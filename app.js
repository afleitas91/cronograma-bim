"use strict";
/* ============================================================
   UTILIDADES DE FECHA
   ============================================================ */
function fmtDate(d){var y=d.getFullYear();var m=String(d.getMonth()+1).padStart(2,'0');var dd=String(d.getDate()).padStart(2,'0');return y+'-'+m+'-'+dd;}
function parseDate(s){var parts=s.split('-').map(Number);return new Date(parts[0],parts[1]-1,parts[2]);}
function addDays(d,n){var r=new Date(d);r.setDate(r.getDate()+n);return r;}
function startOfDay(d){var r=new Date(d);r.setHours(0,0,0,0);return r;}
function today(){return startOfDay(new Date());}
function daysBetween(a,b){return Math.round((startOfDay(b)-startOfDay(a))/86400000);}
function isWeekend(d){var w=d.getDay();return w===0||w===6;}
var MESES=['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
function fmtHuman(s){ if(!s) return '—'; var d=parseDate(s); return String(d.getDate()).padStart(2,'0')+' '+MESES[d.getMonth()]; }
function uid(p){return (p||'id')+Math.random().toString(36).slice(2,8);}

/* ============================================================
   FESTIVOS DE COLOMBIA (cómputo automático por año)
   ============================================================ */
function easterSunday(year){
  var a=year%19,b=Math.floor(year/100),c=year%100,d=Math.floor(b/4),e=b%4,
        f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),
        h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4,
        l=(32+2*e+2*i-h-k)%7,m=Math.floor((a+11*h+22*l)/451),
        month=Math.floor((h+l-7*m+114)/31),day=((h+l-7*m+114)%31)+1;
  return new Date(year,month-1,day);
}
function nextMonday(date){var d=new Date(date);var wd=d.getDay();if(wd===1)return d;var add=(8-wd)%7;d.setDate(d.getDate()+add);return d;}
function easterSunday(year){
  var a=year%19,b=Math.floor(year/100),c=year%100,d=Math.floor(b/4),e=b%4,
        f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),
        h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4,
        l=(32+2*e+2*i-h-k)%7,m=Math.floor((a+11*h+22*l)/451),
        month=Math.floor((h+l-7*m+114)/31),day=((h+l-7*m+114)%31)+1;
  return new Date(year,month-1,day);
}
function nextMonday(date){var d=new Date(date);var wd=d.getDay();if(wd===1)return d;var add=(8-wd)%7;d.setDate(d.getDate()+add);return d;}
function colombiaHolidays(year){
  var easter=easterSunday(year);
  var addD=function(base,n){var d=new Date(base);d.setDate(d.getDate()+n);return d;};
  var list=[];
  var fixed=function(m,d,n){list.push({date:new Date(year,m-1,d),nombre:n});};
  var emi=function(m,d,n){list.push({date:nextMonday(new Date(year,m-1,d)),nombre:n});};
  var emiE=function(o,n){list.push({date:nextMonday(addD(easter,o)),nombre:n});};
  var fixE=function(o,n){list.push({date:addD(easter,o),nombre:n});};
  fixed(1,1,'Año Nuevo'); emi(1,6,'Reyes Magos'); emi(3,19,'San José');
  fixE(-3,'Jueves Santo'); fixE(-2,'Viernes Santo'); fixed(5,1,'Día del Trabajo');
  emiE(39,'Ascensión'); emiE(60,'Corpus Christi'); emiE(68,'Sagrado Corazón');
  emi(6,29,'San Pedro y San Pablo'); fixed(7,20,'Independencia'); fixed(8,7,'Batalla de Boyacá');
  emi(8,15,'Asunción de la Virgen'); emi(10,12,'Día de la Raza'); emi(11,1,'Todos los Santos');
  emi(11,11,'Independencia de Cartagena'); fixed(12,8,'Inmaculada Concepción'); fixed(12,25,'Navidad');
  return list.map(function(h,i){return {id:'fer'+year+'_'+i,fecha:fmtDate(h.date),nombre:h.nombre};});
}
function getNthMonday(year,month){var d=new Date(year,month-1,1);while(d.getDay()!==1){d.setDate(d.getDate()+1);}return d;}
function getLastMonday(year,month){var d=new Date(year,month,0);while(d.getDay()!==1){d.setDate(d.getDate()-1);}return d;}
function getFourthThursday(year,month){var d=new Date(year,month-1,1);var count=0;while(count<4){if(d.getDay()===4)count++;if(count<4)d.setDate(d.getDate()+1);}return d;}
function usHolidaysSimple(year){
  var list=[];var idx=0;
  var fixed=function(m,d,n){list.push({id:'fus'+year+'_'+(idx++),fecha:year+'-'+String(m).padStart(2,'0')+'-'+String(d).padStart(2,'0'),nombre:n});};
  fixed(1,1,'New Year\'s Day');
  var memDay=getLastMonday(year,6);fixed(memDay.getMonth()+1,memDay.getDate(),'Memorial Day');
  fixed(7,4,'Independence Day');
  var labDay=getNthMonday(year,9);fixed(labDay.getMonth()+1,labDay.getDate(),'Labor Day');
  var thanks=getFourthThursday(year,11);fixed(thanks.getMonth()+1,thanks.getDate(),'Thanksgiving');
  fixed(12,25,'Christmas Day');
  return list;
}

/* ============================================================
   ESTADO Y DATOS DE EJEMPLO (seed)
   ============================================================ */
function seed(){
  var T=today();
  var iso=function(n){return fmtDate(addDays(T,n));};
  var created=fmtDate(addDays(T,-7))+'T08:00';
  var yr=T.getFullYear();
  var fer=[].concat(colombiaHolidays(yr),colombiaHolidays(yr+1),usHolidaysSimple(yr),usHolidaysSimple(yr+1));

  var personas=[
    {id:'pe1',nombre:'Daniel',color:PERSON_COLORS[0],capacidadDiaria:8,activo:true},
    {id:'pe2',nombre:'Elkin',color:PERSON_COLORS[1],capacidadDiaria:8,activo:true},
    {id:'pe3',nombre:'Stevens',color:PERSON_COLORS[2],capacidadDiaria:8,activo:true},
    {id:'pe4',nombre:'Victor',color:PERSON_COLORS[3],capacidadDiaria:8,activo:true},
    {id:'pe5',nombre:'Diego',color:PERSON_COLORS[4],capacidadDiaria:8,activo:true},
    {id:'pe6',nombre:'Angie',color:PERSON_COLORS[5],capacidadDiaria:8,activo:true},
  ];
  var asignadores=[{id:'as1',nombre:'Sandra'},{id:'as2',nombre:'Adrian'}];
  var proyectos=[
    {id:'pr1',nombre:'Ocean House',color:PROJECT_COLORS[0],cliente:'Thunder Electrical',fechaInicio:iso(-10)},
    {id:'pr2',nombre:'Surf House',color:PROJECT_COLORS[1],cliente:'Thunder Electrical',fechaInicio:iso(-6)},
    {id:'pr3',nombre:'Lightspeed 6/7',color:PROJECT_COLORS[2],cliente:'Thunder Electrical',fechaInicio:iso(-4)},
  ];
  var t=function(o){return Object.assign({id:uid('ta'),avance:0,estado:'pendiente',asignadorId:'as1',deadline:null,notas:'',esEspontanea:false,fechaCreacion:created},o);};
  var tareas=[
    t({proyectoId:'pr1',personaId:'pe3',nombre:'Actualizar rótulos',horasEstimadas:6,prioridad:0,asignadorId:'as2',deadline:iso(2),esEspontanea:true,fechaCreacion:fmtDate(T)+'T09:00'}),
    t({proyectoId:'pr1',personaId:'pe3',nombre:'Modelado conduit — Nivel 1',horasEstimadas:24,prioridad:1,deadline:iso(5)}),
    t({proyectoId:'pr1',personaId:'pe3',nombre:'Bandejas portacables — Nivel 2',horasEstimadas:18,avance:20,prioridad:2,estado:'en_curso',deadline:iso(12)}),
    t({proyectoId:'pr1',personaId:'pe1',nombre:'Acometidas y tableros',horasEstimadas:30,prioridad:1,deadline:iso(10)}),
    t({proyectoId:'pr1',personaId:'pe5',nombre:'Coordinación MEP — Nivel 2',horasEstimadas:16,prioridad:1,asignadorId:'as2',deadline:iso(6)}),
    t({proyectoId:'pr2',personaId:'pe2',nombre:'Modelado eléctrico fachada',horasEstimadas:40,prioridad:1,deadline:iso(14)}),
    t({proyectoId:'pr2',personaId:'pe2',nombre:'Detalles de conduit',horasEstimadas:16,prioridad:2,deadline:iso(20)}),
    t({proyectoId:'pr2',personaId:'pe4',nombre:'Tableros y acometidas',horasEstimadas:20,prioridad:1,asignadorId:'as2',deadline:iso(8)}),
    t({proyectoId:'pr3',personaId:'pe6',nombre:'Levantamiento nube de puntos',horasEstimadas:28,prioridad:1,deadline:iso(9)}),
    t({proyectoId:'pr3',personaId:'pe4',nombre:'Familias Revit MEP',horasEstimadas:16,prioridad:2,deadline:iso(22)}),
    t({proyectoId:'pr3',personaId:'pe5',nombre:'Apoyo modelado Lightspeed',horasEstimadas:12,prioridad:2,asignadorId:'as2'}),
  ];
  var ausencias=[{id:uid('au'),personaId:'pe3',fechaInicio:iso(3),fechaFin:iso(4),motivo:'Cita médica'}];
  var usuarios=[
    {id:'u1',nombre:'Admin',password:'admin123',rol:'admin',permisos:{create_task:true,edit_task:true,delete_task:true,assign_task:true,edit_project:true,delete_project:true,manage_team:true,manage_config:true,manage_roles:true,mark_complete:true}},
    {id:'u2',nombre:'Daniel',password:'daniel123',rol:'user',permisos:{view_tasks:true,view_projects:true,mark_complete:true}},
    {id:'u3',nombre:'Stevens',password:'stevens123',rol:'user',permisos:{view_tasks:true,view_projects:true,mark_complete:true}},
  ];
  return {personas:personas,asignadores:asignadores,proyectos:proyectos,tareas:tareas,ausencias:ausencias,feriados:fer,usuarios:usuarios};
}

