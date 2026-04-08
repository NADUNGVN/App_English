import { renderSidebar } from '../components/Sidebar.js';

const weeklyData = [
  { rank:1,  name:'Bạn',           xp:60,  time:'1h 9m',  avatar:'B', streak:7,  me:true },
  { rank:2,  name:'Harvey Nguyen', xp:40,  time:'45m',    avatar:'H', streak:5,  me:false },
  { rank:3,  name:'Harvey Test',   xp:20,  time:'30m',    avatar:'H', streak:3,  me:false },
  { rank:4,  name:'MinhTran',      xp:15,  time:'25m',    avatar:'M', streak:2,  me:false },
  { rank:5,  name:'LinhPham',      xp:10,  time:'18m',    avatar:'L', streak:1,  me:false },
  { rank:6,  name:'AnhDo',         xp:8,   time:'12m',    avatar:'A', streak:1,  me:false },
  { rank:7,  name:'TuanLe',        xp:5,   time:'8m',     avatar:'T', streak:0,  me:false },
];

const medals = { 1:'🥇', 2:'🥈', 3:'🥉' };
const xpColors = { 1:'#f59e0b', 2:'#94a3b8', 3:'#c2976a' };

export async function renderLeaderboard() {
  return `
  <div class="page-app">
    ${renderSidebar('rank')}
    <main class="main-content">
      <div class="content-scroll">

        <div class="dashboard-header">
          <h1 class="dashboard-greeting">Bảng Xếp Hạng 🏆</h1>
          <p class="dashboard-subtitle">Cạnh tranh lành mạnh cùng cộng đồng học tiếng Anh</p>
        </div>

        <!-- Tabs -->
        <div style="display:flex;gap:0.5rem;margin-bottom:1.75rem;">
          ${['Tuần này','Tháng này','Tất cả thời gian'].map((t,i)=>`
            <button style="
              padding:0.5rem 1.25rem;border-radius:var(--radius-full);font-family:inherit;
              font-size:0.85rem;font-weight:600;cursor:pointer;transition:all 0.2s;
              border:1px solid ${i===0?'var(--accent-purple)':'var(--border-color)'};
              background:${i===0?'rgba(124,58,237,0.15)':'transparent'};
              color:${i===0?'var(--accent-purple2)':'var(--text-muted)'};
            ">${t}</button>
          `).join('')}
        </div>

        <!-- Top 3 podium -->
        <div style="display:flex;align-items:flex-end;justify-content:center;gap:1rem;margin-bottom:2.5rem;">
          <!-- 2nd place -->
          <div style="text-align:center;flex:1;max-width:160px;">
            <div style="width:3.5rem;height:3.5rem;border-radius:50%;background:linear-gradient(135deg,#374151,#6b7280);display:flex;align-items:center;justify-content:center;font-size:1.25rem;font-weight:800;color:white;margin:0 auto 0.5rem;">H</div>
            <div style="font-size:0.8rem;font-weight:700;color:var(--text-primary);margin-bottom:0.25rem;">Harvey N.</div>
            <div style="font-size:0.7rem;color:var(--text-muted);margin-bottom:0.5rem;">40 XP</div>
            <div style="height:80px;background:linear-gradient(180deg,rgba(148,163,184,0.3),rgba(148,163,184,0.1));border-radius:8px 8px 0 0;display:flex;align-items:center;justify-content:center;font-size:2rem;">🥈</div>
          </div>
          <!-- 1st place -->
          <div style="text-align:center;flex:1;max-width:180px;">
            <div style="
              width:4rem;height:4rem;border-radius:50%;
              background:linear-gradient(135deg,#7c3aed,#ec4899);
              display:flex;align-items:center;justify-content:center;
              font-size:1.5rem;font-weight:800;color:white;
              margin:0 auto 0.5rem;
              box-shadow:0 0 20px rgba(124,58,237,0.5);
            ">B</div>
            <div style="font-size:0.9rem;font-weight:800;color:var(--text-primary);margin-bottom:0.25rem;">Bạn 👑</div>
            <div style="font-size:0.8rem;color:var(--accent-purple2);font-weight:700;margin-bottom:0.5rem;">60 XP</div>
            <div style="height:110px;background:linear-gradient(180deg,rgba(124,58,237,0.3),rgba(124,58,237,0.1));border-radius:8px 8px 0 0;display:flex;align-items:center;justify-content:center;font-size:2.5rem;">🥇</div>
          </div>
          <!-- 3rd place -->
          <div style="text-align:center;flex:1;max-width:160px;">
            <div style="width:3.5rem;height:3.5rem;border-radius:50%;background:linear-gradient(135deg,#374151,#6b7280);display:flex;align-items:center;justify-content:center;font-size:1.25rem;font-weight:800;color:white;margin:0 auto 0.5rem;">H</div>
            <div style="font-size:0.8rem;font-weight:700;color:var(--text-primary);margin-bottom:0.25rem;">Harvey T.</div>
            <div style="font-size:0.7rem;color:var(--text-muted);margin-bottom:0.5rem;">20 XP</div>
            <div style="height:60px;background:linear-gradient(180deg,rgba(194,151,106,0.3),rgba(194,151,106,0.1));border-radius:8px 8px 0 0;display:flex;align-items:center;justify-content:center;font-size:2rem;">🥉</div>
          </div>
        </div>

        <!-- Full table -->
        <div class="card" style="padding:0;overflow:hidden;">
          <div style="padding:1rem 1.25rem;border-bottom:1px solid var(--border-subtle);display:flex;justify-content:space-between;align-items:center;">
            <span style="font-weight:700;font-size:0.9rem;">Bảng xếp hạng đầy đủ</span>
            <div style="display:flex;gap:0.5rem;">
              <button style="font-size:0.72rem;padding:0.25rem 0.75rem;border-radius:var(--radius-full);background:rgba(124,58,237,0.15);color:var(--accent-purple2);border:1px solid rgba(124,58,237,0.3);cursor:pointer;font-family:inherit;font-weight:600;">🏅 Điểm XP</button>
              <button style="font-size:0.72rem;padding:0.25rem 0.75rem;border-radius:var(--radius-full);background:transparent;color:var(--text-muted);border:1px solid var(--border-color);cursor:pointer;font-family:inherit;font-weight:600;">⏱ Thời gian</button>
            </div>
          </div>
          ${weeklyData.map(u => `
            <div style="
              display:flex;align-items:center;gap:1rem;
              padding:0.875rem 1.25rem;
              border-bottom:1px solid var(--border-subtle);
              background:${u.me ? 'rgba(124,58,237,0.08)' : 'transparent'};
              transition:background 0.15s;
            " onmouseover="this.style.background='${u.me?'rgba(124,58,237,0.12)':'var(--bg-secondary)'}'"
               onmouseout="this.style.background='${u.me?'rgba(124,58,237,0.08)':'transparent'}'">
              <!-- Rank -->
              <div style="width:2rem;text-align:center;font-size:${u.rank<=3?'1.25rem':'0.85rem'};font-weight:700;color:${xpColors[u.rank]||'var(--text-muted)'};">
                ${medals[u.rank] || u.rank}
              </div>
              <!-- Avatar -->
              <div style="
                width:2.5rem;height:2.5rem;border-radius:50%;flex-shrink:0;
                background:${u.me?'linear-gradient(135deg,#7c3aed,#ec4899)':'linear-gradient(135deg,#374151,#4b5563)'};
                display:flex;align-items:center;justify-content:center;
                font-size:1rem;font-weight:800;color:white;
                ${u.rank<=3?'box-shadow:0 0 12px rgba(124,58,237,0.3);':''}
              ">${u.avatar}</div>
              <!-- Info -->
              <div style="flex:1;min-width:0;">
                <div style="font-size:0.875rem;font-weight:${u.me?'800':'600'};color:${u.me?'var(--text-primary)':'var(--text-primary)'};">
                  ${u.name} ${u.me?'<span style="font-size:0.7rem;color:var(--accent-purple2);font-weight:700;">(Bạn)</span>':''}
                </div>
                <div style="font-size:0.7rem;color:var(--text-muted);">🔥 ${u.streak} ngày streak · ${u.time}</div>
              </div>
              <!-- XP bar -->
              <div style="width:120px;">
                <div style="display:flex;justify-content:space-between;margin-bottom:3px;">
                  <span style="font-size:0.7rem;color:var(--text-muted);">XP</span>
                  <span style="font-size:0.7rem;font-weight:700;color:${xpColors[u.rank]||'var(--text-secondary)'};">${u.xp}</span>
                </div>
                <div style="height:4px;background:var(--bg-primary);border-radius:2px;overflow:hidden;">
                  <div style="height:100%;width:${(u.xp/60)*100}%;background:linear-gradient(90deg,var(--accent-purple),var(--accent-pink));border-radius:2px;"></div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

      </div>
    </main>
  </div>
  `;
}
