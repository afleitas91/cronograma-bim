// ============================================================
// CARACTERÍSTICAS ADICIONALES
// ============================================================

var searchQuery = '';
var filters = {proyecto: null, persona: null, estado: null};
var theme = localStorage.getItem('app_theme') || 'light';

function filterTareas(tareas) {
  return tareas.filter(function(t) {
    var matchSearch = !searchQuery || t.nombre.toLowerCase().includes(searchQuery.toLowerCase());
    var matchProj = !filters.proyecto || t.proyectoId === filters.proyecto;
    var matchPerson = !filters.persona || t.personaId === filters.persona;
    var matchEstado = !filters.estado || t.estado === filters.estado;
    return matchSearch && matchProj && matchPerson && matchEstado;
  });
}

function setTheme(t) {
  theme = t;
  localStorage.setItem('app_theme', t);
  document.documentElement.setAttribute('data-theme', t);
  if(typeof render === 'function') render();
}

function toggleTheme() {
  setTheme(theme === 'light' ? 'dark' : 'light');
}

var themeCss = '[data-theme="dark"]{--bg:#1a1a1a;--ink:#fff;--ink-2:#ccc;--ink-3:#999}[data-theme="dark"] input,[data-theme="dark"] select{background:#333;color:#fff;border-color:#555}';
if(!document.getElementById('theme-css')) {
  var style = document.createElement('style');
  style.id = 'theme-css';
  style.innerHTML = themeCss;
  document.head.appendChild(style);
}

document.documentElement.setAttribute('data-theme', theme);

function checkDeadlines() {
  if(!state || !state.tareas) return;
  var today = new Date();
  var weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  var upcoming = state.tareas.filter(function(t) {
    if(!t.deadline || t.estado === 'hecha') return false;
    var deadline = new Date(t.deadline);
    return deadline >= today && deadline <= weekFromNow;
  });
  if(upcoming.length > 0) console.log('⏰ Deadlines próximos:', upcoming.length);
}

setTimeout(function() { setInterval(checkDeadlines, 60000); }, 2000);