var state;
var currentUser = JSON.parse(localStorage.getItem('app_currentUser') || 'null');

async function load(){
  var raw = await storage.get(STORE_KEY);
  if(raw){ try{ state=JSON.parse(raw); }catch(e){ state=seed(); } }
  else { state=seed(); }
  // asegurar listas
  ['personas','asignadores','proyectos','tareas','ausencias','feriados','usuarios'].forEach(function(k){ if(!Array.isArray(state[k])) state[k]=[]; });
}

function login(username, password){
  var user = state.usuarios.find(function(u){return u.nombre===username && u.password===password;});
  if(user){
    currentUser = user;
    localStorage.setItem('app_currentUser', JSON.stringify(user));
    render();
    return true;
  }
  return false;
}

function logout(){
  currentUser = null;
  localStorage.removeItem('app_currentUser');
  render();
}

function hasPermission(perm){
  if(!currentUser) return false;
  return currentUser.permisos && currentUser.permisos[perm];
}

async function save(){
  state._saved=new Date().toISOString();
  await storage.set(STORE_KEY, JSON.stringify(state));
  var el=document.getElementById('lastsave');
  if(el) el.textContent=new Date().toLocaleString('es-CO',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'});
}

/* ============================================================
   MOTOR DE AGENDA POR CAPACIDAD
   ============================================================ */
function holidaySet(){return new Set(state.feriados.map(function(f){return f.fecha;}));}
function isAbsent(d,personaId){var s=fmtDate(d);return state.ausencias.some(function(a){return a.personaId===personaId&&s>=a.fechaInicio&&s<=a.fechaFin;});}
function isWorkingDay(d,persona,hset){if(isWeekend(d))return false;if(hset.has(fmtDate(d)))return false;if(isAbsent(d,persona.id))return false;return true;}

function computeSchedule(){
  var hset=holidaySet();
  var res={};
  var start0=today();
  state.personas.forEach(function(persona){
    var tasks=state.tareas
      .filter(function(t){return t.personaId===persona.id && t.estado!=='hecha';})
      .sort(function(a,b){return (a.prioridad-b.prioridad)||((a.fechaCreacion||'')>(b.fechaCreacion||'')?1:-1);});
    var cursor=new Date(start0);var usedToday=0;
    var cap=Math.max(0.5,persona.capacidadDiaria||8);var guard=0;
    tasks.forEach(function(task){
      var remaining=(task.horasEstimadas||0)*(1-(task.avance||0)/100);
      if(remaining<0)remaining=0;
      var tStart=null,tEnd=null;var segs=[];
      if(remaining<=1e-9){
        while(!isWorkingDay(cursor,persona,hset)){cursor=addDays(cursor,1);usedToday=0;if(++guard>5000)break;}
        tStart=new Date(cursor);tEnd=new Date(cursor);
      }else{
        while(remaining>1e-9){
          if(++guard>20000)break;
          if(!isWorkingDay(cursor,persona,hset)||usedToday>=cap-1e-9){cursor=addDays(cursor,1);usedToday=0;continue;}
          if(tStart===null)tStart=new Date(cursor);
          var avail=cap-usedToday;var use=Math.min(avail,remaining);
          remaining-=use;usedToday+=use;segs.push({date:fmtDate(cursor),hours:use});
          tEnd=new Date(cursor);
        }
      }
      var atRisk=task.deadline?(fmtDate(tEnd)>task.deadline):false;
      res[task.id]={startStr:fmtDate(tStart),endStr:fmtDate(tEnd),segments:segs,atRisk:atRisk};
    });
  });
  return res;
}

/* ============================================================
   HELPERS DE DATOS
   ============================================================ */
var byId=function(arr,id){return arr.find(function(x){return x.id===id;});};
var persona=function(id){return byId(state.personas,id)||{nombre:'—',color:'#999'};};
var proyecto=function(id){return byId(state.proyectos,id)||{nombre:'—',color:'#999'};};
var asignador=function(id){return byId(state.asignadores,id)||{nombre:'—'};};
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){var m={'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'};return m[c];});}
function remainingHours(t){return (t.horasEstimadas||0)*(1-(t.avance||0)/100);}
var ESTADOS={pendiente:'Pendiente',en_curso:'En curso',hecha:'Hecha',bloqueada:'Bloqueada'};
var ESTADO_CLS={pendiente:'pend',en_curso:'curso',hecha:'hecha',bloqueada:'bloq'};

function personDot(p){return '<span class="dot" style="background:'+p.color+'"></span>';}
function personPill(id){var p=persona(id);return '<span class="pill-person">'+personDot(p)+esc(p.nombre)+'</span>';}
function projChip(id){var p=proyecto(id);return '<span class="chip"><span class="dot" style="background:'+p.color+'"></span>'+esc(p.nombre)+'</span>';}
function estadoBadge(t,sch){
  var risk = sch && sch[t.id] && sch[t.id].atRisk;
  var html='<span class="badge '+ESTADO_CLS[t.estado]||'pend'+'">'+ESTADOS[t.estado]||t.estado+'</span>';
  if(risk) html+=' <span class="badge risk" title="La fecha proyectada supera el deadline">⚑ Riesgo</span>';
  return html;
}

/* ============================================================
   GANTT
   ============================================================ */
function ganttHTML(tasks, sch, opt){
  opt=opt||{};
  var colorBy=opt.colorBy||UI.colorBy;
  var groupBy=opt.groupBy||'proyecto';
  var scheduled=tasks.filter(function(t){return sch[t.id]&&sch[t.id].startStr&&t.estado!=='hecha';});
  if(!scheduled.length) return '<div class="empty">No hay tareas programadas. Crea una tarea para verla en el cronograma.</div>';

  var minD=null,maxD=null;
  scheduled.forEach(function(t){var s=sch[t.id];var st=parseDate(s.startStr),en=parseDate(s.endStr);
    if(!minD||st<minD)minD=st; if(!maxD||en>maxD)maxD=en;
    if(t.deadline){var dl=parseDate(t.deadline); if(dl<minD)minD=dl; if(dl>maxD)maxD=dl;}});
  var tod=today(); if(tod<minD)minD=tod;
  minD=addDays(minD,-2); maxD=addDays(maxD,3);
  var total=daysBetween(minD,maxD)+1; if(total>420)total=420;
  var DW=30;
  var hset=holidaySet();

  // cabecera meses
  var months='';var i=0;
  while(i<total){var d=addDays(minD,i);var y=d.getFullYear(),m=d.getMonth();var span=0;
    while(i+span<total){var dd=addDays(minD,i+span);if(dd.getFullYear()!==y||dd.getMonth()!==m)break;span++;}
    var lab=d.toLocaleDateString('es-CO',{month:'long',year:'numeric'});
    months+='<div class="gmonth" style="width:'+(span*DW)+'px">'+lab+'</div>'; i+=span;}
  // cabecera días
  var days='';
  for(var j=0;j<total;j++){var d=addDays(minD,j);var cls=isWeekend(d)?'we':(hset.has(fmtDate(d))?'ho':'');
    days+='<div class="gday '+cls+'">'+d.getDate()+'</div>';}

  // sombreado base (findes + festivos), reutilizable
  var baseShade='';
  for(var j=0;j<total;j++){var d=addDays(minD,j);
    if(isWeekend(d))baseShade+='<div class="gshade we" style="left:'+(j*DW)+'px;width:'+DW+'px"></div>';
    else if(hset.has(fmtDate(d)))baseShade+='<div class="gshade ho" style="left:'+(j*DW)+'px;width:'+DW+'px"></div>';}
  var todayOff=daysBetween(minD,tod);
  var todayLine=(todayOff>=0&&todayOff<total)?'<div class="gtoday" style="left:'+(todayOff*DW+DW/2)+'px"></div>':'';

  var absShade=function(pid){var s='';for(var j=0;j<total;j++){var d=addDays(minD,j);
    if(!isWeekend(d)&&!hset.has(fmtDate(d))&&isAbsent(d,pid))s+='<div class="gshade ab" style="left:'+(j*DW)+'px;width:'+DW+'px"></div>';}return s;};

  var bar=function(t){
    var s=sch[t.id];var st=parseDate(s.startStr),en=parseDate(s.endStr);
    var off=daysBetween(minD,st);var dur=daysBetween(st,en)+1;
    var left=off*DW+2;var w=Math.max(16,dur*DW-4);
    var col=colorBy==='persona'?persona(t.personaId).color:proyecto(t.proyectoId).color;
    var pct=Math.min(100,Math.max(0,t.avance||0));
    var dl='';
    if(t.deadline){var dlo=daysBetween(minD,parseDate(t.deadline));if(dlo>=0&&dlo<total)dl='<div class="gdl" style="left:'+(dlo*DW+DW/2)+'px"></div>';}
    var label=(remainingHours(t)>0?Math.round(remainingHours(t)):0)+'h';
    return dl+'<div class="gbar '+(s.atRisk?'risk':'')+'" style="left:'+left+'px;width:'+w+'px;background:'+col+'" data-act="edit-task" data-id="'+t.id+'" title="'+esc(t.nombre)+' · '+fmtHuman(s.startStr)+'→'+fmtHuman(s.endStr)+'">'+(pct>0?'<i class="pct" style="width:'+pct+'%"></i>':'')+
'<span>'+esc(t.nombre)+' · '+label+'</span></div>';
  };

  // agrupar
  var groups={};var order=[];
  scheduled.forEach(function(t){var key=groupBy==='persona'?t.personaId:(groupBy==='proyecto'?t.proyectoId:'all');
    if(!groups[key]){groups[key]=[];order.push(key);} groups[key].push(t);});

  var body='';
  order.forEach(function(key){
    if(groupBy!=='none'){
      var name=groupBy==='persona'?persona(key).nombre:proyecto(key).nombre;
      var color=groupBy==='persona'?persona(key).color:proyecto(key).color;
      body+='<div class="grow ggroup"><div class="glabel"><span class="dot" style="background:'+color+'"></span>'+esc(name)+'</div><div class="gtrack" style="width:'+(total*DW)+'px;background:var(--surface-2)"></div></div>';
    }
    groups[key].sort(function(a,b){return sch[a.id].startStr.localeCompare(sch[b.id].startStr);});
    groups[key].forEach(function(t){
      var s=sch[t.id];
      var meta = groupBy==='persona'
        ? '<span class="dot" style="background:'+proyecto(t.proyectoId).color+'"></span>'+esc(proyecto(t.proyectoId).nombre)
        : '<span class="dot" style="background:'+persona(t.personaId).color+'"></span>'+esc(persona(t.personaId).nombre);
      body+='<div class="grow"><div class="glabel"><span class="gl-name">'+esc(t.nombre)+'</span><span class="gl-meta">'+meta+'</span></div>'
          + '<div class="gtrack" style="width:'+(total*DW)+'px">'+baseShade+absShade(t.personaId)+todayLine+bar(t)+'</div></div>';
    });
  });

  return '<div class="gantt"><div class="gantt-inner">'+
    '<div class="ghead">'+
      '<div class="grow"><div class="gcorner">'+total+' días</div><div class="gmonths">'+months+'</div></div>'+
      '<div class="grow"><div class="gcorner" style="font-size:10px">Tarea</div><div class="gdays">'+days+'</div></div>'+
    '</div>'+
    '<div class="gbody">'+body+'</div>'+
  '</div></div>'+
  '<div class="legend">'+
    '<span><span class="sw" style="background:var(--accent)"></span>Hoy</span>'+
    '<span><span class="sw" style="background:var(--we-bg)"></span>Fin de semana</span>'+
    '<span><span class="sw" style="background:var(--ho-bg)"></span>Festivo</span>'+
    '<span><span class="sw" style="background:var(--ab-bg)"></span>Ausencia</span>'+
    '<span style="color:var(--danger)">⚑</span> Deadline / riesgo</span>'+
    '<span class="muted">La barra clara dentro indica el % de avance · clic en una barra para editar</span>'+
  '</div>';
}

