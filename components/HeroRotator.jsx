'use client';
import { useEffect } from 'react';

// Message 0 mirrors the markup so there's no flash on load.
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

const REST_MS = 9000;     // time a message stays fully shown before the swap
const OUT_D = 640, OUT_STAG = 85;
const IN_D = 780, IN_STAG = 95;
const EASE_OUT = 'cubic-bezier(.4,0,.7,.4)';
const EASE_IN = 'cubic-bezier(.22,1,.36,1)';

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
    if (reduce.matches) return; // static single message, no rotation

    // ordered top -> bottom; headline lines travel a little farther than the rest
    const parts = [
      { el: label, y: 8 },
      { el: lines[0], y: 14 },
      { el: lines[1], y: 14 },
      { el: lines[2], y: 14 },
      { el: para, y: 9 },
    ];
    if (btn) parts.push({ el: btn, y: 7 });

    const apply = (m) => {
      label.textContent = m.eyebrow;
      lines[0].textContent = m.l1;
      lines[1].textContent = m.l2;
      lines[2].innerHTML = '<em>' + m.l3 + '</em>';
      para.textContent = m.p;
      if (btn) btn.textContent = m.cta;
    };

    let i = 0;
    let timer, swapTimer;

    const swap = () => {
      if (document.hidden) { schedule(); return; }

      // clear any leftover finished fills (elements rest at their natural style)
      parts.forEach((p) => p.el.getAnimations().forEach((a) => a.cancel()));

      // OUT — lift up and fade, staggered top to bottom
      let outMax = 0;
      parts.forEach((p, idx) => {
        const delay = idx * OUT_STAG;
        outMax = Math.max(outMax, delay + OUT_D);
        p.el.animate(
          [{ opacity: 1, transform: 'translateY(0)' },
           { opacity: 0, transform: `translateY(-${p.y}px)` }],
          { duration: OUT_D, delay, easing: EASE_OUT, fill: 'forwards' }
        );
      });

      swapTimer = setTimeout(() => {
        i = (i + 1) % MESSAGES.length;
        apply(MESSAGES[i]);
        // IN — rise from just below into place, same staggered cadence
        parts.forEach((p, idx) => {
          p.el.animate(
            [{ opacity: 0, transform: `translateY(${p.y}px)` },
             { opacity: 1, transform: 'translateY(0)' }],
            { duration: IN_D, delay: idx * IN_STAG, easing: EASE_IN, fill: 'both' }
          );
        });
        schedule();
      }, outMax + 30);
    };

    function schedule() { timer = setTimeout(swap, REST_MS); }
    schedule();

    return () => {
      clearTimeout(timer);
      clearTimeout(swapTimer);
      parts.forEach((p) => p.el.getAnimations().forEach((a) => a.cancel()));
    };
  }, []);

  return null;
}
