/* Elsewhere Academics · ortak betik (tüm sayfalar) */
(function(){
const PC={Prep:['var(--ea-prep)','var(--ea-on-prep)'],Summer:['var(--ea-summer)','var(--ea-on-summer)'],Campus:['var(--ea-campus)','var(--ea-on-campus)'],Next:['var(--ea-next)','var(--ea-on-next)']};
const EN=document.documentElement.lang==='en';const L=(t,e)=>EN?e:t;const PG=u=>EN&&/^[a-z0-9-]+\.html/.test(u)?'en-'+u:u;const LC=EN?'en':'tr';
const AY=EN?['January','February','March','April','May','June','July','August','September','October','November','December']:['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
const GUN=EN?['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']:['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'];
const GK=EN?['SU','MO','TU','WE','TH','FR','SA']:['PZ','PT','SA','ÇA','PE','CU','CT'];
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const low=s=>String(s||'').toLocaleLowerCase(LC);
const pd=s=>{const [y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d)};
const ds=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const today=new Date();today.setHours(0,0,0,0);const TODAY=ds(today);
const $=id=>document.getElementById(id);
const IOS=/iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent)&&!/Android/.test(navigator.userAgent);
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const ICO={chev:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 9l6 6 6-6"/></svg>',cal:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="4.5" width="18" height="16" rx="3"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/></svg>',
 link:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>'};

/* ----- Üst şerit ----- */
const topBar=$('top');
if(topBar){const hero=$('giris');
  if(hero){const f=()=>topBar.classList.toggle('on',scrollY>hero.offsetHeight-80);addEventListener('scroll',f,{passive:true});f()}
  else topBar.classList.add('on')}

/* ----- Menü ----- */
const menu=$('menu'),ob=$('openMenu');
const setMenu=o=>{if(!menu)return;menu.classList.toggle('open',o);menu.setAttribute('aria-hidden',!o);ob&&ob.setAttribute('aria-expanded',o);document.body.style.overflow=o?'hidden':''};
ob&&(ob.onclick=()=>setMenu(true));
$('closeMenu')&&($('closeMenu').onclick=()=>setMenu(false));
menu&&menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));

/* ----- Sağ alt düğme ----- */
const fab=$('fab'),fb=$('fabBtn');
fb&&(fb.onclick=()=>{const o=!fab.classList.contains('open');fab.classList.toggle('open',o);fb.setAttribute('aria-expanded',o)});
addEventListener('keydown',e=>{if(e.key==='Escape'){setMenu(false);fab&&fab.classList.remove('open')}});
document.addEventListener('click',e=>{if(fab&&!e.target.closest('#fab'))fab.classList.remove('open')});

/* ----- Açılış: farklı dillerde merhaba (aynı anda birkaç kelime) ----- */
const hello=document.querySelector('.hello');
if(hello&&!RM){const sp=[...hello.children],cols=['#C13BFF','#FFA51E','#FF3B30','#00B4D8'];let k=0,on=new Set();
  const light=s=>{s.style.setProperty('--c',cols[k++%4]);s.classList.add('lit');on.add(s);setTimeout(()=>{s.classList.remove('lit');on.delete(s)},2600)};
  light(sp[0]);
  setInterval(()=>{if(document.hidden)return;const free=sp.filter(x=>!on.has(x));light(free[Math.floor(Math.random()*free.length)])},700)}

/* ----- Veri ----- */
let TAKVIM=null,ARAMA=null;
const loadTakvim=()=>TAKVIM||(TAKVIM=fetch(EN?'takvim-en.json':'takvim.json').then(r=>r.json()).then(d=>d.filter(e=>pd(e.bitis||e.baslangic)>=today).sort((a,b)=>a.baslangic.localeCompare(b.baslangic))).catch(()=>[]));
const loadArama=()=>ARAMA||(ARAMA=fetch(EN?'arama-en.json':'arama.json').then(r=>r.json()).catch(()=>[]));
const progs=e=>(e.programlar&&e.programlar.length?e.programlar:[]);
const trd=s=>{const d=pd(s);return d.getDate()+' '+AY[d.getMonth()]+' '+d.getFullYear()};

/* ----- Takvime ekle ----- */
const nextDay=s=>{const d=pd(s);d.setDate(d.getDate()+1);return ds(d)};
const icsEsc=s=>String(s||'').replace(/\\/g,'\\\\').replace(/[,;]/g,m=>'\\'+m).replace(/\n/g,'\\n');
function gcal(e,day){const a=day.replace(/-/g,''),b=nextDay(day).replace(/-/g,'');
  return 'https://calendar.google.com/calendar/render?action=TEMPLATE&text='+encodeURIComponent(e.etkinlik)+'&dates='+a+'/'+b+'&details='+encodeURIComponent((e.ulke||'')+(e.kurum?' · '+e.kurum:'')+(e.kaynak?'\n'+e.kaynak:'')+'\nelsewhereacademics.com')}
function ics(e,day){const st=new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d+/,'');
  const t=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Elsewhere Academics//Takvim//TR','CALSCALE:GREGORIAN','BEGIN:VEVENT','UID:ea-'+e.id+'-'+day+'@elsewhereacademics.com','DTSTAMP:'+st,'DTSTART;VALUE=DATE:'+day.replace(/-/g,''),'DTEND;VALUE=DATE:'+nextDay(day).replace(/-/g,''),'SUMMARY:'+icsEsc(e.etkinlik),'DESCRIPTION:'+icsEsc((e.ulke||'')+(e.kurum?' · '+e.kurum:'')+(e.kaynak?'\n'+e.kaynak:'')),'END:VEVENT','END:VCALENDAR'].join('\r\n');
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([t],{type:'text/calendar'}));a.download='elsewhere-'+e.id+'.ics';document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500)}
let EVMAP={};
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-ics]');if(!b)return;const e=EVMAP[b.dataset.ics];if(e)ics(e,b.dataset.day)});

