/* Забавия: анимации и поведение страниц. Без JS весь контент остаётся видимым. */
(function(){
 const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
 const calm=matchMedia('(prefers-reduced-motion:reduce)').matches;
 const G=window.gsap;

 /* QR на коробке ведёт на katalog.html#коллекция: доводим до неё и после загрузки картинок */
 const toHash=()=>{if(!location.hash)return;const el=document.getElementById(location.hash.slice(1));if(el)el.scrollIntoView({behavior:'auto'})};
 addEventListener('load',()=>setTimeout(toHash,60));

 /* меню */
 const bg=$('#burger'),menu=$('#menu'),top=$('#top');
 bg&&bg.addEventListener('click',()=>{const on=menu.classList.toggle('on');bg.setAttribute('aria-expanded',on);document.body.style.overflow=on?'hidden':'';top.style.color=on?'#f7f0e3':''});
 const onScroll=()=>top.classList.toggle('solid',scrollY>(document.body.classList.contains('is-home')?innerHeight*.8:40));
 addEventListener('scroll',onScroll,{passive:true});onScroll();

 /* главный слайдер */
 const hero=$('#hero');
 if(hero){
  const sl=$$('.slide',hero),dots=$$('.dots button',hero);let cur=0,t,busy=false;
  const setFg=i=>{const r=document.documentElement.style;r.setProperty('--hfg',sl[i].dataset.fg);r.setProperty('--hbg',sl[i].dataset.bg)};
  setFg(0);
  /* сцена слайда грузится только перед показом */
  const hydrate=i=>{const s=sl[i],im=$('img[data-src]',s);if(!im)return;const so=$('source[data-srcset]',s);if(so){so.srcset=so.dataset.srcset;so.removeAttribute('data-srcset')}im.src=im.dataset.src;im.removeAttribute('data-src')};
  addEventListener('load',()=>hydrate(1));
  function go(n){
   if(n===cur||busy)return;busy=true;clearTimeout(t);hydrate(n);hydrate((n+1)%sl.length);
   const a=sl[cur],b=sl[n];cur=n;dots.forEach((d,i)=>d.classList.toggle('on',i===n));setFg(n);
   const done=()=>{a.classList.remove('on');b.classList.remove('next');b.classList.add('on');b.style.clipPath='';busy=false;t=setTimeout(()=>go((cur+1)%sl.length),6500)};
   b.classList.add('next');
   if(calm||!G){done();return}
   const x=innerWidth>innerHeight&&innerWidth>760?'68% 55%':'50% 66%';
   G.fromTo(b,{clipPath:`circle(0% at ${x})`},{clipPath:`circle(130% at ${x})`,duration:1.15,ease:'power3.inOut',onComplete:done});
   G.fromTo($('picture img',b),{scale:1.14},{scale:1,duration:1.7,ease:'power3.out'});
   G.fromTo($('.ttl span',b),{yPercent:110},{yPercent:0,duration:.95,delay:.34,ease:'power4.out'});
   G.fromTo($$('.kick,.lead,.pill',b),{y:22,opacity:0},{y:0,opacity:1,duration:.7,delay:.52,stagger:.07,ease:'power2.out'});
  }
  dots.forEach((d,i)=>d.addEventListener('click',()=>go(i)));
  let sx=null;hero.addEventListener('touchstart',e=>{sx=e.touches[0].clientX},{passive:true});
  hero.addEventListener('touchend',e=>{if(sx==null)return;const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>50)go((cur+(dx<0?1:sl.length-1))%sl.length);sx=null},{passive:true});
  addEventListener('keydown',e=>{if(e.key==='ArrowRight')go((cur+1)%sl.length);if(e.key==='ArrowLeft')go((cur+sl.length-1)%sl.length)});
  if(!calm)t=setTimeout(()=>go(1),6500);
  /* кнопка на телефоне: у слайда нет места внизу, поэтому общая кнопка над точками */
  if(G&&!calm&&innerWidth>760)hero.addEventListener('mousemove',e=>{const dx=(e.clientX/innerWidth-.5),dy=(e.clientY/innerHeight-.5);G.to('.slide.on picture img',{x:dx*-16,y:dy*-10,scale:1.03,duration:1.2,ease:'power2.out',overwrite:'auto'})});
 }

 /* диалог героя */
 const dlg=$('#dlg');
 if(dlg){
  $$('.card').forEach(c=>c.addEventListener('click',()=>{const d=c.dataset,s=c.closest('.coll');
   dlg.style.cssText=s.getAttribute('style');$('#dimg').src=`assets/img/toys/${d.img}.webp`;$('#dimg').alt=d.n;$('#dk').textContent=`${d.c}, ${d.k}`;$('#dn').textContent=d.n;$('#dt').textContent=d.t;$('#dp').textContent=`${d.p} шт. в упаковке`;$('#da').href=`kontakty.html?c=${d.id}`;dlg.showModal()}));
  $('#dlgx').addEventListener('click',()=>dlg.close());
  dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close()});
 }

 /* форма */
 const f=$('#form');
 if(f){
  const c=new URLSearchParams(location.search).get('c');
  if(c){const box=$(`input[value="${CSS.escape(c)}"]`,f);if(box)box.checked=true}
  f.addEventListener('submit',e=>{e.preventDefault();$('#fok').hidden=false;$('#fok').scrollIntoView({block:'nearest'})});
 }

 if(!G||calm)return;
 G.registerPlugin(ScrollTrigger);

 /* плавная прокрутка только на компьютере */
 if(window.Lenis&&innerWidth>1000){const l=new Lenis({lerp:.11});l.on('scroll',ScrollTrigger.update);G.ticker.add(t=>l.raf(t*1000));G.ticker.lagSmoothing(0);
  $$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const el=$(a.getAttribute('href'));if(el){e.preventDefault();l.scrollTo(el,{offset:-110})}}))}

 /* вход первого экрана */
 const first=$('.slide.on');
 if(first){G.from($('.ttl span',first),{yPercent:110,duration:1.05,delay:.15,ease:'power4.out'});G.from($$('.kick,.lead,.pill',first),{y:20,opacity:0,duration:.8,delay:.45,stagger:.08,ease:'power2.out'});G.from($('picture img',first),{scale:1.1,duration:1.8,ease:'power3.out'})}
 const sub=$('.sub h1,.cont h1');
 if(sub)G.from(sub,{y:46,opacity:0,duration:1,ease:'power3.out'});

 /* появление */
 $$('.rv').forEach(el=>G.from(el,{y:38,opacity:0,duration:.85,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 90%',once:true}}));

 /* манифест проявляется по словам */
 const w=$('#words');
 if(w){w.innerHTML=w.textContent.split(/\s+/).map(x=>`<span>${x}</span>`).join(' ');
  G.fromTo($$('span',w),{opacity:.17},{opacity:1,stagger:.05,ease:'none',scrollTrigger:{trigger:w,start:'top 80%',end:'bottom 52%',scrub:.5}})}

 /* счётчики */
 $$('.nums [data-n]').forEach(b=>{const n=+b.dataset.n,o={v:0};G.to(o,{v:n,duration:1.4,ease:'power2.out',onUpdate:()=>b.textContent=Math.round(o.v),scrollTrigger:{trigger:b,start:'top 92%',once:true}})});

 /* горизонтальная лента */
 ScrollTrigger.matchMedia({'(min-width:761px) and (min-aspect-ratio:1/1)':()=>{const tr=$('#track');if(!tr)return;
  const dist=()=>tr.scrollWidth-innerWidth;
  G.to(tr,{x:()=>-dist(),ease:'none',scrollTrigger:{trigger:'#band',pin:true,scrub:.6,end:()=>'+='+dist(),invalidateOnRefresh:true}})}});

 /* параллакс подложек */
 $$('.sub-pic img,.pic img').forEach(i=>G.fromTo(i,{scale:1.1},{scale:1,ease:'none',scrollTrigger:{trigger:i.parentElement,start:'top bottom',end:'bottom top',scrub:true}}));
 addEventListener('load',()=>ScrollTrigger.refresh());
})();

/* preload-lazy: после загрузки страницы догружаем все картинки заранее, чтобы фигурки не появлялись постепенно */
window.addEventListener('load',()=>setTimeout(()=>document.querySelectorAll('img[loading=lazy]').forEach(i=>{i.loading='eager'}),400));