/* ============================================================
   VISTAS
   ============================================================ */
var UI={tab:'resumen',colorBy:'proyecto',proj:null,person:null,ganttGroup:'proyecto'};

function setActiveTab(){
  document.querySelectorAll('#nav button').forEach(function(b){b.classList.toggle('active',b.dataset.tab===UI.tab);});
}

function header(title,sub){
  document.getElementById('viewTitle').textContent=title;
  document.getElementById('viewSub').textContent=sub||'';
}

function render(){
  var v=document.getElementById('view');
  if(!currentUser){
    document.getElementById('app').style.display='none';
    v.innerHTML=loginView();
    return;
  }
  document.getElementById('app').style.display='';
  document.getElementById('userDisplay').textContent = currentUser.nombre + ' (' + currentUser.rol + ')';
  setActiveTab();
  var sch=computeSchedule();
  if(UI.tab==='resumen') v.innerHTML=viewResumen(sch);
  else if(UI.tab==='proyectos') v.innerHTML=viewProyectos(sch);
  else if(UI.tab==='modeladores') v.innerHTML=viewModeladores(sch);
  else if(UI.tab==='reportes') v.innerHTML=viewReportes(sch);
  else if(UI.tab==='calendario') v.innerHTML=viewCalendario();
  else if(UI.tab==='config') v.innerHTML=viewConfig();
  window.scrollTo({top:0});
}

/* ---- RESUMEN ---- */
function viewResumen(sch){
  header('Resumen','Vista general para presentar al dueño');
  var activeTasks=state.tareas.filter(function(t){return t.estado!=='hecha';});
  var risky=activeTasks.filter(function(t){return sch[t.id]&&sch[t.id].atRisk;});
  var totalH=state.tareas.reduce(function(s,t){return s+(t.horasEstimadas||0);},0);
  var doneH=state.tareas.reduce(function(s,t){return s+(t.horasEstimadas||0)*(t.avance||0)/100;},0);
  var avg=totalH?Math.round(doneH/totalH*100):0;

  // próximas entregas
  var upcoming=activeTasks.filter(function(t){return sch[t.id];}).slice().sort(function(a,b){return sch[a.id].endStr.localeCompare(sch[b.id].endStr);}).slice(0,8);

  // carga por persona (horas pendientes)
  var loads=state.personas.filter(function(p){return p.activo!==false;}).map(function(p){
    var h=state.tareas.filter(function(t){return t.personaId===p.id&&t.estado!=='hecha';}).reduce(function(s,t){return s+remainingHours(t);},0);
    return {p:p,h:h,dias:h/Math.max(1,p.capacidadDiaria||8)};
  });
  var maxLoad=Math.max(1,Math.max.apply(null,loads.map(function(l){return l.h;})));

  var print='<div class="print-only"><h1>Cronograma BIM — Resumen de entregas</h1><div class="pmeta">Generado: '+new Date().toLocaleString('es-CO')+' · Avance global '+avg+'% · '+risky.length+' tarea(s) en riesgo</div></div>';

  var kpis='<div class="kpis">'+
    '<div class="kpi"><div class="lab">Proyectos</div><div class="val num">'+state.proyectos.length+'</div></div>'+
    '<div class="kpi"><div class="lab">Tareas activas</div><div class="val num">'+activeTasks.length+'</div><div class="foot">'+(state.tareas.length-activeTasks.length)+' completadas</div></div>'+
    '<div class="kpi '+(risky.length?'alert':'')+'"><div class="lab">En riesgo</div><div class="val num">'+risky.length+'</div><div class="foot">fecha proyectada &gt; deadline</div></div>'+
    '<div class="kpi"><div class="lab">Avance global</div><div class="val num">'+avg+'%</div><div class="foot">'+Math.round(doneH)+'h de '+Math.round(totalH)+'h</div></div>'+
  '</div>';

  var projRows=state.proyectos.map(function(pr){
    var ts=state.tareas.filter(function(t){return t.proyectoId===pr.id;});
    var th=ts.reduce(function(s,t){return s+(t.horasEstimadas||0);},0);
    var dh=ts.reduce(function(s,t){return s+(t.horasEstimadas||0)*(t.avance||0)/100;},0);
    var pc=th?Math.round(dh/th*100):0;
    var ppl=[].slice.call(new Set(ts.map(function(t){return t.personaId;})));
    var rk=ts.filter(function(t){return sch[t.id]&&sch[t.id].atRisk;}).length;
    var ends=ts.filter(function(t){return sch[t.id];}).map(function(t){return sch[t.id].endStr;}).sort();
    return '<tr style="cursor:pointer" data-act="goto-proj" data-id="'+pr.id+'">'+
      '<td><span class="chip"><span class="dot" style="background:'+pr.color+'"></span><b>'+esc(pr.nombre)+'</b></span><div class="t-sub" style="margin-top:4px">'+esc(pr.cliente||'')+'</div></td>'+
      '<td>'+ppl.map(function(id){return personDot(persona(id));}).join(' ')+' <span class="muted num">'+ppl.length+'</span></td>'+
      '<td class="num">'+ts.length+'</td>'+
      '<td>'+(rk?'<span class="badge risk">⚑ '+rk+'</span>':'<span class="muted">—</span>')+'</td>'+
      '<td class="num">'+(ends.length?fmtHuman(ends[ends.length-1]):'—')+'</td>'+
      '<td style="min-width:140px"><div style="display:flex;align-items:center;gap:8px"><div class="prog '+(pc===100?'ok':'')+'" style="flex:1"><i style="width:'+pc+'%"></i></div><span class="num muted" style="width:34px">'+pc+'%</span></div></td>'+
    '</tr>';
  }).join('');

  var upRows=upcoming.map(function(t){
    var s=sch[t.id];
    return '<tr>'+
      '<td><div class="t-name">'+esc(t.nombre)+'</div><div class="t-sub">'+esc(proyecto(t.proyectoId).nombre)+'</div></td>'+
      '<td>'+personPill(t.personaId)+'</td>'+
      '<td class="num">'+fmtHuman(s.endStr)+'</td>'+
      '<td class="num muted">'+(t.deadline?fmtHuman(t.deadline):'—')+'</td>'+
      '<td>'+(s.atRisk?'<span class="badge risk">⚑ Riesgo</span>':'<span class="badge hecha" style="background:var(--ok-soft)">A tiempo</span>')+'</td>'+
      '<td class="right"><div class="rowact">'+
        '<button class="iconbtn" data-act="toggle-complete" data-id="'+t.id+'" title="Marcar completada">☐</button>'+
        '<button class="iconbtn" data-act="edit-task" data-id="'+t.id+'" title="Editar">✎</button>'+
        '<button class="iconbtn" data-act="del-task-individual" data-id="'+t.id+'" title="Eliminar">✕</button>'+
      '</div></td>'+
    '</tr>';
  }).join('')||'<tr><td colspan="6" class="empty">Sin entregas pendientes.</td></tr>';

  var loadRows=loads.map(function(l){
    return '<div class="load-row">'+
      '<div class="load-name">'+personDot(l.p)+esc(l.p.nombre)+'</div>'+
      '<div class="load-bar"><i style="width:'+Math.round(l.h/maxLoad*100)+'%;background:'+l.p.color+'"></i></div>'+
      '<div class="load-val"><span class="num">'+Math.round(l.h)+'h</span> · <span class="num">'+l.dias.toFixed(1)+'</span> días</div>'+
    '</div>';
  }).join('')||'<div class="empty">Sin carga asignada.</div>';

  var toolbar='<div class="toolbar no-print">'+
    '<span class="field-inline">Color por</span>'+
    '<div class="seg" data-seg="colorBy">'+
      '<button class="'+(UI.colorBy==='proyecto'?'on':'')+'" data-act="colorby" data-v="proyecto">Proyecto</button>'+
      '<button class="'+(UI.colorBy==='persona'?'on':'')+'" data-act="colorby" data-v="persona">Persona</button>'+
    '</div>'+
    '<span class="field-inline" style="margin-left:8px">Agrupar por</span>'+
    '<div class="seg" data-seg="group">'+
      '<button class="'+(UI.ganttGroup==='proyecto'?'on':'')+'" data-act="ganttgroup" data-v="proyecto">Proyecto</button>'+
      '<button class="'+(UI.ganttGroup==='persona'?'on':'')+'" data-act="ganttgroup" data-v="persona">Persona</button>'+
    '</div>'+
  '</div>';

  var allTasks=state.tareas.slice();
  return print+kpis+
    '<div class="panel"><div class="panel-h"><span class="eyebrow">Cronograma</span><h2>Gantt global por semanas</h2></div><div class="panel-b pad">'+toolbar+ganttHTML(allTasks,sch,{colorBy:UI.colorBy,groupBy:UI.ganttGroup})+'</div></div>'+
    '<div class="grid2">'+
      '<div class="panel"><div class="panel-h"><span class="eyebrow">Entregas</span><h2>Proyectos y estado</h2></div>'+
        '<table><thead><tr><th>Proyecto</th><th>Equipo</th><th>Tareas</th><th>Riesgo</th><th>Última entrega</th><th>Avance</th></tr></thead><tbody>'+projRows+'</tbody></table>'+
      '</div>'+
      '<div class="panel"><div class="panel-h"><span class="eyebrow">Carga</span><h2>Horas pendientes por persona</h2></div><div class="panel-b">'+loadRows+'</div></div>'+
    '</div>'+
    '<div class="panel"><div class="panel-h"><span class="eyebrow">Próximo</span><h2>Próximas entregas</h2></div>'+
      '<table><thead><tr><th>Tarea</th><th>Responsable</th><th>Fin proyectado</th><th>Deadline</th><th>Estado</th></tr></thead><tbody>'+upRows+'</tbody></table>'+
    '</div>';
}

