// ============================================================
// GOOGLE APPS SCRIPT - Cronograma BIM
// ============================================================
// Copia este código completo al editor de Google Apps Script
// y despliegalo como Web App con acceso "Anyone"
// ============================================================

var SHEET_NAME = 'config';
var DATA_CELL = 'A1';
var AUDIT_CELL = 'B1';

function doGet(e) {
  var action = e.parameter.action;
  var key = e.parameter.key;

  if(action === 'read') {
    var value = readData(key);
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      value: value
    })).setMimeType(ContentService.MimeType.JSON);
  }

  // Si no hay acción, retorna un mensaje
  return ContentService.createTextOutput('OK').setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    var action = payload.action;
    var key = payload.key;
    var value = payload.value;
    var timestamp = payload.timestamp;

    if(action === 'write') {
      writeData(key, value, timestamp);
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'Datos guardados'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Acción no reconocida'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch(error) {
    Logger.log('Error en doPost: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function readData(key) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME);

    if(!sheet) {
      Logger.log('Hoja ' + SHEET_NAME + ' no encontrada');
      return null;
    }

    var value = sheet.getRange(DATA_CELL).getValue();

    if(value === '' || value === null) {
      return null;
    }

    return value;

  } catch(error) {
    Logger.log('Error en readData: ' + error.toString());
    return null;
  }
}

function writeData(key, value, timestamp) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME);

    if(!sheet) {
      Logger.log('Hoja ' + SHEET_NAME + ' no encontrada, creándola...');
      sheet = ss.insertSheet(SHEET_NAME);
    }

    // Escribe datos en A1
    sheet.getRange(DATA_CELL).setValue(value);

    // Actualiza log de auditoría en B1
    var auditLog = sheet.getRange(AUDIT_CELL).getValue();
    var log = [];

    if(auditLog && auditLog !== '') {
      try {
        log = JSON.parse(auditLog);
      } catch(e) {
        log = [];
      }
    }

    // Agrega entrada al log
    log.push({
      timestamp: timestamp || new Date().toISOString(),
      action: 'write',
      user: Session.getActiveUser().getEmail()
    });

    // Guarda solo las últimas 100 entradas de auditoría
    if(log.length > 100) {
      log = log.slice(-100);
    }

    sheet.getRange(AUDIT_CELL).setValue(JSON.stringify(log));

    // Genera reporte automático
    updateReportsSheet(value);

    Logger.log('Datos guardados correctamente');

  } catch(error) {
    Logger.log('Error en writeData: ' + error.toString());
    throw error;
  }
}

function updateReportsSheet(dataJson) {
  try {
    var data = JSON.parse(dataJson);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var reportSheet = ss.getSheetByName('Reportes');

    // Crea hoja de reportes si no existe
    if(!reportSheet) {
      reportSheet = ss.insertSheet('Reportes');
    }

    // Limpia contenido anterior
    reportSheet.clear();

    // Headers
    var headers = ['Persona', 'Capacidad/día', 'Total Tareas', 'Activas', 'Completadas', 'Horas Est.', 'Horas Done', 'Horas Pend.', 'Días Trabajo', 'Avance %'];
    reportSheet.appendRow(headers);

    // Procesa cada persona activa
    var personas = data.personas || [];
    personas.forEach(function(p) {
      if(p.activo !== false) {
        var tareas = data.tareas || [];
        var allTasks = tareas.filter(function(t) { return t.personaId === p.id; });
        var activeTasks = allTasks.filter(function(t) { return t.estado !== 'hecha'; });
        var doneTasks = allTasks.filter(function(t) { return t.estado === 'hecha'; });

        var totalEst = allTasks.reduce(function(s, t) { return s + (t.horasEstimadas || 0); }, 0);
        var totalDone = allTasks.reduce(function(s, t) { return s + (t.horasEstimadas || 0) * (t.avance || 0) / 100; }, 0);
        var pendingHours = activeTasks.reduce(function(s, t) {
          var remaining = (t.horasEstimadas || 0) * (1 - (t.avance || 0) / 100);
          return s + (remaining > 0 ? remaining : 0);
        }, 0);

        var cap = p.capacidadDiaria || 8;
        var workDays = pendingHours / cap;
        var avgProgress = allTasks.length ? Math.round(allTasks.reduce(function(s, t) { return s + (t.avance || 0); }, 0) / allTasks.length) : 0;

        reportSheet.appendRow([
          p.nombre,
          cap,
          allTasks.length,
          activeTasks.length,
          doneTasks.length,
          Math.round(totalEst),
          Math.round(totalDone),
          Math.round(pendingHours),
          workDays.toFixed(1),
          avgProgress
        ]);
      }
    });

    // Ajusta ancho de columnas
    reportSheet.setColumnWidths(1, 10, 100);

  } catch(error) {
    Logger.log('Error en updateReportsSheet: ' + error.toString());
  }
}

function initializeSheet() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME);

    if(!sheet) {
      Logger.log('Creando hoja ' + SHEET_NAME);
      sheet = ss.insertSheet(SHEET_NAME);
    }

    // Establece ancho de columnas
    sheet.setColumnWidth(1, 600);
    sheet.setColumnWidth(2, 600);

    // Agrega headers
    sheet.getRange('A1').setNote('Estado JSON completo');
    sheet.getRange('B1').setNote('Log de auditoría');

    Logger.log('Sheet inicializado correctamente');

  } catch(error) {
    Logger.log('Error en initializeSheet: ' + error.toString());
  }
}
