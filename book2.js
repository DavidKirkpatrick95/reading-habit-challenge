// Book 2 prototype: "What we do on the calls". One exercise per page: a visual, what you do, and why it works.
const PAGES = [
  { t:'The more you time your reading, the better you get.', anim:'measure',
    p:'Every week you time your reading and write the number down. What gets measured gets better.',
    s:'Students who time and track their own reading improve more. A review of studies found it works across school grades.', c:'Guzman, Goldberg & Swanson, 2018' },
  { t:'Read groups of words', anim:'groups',
    p:'Slow reading stops on every word. We train your eyes to take three or four words in one look.',
    s:'Fast readers take in more letters with each look than slow readers do.', c:'Rayner, Slattery & Bélanger, 2010' },
  { t:'Use the games in the app.', anim:'fade',
    p:'This one is Escape from Alexandria, in the Read Maxxing app. The words burn away behind you as you read, so your eyes keep moving forward.',
    s:'Adults trained on text that disappears as they read got faster and understood more. The same training without the time pressure did nothing.', c:'Breznitz and colleagues, Nature Communications, 2013' },
  { t:'Stop sounding words out loud.', anim:'noread',
    p:'You will practice the \u201cNo Reading Reading\u201d exercise. For two minutes you pass your eyes over a page without sounding anything out. Then you read again and let the words go straight in.',
    s:'You cannot look at a word and not read it. Psychologists have measured this since 1935.', c:'Stroop, 1935' },
  { t:'2-1-2-1', anim:'2121',
    p:'Read for two minutes and mark the spot. Read the same passage in one minute. Do it again. Six minutes a day.',
    s:'Across studies, re-reading the same passage against the clock improved both fluency and comprehension.', c:'Therrien, 2004' },
  { t:'The memory palace', anim:'palace',
    p:'The technique from Moonwalking with Einstein. You place each idea from your book in a room you know, then walk through it.',
    s:'People with ordinary memories more than doubled the words they could recall after six weeks of this training.', c:'Dresler and colleagues, Neuron, 2017' },
  { t:'Active recall', anim:'recall',
    p:'On the call you close the book and tell the group what it taught you, in 60 seconds. Saying it from memory is the exercise.',
    s:'Testing yourself beats re-reading for what you still remember a week later.', c:'Roediger & Karpicke, 2006' },
  { t:'Spaced repetition', anim:'curve',
    p:'Twice a week you get on a call and talk about your books. Every conversation is a review, spaced out for you.',
    s:'Without review, most of what you read fades within days. Each review brings it back and slows the fade.', c:'Ebbinghaus, 1885' },
];