/* ---- PROYECTOS ---- */
function viewProyectos(sch){
  if(!UI.proj||!byId(state.proyectos,UI.proj)) UI.proj=state.proyectos[0]?state.proyectos[0].id:null;
  header('Proyectos','Tareas y cronograma por proyecto');
  if(!UI.proj) return '<div class="empty">No hay proyectos. Crea uno en Configuración.</div>';
  var pr=proyecto(UI.proj);
  var ts=state.tareas.filter(function(t){return t.proyectoId===UI.proj;});

  var opts=state.proyectos.map(function(p){return '<option value="'+p.id+'" '+(p.id===UI.proj?'selected':'')+'>'+esc(p.nombre)+'</option>';}).join('');
  var toolbar='<div class="toolbar">'+
    '<select class="mini" data-act="sel-proj">'+opts+'</select>'+
    '<button class="btn sm" data-act="add-task-proj"><svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 5v14M5 12h14"/></svg>Tarea en este proyecto</button>'+
    '<div class="spacer"></div>'+
    '<span class="field-inline">Color por</span>'+
    '<div class="seg"><button class="'+(UI.colorBy==='proyecto'?'on':'')+'" data-act="colorby" data-v="proyecto">Proyecto</button><button class="'+(UI.colorBy==='persona'?'on':'')+'" data-act="colorby" data-v="persona">Persona</button></div>'+
  '</div>';

  var rows=ts.slice().sort(function(a,b){return (sch[a.id]?sch[a.id].startStr:'~').localeCompare(sch[b.id]?sch[b.id].startStr:'~');}).map(function(t){
    var s=sch[t.id]||{};
    return '<tr data-act="edit-task" data-id="'+t.id+'" style="cursor:pointer">'+
      '<td><div class="t-name">'+esc(t.nombre)+'</div>'+(t.esEspontanea?'<span class="t-sub">⚡ espontánea</span>':'')+
'</td>'+
      '<td>'+personPill(t.personaId)+'</td>'+
      '<td class="num">'+(t.horasEstimadas||0)+'h</td>'+
      '<td style="min-width:90px"><div style="display:flex;align-items:center;gap:6px"><div class="prog" style="flex:1"><i style="width:'+(t.avance||0)+'%"></i></div><span class="num muted" style="font-size:11px">'+(t.avance||0)+'%</span></div></td>'+
      '<td class="num">'+fmtHuman(s.startStr)+' → '+fmtHuman(s.endStr)+'</td>'+
      '<td class="num muted">'+(t.deadline?fmtHuman(t.deadline):'—')+'</td>'+
      '<td>'+estadoBadge(t,sch)+'</td>'+
    '</tr>';
  }).join('')||'<tr><td colspan="7" class="empty">Este proyecto no tiene tareas.</td></tr>';

  return '<div class="panel" style="margin-bottom:18px"><div class="panel-h" style="border-bottom:0"><span class="chip" style="font-size:13px"><span class="dot" style="background:'+pr.color+'"></span><b>'+esc(pr.nombre)+'</b></span><span class="muted">'+esc(pr.cliente||'')+'</span><div class="spacer"></div><span class="muted">Inicio '+fmtHuman(pr.fechaInicio)+'</span></div></div>'+
    toolbar+
    '<div class="panel"><div class="panel-h"><span class="eyebrow">Cronograma</span><h2>Gantt del proyecto</h2></div><div class="panel-b pad">'+ganttHTML(ts,sch,{colorBy:UI.colorBy,groupBy:'persona'})+'</div></div>'+
    '<div class="panel"><div class="panel-h"><span class="eyebrow">Detalle</span><h2>Tareas</h2></div>'+
      '<table><thead><tr><th>Tarea</th><th>Responsable</th><th>Horas</th><th>Avance</th><th>Programado</th><th>Deadline</th><th>Estado</th></tr></thead><tbody>'+rows+'</tbody></table></div>';
}

