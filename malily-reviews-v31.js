(()=>{
const rail=document.getElementById('review-rail');if(!rail)return;
const cards=[...rail.children],reviews=cards.filter(c=>c.classList.contains('review-card'));
const prev=document.getElementById('review-prev'),next=document.getElementById('review-next'),status=document.getElementById('review-position'),reduce=matchMedia('(prefers-reduced-motion:reduce)');
let frame=0,sizeFrame=0,index=-1,lastWidth=-1;
for(const card of reviews){const copy=card.querySelector('.review-copy'),hint=document.createElement('p');hint.className='review-scroll-hint';hint.textContent='上下にスクロールして続きを読む ↓';hint.setAttribute('aria-hidden','true');copy.after(hint);}
const offsets=()=>cards.map(c=>c.offsetLeft-cards[0].offsetLeft);
function update(){frame=0;const positions=offsets(),max=rail.scrollWidth-rail.clientWidth;const active=positions.reduce((best,x,i)=>Math.abs(x-rail.scrollLeft)<Math.abs(positions[best]-rail.scrollLeft)?i:best,0);if(active!==index){index=active;status.textContent=active<5?String(active+1).padStart(2,'0')+' / 05':'MORE';}prev.disabled=rail.scrollLeft<3;next.disabled=rail.scrollLeft>=max-3;}
function queue(){if(!frame)frame=requestAnimationFrame(update);}
function layout(){sizeFrame=0;let natural=0,footer=0;
 for(const card of reviews){const clone=card.cloneNode(true);clone.classList.add('review-measure');clone.setAttribute('aria-hidden','true');clone.inert=true;clone.style.width=card.getBoundingClientRect().width+'px';clone.querySelector('.review-scroll-hint').remove();document.getElementById('voice').append(clone);natural=Math.max(natural,clone.getBoundingClientRect().height);footer=Math.max(footer,clone.querySelector('.review-menu').getBoundingClientRect().height);clone.remove();}
 const target=Math.ceil(natural*2/3);rail.style.setProperty('--review-card-height',target+'px');rail.style.setProperty('--review-menu-height',Math.ceil(footer)+'px');rail.dataset.naturalMax=String(natural);rail.dataset.cardHeight=String(target);
 for(const card of reviews){const copy=card.querySelector('.review-copy'),scrollable=copy.scrollHeight>copy.clientHeight+1;card.dataset.scrollable=String(scrollable);if(scrollable){copy.tabIndex=0;copy.setAttribute('role','region');copy.setAttribute('aria-label',card.querySelector('.review-person h3').textContent.trim()+'の口コミ本文。上下にスクロールして全文を読めます');}else{copy.removeAttribute('tabindex');copy.removeAttribute('role');copy.removeAttribute('aria-label');}}
 update();}
function queueLayout(){if(!sizeFrame)sizeFrame=requestAnimationFrame(layout);}
function go(step){const max=rail.scrollWidth-rail.clientWidth,positions=[...new Set(offsets().map(x=>Math.round(Math.min(x,max))))],current=positions.reduce((best,x,i)=>Math.abs(x-rail.scrollLeft)<Math.abs(positions[best]-rail.scrollLeft)?i:best,0),target=Math.max(0,Math.min(positions.length-1,current+step));rail.scrollTo({left:positions[target],behavior:reduce.matches?'instant':'smooth'});}
prev.addEventListener('click',()=>go(-1));next.addEventListener('click',()=>go(1));rail.addEventListener('scroll',queue,{passive:true});rail.addEventListener('keydown',e=>{if(e.target!==rail)return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();go(e.key==='ArrowRight'?1:-1);}if(e.key==='Home'||e.key==='End'){e.preventDefault();rail.scrollTo({left:e.key==='Home'?0:rail.scrollWidth,behavior:reduce.matches?'instant':'smooth'});}});
new ResizeObserver(entries=>{const width=entries[0].contentRect.width;if(width!==lastWidth){lastWidth=width;queueLayout();}}).observe(rail);
if(document.fonts)document.fonts.ready.then(queueLayout);layout();
})();