function rangeTxt(e){if(!e.bitis)return '';return EN?trd(e.baslangic)+' to '+trd(e.bitis):trd(e.baslangic)+' ile '+trd(e.bitis)+' arası'}
function evHTML(e,day,kind){EVMAP[e.id]=e;
  const tags=progs(e).map(p=>`<span style="--c:${PC[p][0]};--c-on:${PC[p][1]}">${p.toLocaleUpperCase(LC)}</span>`).join('');
  const k=kind==='start'?L('Başlıyor · ','Starts · '):kind==='end'?L('Son gün · ','Deadline · '):'';
  const meta=[esc(e.ulke),e.kurum?esc(e.kurum):'',e.bitis?rangeTxt(e):''].filter(Boolean).join(' · ');
  const soon=(pd(day)-today)/864e5<7?`<span class="soon">${L('Bu hafta','This week')}</span>`:'';
  return `<div class="ev" id="ev-${esc(e.id)}"><div class="tag">${tags}${soon}</div><h4>${k}${esc(e.etkinlik)}</h4><div class="meta">${meta}</div>
  <div class="acts">${IOS?`<button type="button" data-ics="${esc(e.id)}" data-day="${day}">${ICO.cal}${L('Takvime ekle','Add to calendar')}</button>`:`<a href="${gcal(e,day)}" target="_blank" rel="noopener">${ICO.cal}${L('Takvime ekle','Add to calendar')}</a>`}${e.kaynak?`<a class="src" href="${esc(e.kaynak)}" target="_blank" rel="noopener">${L('kaynak','source')}</a>`:''}</div></div>`}
function miniHTML(e,day,kind){const d=pd(day),p=progs(e)[0];
  return `<button type="button" class="mini${(d-today)/864e5<7?' soonm':''}" data-go="${day}"><span class="d">${d.getDate()}<small>${AY[d.getMonth()].slice(0,3).toLocaleUpperCase(LC)} · ${GK[d.getDay()]}</small></span><span><i style="--c:${p?PC[p][0]:'var(--ea-navy)'}"></i>${kind==='end'?L('Son gün · ','Deadline · '):''}${esc(e.etkinlik)}<small>${esc(e.ulke)}</small></span></button>`}
function rowHTML(e,day,kind){const d=pd(day);
  return `<div class="ev"><div class="d">${d.getDate()}<small>${AY[d.getMonth()].slice(0,3).toLocaleUpperCase(LC)} · ${GK[d.getDay()]}</small></div>${evHTML(e,day,kind).replace('<div class="ev"','<div').replace(/ id="ev-[^"]*"/,'')}</div>`}
/* olayları günlere yerleştir: aralıklı olaylar başlangıç ve bitiş gününde görünür */
function byDay(list){const m={};const add=(d,e,k)=>{if(d<TODAY)return;(m[d]=m[d]||[]).push({e,k})};
  list.forEach(e=>{if(e.bitis&&e.bitis!==e.baslangic){add(e.baslangic,e,'start');add(e.bitis,e,'end')}else add(e.baslangic,e,'')});return m}

