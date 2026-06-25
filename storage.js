// ============================================================
// CAPA DE ALMACENAMIENTO (localStorage ↔ Google Sheets)
// ============================================================

var syncStatus = SYNC_STATUS.ONLINE;
var pendingWrites = [];
var localCache = null;

var storage = {
  // Lee datos: intenta Sheets primero, fallback a localStorage
  get: function(k) {
    return fetch(APPS_SCRIPT_URL + '?action=read&key=' + encodeURIComponent(k))
      .then(function(r) { return r.json(); })
      .then(function(data) {
        updateSyncStatus(SYNC_STATUS.ONLINE);
        if(data.success) return data.value;
        throw new Error('Lectura remota falló');
      })
      .catch(function(e) {
        // Fallback a localStorage
        try {
          var val = localStorage.getItem(k);
          if(!val) {
            // Si no hay ni remoto ni local, retorna null
            return null;
          }
          return val;
        } catch(ex) {
          return null;
        }
      });
  },

  // Escribe datos: intenta Sheets, guarda local como respaldo si falla
  set: function(k, v) {
    updateSyncStatus(SYNC_STATUS.SYNCING);

    // Siempre guarda en localStorage como backup inmediato
    try {
      localStorage.setItem(k, v);
    } catch(e) {
      // localStorage lleno o deshabilitado - no es crítico
    }

    // Intenta escribir en Sheets
    return fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' }, // Evita preflight CORS
      body: JSON.stringify({
        action: 'write',
        key: k,
        value: v,
        timestamp: new Date().toISOString()
      })
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      updateSyncStatus(SYNC_STATUS.ONLINE);
      pendingWrites = [];
      return true;
    })
    .catch(function(e) {
      // Si falla, marca como offline pero no pierde datos (ya están en localStorage)
      updateSyncStatus(SYNC_STATUS.OFFLINE);
      // Guarda en pendientes para reintentar después
      pendingWrites.push({ k: k, v: v, timestamp: new Date().toISOString() });
      return false;
    });
  }
};

function updateSyncStatus(status) {
  syncStatus = status;
  var el = document.getElementById('syncStatus');
  if(!el) return;

  var colors = {
    online: '#4adc6e',     // Verde
    syncing: '#f59e0b',    // Ámbar
    offline: '#ef4444'     // Rojo
  };

  var titles = {
    online: 'Online',
    syncing: 'Sincronizando',
    offline: 'Sin conexión'
  };

  el.style.background = colors[status] || '#999';
  el.title = titles[status] || 'Desconocido';
}

// Reintenta escrituras pendientes cada 5 segundos
setInterval(function() {
  if(pendingWrites.length > 0 && syncStatus !== SYNC_STATUS.SYNCING) {
    var write = pendingWrites[0];
    storage.set(write.k, write.v).then(function(ok) {
      if(ok) pendingWrites.shift(); // Remueve si tuvo éxito
    });
  }
}, 5000);

// Detecta cambios de conectividad
window.addEventListener('online', function() {
  updateSyncStatus(SYNC_STATUS.ONLINE);
  // Reintenta inmediatamente si hay pendientes
  if(pendingWrites.length > 0) {
    var write = pendingWrites[0];
    storage.set(write.k, write.v);
  }
});

window.addEventListener('offline', function() {
  updateSyncStatus(SYNC_STATUS.OFFLINE);
});
