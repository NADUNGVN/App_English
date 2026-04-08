import { renderSidebar } from '../components/Sidebar.js';

// Mock vocabulary data
const myWords = [
  { word: 'Perseverance', phonetic: '/ˌpɜːrsɪˈvɪərəns/', meaning: 'Sự kiên trì', example: 'Success requires perseverance.', level: 'C1', learned: true, reviewDate: '2 ngày trước' },
  { word: 'Eloquent',     phonetic: '/ˈeləkwənt/',       meaning: 'Hùng hồn, lưu loát', example: 'She gave an eloquent speech.', level: 'B2', learned: true, reviewDate: '1 ngày trước' },
  { word: 'Ambiguous',    phonetic: '/æmˈbɪɡjuəs/',      meaning: 'Mơ hồ, không rõ ràng', example: 'The instructions were ambiguous.', level: 'B2', learned: false, reviewDate: 'Hôm nay' },
  { word: 'Meticulous',   phonetic: '/məˈtɪkjələs/',     meaning: 'Tỉ mỉ, cẩn thận', example: 'He is meticulous about details.', level: 'C1', learned: false, reviewDate: 'Hôm nay' },
  { word: 'Resilient',    phonetic: '/rɪˈzɪliənt/',      meaning: 'Kiên cường, phục hồi tốt', example: 'Children are very resilient.', level: 'B2', learned: true, reviewDate: '3 ngày trước' },
  { word: 'Pragmatic',    phonetic: '/præɡˈmætɪk/',      meaning: 'Thực tế, thực dụng', example: 'We need a pragmatic approach.', level: 'C1', learned: false, reviewDate: 'Chưa ôn' },
  { word: 'Tenacious',    phonetic: '/təˈneɪʃəs/',       meaning: 'Bền bỉ, kiên quyết', example: 'She is a tenacious negotiator.', level: 'C1', learned: false, reviewDate: 'Chưa ôn' },
  { word: 'Diligent',     phonetic: '/ˈdɪlɪdʒənt/',      meaning: 'Chăm chỉ, cần cù', example: 'He is a diligent student.', level: 'B1', learned: true, reviewDate: '5 ngày trước' },
  { word: 'Spontaneous',  phonetic: '/spɒnˈteɪniəs/',    meaning: 'Tự phát, ngẫu hứng', example: 'It was a spontaneous decision.', level: 'B2', learned: false, reviewDate: 'Chưa ôn' },
  { word: 'Compassion',   phonetic: '/kəmˈpæʃən/',       meaning: 'Lòng trắc ẩn', example: 'Show compassion to others.', level: 'B2', learned: true, reviewDate: '1 tuần trước' },
];

