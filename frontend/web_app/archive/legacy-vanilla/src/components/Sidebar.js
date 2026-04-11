// ── Sidebar component ──
export function renderSidebar(activePage = 'dashboard') {
  const navItems = [
    { id: 'dashboard', label: 'Trang Chủ',       icon: '🏠', path: '/dashboard' },
    { id: 'dictation', label: 'Dictation',         icon: '🎧', path: '/dictation' },
    { id: 'shadowing', label: 'Shadowing',         icon: '🎤', path: '/shadowing' },
    { id: 'library',   label: 'Thư Viện',          icon: '📚', path: '/learning',  badge: '41' },
    { id: 'vocab',     label: 'Danh sách từ vựng', icon: '📝', path: '/vocabulary' },
    { id: 'dict',      label: 'Dictionary',         icon: '📖', path: '/dictionary' },
    { id: 'rank',      label: 'Xếp hạng',           icon: '🏆', path: '/leaderboard' },
    { id: 'stats',     label: 'Thống kê',            icon: '📊', path: '/statistics' },
    { id: 'ext',       label: 'Sila Extension',     icon: '🔌', path: '/extension' },
    { id: 'admin',     label: 'Quản lý Admin',      icon: '⚙️',  path: '/admin' },
  ];

  const footerItems = [
    { icon: '💬', label: 'Join Discord' },
    { icon: '🌐', label: 'Tiếng Việt', arrow: true },
    { icon: '🎨', label: 'Giao diện', arrow: true },
  ];

  return `
  <aside class="sidebar" id="sidebar">
    <div class="sidebar-brand">
      <div class="sidebar-logo">S</div>
      <span class="sidebar-brand-name">S English</span>
      <button class="sidebar-toggle" aria-label="Toggle sidebar">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>
    </div>

    <nav class="sidebar-nav">
      ${navItems.map(item => `
        <button 
          class="nav-item ${item.id === activePage ? 'active' : ''}" 
          data-link="${item.path}"
          aria-label="${item.label}"
        >
          <span class="nav-icon">${item.icon}</span>
          <span>${item.label}</span>
          ${item.badge ? `<span class="nav-badge">${item.badge}</span>` : ''}
        </button>
      `).join('')}
    </nav>

    <div>
      <div class="sidebar-footer">
        ${footerItems.map(item => `
          <button class="sidebar-footer-btn">
            <span>${item.icon}</span>
            <span>${item.label}</span>
            ${item.arrow ? '<span style="margin-left:auto;font-size:0.7rem">▾</span>' : ''}
          </button>
        `).join('')}
      </div>

      <div class="sidebar-user">
        <div class="user-avatar">H</div>
        <div class="user-info">
          <div class="user-name">Harvey Nè</div>
          <div class="user-status">🔥 7 ngày streak</div>
        </div>
      </div>
    </div>
  </aside>
  `;
}
