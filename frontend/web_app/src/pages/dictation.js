import { renderSidebar } from '../components/Sidebar.js';

export async function renderDictation() {
  const lesson = {
    title: 'Saving water in the driest place on Earth',
    source: 'BBC Learning English · B2',
    duration: '6:14',
    currentTime: '2:08',
    progress: 34,
    subtitle: 'Hi, I\'m Ben. Welcome back to 6 Minute English from BBC Learning English.',
    words: ['Hi,','I\'m','Ben.','Welcome','back','to','6','Minute','English','from','BBC','Learning','English.'],
  };

  return `
  <div class="page-app">
    ${renderSidebar('dictation')}
    <main class="main-content">
      <div class="content-scroll">

        <div class="dashboard-header">
          <h1 class="dashboard-greeting">Dictation 🎧</h1>
          <p class="dashboard-subtitle">Luyện nghe - chép chính tả theo video</p>
        </div>

        <!-- Main dictation layout -->
        <div style="display:grid;grid-template-columns:1fr 280px;gap:1.25rem;">

          <!-- Left: video + dictation -->
          <div style="display:flex;flex-direction:column;gap:1rem;">

            <!-- Video player mock -->
            <div class="card" style="padding:0;overflow:hidden;">
              <div style="
                background:linear-gradient(135deg,#1e3a5f,#1a1a35);
                aspect-ratio:16/9;display:flex;align-items:center;justify-content:center;
                position:relative;
              ">
                <div style="font-size:5rem;opacity:0.3;">🎬</div>
                <!-- Play button -->
                <div style="
                  position:absolute;
                  width:4rem;height:4rem;border-radius:50%;
                  background:rgba(124,58,237,0.9);
                  display:flex;align-items:center;justify-content:center;
                  cursor:pointer;box-shadow:0 0 30px rgba(124,58,237,0.5);
                  transition:transform 0.2s;
                " id="dictation-play" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21"/></svg>
                </div>
                <!-- Subtitle overlay -->
                <div style="
                  position:absolute;bottom:1rem;left:50%;transform:translateX(-50%);
                  background:rgba(0,0,0,0.75);backdrop-filter:blur(4px);
                  padding:0.5rem 1.25rem;border-radius:var(--radius-sm);
                  font-size:0.9rem;color:white;text-align:center;white-space:nowrap;
                ">Hi im ben Im here to learn English</div>
              </div>
              <!-- Controls -->
              <div style="padding:0.75rem 1rem;background:var(--bg-card);">
                <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:0.5rem;">
                  <span style="font-size:0.75rem;color:var(--text-muted);">${lesson.currentTime}</span>
                  <div style="flex:1;height:4px;background:var(--bg-primary);border-radius:2px;cursor:pointer;position:relative;">
                    <div style="width:${lesson.progress}%;height:100%;background:linear-gradient(90deg,var(--accent-purple),var(--accent-pink));border-radius:2px;"></div>
                    <div style="position:absolute;top:50%;left:${lesson.progress}%;transform:translate(-50%,-50%);width:12px;height:12px;background:var(--accent-purple);border-radius:50%;box-shadow:0 0 6px rgba(124,58,237,0.6);"></div>
                  </div>
                  <span style="font-size:0.75rem;color:var(--text-muted);">${lesson.duration}</span>
                </div>
                <div style="display:flex;align-items:center;justify-content:space-between;">
                  <div style="display:flex;gap:0.5rem;">
                    ${['⏮','⏪','⏯','⏩','🔁'].map(btn=>`
                      <button style="background:transparent;border:none;color:var(--text-secondary);cursor:pointer;font-size:1.25rem;padding:0.25rem;border-radius:var(--radius-sm);transition:color 0.15s;"
                        onmouseover="this.style.color='var(--text-primary)'" onmouseout="this.style.color='var(--text-secondary)'">${btn}</button>
                    `).join('')}
                  </div>
                  <div style="display:flex;gap:0.375rem;flex-wrap:wrap;">
                    ${['Phụ đề','Chậm lại','Nhanh','Từ','B2','Dịch','Kiểu','English'].map(t=>`
                      <button style="font-size:0.65rem;padding:0.15rem 0.5rem;border-radius:4px;background:var(--bg-secondary);border:1px solid var(--border-subtle);color:var(--text-muted);cursor:pointer;font-family:inherit;">${t}</button>
                    `).join('')}
                  </div>
                </div>
              </div>
            </div>

            <!-- Dictation input panel -->
            <div class="card">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;">
                <div style="font-weight:700;">Chép lại câu vừa nghe</div>
                <div style="display:flex;align-items:center;gap:0.5rem;">
                  <span style="font-size:0.75rem;color:var(--text-muted);">Hiển thị đáp án</span>
                  <div style="width:36px;height:18px;background:var(--accent-purple);border-radius:9px;cursor:pointer;position:relative;">
                    <div style="position:absolute;right:2px;top:2px;width:14px;height:14px;background:white;border-radius:50%;"></div>
                  </div>
                </div>
              </div>

              <!-- Input boxes -->
              <div style="display:flex;flex-wrap:wrap;gap:0.5rem;margin-bottom:1rem;">
                ${lesson.words.map((w,i) => `
                  <input type="text" 
                    style="
                      width:${Math.max(60, w.length * 10 + 20)}px;
                      background:var(--bg-primary);
                      border:1px solid ${i<3?'var(--accent-green)':i===3?'var(--accent-red)':'var(--border-color)'};
                      border-radius:var(--radius-sm);
                      padding:0.375rem 0.5rem;
                      font-family:inherit;font-size:0.85rem;
                      color:${i<3?'var(--accent-green)':i===3?'var(--accent-red)':'var(--text-primary)'};
                      outline:none;text-align:center;
                    "
                    value="${i<3?w:i===3?'Welcom':''}"
                    placeholder="${i>=3?'...':''}"
                  />
                `).join('')}
              </div>

              <div style="display:flex;justify-content:space-between;align-items:center;">
                <div style="font-size:0.78rem;color:var(--text-muted);">3/13 từ đúng · Câu 2 của 8</div>
                <button class="btn btn-primary btn-sm">Tiếp → Câu 3</button>
              </div>
            </div>
          </div>

          <!-- Right: progress panel -->
          <div style="display:flex;flex-direction:column;gap:1rem;">
            <div class="card">
              <div style="font-weight:700;font-size:0.85rem;margin-bottom:1rem;">${lesson.title.substring(0,40)}...</div>
              <div style="font-size:0.72rem;color:var(--text-muted);margin-bottom:0.875rem;">${lesson.source}</div>

              <!-- Session stats -->
              ${[
                { label:'Câu đúng',   value:'1/8',     color:'var(--accent-green)' },
                { label:'Từ đúng',    value:'3/13',    color:'var(--accent-purple2)' },
                { label:'Độ chính xác', value:'79%',   color:'var(--accent-orange)' },
              ].map(s=>`
                <div style="display:flex;justify-content:space-between;padding:0.5rem 0;border-bottom:1px solid var(--border-subtle);">
                  <span style="font-size:0.78rem;color:var(--text-secondary);">${s.label}</span>
                  <span style="font-size:0.85rem;font-weight:700;color:${s.color};">${s.value}</span>
                </div>
              `).join('')}
            </div>

            <!-- Sentence list -->
            <div class="card">
              <div style="font-weight:700;font-size:0.85rem;margin-bottom:0.75rem;">Danh sách câu</div>
              ${[1,2,3,4,5,6,7,8].map(n=>`
                <div style="
                  display:flex;align-items:center;gap:0.625rem;padding:0.5rem;
                  border-radius:var(--radius-sm);margin-bottom:0.25rem;
                  background:${n===2?'rgba(124,58,237,0.12)':'transparent'};
                  cursor:pointer;transition:background 0.15s;
                " onmouseover="this.style.background='var(--bg-secondary)'" onmouseout="this.style.background='${n===2?'rgba(124,58,237,0.12)':'transparent'}'">
                  <div style="
                    width:1.5rem;height:1.5rem;border-radius:50%;flex-shrink:0;
                    background:${n===1?'var(--accent-green)':n===2?'var(--accent-purple)':'var(--bg-primary)'};
                    display:flex;align-items:center;justify-content:center;
                    font-size:0.65rem;font-weight:700;color:white;
                    border:1px solid ${n>2?'var(--border-color)':'transparent'};
                  ">${n===1?'✓':n}</div>
                  <span style="font-size:0.75rem;color:${n===2?'var(--text-primary)':'var(--text-muted)'};">Câu ${n}</span>
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