/* ---- MODELADORES ---- */
function viewModeladores(sch){
  if(!UI.person||!byId(state.personas,UI.person)) UI.person=state.personas[0]?state.personas[0].id:null;
  header('Modeladores','Carga y cronograma por persona');
  if(!UI.person) return '<div class="empty">No hay personas.</div>';
  var p=persona(UI.person);
  var ts=state.tareas.filter(function(t){return t.personaId===UI.person&&t.estado!=='hecha';})
    .sort(function(a,b){return (a.prioridad-b.prioridad)||((a.fechaCreacion||'')>(b.fechaCreacion||'')?1:-1);});
  var done=state.tareas.filter(function(t){return t.personaId===UI.person&&t.estado==='hecha';});
  var pendH=ts.reduce(function(s,t){return s+remainingHours(t);},0);
  var cap=p.capacidadDiaria||8;
  var aus=state.ausencias.filter(function(a){return a.personaId===UI.person;});

  var opts=state.personas.map(function(x){return '<option value="'+x.id+'" '+(x.id===UI.person?'selected':'')+'>'+esc(x.nombre)+'</option>';}).join('');
  var toolbar='<div class="toolbar"><select class="mini" data-act="sel-person">'+opts+'</select>'+
    '<button class="btn sm" data-act="add-task-person"><svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 5v14M5 12h14"/></svg>Asignar tarea</button>'+
    '<button class="btn sm" data-act="add-absence-person"><svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>Registrar ausencia</button>'+
  '</div>';

  var kpis='<div class="kpis" style="grid-template-columns:repeat(auto-fit,minmax(150px,1fr))">'+
    '<div class="kpi"><div class="lab">Capacidad</div><div class="val num">'+cap+'h<span style="font-size:14px;color:var(--ink-3)">/día</span></div></div>'+
    '<div class="kpi"><div class="lab">Pendiente</div><div class="val num">'+Math.round(pendH)+'h</div><div class="foot">'+ts.length+' tareas activas</div></div>'+
    '<div class="kpi"><div class="lab">Días de trabajo</div><div class="val num">'+(pendH/cap).toFixed(1)+'</div><div class="foot">a su capacidad actual</div></div>'+
    '<div class="kpi"><div class="lab">Ausencias</div><div class="val num">'+aus.length+'</div></div>'+
  '</div>';

  var rows=ts.map(function(t,idx){
    var s=sch[t.id]||{};
    return '<tr>'+
      '<td class="num muted" style="width:36px">'+(idx+1)+'</td>'+
      '<td><div class="t-name">'+esc(t.nombre)+'</div><div class="t-sub">'+esc(proyecto(t.proyectoId).nombre)+(t.esEspontanea?' · ⚡ espontánea':'')+'</div></td>'+
      '<td>'+projChip(t.proyectoId)+'</td>'+
      '<td class="num">'+(t.horasEstimadas||0)+'h</td>'+
      '<td class="num">'+fmtHuman(s.startStr)+' → '+fmtHuman(s.endStr)+'</td>'+
      '<td class="num muted">'+(t.deadline?fmtHuman(t.deadline):'—')+'</td>'+
      '<td>'+estadoBadge(t,sch)+'</td>'+
      '<td class="right"><div class="rowact">'+
        '<button class="iconbtn" data-act="up" data-id="'+t.id+'" '+(idx===0?'disabled':'')+' title="Subir prioridad">▲</button>'+
        '<button class="iconbtn" data-act="down" data-id="'+t.id+'" '+(idx===ts.length-1?'disabled':'')+' title="Bajar prioridad">▼</button>'+
        '<button class="iconbtn" data-act="toggle-complete" data-id="'+t.id+'" title="Marcar completada">☐</button>'+
        '<button class="iconbtn" data-act="edit-task" data-id="'+t.id+'" title="Editar">✎</button>'+
        '<button class="iconbtn" data-act="del-task-individual" data-id="'+t.id+'" title="Eliminar">✕</button>'+
      '</div></td>'+
    '</tr>';
  }).join('')||'<tr><td colspan="8" class="empty">Sin tareas activas para '+esc(p.nombre)+'.</td></tr>';

  var ausHTML=aus.map(function(a){return '<div class="load-row"><div style="flex:1">📅 <span class="num">'+fmtHuman(a.fechaInicio)+'</span> → <span class="num">'+fmtHuman(a.fechaFin)+'</span> <span class="muted">· '+esc(a.motivo||'Ausencia')+'</span></div><button class="iconbtn" data-act="del-absence" data-id="'+a.id+'" title="Quitar">✕</button></div>';}).join('')||'<div class="empty" style="padding:18px">Sin ausencias registradas.</div>';

  var doneHTML=done.length?'<div class="panel"><div class="panel-h"><span class="eyebrow">Histórico</span><h2>Tareas completadas ('+done.length+')</h2></div><table><tbody>'+done.map(function(t){return '<tr><td><div class="t-name">'+esc(t.nombre)+'</div><div class="t-sub">'+esc(proyecto(t.proyectoId).nombre)+'</div></td><td>'+projChip(t.proyectoId)+'</td><td class="num">'+(t.horasEstimadas||0)+'h</td><td><span class="badge hecha">Hecha</span></td><td class="right"><button class="iconbtn" data-act="edit-task" data-id="'+t.id+'">✎</button></td></tr>';}).join('')+'</tbody></table></div>':'';

  return '<div class="panel" style="margin-bottom:18px"><div class="panel-h" style="border-bottom:0"><span class="chip" style="font-size:14px"><span class="dot" style="background:'+p.color+'"></span><b>'+esc(p.nombre)+'</b></span></div></div>'+
    toolbar+kpis+
    '<div class="panel"><div class="panel-h"><span class="eyebrow">Cronograma</span><h2>Línea de tiempo de '+esc(p.nombre)+'</h2></div><div class="panel-b pad">'+ganttHTML(ts,sch,{colorBy:UI.colorBy,groupBy:'none'})+'</div></div>'+
    '<div class="panel"><div class="panel-h"><span class="eyebrow">Cola de trabajo</span><h2>Tareas en orden de prioridad</h2><div class="spacer"></div><span class="muted" style="font-size:12px">Usa ▲▼ para reordenar — el cronograma se recalcula solo</span></div>'+
      '<table><thead><tr><th>#</th><th>Tarea</th><th>Proyecto</th><th>Horas</th><th>Programado</th><th>Deadline</th><th>Estado</th><th></th></tr></thead><tbody>'+rows+'</tbody></table></div>'+
    '<div class="grid2"><div class="panel"><div class="panel-h"><span class="eyebrow">Disponibilidad</span><h2>Ausencias</h2></div><div class="panel-b">'+ausHTML+'</div></div><div>'+doneHTML+'</div></div>';
}

/* ---- CALENDARIO ---- */
function viewCalendario(){
  header('Calendario','Festivos y ausencias que afectan el cronograma');
  var yr=today().getFullYear();
  var ferCol=state.feriados.filter(function(f){return f.id.startsWith('fer');});
  var ferUSA=state.feriados.filter(function(f){return f.id.startsWith('fus');});

  var ferColRows=ferCol.filter(function(f){return parseDate(f.fecha)>=addDays(today(),-31);}).sort(function(a,b){return a.fecha.localeCompare(b.fecha);}).slice(0,30).map(function(f){var d=parseDate(f.fecha);var wd=['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'][d.getDay()];var past=d<today();return '<tr style="'+(past?'opacity:.45':'')+'"><td class="num">'+fmtHuman(f.fecha)+'</td><td class="muted">'+wd+'</td><td class="t-name">'+esc(f.nombre)+'</td><td class="right"><button class="iconbtn" data-act="del-holiday" data-id="'+f.id+'" title="Quitar">✕</button></td></tr>';}).join('');

  var ferUSARows=ferUSA.filter(function(f){return parseDate(f.fecha)>=addDays(today(),-31);}).sort(function(a,b){return a.fecha.localeCompare(b.fecha);}).slice(0,30).map(function(f){var d=parseDate(f.fecha);var wd=['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'][d.getDay()];var past=d<today();return '<tr style="'+(past?'opacity:.45':'')+'"><td class="num">'+fmtHuman(f.fecha)+'</td><td class="muted">'+wd+'</td><td class="t-name">'+esc(f.nombre)+'</td><td class="right"><button class="iconbtn" data-act="del-holiday" data-id="'+f.id+'" title="Quitar">✕</button></td></tr>';}).join('');

  var aus=state.ausencias.slice().sort(function(a,b){return a.fechaInicio.localeCompare(b.fechaInicio);});
  var ausRows=aus.map(function(a){return '<tr><td>'+personPill(a.personaId)+'</td><td class="num">'+fmtHuman(a.fechaInicio)+' → '+fmtHuman(a.fechaFin)+'</td><td class="muted">'+esc(a.motivo||'—')+'</td><td class="right"><button class="iconbtn" data-act="del-absence" data-id="'+a.id+'">✕</button></td></tr>';}).join('')||'<tr><td colspan="4" class="empty">Sin ausencias registradas.</td></tr>';

  return '<div class="panel"><div class="panel-h"><span class="eyebrow">No laborables</span><h2>Festivos de Colombia '+yr+'</h2></div><table><thead><tr><th>Fecha</th><th>Día</th><th>Festivo</th><th></th></tr></thead><tbody>'+(ferColRows||'<tr><td colspan="4" class="empty">Sin festivos.</td></tr>')+'</tbody></table></div>'+
    '<div class="panel"><div class="panel-h"><span class="eyebrow">No laborables</span><h2>Festivos de USA '+yr+'</h2></div><table><thead><tr><th>Fecha</th><th>Día</th><th>Festivo</th><th></th></tr></thead><tbody>'+(ferUSARows||'<tr><td colspan="4" class="empty">Sin festivos.</td></tr>')+'</tbody></table></div>'+
    '<div class="panel"><div class="panel-h"><span class="eyebrow">Disponibilidad</span><h2>Ausencias del equipo</h2><div class="spacer"></div><button class="btn sm" data-act="add-absence">+ Ausencia</button></div>'+
      '<table><thead><tr><th>Persona</th><th>Periodo</th><th>Motivo</th><th></th></tr></thead><tbody>'+ausRows+'</tbody></table></div>'+
  '<div class="panel"><div class="panel-b pad"><span class="muted">Los festivos y las ausencias se descuentan automáticamente de los días laborables, lo que mueve las fechas proyectadas. Por eso cada mes tiene un número distinto de horas hábiles.</span></div></div>';
}

/* ---- REPORTES ---- */
function viewReportes(sch){
  header('Reportes','Métricas y carga de trabajo por persona');
  var reportData=[];
  state.personas.filter(function(p){return p.activo!==false;}).forEach(function(p){
    var allTasks=state.tareas.filter(function(t){return t.personaId===p.id;});
    var activeTasks=allTasks.filter(function(t){return t.estado!=='hecha';});
    var doneTasks=allTasks.filter(function(t){return t.estado==='hecha';});
    var totalEstimated=allTasks.reduce(function(s,t){return s+(t.horasEstimadas||0);},0);
    var totalDone=allTasks.reduce(function(s,t){return s+(t.horasEstimadas||0)*(t.avance||0)/100;},0);
    var pendingHours=activeTasks.reduce(function(s,t){return s+remainingHours(t);},0);
    var cap=p.capacidadDiaria||8;
    var avgProgress=allTasks.length?Math.round(allTasks.reduce(function(s,t){return s+(t.avance||0);},0)/allTasks.length):0;
    reportData.push({p:p,allCount:allTasks.length,doneCount:doneTasks.length,activeCount:activeTasks.length,totalEst:totalEstimated,totalDone:totalDone,pendingHours:pendingHours,workDays:(pendingHours/cap).toFixed(1),avgProgress:avgProgress});
  });
  var rows=reportData.map(function(r){
    return '<tr>'+
      '<td><span class="pill-person">'+personDot(r.p)+esc(r.p.nombre)+'</span></td>'+
      '<td class="num">'+r.allCount+'</td>'+
      '<td class="num">'+r.activeCount+'</td>'+
      '<td class="num">'+r.doneCount+'</td>'+
      '<td class="num">'+Math.round(r.totalEst)+'h</td>'+
      '<td class="num">'+Math.round(r.totalDone)+'h</td>'+
      '<td class="num">'+Math.round(r.pendingHours)+'h</td>'+
      '<td class="num">'+r.workDays+'</td>'+
      '<td class="num"><div class="prog" style="flex:1"><i style="width:'+r.avgProgress+'%"></i></div><span style="width:40px">'+r.avgProgress+'%</span></td>'+
    '</tr>';
  }).join('')||'<tr><td colspan="9" class="empty">Sin personas activas.</td></tr>';
  var toolbar='<div class="toolbar no-print"><button class="btn sm" data-act="export-csv"><svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>Exportar CSV</button><button class="btn sm" data-act="export-excel"><svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>Exportar Excel</button></div>';
  return toolbar+
    '<div class="panel"><div class="panel-h"><span class="eyebrow">Equipo</span><h2>Métricas de carga y desempeño</h2></div>'+
    '<table><thead><tr><th>Persona</th><th>Total</th><th>Activas</th><th>Completadas</th><th>Hrs Est.</th><th>Hrs Done</th><th>Hrs Pend.</th><th>Días</th><th>Avance</th></tr></thead><tbody>'+rows+'</tbody></table></div>';
}

