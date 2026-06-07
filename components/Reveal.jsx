'use client';
import { useEffect } from 'react';

export default function Reveal() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const touch = window.matchMedia('(hover: none)').matches;

    // Flip the brand card on tap for touch devices (desktop uses :hover).
    let detachCard = () => {};
    const card = document.querySelector('.about-card');
    if (card && touch) {
      const onClick = (e) => {
        if (e.target.closest('.ac-book')) return; // let the booking link work
        card.classList.toggle('flipped');
      };
      const onKey = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.classList.toggle('flipped');
        }
      };
      card.addEventListener('click', onClick);
      card.addEventListener('keydown', onKey);
      detachCard = () => {
        card.removeEventListener('click', onClick);
        card.removeEventListener('keydown', onKey);
      };
    }

    const revealEls = Array.from(document.querySelectorAll('.reveal-up'));
    const galleryEls = touch && !reduce ? Array.from(document.querySelectorAll('.g-item')) : [];
    const all = [...revealEls, ...galleryEls];

    let io;
    if (all.length) {
      if (!('IntersectionObserver' in window)) {
        revealEls.forEach((el) => el.classList.add('is-visible'));
        galleryEls.forEach((el) => el.classList.add('g-lit'));
      } else {
        io = new IntersectionObserver(
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
      }
    }

    return () => {
      detachCard();
      if (io) io.disconnect();
    };
  }, []);

  return null;
}
