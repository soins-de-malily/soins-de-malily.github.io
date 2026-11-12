document.querySelectorAll('.gloss-gallery').forEach(root => {
  const viewport = root.querySelector('.gloss-window');
  const track = root.querySelector('.gloss-track');
  const original = root.querySelector('[data-gloss-original]');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let cycle = 0, base = 0, copies = 0, ready = false, visible = false;
  let last = 0, remainder = 0, resizeFrame = 0;
  const mod = (n, d) => (n % d + d) % d;
  const write = value => { viewport.scrollLeft = value; };
  function normalize() {
    if (!cycle) return;
    const position = viewport.scrollLeft - base;
    if (position < 0 || position >= cycle) {
      write(base + mod(position, cycle));
      root.dataset.wraps = String(Number(root.dataset.wraps || 0) + 1);
    }
  }
  function layout() {
    const phase = cycle ? mod(viewport.scrollLeft - base, cycle) / cycle : .12;
    cycle = original.getBoundingClientRect().width;
    if (!cycle) return;
    const count = Math.max(1, Math.ceil(viewport.clientWidth / cycle) + 1);
    if (count !== copies) {
      track.querySelectorAll('[data-gloss-clone]').forEach(node => node.remove());
      function clone() {
        const node = original.cloneNode(true);
        node.removeAttribute('data-gloss-original');
        node.dataset.glossClone = '';
        node.setAttribute('aria-hidden', 'true');
        node.inert = true;
        node.querySelectorAll('img').forEach(img => { img.alt = ''; img.draggable = false; });
        return node;
      }
      for (let i = 0; i < count; i++) { track.prepend(clone()); track.append(clone()); }
      copies = count;
    }
    base = copies * cycle;
    write(base + phase * cycle);
    remainder = 0;
    root.dataset.cycle = String(cycle);
  }
  function syncMotion() { root.dataset.reducedMotion = String(reduced.matches); }
  reduced.addEventListener('change', syncMotion);
  viewport.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      viewport.scrollBy({left:(event.key === 'ArrowRight' ? 1 : -1) * (original.firstElementChild.getBoundingClientRect().width + (parseFloat(getComputedStyle(original).columnGap)||0)), behavior:'instant'});
    }
  });
  new IntersectionObserver(entries => { visible = entries.some(entry => entry.isIntersecting); }).observe(viewport);
  new ResizeObserver(() => { cancelAnimationFrame(resizeFrame); resizeFrame = requestAnimationFrame(() => { if (ready) layout(); }); }).observe(viewport);
  Promise.all([...original.querySelectorAll('img')].map(img => img.decode().catch(() => {}))).then(() => {
    layout(); ready = true; root.dataset.ready = 'true';
    root.dataset.imageErrors = String([...original.querySelectorAll('img')].filter(img => !img.naturalWidth).length);
  });
  function tick(now) {
    const delta = last ? Math.min(now - last, 64) : 0; last = now;
    const running = ready && visible && !document.hidden && !reduced.matches;
    root.dataset.state = running ? 'running' : ready ? 'paused' : 'loading';
    if (running) {
      // Continuous 22px/s flow: pointer, touch, focus and page scrolling never pause it.
      const target = viewport.scrollLeft - 22 * delta / 1000 + remainder;
      write(target); remainder = target - viewport.scrollLeft;
    }
    if (ready) normalize();
    requestAnimationFrame(tick);
  }
  syncMotion(); requestAnimationFrame(tick);
});
