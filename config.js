// ============================================================
// CONFIGURACIÓN DE APPS SCRIPT Y CONSTANTES
// ============================================================

// Reemplaza esta URL con la de tu Google Apps Script deployer como Web App
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby-8dyO_hd73O-S_Sktj4Coo1wNarsLI_stCupo_wQX_Fj6QJ79oCoRmahLqBDhkpZo/exec';

// Almacenamiento local fallback (si Sheets no está disponible)
const STORE_KEY = 'cronograma_bim_v1';

// Colores predefinidos
const PERSON_COLORS = ['#2563eb','#16a34a','#ea580c','#7c3aed','#0891b2','#db2777','#ca8a04','#0d9488'];
const PROJECT_COLORS = ['#0ea5e9','#f59e0b','#8b5cf6','#10b981','#ef4444','#6366f1'];

// Estados de sincronización
const SYNC_STATUS = {
  ONLINE: 'online',
  SYNCING: 'syncing',
  OFFLINE: 'offline'
};
