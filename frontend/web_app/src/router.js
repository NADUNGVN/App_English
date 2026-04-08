import { renderLanding }     from './pages/landing.js';
import { renderLogin }       from './pages/login.js';
import { renderRegister }    from './pages/register.js';
import { renderDashboard }   from './pages/dashboard.js';
import { renderLearning }    from './pages/learning.js';
import { renderVocabulary }  from './pages/vocabulary.js';
import { renderDictionary }  from './pages/dictionary.js';
import { renderLeaderboard } from './pages/leaderboard.js';
import { renderStatistics }  from './pages/statistics.js';
import { renderDictation }   from './pages/dictation.js';

const routes = {
  '/':            renderLanding,
  '/login':       renderLogin,
  '/register':    renderRegister,
  '/dashboard':   renderDashboard,
  '/learning':    renderLearning,
  '/vocabulary':  renderVocabulary,
  '/dictionary':  renderDictionary,
  '/leaderboard': renderLeaderboard,
  '/statistics':  renderStatistics,
  '/dictation':   renderDictation,
  '/shadowing':   renderDashboard,   // placeholder → dashboard
  '/extension':   renderDashboard,   // placeholder
  '/admin':       renderDashboard,   // placeholder
};

export const router = {
  async render() {
    const path = window.location.pathname;
    const renderFn = routes[path] || routes['/'];
    const root = document.getElementById('root');

    // Fade out
    root.style.opacity = '0';
    root.style.transition = 'opacity 0.15s ease';

    await new Promise(r => setTimeout(r, 80));
    root.innerHTML = await renderFn();

    // Fade in
    root.style.opacity = '1';

    attachPageScripts(path);
    window.scrollTo(0, 0);
  }
};

function attachPageScripts(path) {
  // Common: nav items & data-link
  document.querySelectorAll('.nav-item[data-link]').forEach(btn => {
    btn.addEventListener('click', () => {
      const p = btn.getAttribute('data-link');
      history.pushState(null, '', p);
      router.render();
    });
  });

  if (path === '/')          attachLandingScripts();
  if (path === '/dashboard') attachDashboardScripts();
  if (path === '/statistics') attachStatisticsScripts();
}

function attachLandingScripts() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.feature-card, .section-header').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.style.background = window.scrollY > 50
        ? 'rgba(13,13,26,0.98)'
        : 'rgba(13,13,26,0.8)';
    }, { passive: true });
  }
}

function attachDashboardScripts() {
  // Tab buttons
  document.querySelectorAll('.tab-btn').forEach(tab => {
    tab.addEventListener('click', () => {
      const group = tab.closest('.leaderboard-tabs, [role="tablist"]');
      if (group) {
        group.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
      }
      tab.classList.add('active');
    });
  });

  // Sidebar toggle mobile
  const toggleBtn = document.querySelector('.sidebar-toggle');
  const sidebar   = document.querySelector('.sidebar');
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => sidebar.classList.toggle('open'));
  }

  // Animate progress bars
  setTimeout(() => {
    document.querySelectorAll('.progress-bar-fill[data-width]').forEach(bar => {
      bar.style.width = bar.getAttribute('data-width');
    });
  }, 200);
}

function attachStatisticsScripts() {
  // Animate bar chart heights
  const bars = document.querySelectorAll('[data-height]');
  bars.forEach(b => {
    b.style.height = '0px';
    setTimeout(() => { b.style.height = b.getAttribute('data-height'); }, 100);
  });
}