(function(){
  const book=document.getElementById('book2'),scene=document.getElementById('scene2');if(!book)return;book.innerHTML='';scene.querySelectorAll('.spark').forEach(e=>e.remove());
  const where=document.getElementById('bwhere2'),bp=document.getElementById('bprev2'),bn=document.getElementById('bnext2');
  const NP=PAGES.length,N=NP/2,M=N+1,mq=matchMedia('(max-width:700px)'); // N spreads of two exercises, then the reader's spread
  let p=0,stops=[];
  const h=(t,c,html)=>{const e=document.createElement(t);if(c)e.className=c;if(html!=null)e.innerHTML=html;return e};

  const ANIM={
    measure:'<div class="anim a-3d" data-3d="reader"><div class="clock" data-clock>0:00</div></div>',
    groups:'<div class="anim a-groups"><div class="lbl"><span>One word at a time</span><b data-c1>0 stops</b></div><div class="ln" data-l1></div><hr><div class="lbl"><span>Groups of words</span><b data-c2>0 stops</b></div><div class="ln g" data-l2></div></div>',
    fade:'<div class="anim a-fade vid"><video muted loop playsinline preload="metadata" poster="img/fading-text-poster.jpg" src="clips/fading-text.mp4"></video></div>',
    noread:'<div class="anim a-noread"><div><div class="mode" data-mode></div><div class="line" data-line></div><div class="bub" data-bub></div></div><div><div class="stop">STOP</div><div class="cap">You never said “stop” in your head.</div></div></div>',
    '2121':'<div class="anim a-2121"><div class="r"><span>2 min</span><div class="t"><i></i></div></div><div class="r fast"><span>1 min</span><div class="t"><i></i></div></div><div class="r"><span>2 min</span><div class="t"><i></i></div></div><div class="r fast"><span>1 min</span><div class="t"><i></i></div></div><div class="cap">Same passage each time, in half the time.</div></div>',
    palace:'<div class="anim a-plan"><div class="plan"><div class="rm r1"><small>Hall</small></div><div class="rm r2"><small>Kitchen</small></div><div class="rm r3"><small>Living room</small></div><div class="rm r4"><small>Bedroom</small></div><div class="flag f1"><b>Idea 1</b></div><div class="flag f2"><b>Idea 2</b></div><div class="flag f3"><b>Idea 3</b></div><div class="flag f4"><b>Idea 4</b></div><div class="walker"><i></i></div></div></div>',
    recall:'<div class="anim a-3d" data-3d="talk"></div>',
    curve:'<div class="anim a-curve"><svg viewBox="0 0 100 60" preserveAspectRatio="none"><path class="ax" d="M4 2V56H98"/><path class="forget" d="M4 6 C12 34 30 48 98 53"/><path class="call" d="M28 4V56M52 4V56M76 4V56"/><path class="keep" d="M4 6 C10 22 18 30 28 34 L28 8 C36 18 44 24 52 27 L52 8 C60 15 68 19 76 21 L76 8 C84 12 92 14 98 15"/><text x="23" y="59.5">call</text><text x="47" y="59.5">call</text><text x="71" y="59.5">call</text></svg><div class="lab"><i>dashed: no review</i><i>green: with the calls</i></div></div>',
    list:'<div class="anim a-list"><div class="sp">A friend said it’s good</div><div class="sp">It’s a bestseller</div><div class="sp win">Solves the problem I have this week</div><div class="cap">20 minutes choosing saves 4 to 8 hours</div></div>',
    call:'<div class="anim a-call"><div class="clock" data-clock></div><ul><li>First 20: your wins and improvements</li><li>Next 20: live training on speed, memory, comprehension</li><li>Last 20: open Q&amp;A</li></ul></div>'
  };

  // animations that need a timer: each returns a function that stops it
  const START={
    measure(el){const c=el.querySelector('[data-clock]');let sec=0;c.textContent='0:00';const iv=setInterval(()=>{sec=(sec+1)%600;c.textContent=Math.floor(sec/60)+':'+String(sec%60).padStart(2,'0')},110);const stop3=scene3(el.querySelector('[data-3d]'),'reader');return()=>{clearInterval(iv);stop3()}},
    recall(el){return scene3(el.querySelector('[data-3d]'),'talk')},
    groups(el){const words='The right book list is half of a reading habit that lasts.'.split(' ');const l1=el.querySelector('[data-l1]'),l2=el.querySelector('[data-l2]'),c1=el.querySelector('[data-c1]'),c2=el.querySelector('[data-c2]');
      const mk=l=>{l.innerHTML=words.map(w=>'<span>'+w+'</span>').join(' ');return[...l.children]};const a=mk(l1),b=mk(l2);let i=0,t;
      function step(){ // one tick = one look, for both readers at once
        const n=words.length,g=Math.ceil(n/3);
        a.forEach((s,k)=>s.className=k===i&&i<n?'on':k<i?'done':'');
        b.forEach((s,k)=>s.className=i<g&&k>=i*3&&k<i*3+3?'on':k<Math.min(i,g)*3?'done':'');
        c1.textContent=i<n?(i+1)+' stops':'done in '+n+' stops';c2.textContent=i<g?(i+1)+' stops':'done in '+g+' stops';
        i++;if(i>n+3){i=0;t=setTimeout(step,900)}else t=setTimeout(step,480)
      }
      t=setTimeout(step,800);return()=>clearTimeout(t)},
    fade(el){const v=el.querySelector('video');let t=setTimeout(()=>{try{v.currentTime=0;const pr=v.play();if(pr&&pr.catch)pr.catch(()=>{})}catch(e){}},500);return()=>{clearTimeout(t);v.pause()}},
    noread(el){const words='Reading got easy, so I kept doing it.'.split(' ');const line=el.querySelector('[data-line]'),bub=el.querySelector('[data-bub]'),mode=el.querySelector('[data-mode]');
      line.innerHTML=words.map(w=>'<span>'+w+'</span>').join(' ');const sp=[...line.children];let i=0,phase=0,t;
      function step(){
        if(i===0){sp.forEach(s=>s.className='');mode.textContent=phase===0?'Sounding out each word':'Letting the words go straight in';bub.style.opacity=phase===0?1:0}
        if(i<sp.length){sp.forEach((s,j)=>s.className=j<i?'done':j===i?'on':'');bub.textContent=phase===0?'“'+words[i]+'”':'';i++;t=setTimeout(step,phase===0?620:150)}
        else{sp.forEach(s=>s.className='done');bub.textContent='';i=0;phase=1-phase;t=setTimeout(step,1300)}
      }
      t=setTimeout(step,900);return()=>clearTimeout(t)},
    call(el){const c=el.querySelector('[data-clock]'),li=[...el.querySelectorAll('li')];let a=0,raf,t0=null;li.forEach(x=>x.classList.remove('on'));
      function fr(t){if(t0===null)t0=t+900;a=Math.max(0,Math.min(360,(t-t0)/4200*360));c.style.setProperty('--a',Math.min(a,120)+'deg');c.style.setProperty('--b',Math.min(a,240)+'deg');c.style.setProperty('--c',a+'deg');
        li[0].classList.toggle('on',a>0);li[1].classList.toggle('on',a>120);li[2].classList.toggle('on',a>240);if(a<360)raf=requestAnimationFrame(fr)}
      raf=requestAnimationFrame(fr);return()=>cancelAnimationFrame(raf)}
  };

  // ---- small 3D scenes: a reader with a wall clock, and two people talking ----
  function need3(){if(window.THREE||document.getElementById('three-js'))return;const s=document.createElement('script');s.id='three-js';s.src='https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';document.head.appendChild(s)}
  function scene3(el,kind){
    if(!el)return()=>{};
    if(!window.THREE){let dead=false,inner=null,n=0;need3();const iv=setInterval(()=>{if(dead||++n>60){clearInterval(iv);return}if(window.THREE){clearInterval(iv);inner=scene3(el,kind)}},150);return()=>{dead=true;clearInterval(iv);if(inner)inner()}}
    const T=THREE,w=el.clientWidth,hh=el.clientHeight,R=new T.WebGLRenderer({antialias:true,alpha:true});R.setPixelRatio(Math.min(2,devicePixelRatio||1));R.setSize(w,hh);el.insertBefore(R.domElement,el.firstChild);
    const sc=new T.Scene(),cam=new T.PerspectiveCamera(34,w/hh,.1,60);
    sc.add(new T.HemisphereLight(0xffffff,0x6b5236,.62));const dl=new T.DirectionalLight(0xfff1d6,.6);dl.position.set(3,5,4);sc.add(dl);
    const M=c=>new T.MeshStandardMaterial({color:c,roughness:.78}),mesh=(g,c)=>new T.Mesh(g,M(c));
    function person(shirt,pants){
      const g=new T.Group(),skin=0xD9A074;
      const torso=mesh(new T.CylinderGeometry(.27,.3,.75,20),shirt);torso.position.y=1.05;g.add(torso);
      const head=new T.Group();head.position.y=1.7;g.add(head);
      head.add(mesh(new T.SphereGeometry(.2,24,18),skin));
      const hair=mesh(new T.SphereGeometry(.212,24,18,0,6.3,0,1.75),0x2A1C12);hair.rotation.x=-.25;head.add(hair);
      const nose=mesh(new T.SphereGeometry(.035,10,8),skin);nose.position.set(0,-.01,.2);head.add(nose);
      const mouth=mesh(new T.SphereGeometry(.045,10,8),0x5A2A22);mouth.position.set(0,-.09,.175);mouth.scale.set(1,.35,.4);head.add(mouth);
      const eyeL=mesh(new T.SphereGeometry(.022,8,6),0x1c1a16),eyeR=eyeL.clone();eyeL.position.set(-.07,.03,.185);eyeR.position.set(.07,.03,.185);head.add(eyeL,eyeR);
      const arm=s=>{const p=new T.Group();p.position.set(s*.34,1.38,0);const a=mesh(new T.CylinderGeometry(.075,.065,.62,12),shirt);a.position.y=-.31;const hd=mesh(new T.SphereGeometry(.08,12,10),skin);hd.position.y=-.64;p.add(a,hd);g.add(p);return p};
      const leg=s=>{const p=new T.Group();p.position.set(s*.14,.68,0);const th=mesh(new T.CylinderGeometry(.1,.09,.5,12),pants);th.position.y=-.25;const k=new T.Group();k.position.y=-.5;const sh=mesh(new T.CylinderGeometry(.085,.075,.5,12),pants);sh.position.y=-.25;const ft=mesh(new T.BoxGeometry(.13,.07,.26),0x2A1C12);ft.position.set(0,-.52,.07);k.add(sh,ft);p.add(th,k);g.add(p);return{p,k}};
      return{g,head,mouth,armL:arm(-1),armR:arm(1),legL:leg(-1),legR:leg(1)};
    }
    const floor=mesh(new T.CircleGeometry(4.2,48),kind==='reader'?0x9C7A4E:0xA98F62);floor.rotation.x=-Math.PI/2;sc.add(floor);
    let update;
    if(kind==='reader'){
      const wall=mesh(new T.PlaneGeometry(9,4.4),0xCDBB93);wall.position.set(0,2.2,-1.7);sc.add(wall);
      const clock=new T.Group();clock.position.set(-1.25,2.15,-1.66);sc.add(clock);
      const face=mesh(new T.CylinderGeometry(.44,.44,.05,40),0xFFFDF5);face.rotation.x=Math.PI/2;clock.add(face);
      const rim=mesh(new T.TorusGeometry(.44,.045,10,40),0x2A1C12);clock.add(rim);
      for(let i=0;i<12;i++){const tk=mesh(new T.BoxGeometry(.025,.07,.02),0x2A1C12);const a=i/12*6.283;tk.position.set(Math.sin(a)*.36,Math.cos(a)*.36,.04);tk.rotation.z=-a;clock.add(tk)}
      const hand=(l,wd,c)=>{const p=new T.Group();const m=mesh(new T.BoxGeometry(wd,l,.02),c);m.position.set(0,l/2,.05);p.add(m);clock.add(p);return p};
      const hMin=hand(.33,.035,0xC8401C),hHr=hand(.21,.045,0x2A1C12);
      const seat=mesh(new T.BoxGeometry(.66,.07,.62),0x7A5632);seat.position.set(0,.47,-.02);const back=mesh(new T.BoxGeometry(.66,.8,.07),0x7A5632);back.position.set(0,.88,-.31);sc.add(seat,back);
      [[-.28,-.27],[.28,-.27],[-.28,.24],[.28,.24]].forEach(([x,z])=>{const l=mesh(new T.BoxGeometry(.06,.47,.06),0x5E4226);l.position.set(x,.235,z);sc.add(l)});
      const P=person(0x2F5F9E,0x3A3A46);P.g.position.y=-.16;sc.add(P.g);
      [P.legL,P.legR].forEach(l=>{l.p.rotation.x=-Math.PI/2;l.k.rotation.x=Math.PI/2});
      P.armL.rotation.set(-1.02,0,.28);P.armR.rotation.set(-1.02,0,-.28);P.head.rotation.x=.42;
      const book=new T.Group();book.position.set(0,.9,.56);book.rotation.x=.62;sc.add(book);
      const cover=mesh(new T.BoxGeometry(.66,.025,.46),0xC8401C);cover.position.y=-.02;book.add(cover);
      const pg=s=>{const m=mesh(new T.BoxGeometry(.3,.03,.42),0xFBF6E6);m.position.set(s*.16,.005,0);m.rotation.z=-s*.1;book.add(m)};pg(-1);pg(1);
      const flip=new T.Group();flip.position.y=.03;const leaf=mesh(new T.BoxGeometry(.3,.008,.42),0xFFFFFF);leaf.position.x=.155;flip.add(leaf);book.add(flip);
      update=t=>{hMin.rotation.z=-t*1.9;hHr.rotation.z=-t*1.9/12;const c=(t%2.6)/2.6,e=c<.4?0:Math.min(1,(c-.4)/.42),k=e*e*(3-2*e);flip.rotation.z=k*Math.PI;leaf.visible=c>=.4&&c<.9;
        P.head.rotation.y=Math.sin(t*1.9)*.13;P.armR.rotation.x=-1.02-(c>.3&&c<.6?Math.sin((c-.3)/.3*Math.PI)*.12:0);
        cam.position.set(2.3+Math.sin(t*.35)*.45,1.95,3.9);cam.lookAt(-.25,1.2,0)};
    }else{
      const table=mesh(new T.CylinderGeometry(.36,.36,.045,32),0x7A5632);table.position.y=.78;const tleg=mesh(new T.CylinderGeometry(.05,.07,.78,12),0x5E4226);tleg.position.y=.39;sc.add(table,tleg);
      const cb=mesh(new T.BoxGeometry(.32,.06,.22),0xC8401C);cb.position.set(0,.835,0);cb.rotation.y=.4;const cp=mesh(new T.BoxGeometry(.3,.045,.2),0xFBF6E6);cp.position.set(.012,.835,.004);cp.rotation.y=.4;sc.add(cp,cb);cb.scale.set(1,1,1.02);
      const A=person(0x1E5A5F,0x33333D),B=person(0xC8401C,0x3A3A46);A.g.position.x=-.95;A.g.rotation.y=1.15;B.g.position.x=.95;B.g.rotation.y=-1.15;sc.add(A.g,B.g);
      const blob=x=>{const m=new T.Mesh(new T.CircleGeometry(.42,24),new T.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.16}));m.rotation.x=-Math.PI/2;m.position.set(x,.01,0);sc.add(m)};blob(-.95);blob(.95);blob(0);
      update=t=>{const who=Math.floor(t/2.4)%2;[[A,0],[B,1]].forEach(([p,i])=>{const sp=who===i,ph=t*(i?1.07:1);
          p.mouth.scale.y=sp?.35+Math.abs(Math.sin(ph*13))*1.1:.3;
          p.head.rotation.x=sp?Math.sin(ph*5)*.07:.09+Math.sin(ph*2.3)*.08;p.head.rotation.y=sp?Math.sin(ph*1.7)*.12:0;
          p.armR.rotation.x=sp?-1.15+Math.sin(ph*6)*.4:-.12;p.armR.rotation.z=sp?-.35:-.06;p.armL.rotation.x=sp?-.5+Math.sin(ph*6+1)*.22:-.12;p.armL.rotation.z=.06;
          p.g.rotation.z=sp?Math.sin(ph*3)*.02:0});
        cam.position.set(Math.sin(t*.3)*.7,1.6,4.7);cam.lookAt(0,1.12,0)};
    }
    let raf,t0=performance.now();const loop=()=>{update((performance.now()-t0)/1000);R.render(sc,cam);raf=requestAnimationFrame(loop)};loop();
    return()=>{cancelAnimationFrame(raf);R.dispose();R.forceContextLoss&&R.forceContextLoss();R.domElement.remove()};
  }

  const pageHTML=(x,i)=>'<div class="in"><div class="ex-k">Exercise '+(i+1)+'</div><div class="ex-t">'+x.t+'</div>'+ANIM[x.anim]+'<p class="ex-p">'+x.p+'</p><div class="ex-s"><b>'+(x.sk||'Why it works')+'</b>'+x.s+(x.c?'<small>'+x.c+'</small>':'')+'</div><div class="st-n"><span>'+(i+1)+' of '+NP+'</span><span>'+(i%2?'Next →':'')+'</span></div></div>';
  const YOU_L='<div class="you-frame"><b>?</b><span>What is stopping you?</span></div>';
  const YOU_R='<div class="in"><div class="st-role">Your first call</div><div class="st-name">You</div><div class="st-big">We find what is stopping you, and build your plan around it.</div><div class="st-rows"><div><b>Call one</b>60 minutes, 1-on-1. Your book list, your reading plan, your daily page goal.</div></div><a class="you-btn" href="https://readaccel-sxuoyiiq.manus.space/">Apply to join →</a><div class="st-n"><span>Starts January 2027</span><span>10 seats</span></div></div>';

  const leaves=[];
  for(let i=0;i<=M;i++){
    const leaf=h('div','leaf');
    const front=i===0?h('div','pg front cover','<div class="in"><div class="brainbox"><canvas id="brain"></canvas></div><i class="corner tl"></i><i class="corner tr"></i><i class="corner bl"></i><i class="corner br"></i><div class="cbot"><div class="ck">How reading coaching works</div><div class="ct">What we <em>do</em> on the calls.</div><div class="cs2">Eight exercises, and why each one works.</div><div class="open">Open the book →</div></div></div>')
      :i===M?h('div','pg front paper you',YOU_R):h('div','pg front paper ex',pageHTML(PAGES[2*i-1],2*i-1));
    front.dataset.pg=i===0||i===M?'':2*i-1;
    front.onclick=()=>{if(i>0&&i<M)go(1)};
    leaf.appendChild(front);
    if(i<N){const back=h('div','pg back paper ex',pageHTML(PAGES[2*i],2*i));back.dataset.pg=2*i;leaf.appendChild(back)}
    else if(i===N)leaf.appendChild(h('div','pg back dark you',YOU_L));
    book.appendChild(leaf);leaves.push(leaf);
  }
  ['board','edge er','edge et','edge ebt','ribbon','oboard','oedge ol','oedge or'].forEach(c=>book.appendChild(h('div',c)));
  [[30,22,0],[70,16,1.1],[24,62,2.3],[76,55,.6],[50,10,3.1],[64,80,1.8],[36,84,3.6],[82,34,2.7]].forEach(([x,y,d])=>{const sp=h('i','spark');sp.style.left=x+'%';sp.style.top=y+'%';sp.style.animationDelay=d+'s';scene.appendChild(sp)});

  function render(fast){
    stops.forEach(f=>f());stops=[];
    const turned=Math.ceil(p/2),m=mq.matches;
    book.classList.toggle('fast',!!fast);
    leaves.forEach((l,i)=>{const t=i<turned,was=l.classList.contains('turned');
      if(t!==was){l.style.zIndex=3000+(t?i:M-i);setTimeout(()=>{l.style.zIndex=l.classList.contains('turned')?i+1:M+1-i},fast?420:920)}
      else l.style.zIndex=t?i+1:M+1-i;
      l.classList.toggle('turned',t)});
    const closed=turned===0;book.classList.toggle('closed',closed);scene.classList.toggle('is-closed',closed);book.classList.toggle('open',!closed);
    const pan=m?(p%2?'translateX(0)':'translateX(-50%)'):'translateX(0)';
    book.style.transform=closed?(m?'translateX(-50%) rotateY(-27deg) rotateX(7deg) scale(.74)':'translateX(-25%) rotateY(-30deg) rotateX(8deg) scale(.84)'):pan+(m?' rotateX(11deg) scale(.97)':' rotateX(17deg) scale(.95)');
    const k=turned-1;
    where.textContent=p===0?NP+' exercises':k>=N?'Your first call':(m?'Exercise '+(p%2?2*k+1:2*k+2)+' of '+NP:'Exercises '+(2*k+1)+' and '+(2*k+2)+' of '+NP);
    bp.disabled=p===0;bn.disabled=p>=2*M;
    book.querySelectorAll('.live').forEach(e=>e.classList.remove('live'));
    if(k>=0&&k<N){const want=m?[p%2?2*k:2*k+1]:[2*k,2*k+1];
      setTimeout(()=>{if(Math.ceil(p/2)-1!==k)return;want.forEach(ix=>{const el=book.querySelector('.pg[data-pg="'+ix+'"]');if(!el)return;el.classList.add('live');const st=START[PAGES[ix].anim];if(st)stops.push(st(el))})},fast?450:700)}
    if(!closed)need3();
    brainOn(closed);
  }
  function set(np,fast){p=Math.max(0,Math.min(2*M,np));render(fast)}
  function go(d){if(mq.matches)set(p+d);else{const s=Math.ceil(p/2)+d;set(s<=0?0:2*s)}}
  scene.addEventListener('click',()=>{if(p===0)set(mq.matches?1:2)});
  bp.onclick=e=>{e.stopPropagation();go(-1)};bn.onclick=e=>{e.stopPropagation();go(1)};
  scene.tabIndex=0;scene.addEventListener('keydown',e=>{if(e.key==='ArrowRight')go(1);if(e.key==='ArrowLeft')go(-1)});
  let x0=null;scene.addEventListener('touchstart',e=>{x0=e.touches[0].clientX},{passive:true});
  scene.addEventListener('touchend',e=>{if(x0==null)return;const dx=e.changedTouches[0].clientX-x0;x0=null;if(Math.abs(dx)>45)go(dx<0?1:-1)},{passive:true});
  mq.addEventListener('change',()=>{if(!mq.matches&&p%2)p++;render(true)});

  // ---- the living brain on the cover ----
  const cv=document.getElementById('brain'),cx=cv.getContext('2d');let raf=null,W=0,H=0,nodes=[],edges=[],pulses=[];
  // side view, facing left; x,y in 0..1 of a 1.2 : 1 box
  const OUT=[[.13,.60],[.07,.47],[.10,.31],[.20,.17],[.35,.08],[.52,.05],[.69,.08],[.82,.17],[.91,.30],[.94,.45],[.90,.57],[.84,.65],[.82,.73],[.74,.80],[.63,.78],[.59,.73],[.57,.83],[.56,.96],[.48,.96],[.47,.83],[.45,.72],[.38,.74],[.28,.75],[.20,.70]];
  const SULCI=[[[.30,.20],[.36,.36],[.30,.52]],[[.50,.10],[.55,.30],[.48,.50],[.52,.64]],[[.70,.14],[.72,.34],[.80,.50]],[[.18,.42],[.34,.46],[.50,.42],[.66,.48],[.86,.42]],[[.62,.72],[.70,.70],[.78,.74]]];
  let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
  function path(pts,close){const P=pts.map(([x,y])=>[x*W,y*H]);cx.beginPath();
    if(close){const m=(a,b)=>[(a[0]+b[0])/2,(a[1]+b[1])/2];let s=m(P[P.length-1],P[0]);cx.moveTo(s[0],s[1]);for(let i=0;i<P.length;i++){const e=m(P[i],P[(i+1)%P.length]);cx.quadraticCurveTo(P[i][0],P[i][1],e[0],e[1])}cx.closePath()}
    else{cx.moveTo(P[0][0],P[0][1]);for(let i=1;i<P.length-1;i++){const e=[(P[i][0]+P[i+1][0])/2,(P[i][1]+P[i+1][1])/2];cx.quadraticCurveTo(P[i][0],P[i][1],e[0],e[1])}cx.lineTo(P[P.length-1][0],P[P.length-1][1])}}
  function setup(){const r=cv.getBoundingClientRect(),d=Math.min(2,devicePixelRatio||1);if(!r.width)return false;
    const bw=Math.min(r.width,r.height*1.2);cv.width=r.width*d;cv.height=r.height*d;W=bw*d;H=bw/1.2*d;cv._ox=(cv.width-W)/2;cv._oy=(cv.height-H)/2;
    seed=7;nodes=[];path(OUT,true);let guard=0;while(nodes.length<74&&guard++<4000){const x=rnd()*W,y=rnd()*H;if(cx.isPointInPath(x,y)&&nodes.every(n=>Math.hypot(n.x-x,n.y-y)>W*.055))nodes.push({x,y,ph:rnd()*6.28})}
    edges=[];nodes.forEach((a,i)=>nodes.forEach((b,j)=>{if(j>i&&Math.hypot(a.x-b.x,a.y-b.y)<W*.13)edges.push([i,j])}));pulses=[];return true}
  function draw(t){
    if(!W&&!setup()){raf=requestAnimationFrame(draw);return}
    cx.setTransform(1,0,0,1,0,0);cx.clearRect(0,0,cv.width,cv.height);
    const br=1+Math.sin(t/1400)*.018;cx.translate(cv._ox+W/2,cv._oy+H/2);cx.scale(br,br);cx.translate(-W/2,-H/2);
    path(OUT,true);const g=cx.createRadialGradient(W*.5,H*.4,W*.05,W*.5,H*.45,W*.6);g.addColorStop(0,'rgba(70,170,160,.55)');g.addColorStop(1,'rgba(10,40,44,.75)');
    cx.fillStyle=g;cx.shadowColor='rgba(255,200,100,.75)';cx.shadowBlur=W*.06;cx.fill();cx.shadowBlur=0;
    cx.lineWidth=W*.008;cx.strokeStyle='#E7BE6C';cx.stroke();
    cx.save();path(OUT,true);cx.clip();
    cx.lineWidth=W*.006;cx.strokeStyle='rgba(231,190,108,.35)';SULCI.forEach(s=>{path(s,false);cx.stroke()});
    cx.lineWidth=W*.0025;cx.strokeStyle='rgba(150,235,215,.28)';cx.beginPath();edges.forEach(([i,j])=>{cx.moveTo(nodes[i].x,nodes[i].y);cx.lineTo(nodes[j].x,nodes[j].y)});cx.stroke();
    if(pulses.length<16&&rnd()<.3){const e=edges[Math.floor(rnd()*edges.length)];pulses.push({e:rnd()<.5?e:[e[1],e[0]],u:0,v:.012+rnd()*.02})}
    pulses=pulses.filter(pl=>(pl.u+=pl.v)<1);
    pulses.forEach(pl=>{const a=nodes[pl.e[0]],b=nodes[pl.e[1]],x=a.x+(b.x-a.x)*pl.u,y=a.y+(b.y-a.y)*pl.u;const r=W*.03,gg=cx.createRadialGradient(x,y,0,x,y,r);gg.addColorStop(0,'rgba(255,235,170,1)');gg.addColorStop(1,'rgba(255,200,100,0)');cx.fillStyle=gg;cx.beginPath();cx.arc(x,y,r,0,6.3);cx.fill()});
    nodes.forEach(n=>{const a=.45+.55*Math.sin(t/500+n.ph);cx.fillStyle='rgba(190,255,235,'+(.35+.6*a)+')';cx.beginPath();cx.arc(n.x,n.y,W*.0065*(1+.5*a),0,6.3);cx.fill()});
    cx.restore();
    raf=requestAnimationFrame(draw);
  }
  function brainOn(on){if(on&&!raf&&!matchMedia('(prefers-reduced-motion:reduce)').matches)raf=requestAnimationFrame(draw);else if(on&&!raf){W=0;draw(0);cancelAnimationFrame(raf);raf=null}else if(!on&&raf){cancelAnimationFrame(raf);raf=null}}
  addEventListener('resize',()=>{W=0});
  render('init');
})();