/* ----- Aylık takvim ----- */
document.querySelectorAll('[data-calgrid]').forEach(root=>{
  const grid=root.querySelector('.calg-days'),title=root.querySelector('.calg-head h3'),prevB=root.querySelector('[data-prev]'),nextB=root.querySelector('[data-next]');
  const panel=root.querySelector('.daypanel'),mlist=root.querySelector('.mlist'),sel=root.querySelector('select'),chips=[...root.querySelectorAll('.chip[data-p]')];
  const home=root.dataset.calgrid==='home';
  const vbs=[...root.querySelectorAll('[data-view]')],wrapEl=root.querySelector('.cal-wrap'),all=root.querySelector('[data-alllink]');let view='ay';
  const setView=v=>{view=v;vbs.forEach(b=>b.setAttribute('aria-pressed',b.dataset.view===v));if(wrapEl)wrapEl.hidden=v==='liste';draw()};
  vbs.forEach(b=>b.onclick=()=>setView(b.dataset.view));
  const updAll=()=>{if(!all)return;all.parentElement.hidden=!fC;if(fC){all.href=PG('takvim.html')+'?ulke='+encodeURIComponent(fC);all.firstChild.textContent=EN?'All dates for '+fC+' ':fC+' için tüm tarihler '}};
  let EV=[],M={},month=new Date(today.getFullYear(),today.getMonth(),1),selDay=null,fP=new Set(),fC='',minM=new Date(month),maxM=new Date(month);
  const filt=()=>EV.filter(e=>(!fC||e.ulke===fC)&&(!fP.size||progs(e).some(p=>fP.has(p))));
  function draw(dir){
    const list=filt();M=byDay(list);
    title.textContent=AY[month.getMonth()]+' '+month.getFullYear();
    prevB.disabled=month<=minM;nextB.disabled=month>=maxM;
    const first=(month.getDay()+6)%7,days=new Date(month.getFullYear(),month.getMonth()+1,0).getDate();let h='';
    for(let i=0;i<first;i++)h+='<span class="day out"></span>';
    for(let d=1;d<=days;d++){const key=ds(new Date(month.getFullYear(),month.getMonth(),d)),it=M[key]||[];
      const ps=[...new Set(it.flatMap(x=>progs(x.e)))].sort((a,b)=>Object.keys(PC).indexOf(a)-Object.keys(PC).indexOf(b));
      const dots=ps.slice(0,4).map(p=>`<i style="--c:${PC[p][0]}"></i>`).join('');
      const cls=['day',key<TODAY?'past':'',key===TODAY?'today':'',it.length?'has':'',key===selDay?'sel':''].join(' ');
      h+=`<button type="button" class="${cls}" data-d="${key}" ${key<TODAY?'disabled':''} aria-label="${d} ${AY[month.getMonth()]}${it.length?', '+it.length+' tarih':''}">${d}<span class="dots">${dots}</span></button>`}
    if(dir&&!RM){grid.classList.add(dir>0?'slide-l':'slide-r');setTimeout(()=>{grid.innerHTML=h;grid.classList.remove('slide-l','slide-r')},180)}else grid.innerHTML=h;
    drawPanel();drawList(list)}
  function monthItems(){const y=month.getFullYear(),m=month.getMonth();return Object.keys(M).filter(k=>{const d=pd(k);return d.getFullYear()===y&&d.getMonth()===m}).sort()}
  function drawPanel(){if(!panel)return;
    if(selDay){const it=M[selDay]||[],d=pd(selDay);
      panel.innerHTML=`<h3>${d.getDate()} ${AY[d.getMonth()]}, ${GUN[d.getDay()]}</h3>`+(it.length?it.map(x=>evHTML(x.e,selDay,x.k)).join(''):L('<p class="empty">Bu gün için tarih yok.</p>','<p class="empty">No dates on this day.</p>'));return}
    const ks=monthItems();
    if(!ks.length){panel.innerHTML=`<h3>${AY[month.getMonth()]}</h3><p class="empty">${L('Bu ay için seçiminize uygun tarih yok.','No dates match your selection this month.')}</p>`;return}
    const lim=home?5:4;let h=(EN?`<h3>In ${AY[month.getMonth()]}</h3><p class="sub">Tap a day to see its details.</p>`:`<h3>${AY[month.getMonth()]} ayında</h3><p class="sub">Bir güne dokunun, o günün ayrıntısı açılsın.</p>`),n=0;
    for(const k of ks){for(const x of M[k]){if(n>=lim)break;h+=miniHTML(x.e,k,x.k);n++}}
    panel.innerHTML='<div class="minis">'+h+'</div>'}
  function drawList(){if(!mlist)return;
    if(view==='liste'){const ks=Object.keys(M).sort();if(!ks.length){mlist.innerHTML=L('<p class="empty">Seçiminize uygun tarih yok.</p>','<p class="empty">No dates match your selection.</p>');return}
      let h='',last='';for(const k of ks){const d=pd(k),m=AY[d.getMonth()]+' '+d.getFullYear();if(m!==last){h+=(last?'</div>':'')+`<div class="month">${m}</div><div class="evlist">`;last=m}h+=M[k].map(x=>rowHTML(x.e,k,x.k)).join('')}
      mlist.innerHTML=h+'</div>';return}
    const ks=monthItems();
    mlist.innerHTML=ks.length?`<div class="month">${AY[month.getMonth()]} ${month.getFullYear()}: ${L('tüm tarihler','all dates')}</div><div class="evlist">`+ks.map(k=>M[k].map(x=>rowHTML(x.e,k,x.k)).join('')).join('')+'</div>':''}
  const go=dir=>{const n=new Date(month.getFullYear(),month.getMonth()+dir,1);if(n<minM||n>maxM)return;month=n;selDay=null;draw(dir)};
  prevB.onclick=()=>go(-1);nextB.onclick=()=>go(1);
  panel&&panel.addEventListener('click',e=>{const b=e.target.closest('[data-go]');if(!b)return;selDay=b.dataset.go;draw()});
  grid.addEventListener('click',e=>{const b=e.target.closest('.day[data-d]');if(!b||b.disabled)return;selDay=selDay===b.dataset.d?null:b.dataset.d;draw();
    if(selDay&&panel&&innerWidth<900)panel.scrollIntoView({behavior:RM?'auto':'smooth',block:'nearest'})});
  let sx=0,sy=0;const cg=root.querySelector('.calg');
  cg.addEventListener('touchstart',e=>{sx=e.touches[0].clientX;sy=e.touches[0].clientY},{passive:true});
  cg.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.3)go(dx<0?1:-1)},{passive:true});
  chips.forEach(b=>b.onclick=()=>{const p=b.dataset.p;fP.has(p)?fP.delete(p):fP.add(p);b.setAttribute('aria-pressed',fP.has(p));selDay=null;draw()});
  sel&&(sel.onchange=()=>{fC=sel.value;selDay=null;jumpFirst();updAll();draw()});
  function jumpFirst(){const l=filt();if(!l.length)return;const f=pd(l[0].baslangic<TODAY?TODAY:l[0].baslangic);const n=new Date(f.getFullYear(),f.getMonth(),1);if(n>month||fC)month=n}
  loadTakvim().then(d=>{EV=d;if(d.length){const last=d.reduce((a,e)=>(e.bitis||e.baslangic)>a?(e.bitis||e.baslangic):a,'');const l=pd(last);maxM=new Date(l.getFullYear(),l.getMonth(),1)}
    const q=new URLSearchParams(location.search);
    const u=q.get('ulke');if(u&&sel&&[...sel.options].some(o=>o.value===u)){sel.value=u;fC=u;jumpFirst();if(vbs.length){view='liste';vbs.forEach(b=>b.setAttribute('aria-pressed',b.dataset.view==='liste'));wrapEl.hidden=true}}
    if(q.get('gorunum')==='liste'&&vbs.length){view='liste';vbs.forEach(b=>b.setAttribute('aria-pressed',b.dataset.view==='liste'));wrapEl.hidden=true}
    const p=q.get('p');if(p&&PC[p]){fP.add(p);chips.forEach(c=>c.setAttribute('aria-pressed',c.dataset.p===p))}
    const id=q.get('ev');let target=null;
    if(id){const e=d.find(x=>String(x.id)===id);if(e){const day=e.baslangic<TODAY&&e.bitis?e.bitis:e.baslangic;const dd=pd(day);month=new Date(dd.getFullYear(),dd.getMonth(),1);selDay=day;target=e.id}}
    draw();
    if(target){setTimeout(()=>{root.scrollIntoView();const el=document.getElementById('ev-'+target);if(el){el.classList.add('flash')}},80)}});
});

/* ----- Kısa liste (ülke ve program sayfaları) ----- */
document.querySelectorAll('[data-evlist]').forEach(box=>{
  loadTakvim().then(d=>{const u=box.dataset.ulke,p=box.dataset.prog,n=+box.dataset.limit||6;
    const list=d.filter(e=>(!u||e.ulke===u)&&(!p||progs(e).includes(p))).slice(0,n);
    box.innerHTML=list.length?list.map(e=>{const day=e.baslangic<TODAY&&e.bitis?e.bitis:e.baslangic;return rowHTML(e,day,e.bitis?(day===e.bitis?'end':'start'):'')}).join(''):L('<p class="empty">Yakın tarihli, teyitli bir tarih henüz yok.</p>','<p class="empty">No confirmed upcoming dates yet.</p>')})});

/* ----- Yatay kaydırma okları ve noktaları ----- */
document.querySelectorAll('[data-hs]').forEach(h=>{const id=h.dataset.hs,box=$(id);if(!box)return;
  h.querySelectorAll('button').forEach(b=>b.onclick=()=>{const w=box.firstElementChild.getBoundingClientRect().width+14;box.scrollBy({left:(b.dataset.dir==='1'?1:-1)*w,behavior:RM?'auto':'smooth'})})});
