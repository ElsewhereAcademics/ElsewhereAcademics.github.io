/* Elsewhere Academics · ortak betik (tüm sayfalar) */
(function(){
const PC={Prep:'var(--ea-prep)',Summer:'var(--ea-summer)',Campus:'var(--ea-campus)',Next:'var(--ea-next)'};
const ORDER=['Prep','Summer','Campus','Next'];
const AY=['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
const GUN=['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'];
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const low=s=>String(s||'').toLocaleLowerCase('tr');
const pd=s=>{const [y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d)};
const today=new Date();today.setHours(0,0,0,0);
const $=id=>document.getElementById(id);

/* ----- Üst şerit ----- */
const topBar=$('top');
if(topBar){
  const hero=$('giris');
  if(hero){const f=()=>topBar.classList.toggle('on',scrollY>hero.offsetHeight-80);addEventListener('scroll',f,{passive:true});f();}
  else topBar.classList.add('on');
}

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

/* ----- Veri ----- */
let TAKVIM=null,ARAMA=null;
const loadTakvim=()=>TAKVIM||(TAKVIM=fetch('takvim.json').then(r=>r.json()).then(d=>d.filter(e=>pd(e.bitis||e.baslangic)>=today).sort((a,b)=>a.baslangic.localeCompare(b.baslangic))).catch(()=>[]));
const loadArama=()=>ARAMA||(ARAMA=fetch('arama.json').then(r=>r.json()).catch(()=>[]));

/* ----- Takvim satırı ----- */
function evRow(e){
  const d=pd(e.baslangic);
  let range='';if(e.bitis){const b=pd(e.bitis);range=` · ${b.getDate()} ${AY[b.getMonth()]}${b.getFullYear()!==d.getFullYear()?' '+b.getFullYear():''} tarihine kadar`}
  const dots=(e.programlar||[]).map(p=>`<i title="${p}" style="background:${PC[p]||'var(--ea-navy)'}"></i>`).join('');
  return `<article class="ev" id="ev-${e.id}"><div class="d">${d.getDate()}<small>${GUN[d.getDay()].toLocaleUpperCase('tr')}</small></div>
   <div><h3>${esc(e.etkinlik)}</h3><div class="meta"><span>${esc(e.ulke)}${e.kurum?' · '+esc(e.kurum):''}${range}</span><span class="pd">${dots}</span>${e.kaynak?`<a href="${esc(e.kaynak)}" target="_blank" rel="noopener">Kaynak</a>`:''}</div></div></article>`;
}
function evList(list,limit){
  let h='',last='';
  list.slice(0,limit).forEach(e=>{const d=pd(e.baslangic),m=AY[d.getMonth()]+' '+d.getFullYear();if(m!==last){h+=`<div class="month">${m}</div>`;last=m}h+=evRow(e)});
  return h;
}

/* ----- Ana sayfa takvimi (filtreli) ----- */
const cal=$('cal');
if(cal&&cal.dataset.mode==='full'){
  let EV=[],shown=30,fP=new Set(),fC='';
  const sel=$('fCountry'),more=$('calMore');
  const render=()=>{
    const list=EV.filter(e=>(!fC||e.ulke===fC)&&(!fP.size||(e.programlar||[]).some(p=>fP.has(p))));
    if(!list.length){cal.innerHTML='<p class="empty">Bu seçim için tarih bulunamadı.</p>';more.hidden=true;return}
    cal.innerHTML=evList(list,shown);more.hidden=list.length<=shown;
  };
  more.onclick=()=>{shown+=30;render()};
  document.querySelectorAll('.chip[data-p]').forEach(b=>b.onclick=()=>{const p=b.dataset.p;fP.has(p)?fP.delete(p):fP.add(p);b.setAttribute('aria-pressed',fP.has(p));shown=30;render()});
  sel.onchange=()=>{fC=sel.value;shown=30;render()};
  window.EA_openEvent=id=>{sel.value='';fC='';fP.clear();document.querySelectorAll('.chip[data-p]').forEach(c=>c.setAttribute('aria-pressed','false'));
    const i=EV.findIndex(x=>String(x.id)===String(id));shown=Math.max(30,i+5);render();const el=$('ev-'+id);if(el){el.classList.add('open');el.scrollIntoView({block:'center'})}};
  loadTakvim().then(d=>{EV=d;
    const u=new URLSearchParams(location.search).get('ulke');
    if(u&&[...sel.options].some(o=>o.value===u)){sel.value=u;fC=u}
    render();
    if(u)setTimeout(()=>$('takvim').scrollIntoView(),50);
    const strip=$('stripIn');
    if(strip&&!strip.dataset.blog){
      const items=EV.filter(e=>pd(e.baslangic)>=today).slice(0,10).map(e=>{const d=pd(e.baslangic),p=(e.programlar||[])[0];
        return `<a href="#ev-${e.id}" data-ev="${e.id}"><i style="background:${PC[p]||'var(--ea-white)'}"></i>${d.getDate()} ${AY[d.getMonth()]} · ${esc(e.etkinlik)}</a>`}).join('');
      if(items){strip.innerHTML=items+items;strip.addEventListener('click',ev=>{const a=ev.target.closest('a[data-ev]');if(!a)return;ev.preventDefault();EA_openEvent(a.dataset.ev)})}
    }
  });
}

/* ----- Ülke sayfası takvimi (sabit ülke) ----- */
if(cal&&cal.dataset.mode==='country'){
  loadTakvim().then(d=>{const list=d.filter(e=>e.ulke===cal.dataset.ulke);
    cal.innerHTML=list.length?evList(list,8):'<p class="empty">Bu ülke için teyitli tarih henüz eklenmedi.</p>';});
}

/* ----- Arama (açılış ekranı ve menü) ----- */
document.querySelectorAll('[data-search]').forEach(inp=>{
  const box=inp.parentElement.querySelector('.results');
  inp.addEventListener('focus',()=>{loadArama();loadTakvim()},{once:true});
  inp.addEventListener('input',async()=>{
    const v=low(inp.value.trim());if(v.length<2){box.classList.remove('show');return}
    const [A,T]=await Promise.all([loadArama(),loadTakvim()]);
    const out=[];
    A.filter(a=>low(a.t).includes(v)).concat(A.filter(a=>!low(a.t).includes(v)&&a.x.includes(v))).slice(0,8)
      .forEach(a=>out.push(`<a href="${a.u}">${esc(a.t)}<small>${esc(a.k)}</small></a>`));
    T.filter(e=>low(e.etkinlik+' '+e.ulke+' '+e.kurum).includes(v)).slice(0,6).forEach(e=>{const d=pd(e.baslangic);
      out.push(`<a href="index.html?ulke=${encodeURIComponent(e.ulke)}#takvim" data-ev="${e.id}">${esc(e.etkinlik)}<small>Takvim · ${d.getDate()} ${AY[d.getMonth()]} ${d.getFullYear()} · ${esc(e.ulke)}</small></a>`)});
    box.innerHTML=out.length?out.join(''):'<div class="none">Sonuç bulunamadı.</div>';box.classList.add('show');
  });
  box.addEventListener('click',e=>{const a=e.target.closest('a[data-ev]');if(a&&window.EA_openEvent){e.preventDefault();box.classList.remove('show');setMenu(false);EA_openEvent(a.dataset.ev)}});
});
document.addEventListener('click',e=>{if(!e.target.closest('.search'))document.querySelectorAll('.results').forEach(r=>r.classList.remove('show'))});

/* ----- Kariyer listesi süzgeci ----- */
const bf=$('bFilter');
if(bf){bf.addEventListener('input',()=>{const v=low(bf.value.trim());
  document.querySelectorAll('.blist a').forEach(a=>{a.style.display=!v||low(a.textContent).includes(v)?'':'none'});
  document.querySelectorAll('.group').forEach(g=>{g.style.display=[...g.querySelectorAll('.blist a')].some(a=>a.style.display!=='none')?'':'none'});
});}
})();
