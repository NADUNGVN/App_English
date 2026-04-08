import { renderSidebar } from '../components/Sidebar.js';

// Mock weekly study data (minutes per day)
const weekData = [
  { day:'T2', min:45,  words:12 },
  { day:'T3', min:72,  words:18 },
  { day:'T4', min:30,  words:8  },
  { day:'T5', min:90,  words:25 },
  { day:'T6', min:69,  words:15 },
  { day:'T7', min:20,  words:5  },
  { day:'CN', min:0,   words:0  },
];
const maxMin = Math.max(...weekData.map(d => d.min));

const moduleStats = [
  { name:'Dictation',  sessions:12, totalMin:210, accuracy:'87%',  icon:'🎧', color:'purple' },
  { name:'Shadowing',  sessions:8,  totalMin:140, accuracy:'72%',  icon:'🎤', color:'pink' },
  { name:'Vocabulary', sessions:20, totalMin:95,  accuracy:'94%',  icon:'📝', color:'green' },
  { name:'Library',    sessions:5,  totalMin:180, accuracy:'—',   icon:'📚', color:'cyan' },
];

export async function renderStatistics() {
  return `
  <div class="page-app">
    ${renderSidebar('stats')}
    <main class="main-content">
      <div class="content-scroll">

        <div class="dashboard-header">
          <h1 class="dashboard-greeting">Thống Kê Học Tập 📊</h1>
          <p class="dashboard-subtitle">Theo dõi tiến độ và hiệu suất học của bạn</p>
        </div>

        <!-- Overview cards -->
        <div class="stats-row" style="margin-bottom:1.75rem;">
          ${[
            { icon:'🔥', color:'orange', value:'7',      unit:'ngày',    label:'Streak hiện tại' },
            { icon:'⏱',  color:'cyan',   value:'69',     unit:'phút',    label:'TB mỗi ngày' },
            { icon:'📖',  color:'green',  value:'83',     unit:'từ',      label:'Từ đã học tuần này' },
            { icon:'✅',  color:'purple', value:'87',     unit:'%',       label:'Độ chính xác' },
          ].map(s=>`
            <div class="stat-card">
              <div class="stat-icon ${s.color}">${s.icon}</div>
              <div class="stat-info">
                <div style="display:flex;align-items:baseline;gap:0.25rem;">
                  <div class="stat-value">${s.value}</div>
                  <div style="font-size:0.75rem;color:var(--text-muted);">${s.unit}</div>
                </div>
                <div class="stat-label">${s.label}</div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Weekly chart + Module breakdown -->
        <div style="display:grid;grid-template-columns:1fr 300px;gap:1.25rem;margin-bottom:1.5rem;">

          <!-- Bar chart -->
          <div class="card">
            <div class="card-header">
              <span class="card-title">Thời gian học theo ngày (phút)</span>
              <div style="display:flex;gap:0.5rem;">
                <button style="font-size:0.72rem;padding:0.2rem 0.625rem;border-radius:var(--radius-full);background:rgba(124,58,237,0.15);color:var(--accent-purple2);border:1px solid rgba(124,58,237,0.3);cursor:pointer;font-family:inherit;font-weight:600;">Tuần</button>
                <button style="font-size:0.72rem;padding:0.2rem 0.625rem;border-radius:var(--radius-full);background:transparent;color:var(--text-muted);border:1px solid var(--border-color);cursor:pointer;font-family:inherit;">Tháng</button>
              </div>
            </div>
            <div style="display:flex;align-items:flex-end;gap:0.75rem;height:160px;padding:0 0.5rem 0.5rem;">
              ${weekData.map(d => {
                const h = maxMin > 0 ? Math.round((d.min / maxMin) * 140) : 0;
                return `
                  <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:0.375rem;">
                    ${d.min > 0 ? `<div style="font-size:0.65rem;color:var(--accent-purple2);font-weight:700;">${d.min}m</div>` : '<div style="font-size:0.65rem;color:transparent;">0</div>'}
                    <div style="
                      width:100%;height:${h}px;min-height:4px;
                      background:${d.min>0?'linear-gradient(180deg,var(--accent-purple),var(--accent-pink))':'var(--bg-secondary)'};
                      border-radius:6px 6px 0 0;
                      transition:height 0.4s ease;
                      position:relative;overflow:hidden;
                    ">
                      ${d.min>0?'<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(255,255,255,0.15),transparent);"></div>':''}
                    </div>
                    <div style="font-size:0.68rem;color:var(--text-muted);font-weight:600;">${d.day}</div>
                  </div>
                `;
              }).join('')}
            </div>
            <!-- Words learned below -->
            <div style="display:flex;gap:0.75rem;margin-top:0.5rem;padding:0 0.5rem;">
              ${weekData.map(d=>`
                <div style="flex:1;text-align:center;font-size:0.62rem;color:var(--text-muted);">
                  ${d.words>0?`<span style="color:var(--accent-green);">+${d.words}</span>`:'—'}
                </div>
              `).join('')}
            </div>
            <div style="font-size:0.68rem;color:var(--text-muted);margin-top:0.25rem;padding:0 0.5rem;">📗 Từ học được</div>
          </div>

          <!-- Module breakdown -->
          <div class="card">
            <div class="card-header"><span class="card-title">Phân bổ theo module</span></div>
            <div style="display:flex;flex-direction:column;gap:0.875rem;">
              ${moduleStats.map(m => {
                const total = moduleStats.reduce((s,x)=>s+x.totalMin,0);
                const pct = Math.round((m.totalMin/total)*100);
                return `
                  <div>
                    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.375rem;">
                      <div style="display:flex;align-items:center;gap:0.5rem;">
                        <span>${m.icon}</span>
                        <span style="font-size:0.8rem;font-weight:600;">${m.name}</span>
                      </div>
                      <span style="font-size:0.72rem;color:var(--text-muted);">${m.totalMin}m · ${pct}%</span>
                    </div>
                    <div style="height:6px;background:var(--bg-primary);border-radius:3px;overflow:hidden;">
                      <div style="height:100%;width:${pct}%;background:linear-gradient(90deg,var(--accent-purple),var(--accent-pink));border-radius:3px;transition:width 0.4s;"></div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>

        <!-- Module detail table -->
        <div class="card" style="padding:0;overflow:hidden;">
          <div style="padding:1rem 1.25rem;border-bottom:1px solid var(--border-subtle);">
            <span class="card-title">Chi tiết theo module</span>
          </div>
          <table style="width:100%;border-collapse:collapse;">
            <thead>
              <tr style="background:var(--bg-secondary);">
                ${['Module','Số buổi','Tổng thời gian','Độ chính xác','Xu hướng'].map(h=>`
                  <th style="padding:0.75rem 1.25rem;text-align:left;font-size:0.72rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;">${h}</th>
                `).join('')}
              </tr>
            </thead>
            <tbody>
              ${moduleStats.map(m=>`
                <tr style="border-bottom:1px solid var(--border-subtle);"
                    onmouseover="this.style.background='var(--bg-secondary)'"
                    onmouseout="this.style.background='transparent'">
                  <td style="padding:0.875rem 1.25rem;">
                    <div style="display:flex;align-items:center;gap:0.625rem;">
                      <div class="stat-icon ${m.color}" style="width:2rem;height:2rem;font-size:1rem;">${m.icon}</div>
                      <span style="font-weight:600;font-size:0.875rem;">${m.name}</span>
                    </div>
                  </td>
                  <td style="padding:0.875rem 1.25rem;font-size:0.85rem;color:var(--text-secondary);">${m.sessions}</td>
                  <td style="padding:0.875rem 1.25rem;font-size:0.85rem;color:var(--text-secondary);">${m.totalMin} phút</td>
                  <td style="padding:0.875rem 1.25rem;">
                    <span style="font-size:0.8rem;font-weight:700;color:${m.accuracy!=='—'?'var(--accent-green)':'var(--text-muted)'};">${m.accuracy}</span>
                  </td>
                  <td style="padding:0.875rem 1.25rem;font-size:0.85rem;color:var(--accent-green);">↑ +12%</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

      </div>
    </main>
  </div>
  `;
}