document.querySelectorAll('[data-dots]').forEach(dots=>{const box=$(dots.dataset.dots);if(!box)return;const n=box.children.length;dots.innerHTML='<i></i>'.repeat(n);
  const f=()=>{const w=box.firstElementChild.getBoundingClientRect().width+14,i=Math.round(box.scrollLeft/w);[...dots.children].forEach((d,j)=>d.classList.toggle('on',j===i));dots.style.display=box.scrollWidth>box.clientWidth+4?'':'none'};
  box.addEventListener('scroll',f,{passive:true});addEventListener('resize',f);f()});

/* ----- Dünya haritası: bölgelere yumuşak yakınlaşma, dokununca ülke kartı ----- */
document.querySelectorAll('[data-wm]').forEach(async wm=>{
  const D=JSON.parse(wm.dataset.wm),RN=JSON.parse(wm.dataset.regs),holder=wm.querySelector('.wm-svg'),card=wm.querySelector('.wm-card'),hint=wm.querySelector('.wm-hint');
  let txt;try{txt=await (await fetch('harita.svg')).text();if(EN)txt=txt.replace('Elsewhere Academics ülkeleri dünya haritası','World map of Elsewhere Academics countries')}catch(e){holder.innerHTML='';return}
  holder.innerHTML=txt;const svg=holder.querySelector('svg');const V=JSON.parse(svg.dataset.views);
  let cur=V.dunya.slice(),view='dunya',anim=null,sel=null;
  const pins=[...svg.querySelectorAll('.pin')],cs=[...svg.querySelectorAll('.c')],chips=[...wm.querySelectorAll('.wm-chips a')];
  // dünya görünümünde bölge kümeleri
  const cl=svg.querySelector('.clusters'),NS='http://www.w3.org/2000/svg';
  const groups={};pins.forEach(p=>{const r=p.dataset.r;(groups[r]=groups[r]||[]).push(p)});
  const cnodes=Object.entries(groups).map(([r,ps])=>{const x=ps.reduce((a,p)=>a+ +p.getAttribute('cx'),0)/ps.length,y=ps.reduce((a,p)=>a+ +p.getAttribute('cy'),0)/ps.length;
    const g=document.createElementNS(NS,'g');g.setAttribute('class','cluster');g.dataset.r=r;g.setAttribute('role','button');g.setAttribute('tabindex','0');g.setAttribute('aria-label',RN[r]+', '+ps.length+L(' ülke',' countries'));
    const c=document.createElementNS(NS,'circle'),t=document.createElementNS(NS,'text');c.setAttribute('cx',x);c.setAttribute('cy',y);t.setAttribute('x',x);t.setAttribute('y',y);t.textContent=ps.length;g.append(c,t);cl.append(g);return g});
  const sizes=()=>{const R=svg.getBoundingClientRect();const k=Math.max(cur[2]/(R.width||1),cur[3]/(R.height||1));pins.forEach(p=>{p.setAttribute('r',(p.dataset.k===sel?8:5.5)*k);p.style.strokeWidth=2*k});
    cnodes.forEach(g=>{g.firstChild.setAttribute('r',17*k);g.firstChild.style.strokeWidth=2.5*k;g.lastChild.style.fontSize=(15*k)+'px'});
    svg.classList.toggle('world',view==='dunya')};
  const set=v=>{cur=v;svg.setAttribute('viewBox',v.map(n=>n.toFixed(2)).join(' '));sizes()};
  const go=k=>{view=k;const from=cur.slice(),to=V[k];cancelAnimationFrame(anim);const t0=performance.now(),dur=RM?0:550;
    wm.querySelectorAll('[data-mview]').forEach(b=>{b.classList.toggle('on',b.dataset.mview===k);b.setAttribute('aria-pressed',b.dataset.mview===k)});
    chips.forEach(c=>c.hidden=k!=='dunya'&&c.dataset.r!==k);
    const step=t=>{const p=dur?Math.min(1,(t-t0)/dur):1,e=p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2;set(from.map((f,i)=>f+(to[i]-f)*e));if(p<1)anim=requestAnimationFrame(step);else sizes()};anim=requestAnimationFrame(step)};
  const show=k=>{sel=k;const d=D[k];if(!d)return;
    cs.forEach(c=>c.classList.toggle('on',c.dataset.k===k));pins.forEach(p=>p.classList.toggle('on',p.dataset.k===k));sizes();
    card.querySelector('img').src='bayrak-'+d[1]+'.svg';card.querySelector('b').textContent=d[0];
    card.querySelector('.pd').innerHTML=d[2].map(p=>`<i style="--c:${PC[p][0]}" title="${p}"></i>`).join('');card.querySelector('a').href=PG('ulke-'+k+'.html');card.hidden=false;if(hint)hint.hidden=true};
  svg.addEventListener('click',e=>{const cg=e.target.closest('.cluster');if(cg){go(cg.dataset.r);return}
    const t=e.target.closest('[data-k]');if(!t)return;const k=t.dataset.k;
    if(D[k]){location.href=PG('ulke-'+k+'.html');return}
    if(view==='dunya')go(t.dataset.r);show(k)});
  svg.addEventListener('keydown',e=>{if(e.key==='Enter'){const cg=e.target.closest('.cluster');if(cg)go(cg.dataset.r)}});
  svg.addEventListener('mouseover',e=>{const t=e.target.closest('[data-k]');if(t&&matchMedia('(hover:hover)').matches)show(t.dataset.k)});
  card.querySelector('.wm-x').onclick=()=>{card.hidden=true;sel=null;cs.forEach(c=>c.classList.remove('on'));pins.forEach(p=>p.classList.remove('on'));sizes()};
  wm.querySelectorAll('[data-mview]').forEach(b=>b.onclick=()=>go(b.dataset.mview));
  chips.forEach(c=>{c.addEventListener('mouseenter',()=>{cs.forEach(x=>x.classList.toggle('on',x.dataset.k===c.dataset.k))});c.addEventListener('mouseleave',()=>{if(sel!==c.dataset.k)cs.forEach(x=>x.classList.toggle('on',x.dataset.k===sel))})});
  addEventListener('resize',sizes,{passive:true});
  set(V.dunya);
});

/* ----- Program sekmeleri (maliyet, çizelge) ----- */
document.querySelectorAll('[data-ptabs]').forEach(t=>{const sec=t.parentElement,bs=[...t.querySelectorAll('[data-ptab]')];
  bs.forEach(b=>b.onclick=()=>{bs.forEach(x=>{x.classList.toggle('on',x===b);x.setAttribute('aria-pressed',x===b)});sec.querySelectorAll('[data-ppan]').forEach(p=>p.hidden=p.dataset.ppan!==b.dataset.ptab)})});

