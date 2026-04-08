import { renderSidebar } from '../components/Sidebar.js';

// ── Mock Data ──
const stats = [
  { icon: '🔥', color: 'orange', value: '7 ngày',  label: 'Chuỗi hiện tại' },
  { icon: '⏱',  color: 'cyan',   value: '1h 9m',   label: 'Thời gian luyện tập' },
  { icon: '📖',  color: 'green',  value: '10',      label: 'Từ đã lưu' },
  { icon: '⭐',  color: 'purple', value: '90 XP',   label: 'Tổng XP' },
];

const weekDays = [
  { label: 'M', done: true },
  { label: 'T', done: true },
  { label: 'W', done: true },
  { label: 'T', done: true },
  { label: 'F', done: true },
  { label: 'S', today: true },
  { label: 'S', empty: true },
];

const quickCards = [
  { icon: '📝', color: 'orange', label: 'Từ vựng của tôi' },
  { icon: '📖', color: 'red',    label: 'Từ điển' },
  { icon: '📊', color: 'blue',   label: 'Thống kê' },
  { icon: '🔌', color: 'purple', label: 'Sila Extension' },
];

const leaderboard = [
  { rank: 1, name: 'Bạn',          time: '0 h',  xp: '60 XP', tier: 'gold',   me: true },
  { rank: 2, name: 'Harvey Nguyen', time: '0 h',  xp: '40 XP', tier: 'silver', me: false },
  { rank: 3, name: 'Harvey Test',   time: '0 h',  xp: '20 XP', tier: 'bronze', me: false },
];

const continueLessons = [
  { emoji: '💧', title: 'Saving water in the driest place on Earth 🌍',          level: 'B2', duration: '6 phút', progress: 9  },
  { emoji: '🥗', title: 'English – Healthy or unhealthy lifestyle? (wit...',      level: 'B2', duration: '3 phút', progress: 43 },
  { emoji: '📱', title: 'Keeping kids off smartphones 6 Minut...',               level: 'B2', duration: '6 phút', progress: 16 },
  { emoji: '🥦', title: 'Healthy Food vs Junk Food | Which is better? |...',      level: 'A1', duration: '3 phút', progress: 39 },
  { emoji: '🎙', title: 'Sam Altman explains how to come up with a...',           level: 'C1', duration: '3 phút', progress: 16 },
];

const bbcLessons = [
  { emoji: '📱', title: 'Keeping kids off smartphones',      level: 'B2', duration: '6 min' },
  { emoji: '💧', title: 'Saving water in the driest place',  level: 'B2', duration: '6 min' },
  { emoji: '🌮', title: 'Learning a new food culture',       level: 'B2', duration: '6 min' },
  { emoji: '🧠', title: 'What decides our taste?',           level: 'A1', duration: '6 min' },
  { emoji: '🎤', title: 'Did Taylor Swift fans cause an earthquake?', level: 'B2', duration: '6 min' },
];

