(()=>{
 const hero=document.querySelector('.hero'),cue=document.querySelector('.hero-scroll-cue'),portal=document.querySelector('.antique-portal'),journey=document.querySelector('.salon-journey'),crest=document.querySelector('.portal-crest');
 if(!hero||!cue||!portal||!journey||!crest)return;
 const ns='http://www.w3.org/2000/svg',reduce=matchMedia('(prefers-reduced-motion:reduce)');
 const svg=document.createElementNS(ns,'svg');svg.setAttribute('class','portal-light-flow');svg.setAttribute('aria-hidden','true');svg.setAttribute('focusable','false');journey.prepend(svg);
 const make=(tag,cls)=>{const e=document.createElementNS(ns,tag);e.setAttribute('class',cls);svg.append(e);return e;};
 const trail=make('path','falling-trail'),fall=make('path','falling-light');[trail,fall].forEach(e=>e.setAttribute('pathLength','1000'));
 const halo=make('ellipse','crown-halo'),crown=make('g','crown-illumination');
 crest.querySelectorAll('path').forEach(p=>crown.append(p.cloneNode(true)));
 const arches=[];for(const side of ['left','right']){const aura=make('path','arch-aura'),line=make('path','arch-light');[aura,line].forEach(e=>e.setAttribute('pathLength','1000'));arches.push({side,aura,line});}
 // Stable copies share a single 5.6s flow, with a new pulse every 5.6/3 seconds.
 const originals=[trail,fall,halo,crown,...arches.flatMap(a=>[a.aura,a.line])],echoPairs=[];
 for(let i=1;i<3;i++){const group=document.createElementNS(ns,'g');group.setAttribute('class','light-flow-echo');group.style.setProperty('--light-phase',(-i*5.6/3)+'s');for(const original of originals){const copy=original.cloneNode(true);group.append(copy);echoPairs.push([original,copy]);}svg.append(group);}
 let scheduled=false;
 function layout(){scheduled=false;const j=journey.getBoundingClientRect(),q=cue.getBoundingClientRect(),c=crest.getBoundingClientRect(),p=portal.getBoundingClientRect();const top=q.top-j.top,h=Math.max(1,p.bottom-q.top),w=j.width;
 svg.style.top=top+'px';svg.style.width=w+'px';svg.style.height=h+'px';svg.setAttribute('viewBox',`0 0 ${w} ${h}`);
 const x=q.left+q.width/2-j.left,cy=c.top-q.top,cx=c.left+c.width/2-j.left;
 const d=`M${x} 0 L${cx} ${Math.max(1,cy+2)}`;[trail,fall].forEach(e=>e.setAttribute('d',d));
 crown.setAttribute('transform',`translate(${c.left-j.left} ${cy}) scale(${c.width/84} ${c.height/48})`);
 halo.setAttribute('cx',cx);halo.setAttribute('cy',cy+c.height*.6);halo.setAttribute('rx',c.width*.62);halo.setAttribute('ry',c.height*.6);
 const sy=p.height/260;
 for(const a of arches){const side=document.querySelector('.portal-architecture-'+a.side).getBoundingClientRect(),sx=side.width/600;const px=n=>a.side==='left'?side.left-j.left+n*sx:side.right-j.left-n*sx;const py=n=>p.top-q.top+n*sy;
 const d=`M${px(600)} ${py(12)} C${px(280)} ${py(12)} ${px(12)} ${py(66)} ${px(12)} ${py(132)} L${px(12)} ${py(258)}`;[a.aura,a.line].forEach(e=>e.setAttribute('d',d));
 }
 for(const [original,copy] of echoPairs){for(const name of original.getAttributeNames())copy.setAttribute(name,original.getAttribute(name));}
 sync();}
 function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(layout);}}
 function sync(){const ready=hero.classList.contains('intro-visible');journey.classList.toggle('light-intro-ready',ready);const h=hero.getBoundingClientRect(),p=portal.getBoundingClientRect(),visible=(h.bottom>0&&h.top<innerHeight)||(p.bottom>0&&p.top<innerHeight);journey.classList.toggle('light-flow-running',ready&&visible&&!document.hidden&&!reduce.matches);}
 hero.addEventListener('transitionend',e=>{if(e.target.classList.contains('hero-inner'))schedule();});
 new MutationObserver(sync).observe(hero,{attributes:true,attributeFilter:['class']});
 const ro=new ResizeObserver(schedule);[hero,cue,portal,crest,journey].forEach(e=>ro.observe(e));
 addEventListener('resize',schedule);addEventListener('scroll',sync,{passive:true});document.addEventListener('visibilitychange',sync);reduce.addEventListener('change',sync);document.fonts?.ready.then(schedule);layout();
})();