/* ----- Bölge sekmeleri (ana sayfa) ----- */
document.querySelectorAll('[data-tabs]').forEach(t=>{const bs=[...t.querySelectorAll('[data-tab]')],sec=t.parentElement;
  bs.forEach(b=>b.onclick=()=>{bs.forEach(x=>{x.classList.toggle('on',x===b);x.setAttribute('aria-pressed',x===b)});
    sec.querySelectorAll('[data-panel]').forEach(p=>p.hidden=p.dataset.panel!==b.dataset.tab)})});

/* ----- İletişim formu (Formspree) ----- */
document.querySelectorAll('[data-cform]').forEach(f=>{
  const msg=f.querySelector('.fmsg');let native=false;
  f.addEventListener('submit',async e=>{if(native)return;e.preventDefault();
    if(f._gotcha&&f._gotcha.value)return;
    const b=f.querySelector('button[type=submit]');b.disabled=true;msg.className='fmsg';msg.textContent=L('Gönderiliyor…','Sending…');
    try{const r=await fetch(f.action,{method:'POST',body:new FormData(f),headers:{Accept:'application/json'}});
      if(r.ok){f.classList.add('sent');msg.classList.add('ok');msg.textContent=L('Mesajınız bize ulaştı. En kısa sürede size dönüyoruz.','Your message reached us. We will get back to you soon.');f.reset();return}
      throw new Error(r.status)}
    catch(err){native=true;msg.textContent='';b.disabled=false;f.submit()}})});

/* ----- Arama: Türkçe karakter katlama, eş anlamlılar, yazım hatası toleransı, gruplu sonuçlar ----- */
const FOLD={'ı':'i','İ':'i','I':'i','ş':'s','Ş':'s','ğ':'g','Ğ':'g','ç':'c','Ç':'c','ö':'o','Ö':'o','ü':'u','Ü':'u','â':'a','î':'i','û':'u'};
const fch=c=>FOLD[c]||(c.toLowerCase().normalize('NFD')[0]||c);
const fold=s=>[...String(s||'')].map(fch).join('');
const SYN=[['abd','amerika','usa','america','united states','birlesik devletler'],['birlesik krallik','ingiltere','britanya','united kingdom','england','londra','london','iskocya','scotland','uk'],
 ['almanya','germany','deutschland','berlin','munih','munich'],['hollanda','netherlands','holland','amsterdam'],['isvicre','switzerland'],['isvec','sweden'],['italya','italy','milano','milan','roma','rome'],['ispanya','spain','madrid','barselona','barcelona'],['fransa','france','paris'],['irlanda','ireland','dublin'],['kanada','canada','toronto','vancouver'],['avustralya','australia','sidney','sydney','melbourne'],['yeni zelanda','new zealand'],['japonya','japan','tokyo'],['cekya','czechia','czech','cek cumhuriyeti','prag','prague'],['macaristan','hungary','budapeste','budapest'],['polonya','poland','varsova','warsaw'],['avusturya','austria','viyana','vienna'],['belcika','belgium'],['danimarka','denmark'],['finlandiya','finland'],['estonya','estonia'],['letonya','latvia'],['litvanya','lithuania'],['malta'],['dubai','bae','birlesik arap emirlikleri','uae','emirates'],
 ['yuksek lisans','master','masters','mba','msc','elsewherenext','graduate','postgraduate','doktora','phd'],
 ['lise','high school','yatili','boarding','elsewhereprep','ortaokul','kolej'],
 ['yaz okulu','summer','dil okulu','language school','dil kursu','elsewheresummer','yaz programi'],
 ['lisans','universite','bachelor','undergraduate','elsewherecampus','university','foundation'],
 ['vize','visa','oturum izni','residence permit','study permit','pasaport','passport'],['burs','scholarship','bursu','indirimli'],
 ['ucret','harc','tuition','maliyet','fiyat','fee','fees','butce','budget','cost','masraf','para'],
 ['ielts','toefl','duolingo','pte','dil sinavi','ingilizce sinavi','english test','language test','cambridge'],['sat','act','psat'],['delf','dalf','dele','testdaf','goethe'],
 ['tip','medicine','doktor','hekim','medical','dis hekimligi','dentistry'],['bilgisayar','yazilim','computer','software','kodlama','coding','yapay zeka','veri bilimi','data science'],
 ['muhendislik','engineering','muhendis','engineer'],['isletme','business','yonetim','management','bba'],['psikoloji','psychology'],['hukuk','law','avukat'],['mimarlik','architecture','mimar'],['ekonomi','economics','iktisat'],
 ['seviye','level','seviye testi','placement','seviye tespiti'],['iletisim','contact','telefon','whatsapp','e-posta','email','mail','phone'],
 ['takvim','calendar','tarih','tarihler','deadline','son basvuru','son gun','dates','ne zaman'],['basvuru','application','apply','ucas','common app','kayit'],
 ['konaklama','yurt','accommodation','housing','homestay','aile yaninda','ev kirasi','kira'],['calisma','part time','work','calismak','part-time'],
 ['denklik','tanima','recognition','equivalence'],['sss','faq','sik sorulan'],['veli','parent','aile','anne','baba']];