// ── Render ──
export async function renderDashboard() {
  return `
  <div class="page-app">
    ${renderSidebar('dashboard')}

    <main class="main-content">
      <div class="content-scroll">

        <!-- Header -->
        <div class="dashboard-header">
          <h1 class="dashboard-greeting">Chào mừng trở lại, Harvey! 👋</h1>
          <p class="dashboard-subtitle">Tiếp tục phát huy — bạn đang làm rất tốt!</p>
        </div>

        <!-- Stats Row -->
        <div class="stats-row">
          ${stats.map(s => `
            <div class="stat-card">
              <div class="stat-icon ${s.color}">${s.icon}</div>
              <div class="stat-info">
                <div class="stat-value">${s.value}</div>
                <div class="stat-label">${s.label}</div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Main grid: Weekly + Leaderboard -->
        <div class="dashboard-grid">
          <!-- Left: Weekly + Quick Actions -->
          <div>
            <div class="card">
              <div class="card-header">
                <span class="card-title">Tuần này</span>
                <span style="font-size:0.75rem;color:var(--accent-green);font-weight:600;">🏅 Gài điểm danh</span>
              </div>

              <div class="weekly-row">
                ${weekDays.map(d => `
                  <div class="week-dot-wrap">
                    <div class="week-dot ${d.done ? 'done' : d.today ? 'today' : 'empty'}">
                      ${d.done ? '✓' : ''}
                    </div>
                    <span class="week-day-label">${d.label}</span>
                  </div>
                `).join('')}
              </div>

              <div class="quick-actions">
                ${quickCards.map(c => `
                  <div class="quick-card" role="button" tabindex="0">
                    <div class="quick-card-icon ${c.color}">${c.icon}</div>
                    <div class="quick-card-label">${c.label}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Right: Leaderboard -->
          <div>
            <div class="card" style="height:100%;">
              <div class="card-header">
                <div style="display:flex;align-items:center;gap:0.5rem;">
                  <span class="card-title">🏆 Bảng xếp hạng</span>
                </div>
                <div class="leaderboard-tabs">
                  <button class="tab-btn active" data-tab="week">Tuần</button>
                  <button class="tab-btn" data-tab="month">Tháng</button>
                  <button class="tab-btn card-action" data-link="/leaderboard">Xem tất cả »</button>
                </div>
              </div>

              <!-- Tab labels: Điểm / Thời gian luyện tập -->
              <div style="display:flex;gap:1rem;margin-bottom:0.875rem;">
                <button class="tab-btn active" id="lb-score-tab">🏅 Điểm</button>
                <button class="tab-btn" id="lb-time-tab">⏱ Thời gian luyện tập</button>
              </div>

              <div class="leaderboard-list">
                ${leaderboard.map(u => `
                  <div class="lb-item ${u.me ? 'me' : ''}">
                    <span class="lb-rank ${u.tier}">${u.rank === 1 ? '🥇' : u.rank === 2 ? '🥈' : '🥉'}</span>
                    <div class="lb-avatar" style="${u.me ? 'background:linear-gradient(135deg,#7c3aed,#ec4899)' : 'background:linear-gradient(135deg,#374151,#6b7280)'}">
                      ${u.name.charAt(0)}
                    </div>
                    <div class="lb-info">
                      <div class="lb-name">${u.name}</div>
                      <div class="lb-meta">${u.time}</div>
                    </div>
                    <span class="lb-xp ${u.tier}">${u.xp}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>

        <!-- Continue Learning -->
        <div style="margin-bottom:1.5rem;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;">
            <h2 class="section-title">Tiếp tục học</h2>
            <button class="card-action" data-link="/learning">Xem thêm »</button>
          </div>

          <div class="lessons-scroll" id="continue-scroll">
            ${continueLessons.map(l => renderLessonCard(l)).join('')}
          </div>
        </div>

        <!-- BBC Learning English -->
        <div style="margin-bottom:2rem;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;">
            <div style="display:flex;align-items:center;gap:0.75rem;">
              <h2 class="section-title" style="margin:0">BBC Learning English</h2>
              <span style="font-size:0.75rem;background:rgba(239,68,68,0.15);color:#f87171;padding:0.15rem 0.5rem;border-radius:4px;font-weight:700;">41</span>
            </div>
            <button class="card-action" data-link="/learning">Xem thêm</button>
          </div>

          <div class="lessons-scroll">
            ${bbcLessons.map(l => renderLessonCardSimple(l)).join('')}
          </div>
        </div>

      </div>
    </main>

    <!-- Floating play button -->
    <div class="play-fab" id="play-fab" title="Tiếp tục học" role="button" tabindex="0" aria-label="Play">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
        <polygon points="5,3 19,12 5,21"/>
      </svg>
    </div>
  </div>
  `;
}

function renderLessonCard(l) {
  const colors = {
    B2: 'linear-gradient(135deg,#1e3a5f,#2563eb)',
    A1: 'linear-gradient(135deg,#14532d,#16a34a)',
    C1: 'linear-gradient(135deg,#7c2d12,#ea580c)',
  };
  return `
    <div class="lesson-card">
      <div class="lesson-thumb" style="background:${colors[l.level] || colors.B2};">
        <div class="lesson-thumb-bg">${l.emoji}</div>
        <span class="lesson-level-badge ${l.level.toLowerCase()}">${l.level}</span>
        <span class="lesson-duration">⏱ ${l.duration}</span>
      </div>
      <div class="lesson-info">
        <div class="lesson-title">${l.title}</div>
        <div class="lesson-progress-wrap">
          <div class="progress-bar-wrap">
            <div class="progress-bar-fill" data-width="${l.progress}%" style="width:0%"></div>
          </div>
          <span class="progress-pct">${l.progress}%</span>
        </div>
      </div>
    </div>
  `;
}

function renderLessonCardSimple(l) {
  const colors = {
    B2: 'linear-gradient(135deg,#1e3a5f,#2563eb)',
    A1: 'linear-gradient(135deg,#14532d,#16a34a)',
    C1: 'linear-gradient(135deg,#7c2d12,#ea580c)',
  };
  return `
    <div class="lesson-card">
      <div class="lesson-thumb" style="background:${colors[l.level] || colors.B2};">
        <div class="lesson-thumb-bg">${l.emoji}</div>
        <span class="lesson-level-badge ${l.level.toLowerCase()}">${l.level}</span>
        <span class="lesson-duration">⏱ ${l.duration}</span>
      </div>
      <div class="lesson-info">
        <div class="lesson-title">${l.title}</div>
        <div style="font-size:0.68rem;color:var(--accent-green);font-weight:600;">BBC Learning English</div>
      </div>
    </div>
  `;
}
