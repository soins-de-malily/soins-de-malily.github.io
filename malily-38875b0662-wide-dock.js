/* Keep the engraved curves at their original physical size as the plaque widens. */
(()=>{
 const dock=document.querySelector('#fixedCta');
 const frame=dock?.querySelector('.dock-frame');
 if(!frame)return;
 const outline=frame.querySelector('.dock-outline'),inlay=frame.querySelector('.dock-inlay');
 const original={box:frame.getAttribute('viewBox'),outline:outline.getAttribute('d'),inlay:inlay.getAttribute('d')};
 const wide=matchMedia('(min-width:760px)');
 function fit(){
  if(!wide.matches){frame.setAttribute('viewBox',original.box);outline.setAttribute('d',original.outline);inlay.setAttribute('d',original.inlay);return;}
  const w=dock.clientWidth,h=dock.clientHeight,c=w/2;
  frame.setAttribute('viewBox',`0 0 ${w} ${h}`);
  outline.setAttribute('d',`M23 3H${c-33}Q${c-21} 3 ${c-15} 1H${c+15}Q${c+21} 3 ${c+33} 3H${w-23}C${w-23} 14 ${w-14} 18 ${w-3} 18V${h-18}C${w-14} ${h-18} ${w-23} ${h-13} ${w-23} ${h-3}H23C23 ${h-13} 14 ${h-18} 3 ${h-18}V18C14 18 23 14 23 3Z`);
  inlay.setAttribute('d',`M27 7H${c-35}M${c+35} 7H${w-27}Q${w-24} 19 ${w-8} 22V${h-22}Q${w-24} ${h-19} ${w-27} ${h-7}H27Q24 ${h-19} 8 ${h-22}V22Q24 19 27 7M${c-35} ${h-7}H${c+35}`);
 }
 new ResizeObserver(fit).observe(dock);wide.addEventListener('change',fit);fit();
})();
