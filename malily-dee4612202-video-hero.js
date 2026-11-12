
(()=>{
const hero=document.querySelector('.hero'),film=document.querySelector('#london-film'),button=document.querySelector('#london-toggle'),counter=document.querySelector('#london-count');
const narrow=matchMedia('(max-width:759px)'),reduce=matchMedia('(prefers-reduced-motion:reduce)'),params=new URLSearchParams(location.search);
let userPaused=reduce.matches||params.get('still')==='1'||params.has('scene'),inView=true,variant='',seekPending=null;
const seekTimes=[1.8,6.1,10.35,14.6,18.85];
// Reveal the whole identity after 1.5 seconds of actual playback, only once.
let introDone=false,introElapsed=0,introStarted=0,introTimer=null;
function revealIdentity(){if(introDone)return;introDone=true;clearTimeout(introTimer);introTimer=null;hero.classList.add('intro-visible');hero.dataset.introShownAt=String(performance.now());hero.dataset.introPlayedMs=String(Math.round(introElapsed+(introStarted?performance.now()-introStarted:0)));}
function startIdentity(){if(introDone||introTimer||film.paused||document.hidden)return;introStarted=performance.now();if(!hero.dataset.introStartedAt)hero.dataset.introStartedAt=String(introStarted);introTimer=setTimeout(revealIdentity,Math.max(0,1500-introElapsed));}
function holdIdentity(){if(introTimer){introElapsed+=performance.now()-introStarted;clearTimeout(introTimer);introTimer=null;introStarted=0;}}
function restartIdentity(){holdIdentity();introDone=false;introElapsed=0;introStarted=0;hero.classList.remove('intro-visible');delete hero.dataset.introShownAt;delete hero.dataset.introStartedAt;delete hero.dataset.introPlayedMs;if(reduce.matches)revealIdentity();}
film.addEventListener('playing',startIdentity);film.addEventListener('pause',holdIdentity);film.addEventListener('error',revealIdentity);
document.addEventListener('visibilitychange',()=>{if(document.hidden)holdIdentity();else startIdentity();});
if(reduce.matches)revealIdentity();
// Keep a useful visible page if autoplay is blocked or the film cannot start.
setTimeout(()=>{if(!introDone&&film.currentTime===0&&film.paused)revealIdentity();},4500);

function framePhoto(){hero.style.setProperty('--london-stage-height',hero.clientHeight+'px');}
function ui(){const paused=film.paused;if(button){button.textContent=paused?'▶':'Ⅱ';button.setAttribute('aria-label',paused?'背景の動きを再生':'背景の動きを一時停止');button.setAttribute('aria-pressed',String(paused));}hero.dataset.londonPaused=String(paused);const scene=Math.min(5,Math.floor((film.currentTime+.5)/4.25)+1);hero.dataset.londonScene=String(scene);if(counter)counter.textContent=String(scene).padStart(2,'0')+' / 05';}
function sync(){if(userPaused||document.hidden||!inView){film.pause();}else{film.play().catch(()=>{film.pause();ui();});}ui();}
function source(){const next=narrow.matches?'mobile':'pc';if(next===variant)return;const fraction=film.duration?film.currentTime/film.duration:0;variant=next;hero.dataset.londonVariant=next;hero.classList.remove('film-ready');film.poster='malily-film-'+next+'-poster.jpg';film.src='malily-film-'+next+'.mp4';film.load();if(fraction)seekPending=fraction*21.25;}
film.addEventListener('loadedmetadata',()=>{if(seekPending!==null){film.currentTime=seekPending;seekPending=null;}const requested=Number(params.get('scene'));if(requested>=1&&requested<=5)film.currentTime=seekTimes[requested-1];sync();});
film.addEventListener('loadeddata',()=>{hero.classList.add('film-ready');sync();});film.addEventListener('error',()=>{hero.classList.remove('film-ready');hero.dataset.filmError='true';ui();});film.addEventListener('timeupdate',ui);film.addEventListener('play',ui);film.addEventListener('pause',ui);
button?.addEventListener('click',()=>{userPaused=!userPaused;sync();});document.addEventListener('visibilitychange',sync);narrow.addEventListener('change',source);reduce.addEventListener('change',()=>{userPaused=reduce.matches;sync();});
if('ResizeObserver'in window){const ro=new ResizeObserver(framePhoto);ro.observe(hero);ro.observe(hero.querySelector('.hero-inner'));}addEventListener('resize',framePhoto);if(document.fonts)document.fonts.ready.then(framePhoto);
if('IntersectionObserver'in window)new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;sync();},{threshold:0}).observe(hero);
addEventListener('message',event=>{if(event.origin!==location.origin||!event.data)return;if(event.data.type==='london-scene'){const n=Number(event.data.scene)-1;if(n>=0&&n<5){userPaused=true;if(film.readyState)film.currentTime=seekTimes[n];else seekPending=seekTimes[n];sync();}}if(event.data.type==='london-restart'){restartIdentity();document.getElementById('top').scrollIntoView({behavior:'instant',block:'start'});film.currentTime=0;userPaused=false;sync();startIdentity();}if(event.data.type==='london-section'){const allowed=['top','worries','cases','results-gallery','voice','first'];if(allowed.includes(event.data.section)){document.getElementById(event.data.section)?.scrollIntoView({behavior:reduce.matches?'instant':'smooth',block:'start'});}}if(event.data.type==='london-play'){userPaused=false;sync();}if(event.data.type==='london-pause'){userPaused=true;sync();}});
framePhoto();source();ui();
})();
