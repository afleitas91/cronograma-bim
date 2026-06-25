# Cronograma BIM — Migración a Google Sheets

Aplicación web de gestión de cronogramas para equipos BIM. Antes usaba `localStorage`; ahora sincroniza con Google Sheets vía Google Apps Script.

## 🚀 Inicio rápido

### Archivos de la aplicación

```
index.html          ← Estructura HTML (abre aquí)
styles.css          ← Estilos (cargado en index.html)
app.js              ← Lógica de la app (100% vanilla JS)
config.js           ← Configuración (URL de Apps Script)
storage.js          ← Capa de almacenamiento (async, con fallback)
Code.gs             ← Google Apps Script (copia en tu Google Sheet)
README.md           ← Este archivo
```

### Requisitos

- Google account
- Google Sheet vacío (new sheet)
- Google Apps Script habilitado (viene con Google Sheets)

---

## 📋 Instalación paso a paso

### Paso 1: Crear un Google Sheet

1. Ve a [sheets.google.com](https://sheets.google.com)
2. Crea una **hoja nueva** (cualquier nombre, ej: "Cronograma BIM")
3. **No necesitas crear manualmente la hoja `config`** — el Apps Script la crea automáticamente en la primera sincronización

### Paso 2: Abrir el editor de Google Apps Script

1. En tu Google Sheet, ve a **Herramientas > Editor de secuencias de comandos**
2. Se abrirá una pestaña nueva en `script.google.com`
3. Borra todo el código que viene por defecto (la función `myFunction()`)

### Paso 3: Pegar Code.gs

1. Copia **todo el contenido** del archivo `Code.gs` (que está en tu carpeta local)
2. Pégalo en el editor de Google Apps Script
3. Guarda: **Ctrl+S** (o menú Archivo > Guardar)

### Paso 4: Desplegar como Web App

En Google Apps Script:

1. Menú superior: **Desplegar > New Deployment**
   - Tipo: selecciona **Web app**
   - Ejecutar como: **Tu cuenta** (la que usa el Sheet)
   - Quién tiene acceso: **Anyone** (para que funcione sin login adicional)
2. Click en **Desplegar**
3. Se abre un modal con la URL. Copia la URL completa (algo como):
   ```
   https://script.google.com/macros/s/AKfycbx...../exec
   ```

### Paso 5: Actualizar config.js

En tu carpeta local, abre `config.js` y reemplaza:

```javascript
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxfn1ngGmhTCruk6iolPTYUkcL4Lb-FWcWuZ8ufeBcM8_pe0mWIpir8oHchYN9Jp6t1/exec';
```

con la URL que copiaste en el Paso 4:

```javascript
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/TU_URL_AQUI/exec';
```

### Paso 6: Abrir la app

1. Abre `index.html` directamente en tu navegador (doble-clic o arrastralo)
   - **Sin necesidad de `python -m http.server` ni build step**
2. La app se carga y automáticamente intenta sincronizar con tu Google Sheet

---

## 🔄 Cómo funciona la sincronización

### Al cargar la aplicación

1. `load()` intenta leer el estado desde Google Sheets vía `storage.get()`
2. Si falla (primero es de esperarse), cae a `localStorage` como fallback
3. Si `localStorage` tampoco existe, carga **datos de ejemplo** (seed)

### Al guardar cambios

1. Cada acción (crear tarea, editar, etc.) llama a `save()`
2. `save()` es **async** y escribe en Sheets + localStorage al mismo tiempo
3. Si Sheets falla:
   - ✅ Los datos se **guardan localmente** (no se pierden)
   - 🔄 Se marcan como "pendientes" y se reintenta cada 5 segundos
   - 🟡 La barra de estado cambia a **"Sincronizando"** / **"Sin conexión"**

### Indicador de estado

En la barra lateral izquierda:

- **🟢 Online** — Sincronizado correctamente
- **🟡 Sincronizando** — Enviando cambios a Sheets
- **🔴 Sin conexión** — Falla de red; reintentará automáticamente

---

## 📊 Estructura de datos en Google Sheets

La hoja `config` tiene:

| Celda | Contenido | Descripción |
|-------|-----------|-------------|
| **A1** | JSON completo | Todo el estado: personas, tareas, proyectos, ausencias, feriados |
| **B1** | Array JSON | Log de auditoría: `[{timestamp, action, user}, ...]` |

### Ejemplo A1:

```json
{
  "personas": [
    {"id":"pe1","nombre":"Daniel","color":"#2563eb",...},
    ...
  ],
  "tareas": [...],
  "proyectos": [...],
  "ausencias": [...],
  "feriados": [...],
  "asignadores": [...]
}
```

---

## 🔐 Notas de seguridad

- **Apps Script expuesto a "Anyone"**: Los datos se envían sin autenticación adicional. Si deseas restringir acceso:
  - Cambia "Quién tiene acceso" a un email/grupo específico
  - Modifica el script para validar un token en `e.parameter.token`

- **Datos en localStorage**: Si cierras sesión y borras cookies, los datos se pierden a nivel local. Pero siempre están en Sheets.

- **CORS**: Usa `Content-Type: text/plain` en POST para evitar preflight CORS. Google Apps Script lo maneja automáticamente.

---

## 🐛 Solución de problemas

### "El Apps Script no responde"

1. Abre el editor de Apps Script
2. Menú **Ejecutar** > Selecciona función **doGet** o **doPost**
3. Verifica los logs en la parte inferior para errores

### "Los datos no se guardan"

1. Abre la consola del navegador (F12)
2. Busca errores rojos en **Console**
3. Verifica que `APPS_SCRIPT_URL` en `config.js` es correcta
4. Asegúrate de que el Apps Script está **desplegado** (no solo guardado)

### "Me aparece 'Sin conexión' constantemente"

- Verifica tu conexión a internet
- Abre el editor de Apps Script y mira los **Logs** de ejecución
- Es posible que la URL tenga un error

### "Quiero volver a usar localStorage"

En `storage.js`, comenta las líneas de fetch a APPS_SCRIPT_URL y descomenta la versión simple de localStorage:

```javascript
var storage = {
  get: function(k) { return localStorage.getItem(k); },
  set: function(k, v) { localStorage.setItem(k, v); return Promise.resolve(true); }
};
```

---

## 📝 Flujo de trabajo típico

1. **Abre `index.html`** en el navegador
2. **Crea tarea** → `save()` escribe en Sheets + localStorage
3. **Edita tarea** → idem
4. **Cambia conexión a Sheets** → Indica "Sin conexión" pero sigue funcionando
5. **Recupera conexión** → Indica "Online" y sincroniza automáticamente

---

## 🎨 Características preservadas

✅ Gantt visual con cálculo automático de cronograma  
✅ Reordenamiento de prioridades (▲▼)  
✅ 5 vistas: Resumen, Proyectos, Modeladores, Calendario, Config  
✅ Export/import JSON  
✅ Export PDF  
✅ Cálculo automático de feriados colombianos  
✅ CSS y diseño idéntico al original  
✅ Sin frameworks, vanilla JS  
✅ Abre directamente en navegador (sin build)  

---

## 🔧 Customización

### Cambiar URL de Apps Script

Edita `config.js`:

```javascript
const APPS_SCRIPT_URL = 'tu-nueva-url-aqui';
```

### Cambiar nombre de hoja de datos

En `Code.gs`, modifica:

```javascript
var SHEET_NAME = 'config'; // cambiar a 'datos', 'cronograma', etc.
```

### Desactivar sincronización remota

En `storage.js`, reemplaza `fetch()` con `localStorage` directo (ver Solución de problemas).

---

## 📞 Soporte

Si hay problemas:

1. Verifica los **logs** en Google Apps Script (Ejecuciones > detalles)
2. Abre la **consola del navegador** (F12 > Console)
3. Comprueba que `APPS_SCRIPT_URL` es correcta y accesible

---

## 📄 Licencia

Código interno — Arqly.

---

**Última actualización**: Junio 2026  
**Estado**: Migración completada, sincronización Google Sheets ✅
