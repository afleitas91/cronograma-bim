// ============================================================
// INTERNACIONALIZACIÓN (Español / Inglés)
// ============================================================

var LANG = localStorage.getItem('app_lang') || 'es'; // 'es' o 'en'

var i18n = {
  es: {
    // Navegación
    'nav.resumen': 'Resumen',
    'nav.proyectos': 'Proyectos',
    'nav.modeladores': 'Modeladores',
    'nav.reportes': 'Reportes',
    'nav.calendario': 'Calendario',
    'nav.config': 'Configuración',

    // Resumen
    'home.title': 'Resumen',
    'home.subtitle': 'Vista general para presentar al dueño',
    'home.projects': 'Proyectos',
    'home.active_tasks': 'Tareas Activas',
    'home.at_risk': 'En Riesgo',
    'home.progress': 'Avance Global',
    'home.gantt': 'Gantt global por semanas',
    'home.new_task': 'Nueva tarea',
    'home.no_tasks': 'No hay tareas programadas. Crea una tarea para verla en el cronograma.',
    'home.deliverables': 'Entregas',
    'home.completed': '0 completadas',

    // Proyectos
    'proj.title': 'Proyectos',
    'proj.add': '+ Proyecto',
    'proj.new': 'Nuevo proyecto',
    'proj.edit': 'Editar proyecto',
    'proj.name': 'Nombre del proyecto',
    'proj.client': 'Cliente',
    'proj.color': 'Color',
    'proj.start_date': 'Fecha de inicio',
    'proj.assigned_models': 'Modeladores asignados',
    'proj.tasks': 'tareas',
    'proj.delete_confirm': '¿Eliminar el proyecto {{name}}?',
    'proj.has_tasks': 'Tiene {{count}} tarea(s) que también se eliminarán.',

    // Modeladores
    'model.title': 'Modeladores',
    'model.add': '+ Persona',
    'model.new': 'Nueva persona',
    'model.edit': 'Editar persona',
    'model.name': 'Nombre',
    'model.capacity': 'Capacidad diaria (horas)',
    'model.status': 'Estado',
    'model.active': 'Activo',
    'model.inactive': 'Inactivo',
    'model.delete_confirm': '¿Eliminar a {{name}}?',

    // Tareas
    'task.title': 'Nueva tarea',
    'task.edit': 'Editar tarea',
    'task.name': 'Nombre de la tarea',
    'task.project': 'Proyecto',
    'task.responsible': 'Responsable',
    'task.hours': 'Horas estimadas',
    'task.progress': 'Avance (%)',
    'task.deadline': 'Deadline (opcional)',
    'task.priority': 'Prioridad (menor = primero)',
    'task.status': 'Estado',
    'task.assigned_by': 'Asignado por',
    'task.notes': 'Notas',
    'task.spontaneous': 'Tarea espontánea (no estaba en el cronograma inicial)',
    'task.save': 'Guardar cambios',
    'task.create': 'Crear tarea',
    'task.delete': 'Eliminar tarea',
    'task.delete_confirm': '¿Eliminar la tarea {{name}}?',
    'task.no_name': 'Ponle un nombre a la tarea.',
    'task.pending': 'Pendiente',
    'task.done': 'Hecha',
    'task.in_progress': 'En progreso',

    // Calendario
    'cal.title': 'Calendario',
    'cal.subtitle': 'Festivos y ausencias que afectan el cronograma',
    'cal.colombia': 'Festivos de Colombia',
    'cal.usa': 'Festivos de USA',
    'cal.absences': 'Ausencias del equipo',
    'cal.add_absence': '+ Ausencia',
    'cal.add_holiday': '+ Festivo',
    'cal.reason': 'Motivo',
    'cal.from': 'Desde',
    'cal.to': 'Hasta',
    'cal.no_absences': 'Sin ausencias registradas.',
    'cal.no_holidays': 'Sin festivos.',

    // Reportes
    'report.title': 'Reportes',
    'report.subtitle': 'Métricas de desempeño del equipo',
    'report.capacity': 'Capacidad/día',
    'report.total_tasks': 'Total Tareas',
    'report.active': 'Activas',
    'report.completed': 'Completadas',
    'report.est_hours': 'Horas Est.',
    'report.done_hours': 'Horas Done',
    'report.pending_hours': 'Horas Pend.',
    'report.work_days': 'Días Trabajo',
    'report.progress': 'Avance %',

    // Configuración
    'config.title': 'Configuración',
    'config.subtitle': 'Equipo, proyectos y datos',
    'config.team': 'Equipo',
    'config.assigners': '¿Quién asigna',
    'config.assigners_name': 'Asignadores',
    'config.portfolio': 'Cartera',
    'config.data': 'Datos',
    'config.backup': 'Respaldo y reinicio',
    'config.export_json': '⤓ Exportar JSON',
    'config.import_json': '⤒ Importar JSON',
    'config.delete_all': '🗑️ Borrar todas las tareas',
    'config.reset': '↺ Restaurar datos de ejemplo',
    'config.delete_all_confirm': '¿Borrar TODAS las tareas? Esta acción no se puede deshacer.',
    'config.lang': 'Idioma / Language',

    // Acciones generales
    'action.save': 'Guardar',
    'action.cancel': 'Cancelar',
    'action.delete': 'Eliminar',
    'action.edit': 'Editar',
    'action.add': 'Agregar',
    'action.close': 'Cerrar',
    'action.download': 'Descargar',
    'action.upload': 'Cargar',
    'action.required': 'Nombre requerido.',

    // Estados de sincronización
    'sync.online': 'Online',
    'sync.syncing': 'Sincronizando',
    'sync.offline': 'Sin conexión',
  },
  en: {
    // Navigation
    'nav.resumen': 'Summary',
    'nav.proyectos': 'Projects',
    'nav.modeladores': 'Team',
    'nav.reportes': 'Reports',
    'nav.calendario': 'Calendar',
    'nav.config': 'Settings',

    // Summary
    'home.title': 'Summary',
    'home.subtitle': 'General overview to present to the owner',
    'home.projects': 'Projects',
    'home.active_tasks': 'Active Tasks',
    'home.at_risk': 'At Risk',
    'home.progress': 'Overall Progress',
    'home.gantt': 'Global Gantt by weeks',
    'home.new_task': 'New task',
    'home.no_tasks': 'No tasks scheduled. Create a task to see it in the schedule.',
    'home.deliverables': 'Deliverables',
    'home.completed': '0 completed',

    // Projects
    'proj.title': 'Projects',
    'proj.add': '+ Project',
    'proj.new': 'New project',
    'proj.edit': 'Edit project',
    'proj.name': 'Project name',
    'proj.client': 'Client',
    'proj.color': 'Color',
    'proj.start_date': 'Start date',
    'proj.assigned_models': 'Assigned team members',
    'proj.tasks': 'tasks',
    'proj.delete_confirm': 'Delete {{name}} project?',
    'proj.has_tasks': 'It has {{count}} task(s) that will also be deleted.',

    // Team
    'model.title': 'Team',
    'model.add': '+ Person',
    'model.new': 'New person',
    'model.edit': 'Edit person',
    'model.name': 'Name',
    'model.capacity': 'Daily capacity (hours)',
    'model.status': 'Status',
    'model.active': 'Active',
    'model.inactive': 'Inactive',
    'model.delete_confirm': 'Delete {{name}}?',

    // Tasks
    'task.title': 'New task',
    'task.edit': 'Edit task',
    'task.name': 'Task name',
    'task.project': 'Project',
    'task.responsible': 'Responsible',
    'task.hours': 'Estimated hours',
    'task.progress': 'Progress (%)',
    'task.deadline': 'Deadline (optional)',
    'task.priority': 'Priority (lower = first)',
    'task.status': 'Status',
    'task.assigned_by': 'Assigned by',
    'task.notes': 'Notes',
    'task.spontaneous': 'Spontaneous task (not in initial schedule)',
    'task.save': 'Save changes',
    'task.create': 'Create task',
    'task.delete': 'Delete task',
    'task.delete_confirm': 'Delete {{name}} task?',
    'task.no_name': 'Give the task a name.',
    'task.pending': 'Pending',
    'task.done': 'Done',
    'task.in_progress': 'In Progress',

    // Calendar
    'cal.title': 'Calendar',
    'cal.subtitle': 'Holidays and absences that affect the schedule',
    'cal.colombia': 'Colombia Holidays',
    'cal.usa': 'USA Holidays',
    'cal.absences': 'Team Absences',
    'cal.add_absence': '+ Absence',
    'cal.add_holiday': '+ Holiday',
    'cal.reason': 'Reason',
    'cal.from': 'From',
    'cal.to': 'To',
    'cal.no_absences': 'No absences recorded.',
    'cal.no_holidays': 'No holidays.',

    // Reports
    'report.title': 'Reports',
    'report.subtitle': 'Team performance metrics',
    'report.capacity': 'Capacity/day',
    'report.total_tasks': 'Total Tasks',
    'report.active': 'Active',
    'report.completed': 'Completed',
    'report.est_hours': 'Est. Hours',
    'report.done_hours': 'Done Hours',
    'report.pending_hours': 'Pending Hours',
    'report.work_days': 'Work Days',
    'report.progress': 'Progress %',

    // Settings
    'config.title': 'Settings',
    'config.subtitle': 'Team, projects and data',
    'config.team': 'Team',
    'config.assigners': 'Who assigns',
    'config.assigners_name': 'Assigners',
    'config.portfolio': 'Portfolio',
    'config.data': 'Data',
    'config.backup': 'Backup and reset',
    'config.export_json': '⤓ Export JSON',
    'config.import_json': '⤒ Import JSON',
    'config.delete_all': '🗑️ Delete all tasks',
    'config.reset': '↺ Restore sample data',
    'config.delete_all_confirm': 'Delete ALL tasks? This action cannot be undone.',
    'config.lang': 'Language / Idioma',

    // General actions
    'action.save': 'Save',
    'action.cancel': 'Cancel',
    'action.delete': 'Delete',
    'action.edit': 'Edit',
    'action.add': 'Add',
    'action.close': 'Close',
    'action.download': 'Download',
    'action.upload': 'Upload',
    'action.required': 'Name required.',

    // Sync status
    'sync.online': 'Online',
    'sync.syncing': 'Syncing',
    'sync.offline': 'No connection',
  }
};

function t(key, vars) {
  var text = i18n[LANG][key] || key;
  if(vars) {
    Object.keys(vars).forEach(function(v) {
      text = text.replace('{{'+v+'}}', vars[v]);
    });
  }
  return text;
}

function setLang(lang) {
  LANG = lang;
  localStorage.setItem('app_lang', lang);
  render();
}
