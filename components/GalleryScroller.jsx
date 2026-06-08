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

    const step = () => Math.max(grid.clientWidth * 0.8, 320);

    const update = () => {
      const max = grid.scrollWidth - grid.clientWidth;
      const overflow = max > 4;
      const atStart = grid.scrollLeft <= 2;
      const atEnd = grid.scrollLeft >= max - 2;
      wrap.classList.toggle('has-overflow', overflow);
      wrap.classList.toggle('can-left', overflow && !atStart);
      wrap.classList.toggle('can-right', overflow && !atEnd);
      if (prev) prev.disabled = !overflow || atStart;
      if (next) next.disabled = !overflow || atEnd;
    };

    const onPrev = () => grid.scrollBy({ left: -step(), behavior: 'smooth' });
    const onNext = () => grid.scrollBy({ left: step(), behavior: 'smooth' });

    if (prev) prev.addEventListener('click', onPrev);
    if (next) next.addEventListener('click', onNext);
    grid.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);

    update();
    // background images can change scrollWidth after they load
    const t = setTimeout(update, 350);

    return () => {
      if (prev) prev.removeEventListener('click', onPrev);
      if (next) next.removeEventListener('click', onNext);
      grid.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      clearTimeout(t);
    };
  }, []);

  return null;
}
