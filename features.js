// ============================================================
// CARACTERÍSTICAS ADICIONALES
// ============================================================

// Búsqueda y filtros
var searchQuery = '';
var filters = {
  proyecto: null,
  persona: null,
  estado: null,
  prioridad: null
};

function filterTareas(tareas) {
  return tareas.filter(function(t) {
    var matchSearch = !searchQuery || t.nombre.toLowerCase().includes(searchQuery.toLowerCase());
    var matchProj = !filters.proyecto || t.proyectoId === filters.proyecto;
    var matchPerson = !filters.persona || t.personaId === filters.persona;
    var matchEstado = !filters.estado || t.estado === filters.estado;
    return matchSearch && matchProj && matchPerson && matchEstado;
  });
}

// Tema oscuro/claro
var theme = localStorage.getItem('app_theme') || 'light';

function setTheme(t) {
  theme = t;
  localStorage.setItem('app_theme', t);
  document.documentElement.setAttribute('data-theme', t);
  render();
}

function toggleTheme() {
  setTheme(theme === 'light' ? 'dark' : 'light');
}

// CSS para tema oscuro
var themeCss = `
[data-theme="dark"] {
  --bg: #1a1a1a;
  --ink: #fff;
  --ink-2: #ccc;
  --ink-3: #999;
  --border: #333;
  --card-bg: #222;
}
[data-theme="dark"] input,
[data-theme="dark"] select,
[data-theme="dark"] textarea {
  background: #333;
  color: #fff;
  border-color: #555;
}
[data-theme="dark"] .btn {
  background: #333;
  color: #fff;
  border-color: #555;
}
[data-theme="dark"] .btn:hover {
  background: #444;
}
`;

// Inyectar CSS de tema
if(!document.getElementById('theme-css')) {
  var style = document.createElement('style');
  style.id = 'theme-css';
  style.innerHTML = themeCss;
  document.head.appendChild(style);
}

// Aplicar tema inicial
document.documentElement.setAttribute('data-theme', theme);

// Notificaciones de deadlines cercanos
function checkDeadlines() {
  var today = new Date();
  var weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

  var upcoming = state.tareas.filter(function(t) {
    if(!t.deadline || t.estado === 'hecha') return false;
    var deadline = new Date(t.deadline);
    return deadline >= today && deadline <= weekFromNow;
  });

  if(upcoming.length > 0) {
    console.log('⏰ Tareas con deadline próximo:', upcoming.map(function(t){return t.nombre;}));
  }
}

// Ejecutar chequeo de deadlines al cargar
setInterval(checkDeadlines, 60000); // Cada minuto
