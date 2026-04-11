import { renderSidebar } from '../components/Sidebar.js';

export async function renderDictionary() {
  const recentSearches = ['perseverance','eloquent','resilient','empathy','tenacious'];
  const wordOfDay = {
    word: 'Serendipity',
    phonetic: '/ˌserənˈdɪpɪti/',
    type: 'danh từ',
    meaning: 'Sự tình cờ may mắn; khả năng tình cờ khám phá ra điều tốt đẹp',
    example: 'It was pure serendipity that we met at the airport.',
    translate: 'Đó thuần túy là sự tình cờ may mắn khi chúng tôi gặp nhau ở sân bay.',
    synonyms: ['luck','fortune','chance','coincidence'],
    level: 'C1',
  };

  return `
  <div class="page-app">
    ${renderSidebar('dict')}
    <main class="main-content">
      <div class="content-scroll">

        <div class="dashboard-header">
          <h1 class="dashboard-greeting">Từ Điển 📖</h1>
          <p class="dashboard-subtitle">Tra từ tức thì, dịch nghĩa và lưu vào danh sách của bạn</p>
        </div>

        <!-- Search bar big -->
        <div style="position:relative;margin-bottom:1.5rem;">
          <span style="position:absolute;left:1.25rem;top:50%;transform:translateY(-50%);font-size:1.25rem;color:var(--text-muted);">🔍</span>
          <input 
            id="dict-search"
            type="text" 
            placeholder="Nhập từ cần tra (English hoặc Tiếng Việt)..." 
            class="form-input"
            style="padding:1rem 1rem 1rem 3.25rem;font-size:1rem;border-radius:var(--radius-lg);"
          />
          <button class="btn btn-primary" style="position:absolute;right:0.5rem;top:50%;transform:translateY(-50%);">
            Tra từ
          </button>
        </div>

        <!-- Recent searches -->
        <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1.75rem;flex-wrap:wrap;">
          <span style="font-size:0.75rem;color:var(--text-muted);font-weight:600;">Gần đây:</span>
          ${recentSearches.map(w=>`
            <button style="
              font-size:0.78rem;padding:0.3rem 0.75rem;
              background:var(--bg-card);border:1px solid var(--border-color);
              border-radius:var(--radius-full);color:var(--text-secondary);
              cursor:pointer;font-family:inherit;transition:all 0.15s;
            " onmouseover="this.style.borderColor='var(--accent-purple)';this.style.color='var(--accent-purple2)'"
               onmouseout="this.style.borderColor='var(--border-color)';this.style.color='var(--text-secondary)'">${w}</button>
          `).join('')}
        </div>

        <!-- 2-col layout: word result + Word of day -->
        <div style="display:grid;grid-template-columns:1fr 300px;gap:1.25rem;">

          <!-- Word result card (shows word of day by default) -->
          <div class="card">
            <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:1.25rem;">
              <div>
                <div style="font-size:2rem;font-weight:900;color:var(--text-primary);letter-spacing:-0.02em;">${wordOfDay.word}</div>
                <div style="display:flex;align-items:center;gap:0.75rem;margin-top:0.25rem;">
                  <span style="font-size:0.875rem;color:var(--text-muted);">${wordOfDay.phonetic}</span>
                  <button style="background:rgba(124,58,237,0.15);border:none;color:var(--accent-purple2);padding:0.2rem 0.5rem;border-radius:var(--radius-sm);cursor:pointer;font-size:0.8rem;">🔊 Nghe</button>
                  <span style="font-size:0.72rem;padding:0.15rem 0.5rem;border-radius:var(--radius-sm);background:rgba(245,158,11,0.15);color:#f59e0b;font-weight:700;">${wordOfDay.level}</span>
                </div>
              </div>
              <button class="btn btn-primary btn-sm">+ Lưu từ</button>
            </div>

            <div style="display:inline-block;font-size:0.75rem;font-style:italic;color:var(--text-muted);background:var(--bg-secondary);padding:0.2rem 0.625rem;border-radius:var(--radius-sm);margin-bottom:1rem;">${wordOfDay.type}</div>

            <!-- Meaning -->
            <div style="padding:1rem;background:var(--bg-secondary);border-radius:var(--radius-md);margin-bottom:1rem;">
              <div style="font-size:0.72rem;font-weight:700;text-transform:uppercase;color:var(--text-muted);margin-bottom:0.5rem;">NGHĨA</div>
              <div style="font-size:0.95rem;color:var(--text-primary);line-height:1.6;">${wordOfDay.meaning}</div>
            </div>

            <!-- Example -->
            <div style="padding:1rem;background:rgba(124,58,237,0.08);border-left:3px solid var(--accent-purple);border-radius:0 var(--radius-md) var(--radius-md) 0;margin-bottom:1rem;">
              <div style="font-size:0.72rem;font-weight:700;text-transform:uppercase;color:var(--accent-purple2);margin-bottom:0.5rem;">VÍ DỤ</div>
              <div style="font-size:0.875rem;color:var(--text-primary);font-style:italic;margin-bottom:0.375rem;">"${wordOfDay.example}"</div>
              <div style="font-size:0.8rem;color:var(--text-secondary);">${wordOfDay.translate}</div>
            </div>

            <!-- Synonyms -->
            <div>
              <div style="font-size:0.72rem;font-weight:700;text-transform:uppercase;color:var(--text-muted);margin-bottom:0.5rem;">TỪ ĐỒNG NGHĨA</div>
              <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
                ${wordOfDay.synonyms.map(s=>`
                  <button style="
                    font-size:0.8rem;padding:0.3rem 0.75rem;
                    background:var(--bg-secondary);border:1px solid var(--border-color);
                    border-radius:var(--radius-full);color:var(--text-secondary);
                    cursor:pointer;font-family:inherit;
                  ">${s}</button>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Word of Day sidebar -->
          <div style="display:flex;flex-direction:column;gap:1rem;">
            <div class="card" style="background:linear-gradient(135deg,rgba(124,58,237,0.15),rgba(236,72,153,0.1));border-color:rgba(124,58,237,0.3);">
              <div style="font-size:0.72rem;font-weight:700;text-transform:uppercase;color:var(--accent-purple2);margin-bottom:0.75rem;">✨ TỪ CỦA NGÀY</div>
              <div style="font-size:1.5rem;font-weight:900;margin-bottom:0.25rem;">Ephemeral</div>
              <div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:0.75rem;">/ɪˈfemərəl/ · tính từ</div>
              <div style="font-size:0.85rem;color:var(--text-secondary);line-height:1.5;">Thoáng qua, không bền lâu; tồn tại trong thời gian ngắn</div>
              <div style="margin-top:0.75rem;font-size:0.8rem;color:var(--text-muted);font-style:italic;">"Youth is ephemeral."</div>
            </div>

            <div class="card">
              <div style="font-size:0.8rem;font-weight:700;margin-bottom:0.875rem;">📈 Thống kê tra từ</div>
              ${[
                { label:'Từ đã tra',    value:'248' },
                { label:'Từ đã lưu',    value:'10' },
                { label:'Tuần này',     value:'32 từ' },
              ].map(s=>`
                <div style="display:flex;justify-content:space-between;align-items:center;padding:0.5rem 0;border-bottom:1px solid var(--border-subtle);">
                  <span style="font-size:0.8rem;color:var(--text-secondary);">${s.label}</span>
                  <span style="font-size:0.875rem;font-weight:700;color:var(--text-primary);">${s.value}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

      </div>
    </main>
  </div>
  `;
}
