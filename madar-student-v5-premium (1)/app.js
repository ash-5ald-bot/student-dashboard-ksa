
const app=document.getElementById("app");
const TODAY=new Date();
const OFFICIAL_EVENTS_VERSION="1448-1449-v2";
const SUB_CODES={
  "MADAR-6M-2026":{months:6,label:"اشتراك 6 شهور"},
  "STUDENT-6M-GIFT":{months:6,label:"اشتراك 6 شهور"},
  "MADAR-YEAR-2026":{months:12,label:"اشتراك سنة"},
  "STUDENT-YEAR-GIFT":{months:12,label:"اشتراك سنة"}
};
const ymd=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
const parse=s=>{const [y,m,d]=s.split("-").map(Number);return new Date(y,m-1,d)};
const diff=s=>Math.ceil((parse(s)-new Date(TODAY.getFullYear(),TODAY.getMonth(),TODAY.getDate()))/86400000);
const arDate=s=>parse(s).toLocaleDateString("ar-SA",{weekday:"long",day:"numeric",month:"long",year:"numeric"});
const shortDate=s=>parse(s).toLocaleDateString("ar-SA",{day:"numeric",month:"short"});
const uid=()=>Math.random().toString(36).slice(2,10);
const esc=x=>String(x??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));

const PRESET_EVENTS=[
{id:"acad-start-admin",official:true,title:"عودة الهيئة الإدارية والمشرفين",type:"school",date:"2026-08-11",end:"2026-08-11",source:"التقويم الدراسي 1448-1449 هـ",notes:"حدث دراسي قابل للتعديل"},
{id:"acad-teachers",official:true,title:"عودة المعلمين",type:"school",date:"2026-08-16",end:"2026-08-16",source:"التقويم الدراسي 1448-1449 هـ",notes:"حدث دراسي قابل للتعديل"},
{id:"acad-start",official:true,title:"بداية العام الدراسي 1448-1449 هـ",type:"school",date:"2026-08-23",end:"2026-08-23",source:"وزارة التعليم/تقويم دراسي",notes:"للتقويم العام. بعض المدن قد تختلف حسب الإعلان الرسمي."},
{id:"national-day",official:true,title:"إجازة اليوم الوطني السعودي",type:"national",date:"2026-09-23",end:"2026-09-26",source:"مناسبة وطنية سعودية",notes:"اليوم الوطني 23 سبتمبر"},
{id:"autumn-break",official:true,title:"إجازة الخريف",type:"holiday",date:"2026-11-20",end:"2026-11-28",source:"التقويم الدراسي 1448-1449 هـ",notes:"إجازة دراسية"},
{id:"midyear-break",official:true,title:"إجازة منتصف العام",type:"holiday",date:"2027-01-08",end:"2027-01-16",source:"التقويم الدراسي 1448-1449 هـ",notes:"إجازة دراسية"},
{id:"ramadan",official:true,title:"بداية رمضان 1448 هـ",type:"ramadan",date:"2027-02-08",end:"2027-02-08",source:"تقويم أم القرى",notes:"تقويميًا؛ الإعلان النهائي حسب الرؤية"},
{id:"last10",official:true,title:"العشر الأواخر من رمضان",type:"ramadan",date:"2027-02-27",end:"2027-03-08",source:"تقويم أم القرى",notes:"تقويميًا؛ الإعلان النهائي حسب الرؤية"},
{id:"founding",official:true,title:"إجازة يوم التأسيس",type:"national",date:"2027-02-19",end:"2027-02-22",source:"يوم التأسيس/التقويم الدراسي",notes:"يوم التأسيس 22 فبراير"},
{id:"fitr-school",official:true,title:"إجازة عيد الفطر للمدارس",type:"eid",date:"2027-02-26",end:"2027-03-13",source:"التقويم الدراسي 1448-1449 هـ",notes:"قد تتغير حسب الرؤية والإعلان الرسمي"},
{id:"eid-fitr",official:true,title:"عيد الفطر المبارك 1448 هـ",type:"eid",date:"2027-03-09",end:"2027-03-11",source:"تقويم أم القرى",notes:"تقويميًا؛ الإعلان النهائي حسب الرؤية"},
{id:"adha-school",official:true,title:"إجازة عيد الأضحى للمدارس",type:"eid",date:"2027-05-07",end:"2027-05-22",source:"التقويم الدراسي 1448-1449 هـ",notes:"قد تتغير حسب الرؤية والإعلان الرسمي"},
{id:"arafah",official:true,title:"يوم عرفة 1448 هـ",type:"eid",date:"2027-05-16",end:"2027-05-16",source:"تقويم أم القرى",notes:"تقويميًا؛ الإعلان النهائي حسب الرؤية"},
{id:"eid-adha",official:true,title:"عيد الأضحى المبارك 1448 هـ",type:"eid",date:"2027-05-17",end:"2027-05-20",source:"تقويم أم القرى",notes:"تقويميًا؛ الإعلان النهائي حسب الرؤية"},
{id:"year-end",official:true,title:"بداية إجازة نهاية العام",type:"holiday",date:"2027-06-24",end:"2027-06-24",source:"التقويم الدراسي 1448-1449 هـ",notes:"بداية إجازة نهاية العام الدراسي"}
];

