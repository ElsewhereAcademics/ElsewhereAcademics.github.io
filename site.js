/* Elsewhere Academics · ortak betik (tüm sayfalar) */
(function(){
const PC={Prep:['var(--ea-prep)','var(--ea-on-prep)'],Summer:['var(--ea-summer)','var(--ea-on-summer)'],Campus:['var(--ea-campus)','var(--ea-on-campus)'],Next:['var(--ea-next)','var(--ea-on-next)']};
const AY=['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
const GUN=['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'];
const GK=['PZ','PT','SA','ÇA','PE','CU','CT'];
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const low=s=>String(s||'').toLocaleLowerCase('tr');
const pd=s=>{const [y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d)};
const ds=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const today=new Date();today.setHours(0,0,0,0);const TODAY=ds(today);
const $=id=>document.getElementById(id);
const IOS=/iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent)&&!/Android/.test(navigator.userAgent);
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const ICO={cal:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="4.5" width="18" height="16" rx="3"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/></svg>',
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
const loadTakvim=()=>TAKVIM||(TAKVIM=fetch('takvim.json').then(r=>r.json()).then(d=>d.filter(e=>pd(e.bitis||e.baslangic)>=today).sort((a,b)=>a.baslangic.localeCompare(b.baslangic))).catch(()=>[]));
const loadArama=()=>ARAMA||(ARAMA=fetch('arama.json').then(r=>r.json()).catch(()=>[]));
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

function rangeTxt(e){if(!e.bitis)return '';return trd(e.baslangic)+' ile '+trd(e.bitis)+' arası'}
function evHTML(e,day,kind){EVMAP[e.id]=e;
  const tags=progs(e).map(p=>`<span style="--c:${PC[p][0]};--c-on:${PC[p][1]}">${p.toLocaleUpperCase('tr')}</span>`).join('');
  const k=kind==='start'?'Başlıyor · ':kind==='end'?'Son gün · ':'';
  const meta=[esc(e.ulke),e.kurum?esc(e.kurum):'',e.bitis?rangeTxt(e):''].filter(Boolean).join(' · ');
  return `<div class="ev" id="ev-${esc(e.id)}"><div class="tag">${tags}</div><h4>${k}${esc(e.etkinlik)}</h4><div class="meta">${meta}</div>
  <div class="acts">${IOS?`<button type="button" data-ics="${esc(e.id)}" data-day="${day}">${ICO.cal}Takvime ekle</button>`:`<a href="${gcal(e,day)}" target="_blank" rel="noopener">${ICO.cal}Takvime ekle</a>`}${e.kaynak?`<a class="src" href="${esc(e.kaynak)}" target="_blank" rel="noopener">kaynak</a>`:''}</div></div>`}
function miniHTML(e,day,kind){const d=pd(day),p=progs(e)[0];
  return `<button type="button" class="mini" data-go="${day}"><span class="d">${d.getDate()}<small>${AY[d.getMonth()].slice(0,3).toLocaleUpperCase('tr')} · ${GK[d.getDay()]}</small></span><span><i style="--c:${p?PC[p][0]:'var(--ea-navy)'}"></i>${kind==='end'?'Son gün · ':''}${esc(e.etkinlik)}<small>${esc(e.ulke)}</small></span></button>`}
function rowHTML(e,day,kind){const d=pd(day);
  return `<div class="ev"><div class="d">${d.getDate()}<small>${AY[d.getMonth()].slice(0,3).toLocaleUpperCase('tr')} · ${GK[d.getDay()]}</small></div>${evHTML(e,day,kind).replace('<div class="ev"','<div').replace(/ id="ev-[^"]*"/,'')}</div>`}
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
  const updAll=()=>{if(!all)return;all.parentElement.hidden=!fC;if(fC){all.href='takvim.html?ulke='+encodeURIComponent(fC);all.firstChild.textContent=fC+' için tüm tarihler '}};
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
      panel.innerHTML=`<h3>${d.getDate()} ${AY[d.getMonth()]}, ${GUN[d.getDay()]}</h3>`+(it.length?it.map(x=>evHTML(x.e,selDay,x.k)).join(''):'<p class="empty">Bu gün için tarih yok.</p>');return}
    const ks=monthItems();
    if(!ks.length){panel.innerHTML=`<h3>${AY[month.getMonth()]}</h3><p class="empty">Bu ay için seçiminize uygun tarih yok.</p>`;return}
    const lim=home?5:4;let h=`<h3>${AY[month.getMonth()]} ayında</h3><p class="sub">Bir güne dokunun, o günün ayrıntısı açılsın.</p>`,n=0;
    for(const k of ks){for(const x of M[k]){if(n>=lim)break;h+=miniHTML(x.e,k,x.k);n++}}
    panel.innerHTML='<div class="minis">'+h+'</div>'}
  function drawList(){if(!mlist)return;
    if(view==='liste'){const ks=Object.keys(M).sort();if(!ks.length){mlist.innerHTML='<p class="empty">Seçiminize uygun tarih yok.</p>';return}
      let h='',last='';for(const k of ks){const d=pd(k),m=AY[d.getMonth()]+' '+d.getFullYear();if(m!==last){h+=(last?'</div>':'')+`<div class="month">${m}</div><div class="evlist">`;last=m}h+=M[k].map(x=>rowHTML(x.e,k,x.k)).join('')}
      mlist.innerHTML=h+'</div>';return}
    const ks=monthItems();
    mlist.innerHTML=ks.length?`<div class="month">${AY[month.getMonth()]} ${month.getFullYear()}: tüm tarihler</div><div class="evlist">`+ks.map(k=>M[k].map(x=>rowHTML(x.e,k,x.k)).join('')).join('')+'</div>':''}
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
    box.innerHTML=list.length?list.map(e=>{const day=e.baslangic<TODAY&&e.bitis?e.bitis:e.baslangic;return rowHTML(e,day,e.bitis?(day===e.bitis?'end':'start'):'')}).join(''):'<p class="empty">Yakın tarihli, teyitli bir tarih henüz yok.</p>'})});