/* ---- CONFIGURACIÓN ---- */
function viewConfig(){
  header('Configuración','Equipo, proyectos y datos');
  var peopleRows=state.personas.map(function(p){return '<tr>'+
    '<td><span class="pill-person">'+personDot(p)+'<b>'+esc(p.nombre)+'</b></span></td>'+
    '<td class="num">'+(p.capacidadDiaria||8)+'h/día</td>'+
    '<td>'+(p.activo!==false?'<span class="badge hecha" style="background:var(--ok-soft)">Activo</span>':'<span class="badge pend">Inactivo</span>')+'</td>'+
    '<td class="right"><div class="rowact"><button class="iconbtn" data-act="edit-person" data-id="'+p.id+'">✎</button><button class="iconbtn" data-act="del-person" data-id="'+p.id+'">✕</button></div></td>'+
  '</tr>';}).join('');

  var projRows=state.proyectos.map(function(p){var n=state.tareas.filter(function(t){return t.proyectoId===p.id;}).length;
    return '<tr><td><span class="chip"><span class="dot" style="background:'+p.color+'"></span><b>'+esc(p.nombre)+'</b></span></td><td class="muted">'+esc(p.cliente||'—')+'</td><td class="num">'+n+' tareas</td><td class="right"><div class="rowact"><button class="iconbtn" data-act="edit-proj" data-id="'+p.id+'">✎</button><button class="iconbtn" data-act="del-proj" data-id="'+p.id+'">✕</button></div></td></tr>';}).join('');

  var asgRows=state.asignadores.map(function(a){return '<tr><td class="t-name">'+esc(a.nombre)+'</td><td class="right"><button class="iconbtn" data-act="del-asg" data-id="'+a.id+'">✕</button></td></tr>';}).join('');

  return '<div class="grid2">'+
    '<div class="panel"><div class="panel-h"><span class="eyebrow">Equipo</span><h2>Modeladores</h2><div class="spacer"></div><button class="btn sm" data-act="add-person">+ Persona</button></div>'+
      '<table><thead><tr><th>Nombre</th><th>Capacidad</th><th>Estado</th><th></th></tr></thead><tbody>'+peopleRows+'</tbody></table></div>'+
    '<div class="panel"><div class="panel-h"><span class="eyebrow">Quién asigna</span><h2>Asignadores</h2><div class="spacer"></div><button class="btn sm" data-act="add-asg">+ Asignador</button></div>'+
      '<table><tbody>'+asgRows+'</tbody></table></div>'+
  '</div>'+
  '<div class="panel"><div class="panel-h"><span class="eyebrow">Cartera</span><h2>Proyectos</h2><div class="spacer"></div><button class="btn sm" data-act="add-proj">+ Proyecto</button></div>'+
    '<table><thead><tr><th>Proyecto</th><th>Cliente</th><th>Tareas</th><th></th></tr></thead><tbody>'+projRows+'</tbody></table></div>'+
  '<div class="panel"><div class="panel-h"><span class="eyebrow">Datos</span><h2>Respaldo y reinicio</h2></div><div class="panel-b pad" style="display:flex;gap:10px;flex-wrap:wrap">'+
    '<button class="btn" data-act="export-json">⤓ Exportar JSON</button>'+
    '<button class="btn" data-act="import-json">⤒ Importar JSON</button>'+
    '<button class="btn danger" data-act="del-all-tasks">🗑️ Borrar todas las tareas</button>'+
    '<button class="btn danger" data-act="del-all-data">🗑️ Borrar proyectos y modeladores</button>'+
    '<button class="btn danger" data-act="reset">↺ Restaurar datos de ejemplo</button>'+
  '</div></div>';
}

/* ---- LOGIN ---- */
function loginView(){
  return '<div style="display:flex;justify-content:center;align-items:center;min-height:100vh;background:var(--bg)">'+
    '<div class="panel" style="width:100%;max-width:400px;padding:40px">'+
      '<div style="text-align:center;margin-bottom:30px">'+
        '<h1>Cronograma BIM</h1>'+
        '<p style="color:var(--ink-3)">Sistema de Gestión de Proyectos</p>'+
      '</div>'+
      '<div class="frow"><label>Usuario</label><input id="login_user" placeholder="Admin, Daniel, Stevens" autofocus></div>'+
      '<div class="frow"><label>Contraseña</label><input id="login_pass" type="password" placeholder="Ingresa tu contraseña"></div>'+
      '<button class="btn primary" style="width:100%;margin-top:20px" data-act="do-login">Iniciar sesión</button>'+
      '<div style="text-align:center;margin-top:30px;font-size:12px;color:var(--ink-3)">'+
        '<p><strong>Usuarios de demostración:</strong></p>'+
        '<p>Admin / admin123</p>'+
        '<p>Daniel / daniel123</p>'+
        '<p>Stevens / stevens123</p>'+
      '</div>'+
    '</div>'+
  '</div>';
}

/* ============================================================
   MODALES Y FORMULARIOS
   ============================================================ */
function closeModal(){document.getElementById('modal-root').innerHTML='';}
function openModal(title,bodyHTML,onSave,saveLabel){
  var root=document.getElementById('modal-root');
  root.innerHTML='<div class="modal-bg" data-bg="1"><div class="modal">'+
    '<div class="modal-h"><h3>'+esc(title)+'</h3><button class="x" data-close="1">×</button></div>'+
    '<div class="modal-b">'+bodyHTML+'</div>'+
    '<div class="modal-f"><button class="btn ghost" data-close="1">Cancelar</button><button class="btn primary" id="modalSave">'+esc(saveLabel||'Guardar')+'</button></div>'+
  '</div></div>';
  root.querySelector('[data-bg]').addEventListener('mousedown',function(e){if(e.target===e.currentTarget)closeModal();});
  root.querySelectorAll('[data-close]').forEach(function(b){b.addEventListener('click',closeModal);});
  root.querySelector('#modalSave').addEventListener('click',function(){if(onSave()!==false) closeModal();});
}
function val(id){var e=document.getElementById(id);return e?e.value:'';}
function checked(id){var e=document.getElementById(id);return e?e.checked:false;}

function selectOptions(arr,sel,label){return arr.map(function(x){return '<option value="'+x.id+'" '+(x.id===sel?'selected':'')+'>'+esc(label?label(x):x.nombre)+'</option>';}).join('');}

function taskModal(task){
  var isNew=!task;
  task=task||{proyectoId:UI.tab==='proyectos'?UI.proj:(state.proyectos[0]||{}).id,
    personaId:UI.tab==='modeladores'?UI.person:(state.personas[0]||{}).id,
    nombre:'',horasEstimadas:8,avance:0,prioridad:1,deadline:null,asignadorId:(state.asignadores[0]||{}).id,estado:'pendiente',notas:'',esEspontanea:false};
  var body='<div class="frow"><label>Nombre de la tarea</label><input id="f_nombre" value="'+esc(task.nombre)+'" placeholder="Ej. Modelado conduit Nivel 1"></div>'+
    '<div class="frow two">'+
      '<div class="frow"><label>Proyecto</label><select id="f_proj">'+selectOptions(state.proyectos,task.proyectoId)+'</select></div>'+
      '<div class="frow"><label>Responsable</label><select id="f_person">'+selectOptions(state.personas,task.personaId)+'</select></div>'+
    '</div>'+
    '<div class="frow two">'+
      '<div class="frow"><label>Horas estimadas</label><input id="f_horas" type="number" min="0" step="1" value="'+(task.horasEstimadas||0)+'"></div>'+
      '<div class="frow"><label>Avance (%)</label><input id="f_avance" type="number" min="0" max="100" step="5" value="'+(task.avance||0)+'"></div>'+
    '</div>'+
    '<div class="frow two">'+
      '<div class="frow"><label>Deadline (opcional)</label><input id="f_deadline" type="date" value="'+(task.deadline||'')+'"></div>'+
      '<div class="frow"><label>Prioridad (menor = primero)</label><input id="f_prio" type="number" step="1" value="'+(task.prioridad!=null?task.prioridad:1)+'"></div>'+
    '</div>'+
    '<div class="frow two">'+
      '<div class="frow"><label>Estado</label><select id="f_estado">'+Object.keys(ESTADOS).map(function(k){return '<option value="'+k+'" '+(k===task.estado?'selected':'')+'>'+ESTADOS[k]+'</option>';}).join('')+'</select></div>'+
      '<div class="frow"><label>Asignado por</label><select id="f_asg">'+selectOptions(state.asignadores,task.asignadorId)+'</select></div>'+
    '</div>'+
    '<div class="frow"><label>Notas</label><textarea id="f_notas" rows="2" placeholder="Detalles, referencias...">'+esc(task.notas||'')+'</textarea></div>'+
    '<div class="frow"><label class="check"><input type="checkbox" id="f_esp" '+(task.esEspontanea?'checked':'')+'> Tarea espontánea (no estaba en el cronograma inicial)</label></div>';
  openModal(isNew?'Nueva tarea':'Editar tarea',body,function(){
    var nombre=val('f_nombre').trim();
    if(!nombre){alert('Ponle un nombre a la tarea.');return false;}
    var data={proyectoId:val('f_proj'),personaId:val('f_person'),nombre:nombre,
      horasEstimadas:Math.max(0,parseFloat(val('f_horas'))||0),
      avance:Math.min(100,Math.max(0,parseFloat(val('f_avance'))||0)),
      deadline:val('f_deadline')||null,prioridad:parseFloat(val('f_prio'))||0,
      estado:val('f_estado'),asignadorId:val('f_asg'),notas:val('f_notas'),esEspontanea:checked('f_esp')};
    if(isNew){ data.id=uid('ta'); data.fechaCreacion=new Date().toISOString(); state.tareas.push(data); }
    else { Object.assign(task,data); }
    save().then(render);
  }, isNew?'Crear tarea':'Guardar cambios');
}