const DEFAULTS={
theme:"blue",active:"dashboard",query:"",calendarMode:"year",calendarYear:2026,calendarMonth:7,studentName:"",officialEventsVersion:OFFICIAL_EVENTS_VERSION,
subscription:{active:false,code:"",plan:"مجاني",expiresAt:null,redeemedAt:null},
notes:[{id:uid(),title:"تذكير",body:"راجع اختبار الأحياء قبل النوم",color:"#fff3a3",rot:"-1.5deg"},{id:uid(),title:"فكرة",body:"جهز جدول مذاكرة بعد المدرسة",color:"#c7f9cc",rot:"1.2deg"}],
subjects:[
{id:"math",name:"الرياضيات",teacher:"أ. ناصر",room:"B-204",color:"#27d7ff",progress:72,notes:"التركيز على الدوال والمعادلات."},
{id:"bio",name:"الأحياء",teacher:"د. سارة",room:"Lab-2",color:"#3ee58f",progress:58,notes:"مراجعة الجهاز العصبي قبل الاختبار."},
{id:"eng",name:"الإنجليزي",teacher:"Mr. Ahmed",room:"A-112",color:"#b65cff",progress:81,notes:"Presentation next week."},
{id:"cs",name:"الحاسب",teacher:"م. ريم",room:"IT-1",color:"#6d5dfc",progress:64,notes:"مشروع الواجهة الأسبوع القادم."}
],
tasks:[
{id:uid(),title:"واجب رياضيات",type:"homework",subjectId:"math",date:"2026-08-25",time:"20:00",priority:"high",status:"new",notes:"واجب تجريبي قابل للحذف"},
{id:uid(),title:"اختبار أحياء",type:"exam",subjectId:"bio",date:"2026-09-03",time:"09:30",priority:"high",status:"new",notes:"اختبار تجريبي"},
{id:uid(),title:"مشروع حاسب",type:"project",subjectId:"cs",date:"2026-09-12",time:"23:00",priority:"medium",status:"in_progress",notes:"تسليم prototype"}
],
events:[...PRESET_EVENTS],
schedule:[
{day:"الأحد",items:[{subjectId:"math",start:"08:00",end:"08:50",location:"B-204"},{subjectId:"bio",start:"09:00",end:"09:50",location:"Lab-2"},{subjectId:"eng",start:"10:10",end:"11:00",location:"A-112"}]},
{day:"الاثنين",items:[{subjectId:"cs",start:"08:00",end:"09:30",location:"IT-1"},{subjectId:"math",start:"10:00",end:"10:50",location:"B-204"}]},
{day:"الثلاثاء",items:[{subjectId:"bio",start:"08:00",end:"09:30",location:"Lab-2"},{subjectId:"eng",start:"10:00",end:"10:50",location:"A-112"}]},
{day:"الأربعاء",items:[{subjectId:"math",start:"08:00",end:"08:50",location:"B-204"},{subjectId:"cs",start:"10:10",end:"11:50",location:"IT-1"}]},
{day:"الخميس",items:[{subjectId:"eng",start:"08:00",end:"08:50",location:"A-112"},{subjectId:"bio",start:"09:00",end:"09:50",location:"Lab-2"}]}
]
};

let state=JSON.parse(localStorage.getItem("madar-student-v1")||"null")||structuredClone(DEFAULTS);
state={...structuredClone(DEFAULTS),...state,subscription:{...DEFAULTS.subscription,...(state.subscription||{})},notes:state.notes||DEFAULTS.notes,studentName:state.studentName||""};
let modal="";
function save(){localStorage.setItem("madar-student-v1",JSON.stringify(state))}
function subject(id){return state.subjects.find(s=>s.id===id)||state.subjects[0]||{name:"بدون مادة",color:"#94a3b8",teacher:"",room:""}}
function inRange(date,start,end){const d=parse(date),s=parse(start),e=parse(end||start);return d>=s&&d<=e}
function allItems(){return[...state.tasks.map(t=>({...t,kind:"task",end:t.date})),...state.events.map(e=>({...e,kind:"event"}))]}
function label(t){return({homework:"واجب",exam:"اختبار",project:"مشروع",note:"ملاحظة",holiday:"إجازة",eid:"عيد",ramadan:"رمضان",birthday:"ميلاد",personal:"شخصي",school:"دراسي",national:"وطني"}[t]||"حدث")}
function icon(t){return({homework:"📄",exam:"⚠️",project:"🧩",note:"📝",holiday:"🏖️",eid:"🌙",ramadan:"🕌",birthday:"🎂",personal:"✨",school:"🎓",national:"🇸🇦"}[t]||"📌")}
function tag(t){return "tag-"+(t||"personal")}
function color(t){return({eid:"#3ee58f",holiday:"#3ee58f",national:"#22c55e",ramadan:"#a78bfa",exam:"#ff5470",homework:"#ffd166",project:"#b65cff",school:"#27d7ff",birthday:"#ff7ab6"}[t]||"#b65cff")}
function navs(){return[["dashboard","🏠","الرئيسية"],["calendar","📅","التقويم"],["subjects","📚","المواد"],["schedule","⏰","الجدول"],["tasks","✅","المهام"],["events","🎉","المناسبات"],["settings","⚙️","الإعدادات"]]}
function navButtons(m=false){return navs().slice(0,m?5:7).map(([k,i,l])=>`<button data-nav="${k}" class="${state.active===k?"active":""}">${i}${m?"":`<span>${l}</span>`}</button>`).join("")}
function pageTitle(){return({dashboard:"مركز اليوم",calendar:"التقويم الذكي",subjects:"المواد",schedule:"الجدول الأسبوعي",tasks:"المهام والاختبارات",events:"المناسبات",settings:"الإعدادات"}[state.active]||"مركز اليوم")}
function nextItem(){return allItems().filter(x=>diff(x.date)>=0).sort((a,b)=>parse(a.date)-parse(b.date))[0]}
function isSubActive(){return state.subscription?.expiresAt && new Date(state.subscription.expiresAt)>new Date()}