const SYNI=(()=>{const m=new Map();SYN.forEach(g=>g.forEach(w=>m.set(w,g)));return m})();
const DISP={muhendislik:'mühendislik',muhendis:'mühendis',universite:'üniversite',isletme:'işletme',yazilim:'yazılım',ucret:'ücret',harc:'harç',basvuru:'başvuru',iletisim:'iletişim',calisma:'çalışma',isvicre:'İsviçre',isvec:'İsveç',cekya:'Çekya',ispanya:'İspanya',italya:'İtalya',irlanda:'İrlanda',mimarlik:'mimarlık',butce:'bütçe',yatili:'yatılı',ingiltere:'Birleşik Krallık',britanya:'Birleşik Krallık',londra:'Londra',almanya:'Almanya',hollanda:'Hollanda',fransa:'Fransa',kanada:'Kanada',avustralya:'Avustralya',japonya:'Japonya',macaristan:'Macaristan',polonya:'Polonya',avusturya:'Avusturya',belcika:'Belçika',danimarka:'Danimarka',finlandiya:'Finlandiya',estonya:'Estonya',letonya:'Letonya',litvanya:'Litvanya',malta:'Malta',dubai:'Dubai',amerika:'Amerika',psikoloji:'psikoloji',ekonomi:'ekonomi',konaklama:'konaklama',denklik:'denklik',seviye:'seviye',takvim:'takvim'};
const PHRASES=[...SYNI.keys()].filter(w=>w.includes(' ')).sort((a,b)=>b.length-a.length);
const GLBL={prog:L('Programlar','Programmes'),ulke:L('Ülkeler','Countries'),bolum:L('Bölümler','Subjects'),sss:L('Sık sorulanlar','FAQ'),blog:'Blog',sayfa:L('Sayfalar','Pages'),takvim:L('Takvim','Calendar')};
const GORD=['prog','ulke','bolum','sss','blog','sayfa','takvim'];
const gtype=u=>{u=u.replace(/^en-/,'');if(/^ulke-/.test(u))return'ulke';if(/^bolum-/.test(u)||/^kariyer/.test(u))return'bolum';if(/^yazi-|^blog/.test(u))return'blog';if(/^sss/.test(u))return'sss';if(/^(prep|summer|campus|next)\.html/.test(u))return'prog';return'sayfa'};
const pkey=a=>{const m=/Elsewhere(Prep|Summer|Campus|Next)/.exec(a.k+' '+a.t)||/^(?:en-)?(prep|summer|campus|next)\.html/.exec(a.u);return m?m[1][0].toUpperCase()+m[1].slice(1):''};
let SIDX=null,VOCAB=null;const ORIG=new Map();
const prepIdx=A=>SIDX||(SIDX=A.map(a=>({a,t:fold(a.t),k:fold(a.k),x:fold(a.x),g:gtype(a.u)})));
const reEsc=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const wre=new Map();
const has=(txt,w)=>{if(w.length>3)return txt.includes(w);let r=wre.get(w);if(!r){r=new RegExp('(^|[^a-z0-9])'+reEsc(w)+'($|[^a-z0-9])');wre.set(w,r)}return r.test(txt)};
const lev=(a,b,max)=>{if(Math.abs(a.length-b.length)>max)return max+1;let p=[...Array(b.length+1).keys()];for(let i=1;i<=a.length;i++){const c=[i];let mn=i;for(let j=1;j<=b.length;j++){c[j]=Math.min(p[j]+1,c[j-1]+1,p[j-1]+(a[i-1]===b[j-1]?0:1));mn=Math.min(mn,c[j])}if(mn>max)return max+1;p=c}return p[b.length]};
const vocab=()=>VOCAB||(VOCAB=(()=>{const m=new Map();SIDX.forEach(e=>String(e.a.t).split(/[^\p{L}\p{N}]+/u).forEach(o=>{const f=fold(o);if(f.length>=4&&!ORIG.has(f))ORIG.set(f,o.toLocaleLowerCase(LC))}));SIDX.forEach(e=>(e.t+' '+e.k+' '+e.x).split(/[^a-z0-9]+/).forEach(w=>{if(w.length>=4)m.set(w,(m.get(w)||0)+(e.t.includes(w)?5:1))}));SYNI.forEach((g,w)=>{if(!w.includes(' ')&&w.length>=4)m.set(w,(m.get(w)||0)+20)});return m})());
const fix=w=>{const max=w.length>=7?2:1;let best=null,bd=9,bf=0;vocab().forEach((f,v)=>{if(v[0]!==w[0]&&max<2)return;const d=lev(w,v,max);if(d<=max&&(d<bd||(d===bd&&f>bf))){best=v;bd=d;bf=f}});return best};
/* sorguyu terimlere ayır: her terim bir eş anlamlı kümesi */
const parse=q=>{let s=' '+fold(q).replace(/[^a-z0-9\s'-]/g,' ').replace(/'/g,' ')+' ';const terms=[];
  PHRASES.forEach(ph=>{if(s.includes(' '+ph+' ')){terms.push({w:ph,set:SYNI.get(ph)});s=s.replace(' '+ph+' ',' ')}});
  s.split(/\s+/).filter(w=>w.length>=2&&!['ve','de','da','ile','icin','in','the','and','of','for','to','a'].includes(w)).forEach(w=>{
    const st=w.replace(/(lerinde|larinda|lerde|larda|ler|lar|nde|nda|de|da|te|ta|ye|ya|yi|yu|i|u)$/,'');
    const g=SYNI.get(w)||(st.length>=3&&SYNI.get(st));terms.push({w,set:g?[...new Set([w,...g])]:[w]})});
  return terms};
const nyl=(t,w)=>w==='lisans'?t.replace(/yuksek lisans/g,' '):t;
const tscore=(e,set,ow)=>{let b=0;for(const w of set){const f=w===ow?1:.8,T_=nyl(e.t,w),K_=nyl(e.k,w),X_=nyl(e.x,w);if(has(T_,w))b=Math.max(b,((' '+T_).includes(' '+w)?10:7)*f);else if(has(K_,w))b=Math.max(b,4*f);else if(has(X_,w))b=Math.max(b,2*f)}return b};
const search=(A,q)=>{prepIdx(A);let terms=parse(q),note='';if(!terms.length)return{res:[],terms,note};
  terms.forEach(t=>{if(t.set.length===1&&t.w.length>=4&&!SIDX.some(e=>has(e.t,t.w)||has(e.k,t.w)||has(e.x,t.w))){const f=fix(t.w);if(f){note=f;t.fixed=f;t.set=[...new Set([f,...(SYNI.get(f)||[])])]}}});
  const sc=SIDX.map(e=>{let s=0,n=0;terms.forEach(t=>{const v=tscore(e,t.set,t.fixed||t.w);if(v){s+=v;n++}});const fq=fold(q).replace(/[^a-z0-9]+/g,' ').trim();if(n&&e.t.replace(/[^a-z0-9]+/g,' ').trim()===fq)s+=20;if(n&&e.g==='prog'&&s>=10)s+=3;if(n&&e.g==='ulke'&&s>=10)s+=2;return{e,s,n}}).filter(r=>r.n);
  const mx=Math.max(0,...sc.map(r=>r.n));const res=sc.filter(r=>r.n===mx).sort((a,b)=>b.s-a.s);
  return{res,terms,note,partial:mx<terms.length}};
const mark=(title,terms)=>{const f=fold(title),ch=[...title],fc=[...f];if(fc.length!==ch.length)return esc(title);const on=new Array(ch.length).fill(false);
  terms.forEach(t=>t.set.forEach(w=>{if(w.length<2)return;let i=f.indexOf(w);while(i>-1){for(let k=i;k<i+w.length;k++)on[[...f.slice(0,k)].length]=true;i=f.indexOf(w,i+w.length)}}));
  let o='',open=false;ch.forEach((c,i)=>{if(on[i]&&!open){o+='<mark>';open=true}if(!on[i]&&open){o+='</mark>';open=false}o+=esc(c)});return o+(open?'</mark>':'')};
const POP=EN?['High school in the USA','Bachelor\'s in the UK','Master\'s in Germany','Language school in Malta','IELTS','SAT dates','Medicine','Computer engineering','Scholarship','Student visa']
  :['ABD\'de lise','Birleşik Krallık lisans','Almanya yüksek lisans','Malta dil okulu','IELTS','SAT tarihleri','Tıp','Bilgisayar mühendisliği','Burs','Öğrenci vizesi'];
const WAI='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20.5l1.6-5.2A8.5 8.5 0 1 1 21 11.5z"/></svg>';
const WA=`<a class="sr-cta" href="https://wa.me/905015660808" target="_blank" rel="noopener">${WAI}<span><b>${L('Aradığınızı bulamadınız mı?','Can\'t find what you are looking for?')}</b>${L('Sorunuzu WhatsApp\'tan yazın, birlikte bakalım.','Write to us on WhatsApp and we will look into it together.')}</span></a>`;
document.querySelectorAll('[data-search]').forEach(inp=>{
  const box=inp.parentElement.querySelector('.results');let sel=-1;
  const items=()=>[...box.querySelectorAll('a')];
  const popular=()=>{box.innerHTML=`<div class="sr-h">${L('Öne çıkan aramalar','Suggested searches')}</div><div class="sr-pop">${POP.map(p=>`<button type="button" data-q="${esc(p)}">${esc(p)}</button>`).join('')}</div>`+WA;box.classList.add('show');sel=-1};
  inp.addEventListener('focus',()=>{loadArama();loadTakvim();if(inp.value.trim().length<2)popular()});
  box.addEventListener('click',e=>{const b=e.target.closest('[data-q]');if(b){inp.value=b.dataset.q;inp.focus();run()}});
  const run=async()=>{
    const q=inp.value.trim();if(q.length<2){popular();return}
    const [A,T]=await Promise.all([loadArama(),loadTakvim()]);if(inp.value.trim()!==q)return;
    const {res,terms,note,partial}=search(A,q);const groups={};
    const gtop={};res.forEach(r=>{(groups[r.e.g]=groups[r.e.g]||[]).push(r.e.a);gtop[r.e.g]=Math.max(gtop[r.e.g]||0,r.s)});
    if(terms.length){const ev=T.map(e=>({e,f:fold(e.etkinlik+' '+e.ulke+' '+(e.kurum||'')+' '+(e.programlar||[]).join(' '))})).filter(o=>terms.every(t=>t.set.some(w=>has(o.f,w)))).slice(0,4).map(o=>o.e);if(ev.length)groups.takvim=ev}
    let h='';if(note)h+=`<div class="sr-note">${L('Bunu mu demek istediniz:','Did you mean:')} <b>${esc((EN?null:DISP[note])||ORIG.get(note)||note)}</b></div>`;
    else if(partial&&res.length)h+=`<div class="sr-note">${L('Tüm kelimeleri içeren sonuç yok; en yakın sonuçlar:','No result has every word; closest matches:')}</div>`;
    let n=0;const ord=GORD.filter(g=>g!=='takvim').sort((a,b)=>(gtop[b]||0)-(gtop[a]||0)||GORD.indexOf(a)-GORD.indexOf(b)).concat('takvim');ord.forEach(g=>{const L_=groups[g];if(!L_||!L_.length)return;h+=`<div class="sr-g"><div class="sr-h">${GLBL[g]}</div>`;
      if(g==='takvim')L_.forEach(e=>{h+=`<a href="${PG('takvim.html')}?ev=${encodeURIComponent(e.id)}"><span class="sr-t">${mark(e.etkinlik,terms)}</span><small>${trd(e.baslangic)} · ${esc(e.ulke)}</small></a>`;n++});
      else L_.slice(0,g==='prog'||g==='ulke'?5:4).forEach(a=>{const p=pkey(a);h+=`<a href="${a.u}">${p?`<i class="sr-dot" style="background:${PC[p][0]}"></i>`:''}<span class="sr-t">${mark(a.t,terms)}</span><small>${esc(a.k)}</small></a>`;n++});h+='</div>'});
    if(!n)h+=`<div class="none">${L('Sonuç bulunamadı.','No results found.')}</div><div class="sr-h">${L('Bunları deneyin','Try these')}</div><div class="sr-pop">${POP.slice(0,6).map(p=>`<button type="button" data-q="${esc(p)}">${esc(p)}</button>`).join('')}</div>`;
    box.innerHTML=h+WA;box.classList.add('show');sel=-1};
  let tm;inp.addEventListener('input',()=>{clearTimeout(tm);tm=setTimeout(run,90)});
  inp.addEventListener('keydown',e=>{const it=items();if(!box.classList.contains('show')||!it.length)return;
    if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();sel=(sel+(e.key==='ArrowDown'?1:-1)+it.length)%it.length;it.forEach((a,i)=>a.classList.toggle('on',i===sel));it[sel].scrollIntoView({block:'nearest'})}
    else if(e.key==='Enter'){e.preventDefault();const a=it[sel>-1?sel:0];if(a)a.click()}
    else if(e.key==='Escape'){box.classList.remove('show')}});
});
document.addEventListener('click',e=>{if(!e.target.closest('.search'))document.querySelectorAll('.results').forEach(r=>r.classList.remove('show'))});