function personModal(p){
  var isNew=!p; var usedColors=state.personas.map(function(x){return x.color;});
  var color=p?p.color:(PERSON_COLORS.find(function(c){return !usedColors.includes(c);})||PERSON_COLORS[0]);
  p=p||{nombre:'',capacidadDiaria:8,activo:true,color:color};
  var body='<div class="frow"><label>Nombre</label><input id="f_n" value="'+esc(p.nombre)+'"></div>'+
    '<div class="frow two">'+
      '<div class="frow"><label>Capacidad diaria (horas)</label><input id="f_cap" type="number" min="1" max="24" step="1" value="'+(p.capacidadDiaria||8)+'"></div>'+
      '<div class="frow"><label>Color</label><input id="f_col" type="color" value="'+p.color+'" style="height:42px;padding:4px"></div>'+
    '</div>'+
    '<div class="frow"><label class="check"><input type="checkbox" id="f_act" '+(p.activo!==false?'checked':'')+' > Activo</label></div>';
  openModal(isNew?'Nueva persona':'Editar persona',body,function(){
    var nombre=val('f_n').trim(); if(!nombre){alert('Nombre requerido.');return false;}
    var data={nombre:nombre,capacidadDiaria:Math.max(1,parseFloat(val('f_cap'))||8),color:val('f_col'),activo:checked('f_act')};
    if(isNew){data.id=uid('pe');state.personas.push(data);} else Object.assign(p,data);
    save().then(render);
  });
}

function projModal(p){
  var isNew=!p; var used=state.proyectos.map(function(x){return x.color;});
  var color=p?p.color:(PROJECT_COLORS.find(function(c){return !used.includes(c);})||PROJECT_COLORS[0]);
  p=p||{nombre:'',cliente:'',color:color,fechaInicio:fmtDate(today()),modeladoresAsignados:[]};
  var modeladoresChecks=state.personas.map(function(pe){var checked=(p.modeladoresAsignados||[]).includes(pe.id);return '<label class="check" style="display:flex;align-items:center;gap:6px"><input type="checkbox" class="f_model" value="'+pe.id+'" '+(checked?'checked':'')+' > '+esc(pe.nombre)+'</label>';}).join('');
  var body='<div class="frow"><label>Nombre del proyecto</label><input id="f_n" value="'+esc(p.nombre)+'"></div>'+
    '<div class="frow two">'+
      '<div class="frow"><label>Cliente</label><input id="f_cli" value="'+esc(p.cliente||'')+'"></div>'+
      '<div class="frow"><label>Color</label><input id="f_col" type="color" value="'+p.color+'" style="height:42px;padding:4px"></div>'+
    '</div>'+
    '<div class="frow"><label>Fecha de inicio</label><input id="f_ini" type="date" value="'+(p.fechaInicio||fmtDate(today()))+'"></div>'+
    '<div class="frow"><label>Modeladores asignados</label><div style="display:flex;flex-direction:column;gap:6px">'+modeladoresChecks+'</div></div>';
  openModal(isNew?'Nuevo proyecto':'Editar proyecto',body,function(){
    var nombre=val('f_n').trim(); if(!nombre){alert('Nombre requerido.');return false;}
    var modeladores=[].slice.call(document.querySelectorAll('.f_model:checked')).map(function(c){return c.value;});
    var data={nombre:nombre,cliente:val('f_cli'),color:val('f_col'),fechaInicio:val('f_ini')||fmtDate(today()),modeladoresAsignados:modeladores};
    if(isNew){data.id=uid('pr');state.proyectos.push(data);} else Object.assign(p,data);
    save().then(render);
  });
}

function absenceModal(presetPerson){
  var body='<div class="frow"><label>Persona</label><select id="f_p">'+selectOptions(state.personas,presetPerson||(state.personas[0]||{}).id)+'</select></div>'+
    '<div class="frow two">'+
      '<div class="frow"><label>Desde</label><input id="f_d1" type="date" value="'+fmtDate(today())+'"></div>'+
      '<div class="frow"><label>Hasta</label><input id="f_d2" type="date" value="'+fmtDate(today())+'"></div>'+
    '</div>'+
    '<div class="frow"><label>Motivo</label><input id="f_m" placeholder="Cita médica, vacaciones..."></div>';
  openModal('Registrar ausencia',body,function(){
    var d1=val('f_d1'),d2=val('f_d2'); if(!d1){alert('Indica la fecha.');return false;} if(!d2||d2<d1)d2=d1;
    state.ausencias.push({id:uid('au'),personaId:val('f_p'),fechaInicio:d1,fechaFin:d2,motivo:val('f_m')});
    save().then(render);
  });
}

function holidayModal(){
  var body='<div class="frow two"><div class="frow"><label>Fecha</label><input id="f_d" type="date" value="'+fmtDate(today())+'"></div><div class="frow"><label>Nombre</label><input id="f_n" placeholder="Festivo"></div></div>';
  openModal('Agregar festivo',body,function(){
    var d=val('f_d'); if(!d){alert('Indica la fecha.');return false;}
    state.feriados.push({id:uid('fer'),fecha:d,nombre:val('f_n')||'Festivo'});
    save().then(render);
  });
}

function asgModal(){
  var body='<div class="frow"><label>Nombre</label><input id="f_n" placeholder="Nombre de quien asigna"></div>';
  openModal('Nuevo asignador',body,function(){var n=val('f_n').trim();if(!n){alert('Nombre requerido.');return false;}state.asignadores.push({id:uid('as'),nombre:n});save().then(render);});
}

/* ============================================================
   ACCIONES (reordenar, borrar, importar/exportar, etc.)
   ============================================================ */
function reorder(id,dir){
  var t=byId(state.tareas,id); if(!t)return;
  var list=state.tareas.filter(function(x){return x.personaId===t.personaId&&x.estado!=='hecha';})
    .sort(function(a,b){return (a.prioridad-b.prioridad)||((a.fechaCreacion||'')>(b.fechaCreacion||'')?1:-1);});
  var i=list.indexOf(t); var j=i+dir; if(j<0||j>=list.length)return;
  // reasignar prioridades secuenciales y luego intercambiar
  list.forEach(function(x,k){x.prioridad=k;});
  var a=list[i],b=list[j]; var tmp=a.prioridad;a.prioridad=b.prioridad;b.prioridad=tmp;
  save().then(render);
}
function delTask(id){var t=byId(state.tareas,id);if(t&&confirm('¿Eliminar la tarea "'+t.nombre+'"?')){state.tareas=state.tareas.filter(function(x){return x.id!==id;});save().then(render);}}