function shell(content){
 document.documentElement.dataset.theme=state.theme;
 const n=nextItem();
 const greeting=state.studentName?`يا هلا والله ${esc(state.studentName)}، مستعد للإنجاز؟`:"يا هلا والله، مستعد للإنجاز؟";
 const subText=isSubActive()?`${state.subscription.plan} • ينتهي ${shortDate(state.subscription.expiresAt)}`:"مجاني";
 app.innerHTML=`<div class="app">
  <aside class="sidebar">
   <div class="brand"><div class="mark"><span>◎</span></div><div><h1>مدار الطالب</h1><p>StudentOS KSA</p></div></div>
   <nav class="nav">${navButtons()}</nav>
   <div class="pro-panel"><span class="eyebrow">${subText}</span><h3>مساعد دراسي ذكي</h3><p>المرحلة القادمة: إدخال صوتي/نصي يحول الكلام إلى مهام وخطة مذاكرة تلقائية.</p></div>
  </aside>
  <main class="main">
   <header class="top">
    <section class="hero">
     <div class="hero-inner">
      <div>
       <span class="badge">🇸🇦 تقويم سعودي • 1448-1449 هـ</span>
       <h2>${greeting}</h2>
       <p>كل ما يحتاجه الطالب في شاشة واحدة: ${pageTitle()} — تقويم دراسي، واجبات، اختبارات، مواد، رمضان، الأعياد والمناسبات السعودية بتصميم premium قابل للبيع.</p>
       <div class="hero-actions"><button class="btn" id="quickAdd">+ إضافة سريعة</button><button class="btn ghost" id="profileBtn">👤 بيانات الطالب</button><button class="btn ghost" id="themeBtn">${state.theme==="blue"?"🌸 ثيم وردي":"🔵 ثيم أزرق"}</button><button class="btn ghost" id="goCalendar">📅 افتح التقويم</button></div>
      </div>
      <div class="focus-card">
       <div class="focus-date">${TODAY.toLocaleDateString("ar-SA",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</div>
       <div class="ring"><span>${state.tasks.filter(t=>t.status==="done").length}/${Math.max(state.tasks.length,1)}</span></div>
       <div class="focus-next"><small>القادم</small><b>${n?esc(n.title):"لا توجد أحداث قادمة"}</b><div class="muted small">${n?`${diff(n.date)} يوم • ${label(n.type)}`:""}<br>${subText}</div></div>
      </div>
     </div>
    </section>
    <div class="toolrow">
      <div class="search"><span>🔎</span><input id="search" value="${esc(state.query)}" placeholder="ابحث عن مادة، اختبار، واجب، إجازة..."></div>
      <button class="btn ghost" id="exportMini">تصدير</button>
    </div>
   </header>
   <div class="content">${state.query.trim()?searchView():content}</div>
  </main>
  <button class="fab" id="fab">+</button>
  <div class="mobile"><div class="mobile-inner">${navButtons(true)}</div></div>
  ${modal}
 </div>`;
 bind();
}
function bind(){
 document.querySelectorAll("[data-nav]").forEach(b=>b.onclick=()=>{state.active=b.dataset.nav;state.query="";save();render()});
 document.getElementById("themeBtn").onclick=()=>{state.theme=state.theme==="blue"?"rose":"blue";save();render()};
 document.getElementById("quickAdd").onclick=()=>openModal("task");
 document.getElementById("profileBtn").onclick=openProfile;
 document.getElementById("fab").onclick=()=>openModal("task");
 document.getElementById("goCalendar").onclick=()=>{state.active="calendar";state.query="";save();render()};
 document.getElementById("exportMini").onclick=exportData;
 document.getElementById("search").oninput=e=>{state.query=e.target.value;render()};
 document.querySelectorAll("[data-close]").forEach(b=>b.onclick=()=>{modal="";render()});
}
function stat(ic,l,v,s){return`<div class="card stat"><div class="stat-top"><div><div class="stat-label">${l}</div><div class="stat-value">${v}</div><div class="muted small">${esc(s||"")}</div></div><div class="iconbox">${ic}</div></div></div>`}
function upcoming(x){const d=diff(x.date),s=x.subjectId?subject(x.subjectId):null;return`<div class="item"><div class="row"><div><div><span class="pill ${tag(x.type)}">${icon(x.type)} ${label(x.type)}</span>${s?` <span class="pill">${esc(s.name)}</span>`:""}</div><h3 style="margin:10px 0 5px">${esc(x.title)}</h3><div class="muted small">${arDate(x.date)}${x.end&&x.end!==x.date?` إلى ${shortDate(x.end)}`:""} ${x.time?`• ${esc(x.time)}`:""}</div>${x.notes?`<div class="muted small" style="margin-top:8px;line-height:1.8">${esc(x.notes)}</div>`:""}</div><div class="count ${d<=2?"urgent":d<=7?"soon":""}"><b>${Math.max(d,0)}</b><br><span class="small">يوم</span></div></div></div>`}
function dashboard(){
 const up=allItems().filter(x=>diff(x.date)>=0&&diff(x.date)<=60).sort((a,b)=>parse(a.date)-parse(b.date));
 const exam=state.tasks.filter(t=>t.type==="exam").sort((a,b)=>parse(a.date)-parse(b.date))[0];
 const hol=state.events.filter(e=>["holiday","eid"].includes(e.type)).sort((a,b)=>parse(a.date)-parse(b.date))[0];
 const ram=state.events.find(e=>e.type==="ramadan");
 const dn=["الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"][TODAY.getDay()];
 const todays=(state.schedule.find(d=>d.day===dn)||state.schedule[0]).items;
 return`<div class="grid stats">${stat("⚠️","أقرب اختبار",exam?`${diff(exam.date)} يوم`:"لا يوجد",exam?.title)}${stat("🏖️","أقرب إجازة",hol?`${diff(hol.date)} يوم`:"لا يوجد",hol?.title)}${stat("🕌","رمضان 1448",ram?`${diff(ram.date)} يوم`:"مدخل",ram?.title)}${stat("✅","منجزة",state.tasks.filter(t=>t.status==="done").length,"من إجمالي المهام")}</div>
 <div class="grid two" style="margin-top:18px">
  <div class="card"><div class="row"><div><h2>خط اليوم</h2><div class="muted">الحصص والمحاضرات حسب الجدول</div></div><span class="pill tag-school">🔊 تنبيه بصري</span></div><div class="list" style="margin-top:16px">${todays.map(x=>{const s=subject(x.subjectId);return`<div class="item"><div class="row"><div style="display:flex;gap:13px;align-items:center"><div class="subject-color" style="background:${s.color}"></div><div><h3 style="margin:0">${esc(s.name)}</h3><div class="muted small">${esc(s.teacher)} • ${esc(x.location)}</div></div></div><b>${x.start} - ${x.end}</b></div></div>`}).join("")}</div></div>
  <div class="card"><div class="row"><div><h2>القادم خلال 60 يوم</h2><div class="muted">اختبارات، إجازات، مناسبات</div></div><div class="iconbox">⏳</div></div><div class="list" style="margin-top:16px;max-height:640px;overflow:auto">${up.map(upcoming).join("")||`<div class="muted">لا توجد أحداث قريبة</div>`}</div></div>
 </div>
 <div class="card" style="margin-top:18px"><div class="row"><div><h2>ستكرات التذكير</h2><div class="muted">Sticky notes للمهام السريعة والأفكار</div></div><button class="btn ghost" onclick="openNote()">+ ستيكر</button></div><div class="sticky-board" style="margin-top:16px">${state.notes.map(note=>`<div class="note" style="background:${note.color};--rot:${note.rot||'0deg'}"><button onclick="deleteNote('${note.id}')">×</button><h4>${esc(note.title)}</h4><p>${esc(note.body)}</p></div>`).join("")}</div></div>`
}
function calendar(){
 setTimeout(bindCal,0);
 return`<div class="card"><div class="monthbar"><div><h2>تقويم 1448-1449 هـ</h2><div class="muted">عرض سنوي مصغر، واضغط على أي شهر للتكبير.</div></div><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn ghost" data-year="-1">السنة السابقة</button><button class="btn">${state.calendarYear}</button><button class="btn ghost" data-year="1">السنة التالية</button><div class="seg"><button data-mode="year" class="${state.calendarMode==="year"?"active":""}">كل الشهور</button><button data-mode="month" class="${state.calendarMode==="month"?"active":""}">شهر مكبر</button></div></div></div>${state.calendarMode==="year"?yearView(state.calendarYear):monthView(state.calendarYear,state.calendarMonth)}<div class="source-note">رمضان والأعياد مبنية على تقويم أم القرى/تقديرات تقويمية، والإعلان النهائي حسب الرؤية والجهات الرسمية. كل الأحداث قابلة للتعديل.</div></div>`
}
function bindCal(){document.querySelectorAll("[data-year]").forEach(b=>b.onclick=()=>{state.calendarYear+=Number(b.dataset.year);save();render()});document.querySelectorAll("[data-mode]").forEach(b=>b.onclick=()=>{state.calendarMode=b.dataset.mode;save();render()});document.querySelectorAll("[data-open-month]").forEach(b=>b.onclick=()=>{state.calendarMonth=Number(b.dataset.openMonth);state.calendarMode="month";save();render()});document.querySelectorAll("[data-prev]").forEach(b=>b.onclick=()=>changeMonth(-1));document.querySelectorAll("[data-next]").forEach(b=>b.onclick=()=>changeMonth(1))}
function changeMonth(n){let m=state.calendarMonth+n,y=state.calendarYear;if(m<0){m=11;y--}if(m>11){m=0;y++}state.calendarMonth=m;state.calendarYear=y;save();render()}
function monthEvents(y,m){return allItems().filter(e=>{const d=parse(e.date);return d.getFullYear()===y&&d.getMonth()===m})}
function yearView(y){return`<div class="year-grid">${Array.from({length:12},(_,m)=>miniMonth(y,m)).join("")}</div>`}
function miniMonth(y,m){const name=new Date(y,m,1).toLocaleDateString("ar-SA",{month:"long"}),dim=new Date(y,m+1,0).getDate(),first=new Date(y,m,1).getDay(),evs=monthEvents(y,m),cells=Array.from({length:first+dim},(_,i)=>i<first?null:i-first+1);return`<button class="mini-month" data-open-month="${m}"><div class="mini-title"><span>${name}</span><span class="pill">${evs.length}</span></div><div class="mini-days">${["ح","ن","ث","ر","خ","ج","س"].map(d=>`<span>${d}</span>`).join("")}${cells.map(day=>{if(!day)return`<span></span>`;const iso=ymd(new Date(y,m,day)),has=evs.some(e=>inRange(iso,e.date,e.end)),ist=iso===ymd(TODAY);return`<span class="${has?"has":""} ${ist?"today":""}">${day}</span>`}).join("")}</div><div class="dots">${evs.slice(0,10).map(e=>`<i class="dot" style="background:${color(e.type)}" title="${esc(e.title)}"></i>`).join("")}</div></button>`}
function monthView(y,m){const name=new Date(y,m,1).toLocaleDateString("ar-SA",{month:"long",year:"numeric"}),dim=new Date(y,m+1,0).getDate(),first=new Date(y,m,1).getDay(),cells=Array.from({length:first+dim},(_,i)=>i<first?null:i-first+1),items=allItems();return`<div class="monthbar"><button class="btn ghost" data-prev>السابق</button><h2>${name}</h2><button class="btn ghost" data-next>التالي</button></div><div class="cal-head">${["الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"].map(d=>`<div>${d}</div>`).join("")}</div><div class="cal-grid">${cells.map(day=>{if(!day)return`<div></div>`;const iso=ymd(new Date(y,m,day)),evs=items.filter(e=>inRange(iso,e.date,e.end)),ist=iso===ymd(TODAY);return`<div class="day ${ist?"today":""}"><span class="daynum">${day}</span>${evs.slice(0,4).map(e=>`<span class="ev ${tag(e.type)}">${icon(e.type)} ${esc(e.title)}</span>`).join("")}</div>`}).join("")}</div>`}
function subjects(){return`<div class="actions" style="margin-top:0"><button class="btn" onclick="openSubject()">+ إضافة مادة</button></div><div class="grid three" style="margin-top:16px">${state.subjects.map(s=>`<div class="card"><div style="height:8px;background:${s.color};border-radius:99px;margin-bottom:16px"></div><div class="row"><div><h2>${esc(s.name)}</h2><div class="muted small">${esc(s.teacher)} • ${esc(s.room)}</div></div><div class="iconbox" style="background:${s.color}">📚</div></div><p class="muted">${esc(s.notes||"")}</p><div class="row small"><b>الإنجاز</b><b>${s.progress||0}%</b></div><div class="progress"><span style="width:${s.progress||0}%"></span></div><div class="actions"><button class="btn ghost" onclick="openSubject('${s.id}')">تعديل</button><button class="btn danger" onclick="deleteSubject('${s.id}')">حذف</button></div></div>`).join("")}</div>`}
function schedule(){return`<div class="grid week">${state.schedule.map(d=>`<div class="card"><h2 style="text-align:center;margin-bottom:14px">${d.day}</h2><div class="list">${d.items.map(x=>{const s=subject(x.subjectId);return`<div class="item"><div style="height:6px;background:${s.color};border-radius:99px;margin-bottom:10px"></div><b>${esc(s.name)}</b><div class="muted small">⏰ ${esc(x.start)} - ${esc(x.end)}</div><div class="muted small">📍 ${esc(x.location)}</div></div>`}).join("")}</div></div>`).join("")}</div>`}
function tasks(){return`<div class="actions" style="margin-top:0"><button class="btn" onclick="openModal('task')">+ إضافة واجب/اختبار</button></div><div class="grid twoeq" style="margin-top:16px">${state.tasks.sort((a,b)=>parse(a.date)-parse(b.date)).map(t=>{const s=subject(t.subjectId),d=diff(t.date);return`<div class="card"><div class="row"><div><span class="pill ${tag(t.type)}">${icon(t.type)} ${label(t.type)}</span> <span class="pill">${esc(s.name)}</span><h2 style="margin-top:12px">${esc(t.title)}</h2><div class="muted">${arDate(t.date)} • ${esc(t.time||"")}</div></div><div class="count ${d<=2?"urgent":d<=7?"soon":""}"><b>${d}</b><br><span class="small">يوم</span></div></div><p class="muted">${esc(t.notes||"")}</p><div class="actions"><button class="btn ${t.status==="done"?"done":"ghost"}" onclick="toggleDone('${t.id}')">${t.status==="done"?"✓ تم الإنجاز":"تم الإنجاز"}</button><button class="btn ghost" onclick="openModal('task','${t.id}')">تعديل</button><button class="btn danger" onclick="deleteTask('${t.id}')">حذف</button></div></div>`}).join("")}</div>`}
function events(){return`<div class="actions" style="margin-top:0"><button class="btn" onclick="openModal('event')">+ إضافة مناسبة</button><button class="btn ghost" onclick="updateOfficialEvents()">تحديث الرسمية</button></div><div class="grid twoeq" style="margin-top:16px">${state.events.sort((a,b)=>parse(a.date)-parse(b.date)).map(e=>`<div class="card"><div class="row"><div><span class="pill ${tag(e.type)}">${icon(e.type)} ${label(e.type)}</span><h2 style="margin-top:12px">${esc(e.title)}</h2><div class="muted">${arDate(e.date)}${e.end&&e.end!==e.date?` إلى ${shortDate(e.end)}`:""}</div></div><div class="count"><b>${diff(e.date)}</b><br><span class="small">يوم</span></div></div><p class="muted">${esc(e.notes||"")}</p><div class="muted small">المصدر: ${esc(e.source||"مدخل شخصي")}${e.official?" • رسمي":""}</div><div class="actions"><button class="btn ghost" onclick="openModal('event','${e.id}')">تعديل</button><button class="btn danger" onclick="deleteEvent('${e.id}')">حذف</button></div></div>`).join("")}</div>`}
function settings(){return`<div class="grid twoeq">
<div class="card"><h2>بيانات الطالب</h2><p class="muted">اسم الطالب يظهر في الهيدر.</p><div class="item"><b>الاسم الحالي</b><div class="muted">${state.studentName?esc(state.studentName):"لم يتم إدخال الاسم"}</div></div><div class="actions"><button class="btn" onclick="openProfile()">تعديل الاسم</button><button class="btn ghost" onclick="exportData()">تصدير البيانات</button><button class="btn ghost" onclick="importData()">استيراد البيانات</button><button class="btn danger" onclick="resetData()">إعادة ضبط</button></div></div>
<div class="card"><h2>الاشتراك بالأكواد</h2><p class="muted">أدخل كود 6 شهور أو سنة. هذه نسخة محلية للتجربة، والنسخة التجارية تحتاج تحقق من السيرفر.</p><div class="sub-card ${isSubActive()?"sub-active":""}"><b>${isSubActive()?"اشتراك مفعل":"لا يوجد اشتراك مفعل"}</b><div class="muted">${isSubActive()?`${state.subscription.plan} — ينتهي ${arDate(state.subscription.expiresAt)}`:"الخطة الحالية: مجانية"}</div></div><div class="actions"><button class="btn" onclick="openRedeem()">إدخال كود</button></div></div>
<div class="card"><h2>تحديث المناسبات الرسمية</h2><p class="muted">عند إعلان التقويم الرسمي، نحدث قائمة PRESET_EVENTS في إصدار جديد. المستخدم يضغط تحديث الرسمية فتتحدث الأحداث الرسمية فقط بدون حذف المناسبات الشخصية.</p><div class="item"><b>إصدار المناسبات</b><div class="muted">${state.officialEventsVersion||"غير معروف"}</div></div><div class="actions"><button class="btn success" onclick="updateOfficialEvents()">تحديث المناسبات الرسمية</button></div></div>
<div class="card"><h2>التحديث بدون فقد البيانات</h2><p class="muted">البيانات محفوظة في LocalStorage باسم ثابت. إذا حدثت نفس رابط Vercel ونفس الدومين، لن تضيع بيانات المستخدم. إذا غيرت الدومين أو المشروع، استخدم تصدير/استيراد.</p></div>
</div>`}
function searchView(){const q=state.query.toLowerCase();const subs=state.subjects.filter(s=>JSON.stringify(s).toLowerCase().includes(q));const ts=state.tasks.filter(t=>JSON.stringify(t).toLowerCase().includes(q));const ev=state.events.filter(e=>JSON.stringify(e).toLowerCase().includes(q));return`<div class="card"><h2>نتائج البحث عن: ${esc(state.query)}</h2><p class="muted">بحث في المواد، المهام، الاختبارات، والمناسبات.</p></div><br><div class="grid three"><div class="card"><h3>المواد</h3>${subs.map(s=>`<div class="item">${esc(s.name)}<div class="muted small">${esc(s.teacher)}</div></div>`).join("")||"<p class='muted'>لا توجد نتائج</p>"}</div><div class="card"><h3>المهام</h3>${ts.map(t=>`<div class="item">${esc(t.title)}<div class="muted small">${shortDate(t.date)}</div></div>`).join("")||"<p class='muted'>لا توجد نتائج</p>"}</div><div class="card"><h3>المناسبات</h3>${ev.map(e=>`<div class="item">${esc(e.title)}<div class="muted small">${shortDate(e.date)}</div></div>`).join("")||"<p class='muted'>لا توجد نتائج</p>"}</div></div>`}
function render(){const pages={dashboard,calendar,subjects,schedule,tasks,events,settings};shell((pages[state.active]||dashboard)())}
window.openModal=(kind,id)=>{const isEvent=kind==="event",data=isEvent?state.events.find(x=>x.id===id):state.tasks.find(x=>x.id===id);modal=`<div class="modal"><div class="modalbox"><div class="row"><div><h2>${isEvent?"إضافة / تعديل مناسبة":"إضافة / تعديل مهمة"}</h2><p class="muted">سيتم الحفظ محليًا على هذا الجهاز.</p></div><button class="btn ghost" data-close>✕</button></div><br><form class="form" id="form"><label>النوع<select name="type">${(isEvent?[["personal","شخصي"],["birthday","عيد ميلاد"],["holiday","إجازة"],["eid","عيد"],["ramadan","رمضان"],["school","دراسي"],["national","وطني"]]:[["homework","واجب"],["exam","اختبار"],["project","مشروع"],["note","ملاحظة"]]).map(([v,l])=>`<option value="${v}" ${data?.type===v?"selected":""}>${l}</option>`).join("")}</select></label><label>العنوان<input name="title" required value="${esc(data?.title||"")}"></label>${isEvent?"":`<label>المادة<select name="subjectId">${state.subjects.map(s=>`<option value="${s.id}" ${data?.subjectId===s.id?"selected":""}>${esc(s.name)}</option>`).join("")}</select></label>`}<label>التاريخ<input type="date" name="date" required value="${esc(data?.date||ymd(TODAY))}"></label>${isEvent?`<label>تاريخ النهاية<input type="date" name="end" value="${esc(data?.end||data?.date||ymd(TODAY))}"></label><label>المصدر<input name="source" value="${esc(data?.source||"مدخل شخصي")}"></label>`:`<label>الوقت<input type="time" name="time" value="${esc(data?.time||"08:00")}"></label><label>الأولوية<select name="priority"><option value="low">عادية</option><option value="medium" ${data?.priority==="medium"?"selected":""}>متوسطة</option><option value="high" ${data?.priority==="high"?"selected":""}>عالية</option></select></label>`}<label class="full">ملاحظات<textarea name="notes">${esc(data?.notes||"")}</textarea></label><div class="full actions"><button class="btn" type="submit">حفظ</button><button class="btn ghost" type="button" data-close>إلغاء</button></div></form></div></div>`;render();document.getElementById("form").onsubmit=e=>{e.preventDefault();const fd=Object.fromEntries(new FormData(e.target).entries());if(isEvent){const item={id:data?.id||uid(),official:data?.official||false,title:fd.title,type:fd.type,date:fd.date,end:fd.end||fd.date,source:fd.source||"مدخل شخصي",notes:fd.notes};data?state.events=state.events.map(x=>x.id===data.id?item:x):state.events.push(item)}else{const item={id:data?.id||uid(),title:fd.title,type:fd.type,subjectId:fd.subjectId,date:fd.date,time:fd.time,priority:fd.priority||"medium",status:data?.status||"new",notes:fd.notes};data?state.tasks=state.tasks.map(x=>x.id===data.id?item:x):state.tasks.push(item)}modal="";save();toast("تم الحفظ");render()};document.querySelectorAll("[data-close]").forEach(b=>b.onclick=()=>{modal="";render()})}
window.openSubject=(id)=>{const data=state.subjects.find(s=>s.id===id);modal=`<div class="modal"><div class="modalbox"><div class="row"><h2>إضافة / تعديل مادة</h2><button class="btn ghost" data-close>✕</button></div><br><form class="form" id="sform"><label>اسم المادة<input name="name" required value="${esc(data?.name||"")}"></label><label>المدرس/الدكتور<input name="teacher" value="${esc(data?.teacher||"")}"></label><label>القاعة<input name="room" value="${esc(data?.room||"")}"></label><label>اللون<input type="color" name="color" value="${esc(data?.color||"#27d7ff")}"></label><label>نسبة الإنجاز<input type="number" min="0" max="100" name="progress" value="${data?.progress||0}"></label><label class="full">ملاحظات<textarea name="notes">${esc(data?.notes||"")}</textarea></label><div class="full actions"><button class="btn" type="submit">حفظ</button><button class="btn ghost" type="button" data-close>إلغاء</button></div></form></div></div>`;render();document.getElementById("sform").onsubmit=e=>{e.preventDefault();const fd=Object.fromEntries(new FormData(e.target).entries());const item={id:data?.id||uid(),name:fd.name,teacher:fd.teacher,room:fd.room,color:fd.color,progress:Number(fd.progress||0),notes:fd.notes};data?state.subjects=state.subjects.map(s=>s.id===data.id?item:s):state.subjects.push(item);modal="";save();render()};document.querySelectorAll("[data-close]").forEach(b=>b.onclick=()=>{modal="";render()})}

