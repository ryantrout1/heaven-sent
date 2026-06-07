'use client';
import { useEffect } from 'react';

export default function Reveal() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const touch = window.matchMedia('(hover: none)').matches;

    const revealEls = Array.from(document.querySelectorAll('.reveal-up'));
    const galleryEls = touch && !reduce ? Array.from(document.querySelectorAll('.g-item')) : [];
    const all = [...revealEls, ...galleryEls];
    if (!all.length) return;

    if (!('IntersectionObserver' in window)) {
      revealEls.forEach((el) => el.classList.add('is-visible'));
      galleryEls.forEach((el) => el.classList.add('g-lit'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          const t = en.target;
          if (t.classList.contains('reveal-up')) t.classList.add('is-visible');
          if (t.classList.contains('g-item')) t.classList.add('g-lit');
          io.unobserve(t);
        });
      },
      { threshold: 0.18, rootMargin: '0px 0px -8% 0px' }
    );

    all.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