function exportJSON(){
  var blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});
  var a=document.createElement('a');a.href=URL.createObjectURL(blob);
  a.download='cronograma-bim-'+fmtDate(today())+'.json';a.click();
  setTimeout(function(){URL.revokeObjectURL(a.href);},1000);
}
function exportToCSV(){
  var csv='Persona,Total Tareas,Activas,Completadas,Horas Estimadas,Horas Completadas,Horas Pendientes,Días de Trabajo,Avance Promedio\n';
  state.personas.filter(function(p){return p.activo!==false;}).forEach(function(p){
    var allTasks=state.tareas.filter(function(t){return t.personaId===p.id;});
    var activeTasks=allTasks.filter(function(t){return t.estado!=='hecha';});
    var doneTasks=allTasks.filter(function(t){return t.estado==='hecha';});
    var totalEst=allTasks.reduce(function(s,t){return s+(t.horasEstimadas||0);},0);
    var totalDone=allTasks.reduce(function(s,t){return s+(t.horasEstimadas||0)*(t.avance||0)/100;},0);
    var pendingHours=activeTasks.reduce(function(s,t){return s+remainingHours(t);},0);
    var cap=p.capacidadDiaria||8;
    var avgProgress=allTasks.length?Math.round(allTasks.reduce(function(s,t){return s+(t.avance||0);},0)/allTasks.length):0;
    csv+='"'+p.nombre+'",'+allTasks.length+','+activeTasks.length+','+doneTasks.length+','+Math.round(totalEst)+','+Math.round(totalDone)+','+Math.round(pendingHours)+','+(pendingHours/cap).toFixed(1)+','+avgProgress+'%\n';
  });
  var bom='﻿';
  var blob=new Blob([bom+csv],{type:'text/csv;charset=utf-8'});
  var a=document.createElement('a');a.href=URL.createObjectURL(blob);
  a.download='reportes-'+fmtDate(today())+'.csv';a.click();
  setTimeout(function(){URL.revokeObjectURL(a.href);},1000);
}
function exportToExcel(){
  var csv='Persona,Total Tareas,Activas,Completadas,Horas Estimadas,Horas Completadas,Horas Pendientes,Días de Trabajo,Avance Promedio\n';
  state.personas.filter(function(p){return p.activo!==false;}).forEach(function(p){
    var allTasks=state.tareas.filter(function(t){return t.personaId===p.id;});
    var activeTasks=allTasks.filter(function(t){return t.estado!=='hecha';});
    var doneTasks=allTasks.filter(function(t){return t.estado==='hecha';});
    var totalEst=allTasks.reduce(function(s,t){return s+(t.horasEstimadas||0);},0);
    var totalDone=allTasks.reduce(function(s,t){return s+(t.horasEstimadas||0)*(t.avance||0)/100;},0);
    var pendingHours=activeTasks.reduce(function(s,t){return s+remainingHours(t);},0);
    var cap=p.capacidadDiaria||8;
    var avgProgress=allTasks.length?Math.round(allTasks.reduce(function(s,t){return s+(t.avance||0);},0)/allTasks.length):0;
    csv+='"'+p.nombre+'",'+allTasks.length+','+activeTasks.length+','+doneTasks.length+','+Math.round(totalEst)+','+Math.round(totalDone)+','+Math.round(pendingHours)+','+(pendingHours/cap).toFixed(1)+','+avgProgress+'%\n';
  });
  var bom='﻿';
  var blob=new Blob([bom+csv],{type:'application/vnd.ms-excel;charset=utf-8'});
  var a=document.createElement('a');a.href=URL.createObjectURL(blob);
  a.download='reportes-'+fmtDate(today())+'.xlsx';a.click();
  setTimeout(function(){URL.revokeObjectURL(a.href);},1000);
}
function importJSON(){
  var inp=document.createElement('input');inp.type='file';inp.accept='application/json,.json';
  inp.onchange=function(){var f=inp.files[0];if(!f)return;var r=new FileReader();
    r.onload=function(){try{var data=JSON.parse(r.result);
      if(!data.personas||!data.tareas){alert('El archivo no tiene el formato esperado.');return;}
      state=data;['personas','asignadores','proyectos','tareas','ausencias','feriados'].forEach(function(k){if(!Array.isArray(state[k]))state[k]=[];});
      save().then(function(){render();alert('Datos importados correctamente.');});
    }catch(e){alert('No se pudo leer el archivo: '+e.message);}};
    r.readAsText(f);};
  inp.click();
}
function resetData(){if(confirm('Esto reemplaza todo por los datos de ejemplo. ¿Continuar?')){state=seed();save().then(render);}}

/* ============================================================
   ENRUTADOR DE EVENTOS
   ============================================================ */
var ACTIONS={
  'do-login':function(){
    var username = document.getElementById('login_user').value.trim();
    var password = document.getElementById('login_pass').value;
    if(!username || !password){
      alert('Ingresa usuario y contraseña');
      return;
    }
    if(login(username, password)){
      return;
    } else {
      alert('Usuario o contraseña incorrectos');
    }
  },
  'logout':function(){logout();},
  'add-task':function(){taskModal(null);},
  'add-task-proj':function(){taskModal(null);},
  'add-task-person':function(){taskModal(null);},
  'edit-task':function(id){var t=byId(state.tareas,id);if(t)taskModal(t);},
  'up':function(id){reorder(id,-1);},
  'down':function(id){reorder(id,1);},
  'goto-proj':function(id){UI.proj=id;UI.tab='proyectos';render();},
  'sel-proj':null,'sel-person':null,
  'add-person':function(){personModal(null);},
  'edit-person':function(id){personModal(byId(state.personas,id));},
  'del-person':function(id){var p=byId(state.personas,id);var n=state.tareas.filter(function(t){return t.personaId===id;}).length;
    if(confirm('¿Eliminar a '+p.nombre+'?'+(n?' Tiene '+n+' tarea(s) que también se eliminarán.':''))){state.tareas=state.tareas.filter(function(t){return t.personaId!==id;});state.ausencias=state.ausencias.filter(function(a){return a.personaId!==id;});state.personas=state.personas.filter(function(p){return p.id!==id;});save().then(render);}},
  'add-proj':function(){projModal(null);},
  'edit-proj':function(id){projModal(byId(state.proyectos,id));},
  'del-proj':function(id){var p=byId(state.proyectos,id);var n=state.tareas.filter(function(t){return t.proyectoId===id;}).length;
    if(confirm('¿Eliminar el proyecto '+p.nombre+'?'+(n?' Tiene '+n+' tarea(s) que también se eliminarán.':''))){state.tareas=state.tareas.filter(function(t){return t.proyectoId!==id;});state.proyectos=state.proyectos.filter(function(p){return p.id!==id;});save().then(render);}},
  'add-asg':function(){asgModal();},
  'del-asg':function(id){state.asignadores=state.asignadores.filter(function(a){return a.id!==id;});save().then(render);},
  'add-absence':function(){absenceModal(null);},
  'add-absence-person':function(){absenceModal(UI.person);},
  'del-absence':function(id){state.ausencias=state.ausencias.filter(function(a){return a.id!==id;});save().then(render);},
  'add-holiday':function(){holidayModal();},
  'del-holiday':function(id){state.feriados=state.feriados.filter(function(f){return f.id!==id;});save().then(render);},
  'export-json':function(){exportJSON();},
  'export-csv':function(){exportToCSV();},
  'export-excel':function(){exportToExcel();},
  'import-json':function(){importJSON();},
  'reset':function(){resetData();},
  'export-pdf':function(){UI.tab='resumen';render();setTimeout(function(){window.print();},120);},
  'colorby':function(v){UI.colorBy=v;render();},
  'ganttgroup':function(v){UI.ganttGroup=v;render();},
  'del-all-tasks':function(){if(confirm('¿Borrar TODAS las tareas? Esta acción no se puede deshacer.')){state.tareas=[];save().then(render);}},
  'del-all-data':function(){if(confirm('¿Borrar TODOS los proyectos y modeladores? Esto también eliminará todas las tareas asociadas. Esta acción no se puede deshacer.')){state.proyectos=[];state.personas=[];state.tareas=[];state.asignadores=[];save().then(render);}},
  'toggle-complete':function(id){var t=byId(state.tareas,id);if(t){t.estado=t.estado==='hecha'?'pendiente':'hecha';save().then(render);}},
  'del-task-individual':function(id){var t=byId(state.tareas,id);if(confirm('¿Eliminar la tarea "'+t.nombre+'"?')){state.tareas=state.tareas.filter(function(x){return x.id!==id;});save().then(render);}},
};

document.addEventListener('click',function(e){
  var el=e.target.closest('[data-act]'); if(!el)return;
  var act=el.dataset.act; var id=el.dataset.id; var v=el.dataset.v;
  if(act==='sel-proj'||act==='sel-person')return; // manejado por change
  var fn=ACTIONS[act];
  if(fn){ e.preventDefault(); fn(v!==undefined?v:id); }
});
document.addEventListener('change',function(e){
  var el=e.target.closest('[data-act]'); if(!el)return;
  if(el.dataset.act==='sel-proj'){UI.proj=el.value;render();}
  if(el.dataset.act==='sel-person'){UI.person=el.value;render();}
});

/* ============================================================
   NAVEGACIÓN E INICIO
   ============================================================ */
var TABS=[
  {id:'resumen',label:'Resumen',icon:'<rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/>'},
  {id:'proyectos',label:'Proyectos',icon:'<path d="M3 7h18M3 7l1.5 12a2 2 0 0 0 2 1.7h11a2 2 0 0 0 2-1.7L21 7M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>'},
  {id:'modeladores',label:'Modeladores',icon:'<circle cx="9" cy="7" r="3"/><path d="M3 21v-1a6 6 0 0 1 6-6M16 11l2 2 4-4"/>'},
  {id:'reportes',label:'Reportes',icon:'<path d="M3 3h18v18H3z"/><path d="M9 9h6M9 15h6M9 12h2M15 12h2"/>'},
  {id:'calendario',label:'Calendario',icon:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>'},
  {id:'config',label:'Configuración',icon:'<circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1l2-1.6-2-3.4-2.4 1a7 7 0 0 0-1.7-1L14.5 3h-4l-.4 2.6a7 7 0 0 0-1.7 1l-2.4-1-2 3.4L4 11a7 7 0 0 0 0 2l-2 1.6 2 3.4 2.4-1a7 7 0 0 0 1.7 1l.4 2.6h4l.4-2.6a7 7 0 0 0 1.7-1l2.4 1 2-3.4-2-1.6a7 7 0 0 0 .1-1z"/>'},
];
function buildNav(){
  document.getElementById('nav').innerHTML=TABS.map(function(t){
    return '<button data-tab="'+t.id+'"><svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">'+t.icon+'</svg>'+t.label+'</button>';}).join('');
  document.querySelectorAll('#nav button').forEach(function(b){b.addEventListener('click',function(){UI.tab=b.dataset.tab;render();});});
}

// Inicialización async
load().then(function(){
  buildNav();
  render();
}).catch(function(e){
  console.error('Error al cargar:', e);
  // Fallback: carga datos de ejemplo
  state=seed();
  buildNav();
  render();
});
