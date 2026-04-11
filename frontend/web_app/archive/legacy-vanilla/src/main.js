import './styles/main.css';
import { router } from './router.js';

// ── App bootstrap ──
async function init() {
  const root = document.getElementById('root');
  root.innerHTML = '';

  // Initial route render
  await router.render();

  // Handle link navigation (SPA)
  document.addEventListener('click', (e) => {
    const a = e.target.closest('[data-link]');
    if (a) {
      e.preventDefault();
      const path = a.getAttribute('data-link');
      history.pushState(null, '', path);
      router.render();
    }
  });

  // Handle browser back/forward
  window.addEventListener('popstate', () => router.render());
}

init();
