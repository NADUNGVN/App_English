import { renderSidebar } from '../components/Sidebar.js';

const categories = [
  { id: 'all',     label: 'Tất cả',          count: 500 },
  { id: 'bbc',     label: 'BBC Learning',     count: 41 },
  { id: 'cnn',     label: 'CNN 10',           count: 87 },
  { id: 'ted',     label: 'TED Talks',        count: 63 },
  { id: 'daily',   label: 'Daily English',    count: 124 },
  { id: 'grammar', label: 'Grammar',          count: 55 },
];

const levels = ['Tất cả', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const lessons = [
  { emoji: '💧', title: 'Saving water in the driest place on Earth',       level: 'B2', duration: '6 min',  source: 'BBC',     progress: 9,  tags: ['Environment', 'Science'] },
  { emoji: '🥗', title: 'Healthy or unhealthy lifestyle?',                 level: 'B2', duration: '3 min',  source: 'BBC',     progress: 43, tags: ['Health', 'Lifestyle'] },
  { emoji: '📱', title: 'Keeping kids off smartphones',                    level: 'B2', duration: '6 min',  source: 'BBC',     progress: 16, tags: ['Technology', 'Parenting'] },
  { emoji: '🥦', title: 'Healthy Food vs Junk Food',                       level: 'A1', duration: '3 min',  source: 'YouTube', progress: 39, tags: ['Food', 'Health'] },
  { emoji: '🎙', title: 'Sam Altman explains how to come up with an idea',  level: 'C1', duration: '12 min', source: 'TED',     progress: 16, tags: ['Business', 'AI'] },
  { emoji: '🌮', title: 'Learning a new food culture',                      level: 'B2', duration: '6 min',  source: 'BBC',     progress: 0,  tags: ['Culture', 'Food'] },
  { emoji: '🧠', title: 'What decides our taste?',                          level: 'A1', duration: '6 min',  source: 'BBC',     progress: 0,  tags: ['Science', 'Health'] },
  { emoji: '🎤', title: 'Did Taylor Swift fans cause an earthquake?',       level: 'B2', duration: '6 min',  source: 'BBC',     progress: 0,  tags: ['Music', 'Science'] },
  { emoji: '🚀', title: 'The future of space travel',                       level: 'C1', duration: '18 min', source: 'TED',     progress: 0,  tags: ['Science', 'Space'] },
  { emoji: '💼', title: 'How to nail a job interview',                       level: 'B1', duration: '8 min',  source: 'CNN',     progress: 0,  tags: ['Career', 'Business'] },
  { emoji: '🌍', title: 'Climate change explained simply',                   level: 'B2', duration: '10 min', source: 'TED',     progress: 0,  tags: ['Environment'] },
  { emoji: '📚', title: 'Why reading books makes you smarter',              level: 'A2', duration: '5 min',  source: 'Daily',   progress: 0,  tags: ['Education'] },
];

export async function renderLearning() {
  return `
  <div class="page-app">
    ${renderSidebar('library')}

    <main class="main-content">
      <div class="content-scroll">

        <!-- Header -->
        <div class="dashboard-header" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;">
          <div>
            <h1 class="dashboard-greeting">Thư Viện Bài Học 📚</h1>
            <p class="dashboard-subtitle">500+ video bài học từ BBC, CNN, TED và YouTube</p>
          </div>

          <!-- Search -->
          <div style="position:relative;max-width:300px;width:100%;">
            <span style="position:absolute;left:0.875rem;top:50%;transform:translateY(-50%);color:var(--text-muted);font-size:1rem;">🔍</span>
            <input 
              id="search-input"
              type="text" 
              placeholder="Tìm bài học..." 
              class="form-input"
              style="padding-left:2.5rem;border-radius:var(--radius-full);"
            />
          </div>
        </div>

        <!-- Category tabs -->
        <div style="display:flex;gap:0.5rem;margin-bottom:1.25rem;overflow-x:auto;padding-bottom:0.25rem;scrollbar-width:none;">
          ${categories.map((c, i) => `
            <button class="tab-btn ${i === 0 ? 'active' : ''}" data-category="${c.id}" style="white-space:nowrap;padding:0.4rem 1rem;${i === 0 ? 'background:rgba(124,58,237,0.2);color:var(--accent-purple2);' : ''}">
              ${c.label}
              <span style="font-size:0.65rem;opacity:0.7;margin-left:0.25rem;">${c.count}</span>
            </button>
          `).join('')}
        </div>

        <!-- Level filter + Sort -->
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.5rem;gap:1rem;flex-wrap:wrap;">
          <div style="display:flex;gap:0.375rem;flex-wrap:wrap;">
            ${levels.map((l, i) => `
              <button class="level-btn" data-level="${l}" style="
                padding:0.3rem 0.75rem;
                border-radius:var(--radius-full);
                border:1px solid ${i === 0 ? 'var(--accent-purple)' : 'var(--border-color)'};
                background:${i === 0 ? 'rgba(124,58,237,0.15)' : 'transparent'};
                color:${i === 0 ? 'var(--accent-purple2)' : 'var(--text-muted)'};
                font-size:0.75rem;font-weight:600;cursor:pointer;
                font-family:inherit;transition:all 0.2s;
              ">${l}</button>
            `).join('')}
          </div>

          <div style="display:flex;align-items:center;gap:0.75rem;">
            <span style="font-size:0.75rem;color:var(--text-muted);">Sắp xếp:</span>
            <select style="
              background:var(--bg-card);border:1px solid var(--border-color);
              color:var(--text-primary);border-radius:var(--radius-md);
              padding:0.375rem 0.75rem;font-size:0.8rem;font-family:inherit;
              cursor:pointer;outline:none;
            ">
              <option>Mới nhất</option>
              <option>Phổ biến nhất</option>
              <option>Ngắn nhất</option>
              <option>Đang học</option>
            </select>
          </div>
        </div>

        <!-- Lessons Grid -->
        <div id="lessons-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:1rem;margin-bottom:2rem;">
          ${lessons.map(l => renderGridCard(l)).join('')}
        </div>

        <!-- Load more -->
        <div style="text-align:center;margin-bottom:2rem;">
          <button class="btn btn-outline" id="load-more-btn">
            Tải thêm bài học
            <span style="font-size:0.75rem;opacity:0.7;">488 bài còn lại</span>
          </button>
        </div>

      </div>
    </main>
  </div>
  `;
}

function renderGridCard(l) {
  const levelColors = {
    A1: '#16a34a', A2: '#15803d',
    B1: '#2563eb', B2: '#1d4ed8',
    C1: '#ea580c', C2: '#dc2626',
  };
  const sourceColors = {
    BBC:    'rgba(239,68,68,0.15)',
    CNN:    'rgba(59,130,246,0.15)',
    TED:    'rgba(239,68,68,0.12)',
    YouTube:'rgba(239,68,68,0.1)',
    Daily:  'rgba(16,185,129,0.12)',
  };
  const sourceTextColors = {
    BBC:'#f87171', CNN:'#60a5fa', TED:'#f87171', YouTube:'#f87171', Daily:'#34d399',
  };

  return `
    <div class="lesson-card" style="width:100%;" role="button" tabindex="0">
      <div class="lesson-thumb" style="background:linear-gradient(135deg,#1e3a5f,#2563eb);">
        <div class="lesson-thumb-bg" style="font-size:2.5rem;">${l.emoji}</div>
        <span class="lesson-level-badge" style="background:${levelColors[l.level]}cc;color:white;">${l.level}</span>
        <span class="lesson-duration">⏱ ${l.duration}</span>
        ${l.progress > 0 ? `
          <div style="position:absolute;bottom:0;left:0;right:0;height:3px;background:rgba(0,0,0,0.4);">
            <div style="height:100%;width:${l.progress}%;background:linear-gradient(90deg,var(--accent-purple),var(--accent-pink));"></div>
          </div>
        ` : ''}
      </div>
      <div class="lesson-info">
        <div style="display:flex;align-items:center;gap:0.375rem;margin-bottom:0.375rem;">
          <span style="font-size:0.62rem;padding:0.1rem 0.4rem;border-radius:3px;font-weight:700;background:${sourceColors[l.source]};color:${sourceTextColors[l.source]};">${l.source}</span>
          ${l.tags.slice(0,1).map(t => `<span style="font-size:0.62rem;padding:0.1rem 0.4rem;border-radius:3px;background:var(--bg-secondary);color:var(--text-muted);">${t}</span>`).join('')}
        </div>
        <div class="lesson-title">${l.title}</div>
        ${l.progress > 0 ? `
          <div class="lesson-progress-wrap">
            <div class="progress-bar-wrap">
              <div class="progress-bar-fill" style="width:${l.progress}%"></div>
            </div>
            <span class="progress-pct">${l.progress}%</span>
          </div>
        ` : `<div style="font-size:0.68rem;color:var(--text-muted);">Chưa bắt đầu</div>`}
      </div>
    </div>
  `;
}
