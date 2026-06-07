'use client';
import { useEffect } from 'react';

export default function ServicesEnhancer() {
  useEffect(() => {
    const openAndScroll = (id) => {
      const cat = document.getElementById(id);
      if (!cat) return;
      const d = cat.querySelector('details');
      if (d) d.open = true;
      requestAnimationFrame(() =>
        cat.scrollIntoView({ behavior: 'smooth', block: 'start' })
      );
    };

    const onClick = (e) => {
      const a = e.target.closest('.svc-subnav a[href^="#"]');
      if (!a) return;
      e.preventDefault();
      const id = a.getAttribute('href').slice(1);
      openAndScroll(id);
      history.replaceState(null, '', '#' + id);
    };

    const onHash = () => {
      if (location.hash.length > 1) openAndScroll(location.hash.slice(1));
    };

    document.addEventListener('click', onClick);
    window.addEventListener('hashchange', onHash);
    if (location.hash.length > 1) openAndScroll(location.hash.slice(1));

    return () => {
      document.removeEventListener('click', onClick);
      window.removeEventListener('hashchange', onHash);
    };
  }, []);

  return null;
}
