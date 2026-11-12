(()=>{
const rail=document.getElementById('review-rail');if(!rail)return;
const cards=[...rail.children],prev=document.getElementById('review-prev'),next=document.getElementById('review-next'),status=document.getElementById('review-position'),reduce=matchMedia('(prefers-reduced-motion:reduce)');let frame=0,index=-1;
const offsets=()=>cards.map(c=>c.offsetLeft-cards[0].offsetLeft);
function update(){frame=0;const positions=offsets(),max=rail.scrollWidth-rail.clientWidth;let active=positions.reduce((best,x,i)=>Math.abs(x-rail.scrollLeft)<Math.abs(positions[best]-rail.scrollLeft)?i:best,0);
 if(active!==index){index=active;status.textContent=active<5?String(active+1).padStart(2,'0')+' / 05':'MORE';}
 prev.disabled=rail.scrollLeft<3;next.disabled=rail.scrollLeft>=max-3;
 const rr=rail.getBoundingClientRect(),visible=cards.filter(c=>{const r=c.getBoundingClientRect();return Math.min(r.right,rr.right)-Math.max(r.left,rr.left)>r.width*.5;});const height=Math.max(...(visible.length?visible:[cards[active]]).map(c=>c.getBoundingClientRect().height));rail.style.height=Math.ceil(height+22)+'px';
}
function queue(){if(!frame)frame=requestAnimationFrame(update);}
function go(step){const max=rail.scrollWidth-rail.clientWidth,positions=[...new Set(offsets().map(x=>Math.round(Math.min(x,max))))],current=positions.reduce((best,x,i)=>Math.abs(x-rail.scrollLeft)<Math.abs(positions[best]-rail.scrollLeft)?i:best,0),target=Math.max(0,Math.min(positions.length-1,current+step));rail.scrollTo({left:positions[target],behavior:reduce.matches?'instant':'smooth'});}
prev.addEventListener('click',()=>go(-1));next.addEventListener('click',()=>go(1));rail.addEventListener('scroll',queue,{passive:true});rail.addEventListener('keydown',e=>{if(e.target!==rail)return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();go(e.key==='ArrowRight'?1:-1);}if(e.key==='Home'||e.key==='End'){e.preventDefault();rail.scrollTo({left:e.key==='Home'?0:rail.scrollWidth,behavior:reduce.matches?'instant':'smooth'});}});addEventListener('resize',queue);if('ResizeObserver'in window){const ro=new ResizeObserver(queue);cards.forEach(c=>ro.observe(c));}if(document.fonts)document.fonts.ready.then(queue);update();
})();