/* ----- Kariyer listesi süzgeci ----- */
const bf=$('bFilter');
if(bf){bf.addEventListener('input',()=>{const v=low(bf.value.trim());
  document.querySelectorAll('.blist a').forEach(a=>{a.style.display=!v||low(a.textContent).includes(v)?'':'none'});
  document.querySelectorAll('.group').forEach(g=>{g.style.display=[...g.querySelectorAll('.blist a')].some(a=>a.style.display!=='none')?'':'none'})})}

/* ----- Blog kategori süzgeci ----- */
document.querySelectorAll('[data-blogcat]').forEach(b=>b.addEventListener('click',()=>{const k=b.dataset.blogcat;
  document.querySelectorAll('[data-blogcat]').forEach(x=>{const on=x===b;x.classList.toggle('on',on);x.setAttribute('aria-pressed',on)});
  document.querySelectorAll('.blogcards [data-kat]').forEach(c=>c.hidden=!!k&&c.dataset.kat!==k)}));
/* ----- SSS: aynı anda tek cevap açık ----- */
document.querySelectorAll('.faq').forEach(f=>f.addEventListener('toggle',e=>{const d=e.target;if(d.tagName!=='DETAILS'||!d.open||d.parentElement!==f)return;
  f.querySelectorAll(':scope>details[open]').forEach(x=>{if(x!==d)x.open=false})},true));

