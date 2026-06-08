'use client';
import { useEffect } from 'react';

export default function GalleryScroller() {
  useEffect(() => {
    const wrap = document.querySelector('.gallery-scroll-wrap');
    if (!wrap) return;
    const grid = wrap.querySelector('.gallery-grid');
    if (!grid) return;
    const prev = wrap.querySelector('.gallery-arrow.prev');
    const next = wrap.querySelector('.gallery-arrow.next');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Duplicate the tiles once so the strip can loop seamlessly.
    const originals = Array.from(grid.children);
    const origCount = originals.length;
    if (!grid.dataset.looped) {
      originals.forEach((node) => {
        const clone = node.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        grid.appendChild(clone);
      });
      grid.dataset.looped = '1';
    }

    let loopWidth = 0;
    const measure = () => {
      const firstClone = grid.children[origCount];
      loopWidth = firstClone ? firstClone.offsetLeft : grid.scrollWidth / 2;
    };
    measure();

    let pos = grid.scrollLeft;
    const SPEED = 0.45; // px/frame (~27px/s)

    let paused = false;
    let idle;
    const resumeSoon = () => {
      clearTimeout(idle);
      idle = setTimeout(() => { paused = false; }, 1800);
    };

    // keep our float position in sync whenever the browser changes scrollLeft
    const onScroll = () => {
      if (loopWidth > 0) {
        if (grid.scrollLeft >= loopWidth) grid.scrollLeft -= loopWidth;
        else if (grid.scrollLeft < 0) grid.scrollLeft += loopWidth;
      }
      pos = grid.scrollLeft;
    };
    grid.addEventListener('scroll', onScroll, { passive: true });

    // hover pauses (and the hovered tile colorizes via CSS :hover)
    wrap.addEventListener('mouseenter', () => { paused = true; });
    wrap.addEventListener('mouseleave', () => { paused = false; });

    // wheel / touch take over, then auto-resume after idle
    const userTouch = () => { paused = true; resumeSoon(); };
    grid.addEventListener('wheel', userTouch, { passive: true });
    grid.addEventListener('touchstart', () => { paused = true; }, { passive: true });
    grid.addEventListener('touchend', resumeSoon, { passive: true });

    // grab-and-drag to slide manually
    let dragging = false, startX = 0, startScroll = 0, moved = false;
    const down = (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      dragging = true; moved = false; paused = true;
      startX = e.clientX; startScroll = grid.scrollLeft;
      grid.classList.add('dragging');
      try { grid.setPointerCapture(e.pointerId); } catch (_) {}
    };
    const move = (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 3) moved = true;
      grid.scrollLeft = startScroll - dx;
    };
    const up = () => {
      if (!dragging) return;
      dragging = false;
      grid.classList.remove('dragging');
      resumeSoon();
    };
    // swallow the click that follows a real drag (so tiles don't feel "clicked")
    const onClickCapture = (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } };
    grid.addEventListener('pointerdown', down);
    grid.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    grid.addEventListener('click', onClickCapture, true);

    // arrows nudge, then auto-resume
    const step = () => Math.max(grid.clientWidth * 0.7, 280);
    const onPrev = () => { paused = true; grid.scrollBy({ left: -step(), behavior: 'smooth' }); resumeSoon(); };
    const onNext = () => { paused = true; grid.scrollBy({ left: step(), behavior: 'smooth' }); resumeSoon(); };
    if (prev) prev.addEventListener('click', onPrev);
    if (next) next.addEventListener('click', onNext);

    // the drift loop
    let raf;
    const tick = () => {
      if (!reduce.matches && !paused && !document.hidden && loopWidth > 0) {
        pos += SPEED;
        if (pos >= loopWidth) pos -= loopWidth;
        grid.scrollLeft = pos;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onResize = () => measure();
    window.addEventListener('resize', onResize);
    const t = setTimeout(measure, 450); // re-measure after images settle

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(idle); clearTimeout(t);
      grid.removeEventListener('scroll', onScroll);
      grid.removeEventListener('wheel', userTouch);
      grid.removeEventListener('pointerdown', down);
      grid.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      grid.removeEventListener('click', onClickCapture, true);
      if (prev) prev.removeEventListener('click', onPrev);
      if (next) next.removeEventListener('click', onNext);
      window.removeEventListener('resize', onResize);
      // remove clones so a re-mount (e.g. dev strict mode) re-clones cleanly
      while (grid.children.length > origCount) grid.removeChild(grid.lastChild);
      delete grid.dataset.looped;
    };
  }, []);

  return null;
}