/* ----- Yatay kaydırma okları ve noktaları ----- */
document.querySelectorAll('[data-hs]').forEach(h=>{const id=h.dataset.hs,box=$(id);if(!box)return;
  h.querySelectorAll('button').forEach(b=>b.onclick=()=>{const w=box.firstElementChild.getBoundingClientRect().width+14;box.scrollBy({left:(b.dataset.dir==='1'?1:-1)*w,behavior:RM?'auto':'smooth'})})});
document.querySelectorAll('[data-dots]').forEach(dots=>{const box=$(dots.dataset.dots);if(!box)return;const n=box.children.length;dots.innerHTML='<i></i>'.repeat(n);
  const f=()=>{const w=box.firstElementChild.getBoundingClientRect().width+14,i=Math.round(box.scrollLeft/w);[...dots.children].forEach((d,j)=>d.classList.toggle('on',j===i));dots.style.display=box.scrollWidth>box.clientWidth+4?'':'none'};
  box.addEventListener('scroll',f,{passive:true});addEventListener('resize',f);f()});

/* ----- Bölge sekmeleri (ana sayfa) ----- */
document.querySelectorAll('[data-tabs]').forEach(t=>{const bs=[...t.querySelectorAll('[data-tab]')],sec=t.parentElement;
  bs.forEach(b=>b.onclick=()=>{bs.forEach(x=>{x.classList.toggle('on',x===b);x.setAttribute('aria-pressed',x===b)});
    sec.querySelectorAll('[data-panel]').forEach(p=>p.hidden=p.dataset.panel!==b.dataset.tab)})});

/* ----- Arama ----- */
document.querySelectorAll('[data-search]').forEach(inp=>{
  const box=inp.parentElement.querySelector('.results');
  inp.addEventListener('focus',()=>{loadArama();loadTakvim()},{once:true});
  inp.addEventListener('input',async()=>{
    const v=low(inp.value.trim());if(v.length<2){box.classList.remove('show');return}
    const [A,T]=await Promise.all([loadArama(),loadTakvim()]);const out=[];
    A.filter(a=>low(a.t).includes(v)).concat(A.filter(a=>!low(a.t).includes(v)&&a.x.includes(v))).slice(0,8)
      .forEach(a=>out.push(`<a href="${a.u}">${esc(a.t)}<small>${esc(a.k)}</small></a>`));
    T.filter(e=>low(e.etkinlik+' '+e.ulke+' '+e.kurum).includes(v)).slice(0,6).forEach(e=>{
      out.push(`<a href="takvim.html?ev=${encodeURIComponent(e.id)}">${esc(e.etkinlik)}<small>Takvim · ${trd(e.baslangic)} · ${esc(e.ulke)}</small></a>`)});
    box.innerHTML=out.length?out.join(''):'<div class="none">Sonuç bulunamadı.</div>';box.classList.add('show')});
});
document.addEventListener('click',e=>{if(!e.target.closest('.search'))document.querySelectorAll('.results').forEach(r=>r.classList.remove('show'))});

/* ----- Kariyer listesi süzgeci ----- */
const bf=$('bFilter');
if(bf){bf.addEventListener('input',()=>{const v=low(bf.value.trim());
  document.querySelectorAll('.blist a').forEach(a=>{a.style.display=!v||low(a.textContent).includes(v)?'':'none'});
  document.querySelectorAll('.group').forEach(g=>{g.style.display=[...g.querySelectorAll('.blist a')].some(a=>a.style.display!=='none')?'':'none'})})}
})();