/* ----- Okul logoları: kendiliğinden kayar, sürüklenir, oklarla ileri geri ----- */
document.querySelectorAll('.schools').forEach(s=>{const vp=s.querySelector('.schools-vp'),inn=s.querySelector('.schools-in');if(!vp||!inn)return;
  s.classList.add('js');const speed=RM?0:38;let hold=0,drag=null,last=performance.now(),acc=0,hover=false;
  const half=()=>inn.scrollWidth/2;
  const wrap=()=>{const h=half();if(!h)return;let d=0;if(vp.scrollLeft>=h)d=-h;else if(vp.scrollLeft<=0)d=h;if(d){vp.scrollLeft+=d;if(drag)drag.l+=d}};
  const tick=t=>{const dt=Math.min(64,t-last);last=t;
    if(speed&&!hover&&!drag&&t>hold&&!document.hidden){acc+=speed*dt/1000;const st=Math.floor(acc);if(st){vp.scrollLeft+=st;acc-=st;wrap()}}
    requestAnimationFrame(tick)};
  vp.scrollLeft=1;requestAnimationFrame(tick);
  s.addEventListener('mouseenter',()=>hover=true);s.addEventListener('mouseleave',()=>hover=false);
  vp.addEventListener('touchstart',()=>{hold=performance.now()+1e9},{passive:true});
  vp.addEventListener('touchend',()=>{hold=performance.now()+2500},{passive:true});
  vp.addEventListener('scroll',()=>{if(hold>performance.now()&&!s.dataset.nav)wrap()},{passive:true});
  vp.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.button)return;drag={x:e.clientX,l:vp.scrollLeft};vp.setPointerCapture(e.pointerId);vp.classList.add('drag')});
  vp.addEventListener('pointermove',e=>{if(!drag)return;vp.scrollLeft=drag.l-(e.clientX-drag.x);wrap()});
  const end=()=>{if(!drag)return;drag=null;vp.classList.remove('drag');hold=performance.now()+1500};
  vp.addEventListener('pointerup',end);vp.addEventListener('pointercancel',end);
  s.querySelectorAll('.sc-nav').forEach(b=>b.onclick=()=>{const dir=b.classList.contains('prev')?-1:1,amt=Math.max(200,vp.clientWidth*.6),h=half();
    if(dir<0&&vp.scrollLeft<amt+2)vp.scrollLeft+=h;if(dir>0&&vp.scrollLeft+amt>=h-2)vp.scrollLeft-=h;
    hold=performance.now()+3000;s.dataset.nav=1;vp.scrollBy({left:dir*amt,behavior:RM?'auto':'smooth'});setTimeout(()=>{delete s.dataset.nav},700)});
});
/* ----- Canlılık: sayan rakamlar, okuma çubuğu ----- */
const cnt=[...document.querySelectorAll('[data-count]')];
if(cnt.length&&!RM&&'IntersectionObserver' in window){const io=new IntersectionObserver(es=>es.forEach(en=>{if(!en.isIntersecting)return;io.unobserve(en.target);const el=en.target,n=+el.dataset.count,t0=performance.now(),dur=1300;
  const st=t=>{const p=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-p,3);el.textContent=Math.round(n*e).toLocaleString(LC);if(p<1)requestAnimationFrame(st)};el.textContent='0';requestAnimationFrame(st)}),{threshold:.6});cnt.forEach(c=>io.observe(c))}
const rp=document.querySelector('.rprog i');
if(rp){const ph=document.querySelector('.phero[style*="--c:var(--ea-"]');if(ph){const m=/--c:(var\(--ea-[a-z]+\))/.exec(ph.getAttribute('style'));if(m)rp.style.background=m[1]}
  const f=()=>{const h=document.documentElement.scrollHeight-innerHeight;rp.style.transform=`scaleX(${h>0?Math.min(1,scrollY/h):0})`};addEventListener('scroll',f,{passive:true});addEventListener('resize',f);f()}
/* ----- Telefonda uzun listeler katlanır ----- */
const MQF=matchMedia('(max-width:760px)');
document.querySelectorAll('[data-fold]').forEach(box=>{const n=+box.dataset.fold,kids=[...box.children];if(kids.length<=n+2)return;
  const b=document.createElement('button');b.type='button';b.className='foldbtn';let open=false;
  const set=()=>{kids.forEach((k,i)=>k.classList.toggle('fhid',!open&&i>=n&&MQF.matches));b.hidden=!MQF.matches;
    b.innerHTML=(open?L('Daha az göster','Show less'):L('Tümünü göster','Show all')+` <span>${kids.length}</span>`)+(ICO.chev||'');b.setAttribute('aria-expanded',open);b.classList.toggle('open',open)};
  b.onclick=()=>{open=!open;set();if(!open)box.scrollIntoView({block:'start',behavior:RM?'auto':'smooth'})};box.after(b);set();MQF.addEventListener('change',set)});
/* ----- SSS: bağlantıyla gelinen soruyu aç; takvim sayacı ----- */
const openHash=()=>{const h=location.hash.slice(1);if(!h)return;const d=document.getElementById(h);if(d&&d.tagName==='DETAILS'){d.open=true;setTimeout(()=>d.scrollIntoView({block:'start'}),60)}};
openHash();addEventListener('hashchange',openHash);
const upc=document.querySelector('[data-upcount]');if(upc)loadTakvim().then(d=>{if(d.length)upc.textContent=d.length.toLocaleString(LC)});
})();