export async function renderVocabulary() {
  const learned = myWords.filter(w => w.learned).length;
  const total   = myWords.length;
  const toReview = myWords.filter(w => !w.learned).length;

  return `
  <div class="page-app">
    ${renderSidebar('vocab')}

    <main class="main-content">
      <div class="content-scroll">

        <!-- Header -->
        <div class="dashboard-header" style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:1rem;margin-bottom:1.5rem;">
          <div>
            <h1 class="dashboard-greeting">Danh Sách Từ Vựng 📝</h1>
            <p class="dashboard-subtitle">Ôn tập từ vựng cá nhân với spaced repetition</p>
          </div>
          <div style="display:flex;gap:0.75rem;">
            <button class="btn btn-outline btn-sm">📤 Xuất file</button>
            <button class="btn btn-primary btn-sm">➕ Thêm từ mới</button>
          </div>
        </div>

        <!-- Stats mini row -->
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin-bottom:1.5rem;">
          ${[
            { icon:'📚', label:'Tổng từ',    value: total,    color:'purple' },
            { icon:'✅', label:'Đã thuộc',   value: learned,  color:'green' },
            { icon:'🔄', label:'Cần ôn',     value: toReview, color:'orange' },
            { icon:'🔥', label:'Streak ôn',  value:'5 ngày',  color:'red' },
          ].map(s => `
            <div class="stat-card">
              <div class="stat-icon ${s.color}">${s.icon}</div>
              <div class="stat-info">
                <div class="stat-value">${s.value}</div>
                <div class="stat-label">${s.label}</div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Flashcard mode banner -->
        <div style="
          background:linear-gradient(135deg,rgba(124,58,237,0.15),rgba(236,72,153,0.1));
          border:1px solid rgba(124,58,237,0.3);border-radius:var(--radius-lg);
          padding:1.25rem 1.5rem;margin-bottom:1.5rem;
          display:flex;align-items:center;justify-content:space-between;gap:1rem;
        ">
          <div>
            <div style="font-weight:700;font-size:1rem;margin-bottom:0.25rem;">🃏 Chế độ Flashcard</div>
            <div style="font-size:0.8rem;color:var(--text-secondary);">Bạn có <strong style="color:var(--accent-pink)">${toReview} từ</strong> cần ôn tập hôm nay</div>
          </div>
          <button class="btn btn-primary">Bắt đầu ôn tập →</button>
        </div>

        <!-- Filter + Search -->
        <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.25rem;flex-wrap:wrap;">
          <div style="position:relative;flex:1;min-width:200px;max-width:320px;">
            <span style="position:absolute;left:0.875rem;top:50%;transform:translateY(-50%);color:var(--text-muted);">🔍</span>
            <input type="text" placeholder="Tìm từ vựng..." class="form-input" style="padding-left:2.5rem;border-radius:var(--radius-full);" />
          </div>
          <div style="display:flex;gap:0.5rem;">
            ${['Tất cả','Chưa thuộc','Đã thuộc'].map((f,i) => `
              <button style="
                padding:0.375rem 0.875rem;border-radius:var(--radius-full);
                border:1px solid ${i===0?'var(--accent-purple)':'var(--border-color)'};
                background:${i===0?'rgba(124,58,237,0.15)':'transparent'};
                color:${i===0?'var(--accent-purple2)':'var(--text-muted)'};
                font-size:0.75rem;font-weight:600;cursor:pointer;font-family:inherit;
              ">${f}</button>
            `).join('')}
          </div>
          <select style="
            background:var(--bg-card);border:1px solid var(--border-color);
            color:var(--text-primary);border-radius:var(--radius-md);
            padding:0.4rem 0.75rem;font-size:0.8rem;font-family:inherit;cursor:pointer;outline:none;
          ">
            <option>Mới nhất</option><option>A → Z</option><option>Cần ôn nhất</option>
          </select>
        </div>

        <!-- Vocab table -->
        <div class="card" style="padding:0;overflow:hidden;">
          <table style="width:100%;border-collapse:collapse;">
            <thead>
              <tr style="background:var(--bg-secondary);border-bottom:1px solid var(--border-color);">
                <th style="padding:0.875rem 1.25rem;text-align:left;font-size:0.75rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.05em;">Từ / Phiên âm</th>
                <th style="padding:0.875rem 1rem;text-align:left;font-size:0.75rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.05em;">Nghĩa</th>
                <th style="padding:0.875rem 1rem;text-align:left;font-size:0.75rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.05em;">Ví dụ</th>
                <th style="padding:0.875rem 1rem;text-align:center;font-size:0.75rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.05em;">Cấp độ</th>
                <th style="padding:0.875rem 1rem;text-align:center;font-size:0.75rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.05em;">Trạng thái</th>
                <th style="padding:0.875rem 1rem;text-align:right;font-size:0.75rem;font-weight:700;color:var(--text-muted);">⋯</th>
              </tr>
            </thead>
            <tbody>
              ${myWords.map((w, i) => `
                <tr style="border-bottom:1px solid var(--border-subtle);transition:background 0.15s;" 
                    onmouseover="this.style.background='var(--bg-secondary)'"
                    onmouseout="this.style.background='transparent'">
                  <td style="padding:0.875rem 1.25rem;">
                    <div style="font-weight:700;font-size:0.9rem;color:var(--text-primary);">${w.word}</div>
                    <div style="font-size:0.72rem;color:var(--text-muted);margin-top:0.15rem;">${w.phonetic}</div>
                  </td>
                  <td style="padding:0.875rem 1rem;font-size:0.82rem;color:var(--text-secondary);max-width:160px;">${w.meaning}</td>
                  <td style="padding:0.875rem 1rem;font-size:0.78rem;color:var(--text-muted);max-width:220px;font-style:italic;">"${w.example}"</td>
                  <td style="padding:0.875rem 1rem;text-align:center;">
                    <span style="
                      font-size:0.65rem;font-weight:800;padding:0.2rem 0.5rem;border-radius:4px;
                      background:${w.level==='C1'?'rgba(245,158,11,0.2)':w.level==='B2'?'rgba(59,130,246,0.2)':'rgba(16,185,129,0.2)'};
                      color:${w.level==='C1'?'#f59e0b':w.level==='B2'?'#60a5fa':'#34d399'};
                    ">${w.level}</span>
                  </td>
                  <td style="padding:0.875rem 1rem;text-align:center;">
                    ${w.learned
                      ? `<span style="font-size:0.72rem;color:var(--accent-green);font-weight:600;">✓ Đã thuộc</span>`
                      : `<span style="font-size:0.72rem;color:var(--accent-orange);font-weight:600;">⟳ ${w.reviewDate}</span>`
                    }
                  </td>
                  <td style="padding:0.875rem 1rem;text-align:right;">
                    <button style="background:transparent;border:none;color:var(--text-muted);cursor:pointer;font-size:1rem;padding:0.25rem 0.5rem;border-radius:var(--radius-sm);transition:color 0.15s;"
                      onmouseover="this.style.color='var(--text-primary)'" onmouseout="this.style.color='var(--text-muted)'">🔊</button>
                    <button style="background:transparent;border:none;color:var(--text-muted);cursor:pointer;font-size:1rem;padding:0.25rem 0.5rem;border-radius:var(--radius-sm);transition:color 0.15s;"
                      onmouseover="this.style.color='var(--accent-red)'" onmouseout="this.style.color='var(--text-muted)'">🗑</button>
                  </td>
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
