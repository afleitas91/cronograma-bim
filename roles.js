// ============================================================
// SISTEMA DE ROLES Y PERMISOS
// ============================================================

var ROLES = {
  ADMIN: 'admin',
  USER: 'user'
};

var CURRENT_USER = localStorage.getItem('app_user') || null;
var CURRENT_ROLE = localStorage.getItem('app_role') || ROLES.ADMIN; // Por defecto admin

// Permisos por rol
var PERMISSIONS = {
  admin: {
    'create_task': true,
    'edit_task': true,
    'delete_task': true,
    'assign_task': true,
    'edit_project': true,
    'delete_project': true,
    'manage_team': true,
    'manage_config': true,
    'manage_roles': true,
  },
  user: {
    'create_task': false,
    'edit_task': false,
    'delete_task': false,
    'assign_task': false,
    'edit_project': false,
    'delete_project': false,
    'manage_team': false,
    'manage_config': false,
    'manage_roles': false,
    'view_tasks': true,
    'view_projects': true,
    'view_reports': true,
    'mark_complete': true, // Usuarios pueden marcar como completada
  }
};

function hasPermission(perm) {
  return PERMISSIONS[CURRENT_ROLE] && PERMISSIONS[CURRENT_ROLE][perm];
}

function setUser(name, role) {
  CURRENT_USER = name;
  CURRENT_ROLE = role || ROLES.ADMIN;
  localStorage.setItem('app_user', name);
  localStorage.setItem('app_role', role || ROLES.ADMIN);
  render();
}

function showAdminOnly() {
  if(!hasPermission('assign_task')) {
    alert('❌ Solo administradores pueden acceder a esta acción.');
    return false;
  }
  return true;
}

function disableIfNotAdmin(el) {
  if(!hasPermission('manage_config')) {
    el.disabled = true;
    el.style.opacity = '0.5';
    el.style.cursor = 'not-allowed';
    el.title = 'Solo admin';
  }
}