window.openProfile=()=>{modal=`<div class="modal"><div class="modalbox"><div class="row"><h2>بيانات الطالب</h2><button class="btn ghost" data-close>✕</button></div><br><form class="form" id="pform"><label class="full">اسم الطالب<input name="name" required placeholder="مثال: خالد" value="${esc(state.studentName)}"></label><div class="full actions"><button class="btn" type="submit">حفظ</button><button class="btn ghost" type="button" data-close>إلغاء</button></div></form></div></div>`;render();document.getElementById("pform").onsubmit=e=>{e.preventDefault();state.studentName=new FormData(e.target).get("name");modal="";save();render()};document.querySelectorAll("[data-close]").forEach(b=>b.onclick=()=>{modal="";render()})}
window.openRedeem=()=>{modal=`<div class="modal"><div class="modalbox"><div class="row"><h2>تفعيل الاشتراك بالكود</h2><button class="btn ghost" data-close>✕</button></div><p class="muted">أكواد تجربة: MADAR-6M-2026 أو MADAR-YEAR-2026</p><form class="form" id="rform"><label class="full">كود الاشتراك<input name="code" required placeholder="MADAR-6M-2026"></label><div class="full actions"><button class="btn" type="submit">تفعيل</button><button class="btn ghost" type="button" data-close>إلغاء</button></div></form></div></div>`;render();document.getElementById("rform").onsubmit=e=>{e.preventDefault();const code=String(new FormData(e.target).get("code")).trim().toUpperCase();const plan=SUB_CODES[code];if(!plan){toast("الكود غير صحيح");return}const start=new Date();const end=new Date();end.setMonth(end.getMonth()+plan.months);state.subscription={active:true,code,plan:plan.label,redeemedAt:start.toISOString(),expiresAt:end.toISOString()};modal="";save();toast("تم تفعيل الاشتراك");render()};document.querySelectorAll("[data-close]").forEach(b=>b.onclick=()=>{modal="";render()})}
window.openNote=()=>{const colors=["#fff3a3","#c7f9cc","#bde0fe","#ffc8dd","#e9d5ff"];modal=`<div class="modal"><div class="modalbox"><div class="row"><h2>ستكر تذكير</h2><button class="btn ghost" data-close>✕</button></div><br><form class="form" id="nform"><label>العنوان<input name="title" required placeholder="تذكير"></label><label>اللون<select name="color">${colors.map(c=>`<option value="${c}">${c}</option>`).join("")}</select></label><label class="full">النص<textarea name="body" required placeholder="اكتب ملاحظتك"></textarea></label><div class="full actions"><button class="btn" type="submit">إضافة</button><button class="btn ghost" type="button" data-close>إلغاء</button></div></form></div></div>`;render();document.getElementById("nform").onsubmit=e=>{e.preventDefault();const fd=Object.fromEntries(new FormData(e.target).entries());state.notes.push({id:uid(),title:fd.title,body:fd.body,color:fd.color,rot:(Math.random()*4-2).toFixed(1)+"deg"});modal="";save();render()};document.querySelectorAll("[data-close]").forEach(b=>b.onclick=()=>{modal="";render()})}
window.deleteNote=id=>{state.notes=state.notes.filter(n=>n.id!==id);save();render()}
window.updateOfficialEvents=()=>{const personal=state.events.filter(e=>!e.official&&!PRESET_EVENTS.some(p=>p.id===e.id));state.events=[...personal,...PRESET_EVENTS.map(e=>({...e}))];state.officialEventsVersion=OFFICIAL_EVENTS_VERSION;save();toast("تم تحديث المناسبات الرسمية");render()}
window.deleteSubject=id=>{if(confirm("حذف المادة سيحذف مهامها المرتبطة. متابعة؟")){state.subjects=state.subjects.filter(s=>s.id!==id);state.tasks=state.tasks.filter(t=>t.subjectId!==id);save();render()}}
window.deleteTask=id=>{state.tasks=state.tasks.filter(t=>t.id!==id);save();render()}
window.toggleDone=id=>{state.tasks=state.tasks.map(t=>t.id===id?{...t,status:t.status==="done"?"new":"done"}:t);save();render()}
window.deleteEvent=id=>{state.events=state.events.filter(e=>e.id!==id);save();render()}
function exportData(){const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="madar-student-data.json";a.click()}
window.exportData=exportData;
window.importData=()=>{const inp=document.createElement("input");inp.type="file";inp.accept="application/json";inp.onchange=()=>{const r=new FileReader();r.onload=()=>{state=JSON.parse(r.result);save();render()};r.readAsText(inp.files[0])};inp.click()}
window.resetData=()=>{if(confirm("إعادة ضبط كل البيانات؟")){localStorage.removeItem("madar-student-v1");state=structuredClone(DEFAULTS);render()}}
function toast(msg){const t=document.createElement("div");t.className="toast";t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.remove(),1900)}
if("serviceWorker"in navigator)navigator.serviceWorker.register("./sw.js").catch(()=>{});
render();
