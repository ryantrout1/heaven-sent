'use client';
import { useEffect } from 'react';

// Message 0 must mirror what's already in the markup so there's no flash on load.
const MESSAGES = [
  {
    eyebrow: 'A Buckeye Spa Studio',
    l1: 'Soft skin.',
    l2: 'Slow rituals.',
    l3: 'Real care.',
    p: 'Customized facials, brow and lash artistry, and gentle waxing \u2014 all in a quiet studio designed to make you feel like the most cared-for person in the room.',
    cta: 'Book a Treatment',
  },
  {
    eyebrow: 'Made for your skin',
    l1: 'Your skin.',
    l2: 'Your pace.',
    l3: 'Your glow.',
    p: 'Personalized facials, brows, lashes, and waxing \u2014 unrushed, attentive, and tailored to exactly what your skin needs today.',
    cta: 'Book Your Visit',
  },
  {
    eyebrow: 'Brows \u00b7 Lashes \u00b7 Skin',
    l1: 'Brows, framed.',
    l2: 'Lashes, fuller.',
    l3: 'Skin, glowing.',
    p: 'Brow and lash artistry, custom facials, and gentle waxing \u2014 finished with a calm that stays with you long after you leave.',
    cta: 'Book a Treatment',
  },
];

const DISPLAY_MS = 6000;
const FADE_MS = 700;

export default function HeroRotator() {
  useEffect(() => {
    const inner = document.querySelector('.hero-inner');
    const col = inner && inner.firstElementChild;
    if (!col) return;
    const label = col.querySelector('.label');
    const lines = col.querySelectorAll('h1 .hsb-line');
    const para = col.querySelector('p');
    const btn = col.querySelector('.btn-c');
    if (!label || lines.length < 3 || !para) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduce.matches) return; // honor reduced motion: single static message

    col.classList.add('hero-msg-rotator');

    const apply = (m) => {
      label.textContent = m.eyebrow;
      lines[0].textContent = m.l1;
      lines[1].textContent = m.l2;
      lines[2].innerHTML = '<em>' + m.l3 + '</em>';
      para.textContent = m.p;
      if (btn) btn.textContent = m.cta;
    };

    let i = 0;
    let swapTimer;
    const cycle = () => {
      if (document.hidden) return; // don't churn while tab is backgrounded
      col.classList.add('swapping');
      swapTimer = setTimeout(() => {
        i = (i + 1) % MESSAGES.length;
        apply(MESSAGES[i]);
        col.classList.remove('swapping');
      }, FADE_MS);
    };

    const interval = setInterval(cycle, DISPLAY_MS + FADE_MS);

    return () => {
      clearInterval(interval);
      clearTimeout(swapTimer);
      col.classList.remove('hero-msg-rotator', 'swapping');
    };
  }, []);

  return null;
}
