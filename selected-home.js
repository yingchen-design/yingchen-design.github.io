(() => {
  'use strict';
  const mobileLayout=matchMedia('(max-width:760px)');
  mobileLayout.addEventListener('change',()=>location.reload());
  if(mobileLayout.matches){document.documentElement.classList.remove('gallery-boot');return;}

  const stage = document.querySelector('.gallery-stage');
  const cards = [...stage.querySelectorAll('.gallery-slide')];
  const title = document.querySelector('#project-title a');
  const discipline = document.querySelector('#project-discipline');
  const note = document.querySelector('#project-note');
  const position = document.querySelector('#project-position');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const count = cards.length;
  const mod = (n, size) => ((n % size) + size) % size;
  let current = 0, target = 0, active = -1, frame = 0, lastTime = 0, drag = null;
  let width = 0, stride = 0, clickBlockedUntil = 0, settleTimer = 0, language = 'en';
  const autoButton=document.querySelector('#toggle-autoplay'),autoLabel=document.querySelector('.autoplay-label'),autoBar=document.querySelector('.autoplay-progress i');
  let autoPaused=reduced.matches,autoHover=false;
  const autoCanMove=()=>!autoPaused&&!autoHover&&!reduced.matches&&!document.hidden&&!drag&&!document.documentElement.classList.contains('gallery-boot');
  function stopAutoplay(){autoPaused=true;}
  autoButton.addEventListener('click',()=>{autoPaused=!autoPaused;requestFrame();});
  stage.addEventListener('pointerenter',()=>{autoHover=true;});
  stage.addEventListener('pointerleave',()=>{autoHover=false;requestFrame();});
  stage.addEventListener('pointerdown',stopAutoplay);
  document.querySelector('.gallery').addEventListener('focusin',event=>{if(event.target!==autoButton)stopAutoplay();});
  const autoTimer=setInterval(()=>{
    const stopped=autoPaused||autoHover||reduced.matches||document.hidden||!!drag||document.documentElement.classList.contains('gallery-boot');
    autoBar.style.transform=`scaleX(${mod(current,count)/count})`;
    const ja=language==='ja';
    const label=reduced.matches?(ja?'手動切替':'Manual'):stopped?(ja?'一時停止':'Paused'):(ja?'自動再生':'Auto');if(autoLabel.textContent!==label)autoLabel.textContent=label;
    autoButton.disabled=reduced.matches;position.setAttribute('aria-live',stopped?'polite':'off');autoButton.textContent=autoPaused?'▶':'Ⅱ';autoButton.setAttribute('aria-label',autoPaused?(ja?'自動再生を開始':'Start automatic slideshow'):(ja?'自動再生を一時停止':'Pause automatic slideshow'));
    if(!stopped)requestFrame();
  },100);
  const copy = {
    en: {subtitle:'Visual & product designer',index:'Work',about:'About',view:'View project',drag:'',close:'Close',selected:'Work index',visual:'Visual gallery ↗',intro:'I connect visual expression and product experience.',detail:'Based in Tokyo, my experience at Amazon, RightCapital, and IBM spans Japanese campaigns, B2B products, design systems, and creative collaboration.',approach:'I bring a visual designer’s eye to complex products, and a product designer’s thinking to visual work.',contact:'Say hello ↗',location:'Tokyo, Japan'},
    ja: {subtitle:'ビジュアル・プロダクトデザイナー',index:'作品一覧',about:'プロフィール',view:'プロジェクトを見る',drag:'',close:'閉じる',selected:'作品一覧',visual:'ビジュアル作品 ↗',intro:'ビジュアル表現とプロダクト体験をつなぎます。',detail:'東京を拠点に活動しています。Amazon、RightCapital、IBMで、日本向けキャンペーン、B2Bプロダクト、デザインシステム、クリエイティブの協業に取り組んできました。',approach:'複雑なプロダクトにはビジュアルデザイナーの視点を。ビジュアルの仕事にはプロダクトデザイナーの思考を。',contact:'お問い合わせ ↗',location:'東京、日本'}
  };
  function setLanguage(value) {
    language = copy[value] ? value : 'en';
    document.documentElement.lang = language;
    document.querySelectorAll('[data-copy]').forEach(el => { el.textContent = copy[language][el.dataset.copy]; });
    document.querySelectorAll('[data-lang]').forEach(el => el.setAttribute('aria-pressed',String(el.dataset.lang === language)));
    position.textContent = language === 'ja' ? `${mod(Math.round(current),count)+1} / ${count}` : `${mod(Math.round(current),count)+1} of ${count}`;
    try { localStorage.setItem('portfolio-language',language); } catch (_) {}
  }
  // Start in the language already chosen by the visitor; the project names remain their original names.
  language=new URLSearchParams(location.search).get('lang')==='ja'?'ja':'en';
  setLanguage(language);
  document.querySelectorAll('[data-lang]').forEach(button => button.addEventListener('click',() => setLanguage(button.dataset.lang)));
  function syncVideo() {
    stage.querySelectorAll('video').forEach(video=>{
      const card=video.closest('.gallery-slide');
      const shouldPlay=card.classList.contains('is-active')&&!reduced.matches&&!document.hidden&&!document.querySelector('dialog[open]');
      if(shouldPlay){video.play().then(()=>{if(!video.paused){card.classList.add('is-playing');requestFrame()}}).catch(()=>{});}
      else{video.pause();card.classList.remove('is-playing');}
    });
  }
  function updateActive(index) {
    if (active === index) return;
    active = index;
    cards.forEach((card,i) => {
      card.classList.toggle('is-active',i === index);
      card.tabIndex = i === index ? 0 : -1;
      if (i === index) card.setAttribute('aria-current','true'); else card.removeAttribute('aria-current');
    });
    const card = cards[index];
    title.textContent = card.dataset.title;
    title.href = card.href;
    document.querySelector('#view-project').href=card.href;
    discipline.textContent = card.dataset.discipline;
    note.textContent = card.dataset.note;
    position.textContent = language === 'ja' ? `${index+1} / ${count}` : `${index+1} of ${count}`;
    syncVideo();
  }
  let surface = null;
  function paint() {
    const phone = innerWidth < 601;
    cards.forEach((card,i) => {
      const delta = mod(i - current + count/2,count) - count/2;
      const abs = Math.abs(delta);
      card.classList.toggle('is-near',abs < 2.3);
      card.setAttribute('aria-hidden',String(abs >= 2.3));
      const x = delta * stride;
      const angle = 0;
      const scale = 1 - Math.min(abs,1) * .10;
      const y = 0;
      card.style.transform = `translate(-50%,-50%) translate3d(${x}px,${y}px,0px) rotateY(${angle}deg) scale(${scale})`;
      card.style.zIndex = String(10 - Math.round(abs*2));
    });
    updateActive(mod(Math.round(current),count));
    if(surface) surface.draw(current,width,stride);
  }
  function render(time) {
    frame = 0;
    const dt = lastTime ? Math.min(time-lastTime,50) : 16;
    lastTime = time;
    if(autoCanMove()){current+=dt/1000*.16;target=current;}
    else if (reduced.matches || drag) current = target;
    else current += (target-current) * (1-Math.exp(-dt/105));
    if (Math.abs(target-current) < .0005) current = target;
    paint();
    const videoPlaying = surface && surface.ready && [...stage.querySelectorAll("video")].some(video=>!video.paused) && !reduced.matches && !document.querySelector("dialog[open]");
    if (autoCanMove() || Math.abs(target-current) > .0005 || videoPlaying || (surface && surface.animating)) requestFrame(); else lastTime = 0;
  }
  function requestFrame() { if (!frame && !document.hidden) frame = requestAnimationFrame(render); }
  function measure() {
    // offsetWidth is unaffected by the card's perspective transform.
    width = cards[0].offsetWidth;
    stride = width + Math.max(innerWidth*.052,24);
    if(surface) surface.resize();
    paint();
  }
  cards.forEach(card=>card.addEventListener('pointermove',event=>{if(drag)return;const r=card.getBoundingClientRect();card._galleryPointer={x:Math.max(-1,Math.min(1,(event.clientX-r.left)/r.width*2-1)),y:Math.max(-1,Math.min(1,1-(event.clientY-r.top)/r.height*2))};requestFrame();}));
  cards.forEach(card=>['pointerenter','pointerleave','focusin','focusout'].forEach(type=>card.addEventListener(type,requestFrame)));
  function step(direction) { stopAutoplay(); target = Math.round(target) + direction; requestFrame(); }
  document.querySelector('#previous-project').addEventListener('click',() => step(-1));
  document.querySelector('#next-project').addEventListener('click',() => step(1));
  stage.addEventListener('keydown',event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); step(event.key === 'ArrowRight' ? 1 : -1); }
    if (event.key === 'Home' || event.key === 'End') { stopAutoplay(); event.preventDefault(); target = Math.round(target/count)*count + (event.key === 'Home' ? 0 : count-1);requestFrame(); }
  });
  stage.addEventListener('pointerdown',event => {
    if (!event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)) return;
    clearTimeout(settleTimer);
    drag = {id:event.pointerId,x:event.clientX,y:event.clientY,start:current,lastX:event.clientX,lastTime:performance.now(),velocity:0,moved:false};
    target = current;
  });
  stage.addEventListener('pointermove',event => {
    if (!drag || drag.id !== event.pointerId) return;
    const dx = event.clientX-drag.x,dy = event.clientY-drag.y;
    if (!drag.moved) {
      if (Math.max(Math.abs(dx),Math.abs(dy)) < 6) return;
      drag.axis=Math.abs(dy)>Math.abs(dx)?'y':'x';
      drag.lastX=drag.axis==='y'?drag.y:drag.x;
      drag.moved = true; stage.setPointerCapture(event.pointerId); stage.classList.add('is-dragging');
    }
    const now = performance.now();
    const coordinate=drag.axis==='y'?event.clientY:event.clientX;
    drag.velocity = (coordinate-drag.lastX)/Math.max(now-drag.lastTime,1);
    drag.lastX=coordinate;drag.lastTime=now;
    target=drag.start-(drag.axis==='y'?dy:dx)/stride;
    requestFrame();
  });
  function endDrag(event) {
    if (!drag || event.pointerId !== drag.id) return;
    const moved=drag.moved;
    if (moved) {
      const velocity = performance.now()-drag.lastTime < 100 ? drag.velocity : 0;
      target=Math.round(target - Math.max(-.65,Math.min(.65,velocity*.15)));
      clickBlockedUntil=performance.now()+350;
    } else target=Math.round(target);
    drag=null;stage.classList.remove('is-dragging');requestFrame();
    if (stage.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId);
  }
  stage.addEventListener('pointerup',endDrag);
  stage.addEventListener('pointercancel',event => { if (drag && drag.id===event.pointerId) { target=Math.round(target);drag=null;stage.classList.remove('is-dragging');requestFrame(); } });
  addEventListener('pointerup',endDrag);
  stage.addEventListener('click',event => {
    const card=event.target.closest('.gallery-slide');
    if (performance.now()<clickBlockedUntil) {event.preventDefault();event.stopPropagation();return;}
    if (card && !card.classList.contains('is-active')) {
      event.preventDefault(); const index=cards.indexOf(card);
      target=current+(mod(index-current+count/2,count)-count/2);target=Math.round(target);requestFrame();
    }
  },true);
  // Both wheel axes navigate the full-screen gallery, including over its caption.
  let wheelTotal=0, wheelDirection=0, wheelLast=0, wheelStepped=false;
  document.querySelector('.gallery').addEventListener('wheel',event => {
    if(event.ctrlKey || document.querySelector('dialog[open]')) return;
    const raw=Math.abs(event.deltaX)>Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    if(!raw) return;
    event.preventDefault();
    const unit=event.deltaMode===1 ? 16 : event.deltaMode===2 ? innerHeight : 1;
    const delta=raw*unit, direction=Math.sign(delta), now=performance.now();
    // One step per gesture; a reversal responds immediately, without a timed lock.
    if(now-wheelLast>180 || direction!==wheelDirection){wheelTotal=0;wheelStepped=false;}
    wheelLast=now;wheelDirection=direction;wheelTotal+=Math.abs(delta);
    if(!wheelStepped && wheelTotal>=18){wheelStepped=true;step(direction);}
  },{passive:false});
  document.querySelectorAll('[data-open]').forEach(button => {
    const dialog=document.getElementById(button.dataset.open);
    button.addEventListener('click',() => {dialog.showModal();document.body.classList.add('dialog-open');button.setAttribute('aria-expanded','true');syncVideo();});
    dialog.querySelector('[data-close]').addEventListener('click',() => dialog.close());
    dialog.addEventListener('close',() => {document.body.classList.remove('dialog-open');button.setAttribute('aria-expanded','false');button.focus({preventScroll:true});syncVideo();});
  });
  addEventListener('resize',measure);
  document.addEventListener('visibilitychange',() => {syncVideo();if (!document.hidden) requestFrame();});
  reduced.addEventListener('change',() => {target=Math.round(target);requestFrame();syncVideo();});
  document.body.classList.add('gallery-ready');
  const requestedView = new URLSearchParams(location.search).get('view');
  if (requestedView === 'about') { location.replace('about.html?role='+(new URLSearchParams(location.search).get('role')==='uiux'?'uiux':'design-lead')); return; }
  if (requestedView === 'index') {const url=new URL(location.href);url.searchParams.delete('view');url.hash='work';history.replaceState(null,'',url.pathname+url.search+url.hash);}
  measure();
  if(window.CurvedGallery) surface = new window.CurvedGallery(stage,cards,requestFrame);
  if(!surface?.gl) document.documentElement.classList.remove('gallery-boot');
})();
