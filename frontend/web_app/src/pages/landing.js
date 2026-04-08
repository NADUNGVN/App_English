// ── Landing Page ──
export async function renderLanding() {
  return `
  <div class="page-landing">
    <!-- Navbar -->
    <nav class="navbar" id="navbar">
      <div class="navbar-brand">
        <div class="logo-icon">S</div>
        S English
      </div>

      <ul class="navbar-links">
        <li><a href="#" >Trang Chủ</a></li>
        <li><a href="#features">Nâng Cấp</a></li>
        <li><a href="#about">Về chúng tôi</a></li>
      </ul>

      <div class="navbar-actions">
        <button class="btn btn-ghost btn-sm">🌐 EN</button>
        <button class="btn btn-ghost btn-sm">🌙</button>
        <button class="btn btn-outline btn-sm" data-link="/login">Thêm vào Edge</button>
        <button class="btn btn-primary btn-sm" data-link="/login">Đăng nhập</button>
      </div>
    </nav>

    <!-- Hero -->
    <section class="hero">
      <div class="hero-content animate-fade-up">
        <div class="hero-badge">
          <span class="badge badge-purple">⚡ Học tiếng Anh chủ động</span>
          <span class="badge badge-green">🎁 Trải nghiệm miễn phí</span>
        </div>

        <h1 class="hero-title">
          Học tiếng Anh<br>
          <span class="highlight-purple">thú vị và hiệu</span><br>
          <span class="highlight-pink">quả</span> hơn mỗi<br>
          ngày
        </h1>

        <p class="hero-desc">
          Luyện <strong>Dictation</strong> &amp; <strong>Shadowing</strong> cùng các bài học Audio,
          Youtube tuyển chọn, học cùng <strong>AI</strong>, tra từ tức thì và dịch thuật
          trên mọi website với <span class="link-styled">Browser Extension</span> — tất cả gói gọn
          trong một đăng ký.
        </p>

        <div class="hero-actions">
          <button class="btn btn-primary btn-lg" data-link="/dashboard">
            🚀 Học miễn phí ngay
          </button>
          <button class="btn btn-outline btn-lg">
            🔷 Thêm vào Chrome
          </button>
        </div>

        <div class="hero-features">
          <div class="feature-item">
            <span class="check">✅</span>
            Học tiếng Anh thực tế qua YouTube videos và các bài học audio
          </div>
          <div class="feature-item">
            <span class="check">✅</span>
            AI Chat, Từ điển &amp; Dịch thuật tức thì trên mọi trang web với Browser Extension
          </div>
          <div class="feature-item">
            <span class="check">✅</span>
            Hoàn toàn miễn phí **
          </div>
        </div>

        <div class="hero-rating">
          <span class="stars">★★★★★</span>
          <div>
            <div style="font-size:0.85rem;font-weight:700;color:var(--text-primary)">5.0</div>
            <div class="rating-text">trên Chrome Web Store · 1000+ người dùng sử dụng hàng ngày</div>
          </div>
        </div>
      </div>

      <!-- Preview Window -->
      <div class="hero-preview animate-fade-up delay-2">
        <div class="preview-window animate-float">
          <div class="preview-topbar">
            <div class="preview-dots">
              <span></span><span></span><span></span>
            </div>
            <div class="preview-url">senglish.net</div>
          </div>
          <div class="preview-body">
            <div style="display:flex;gap:0.75rem;align-items:flex-start;">
              <!-- Mini video -->
              <div style="flex:1.4">
                <div style="background:var(--bg-primary);border-radius:8px;overflow:hidden;aspect-ratio:16/9;display:flex;align-items:center;justify-content:center;position:relative;">
                  <div style="font-size:3rem">🎬</div>
                  <!-- Video controls mock -->
                  <div style="position:absolute;bottom:0;left:0;right:0;padding:0.5rem;background:linear-gradient(transparent,rgba(0,0,0,0.8));">
                    <div style="display:flex;align-items:center;gap:0.5rem;">
                      <div style="width:10px;height:10px;background:var(--accent-purple);border-radius:50%;cursor:pointer;"></div>
                      <div style="flex:1;height:3px;background:rgba(255,255,255,0.2);border-radius:2px;">
                        <div style="width:35%;height:100%;background:var(--accent-purple);border-radius:2px;"></div>
                      </div>
                      <span style="font-size:0.6rem;color:rgba(255,255,255,0.7)">2:15</span>
                    </div>
                  </div>
                </div>
                <!-- Subtitle line -->
                <div style="padding:0.625rem 0.5rem;background:var(--bg-secondary);margin-top:0.25rem;border-radius:6px;">
                  <div style="font-size:0.72rem;color:var(--text-primary);margin-bottom:0.25rem;">
                    Hi im ben Im here to learn English
                  </div>
                  <div style="display:flex;gap:0.25rem;flex-wrap:wrap;">
                    ${['Phú đề','Chậm lại','Nhanh','Từ','B2','Dịch','Kiểu','English'].map(t => 
                      `<span style="font-size:0.6rem;padding:0.1rem 0.35rem;background:var(--bg-card);border-radius:4px;color:var(--text-secondary)">${t}</span>`
                    ).join('')}
                  </div>
                </div>
              </div>

              <!-- Dictation panel -->
              <div style="flex:1;background:var(--bg-secondary);border-radius:8px;padding:0.625rem;font-size:0.65rem;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem;">
                  <span style="color:var(--text-muted)">Tả đề</span>
                  <label style="display:flex;align-items:center;gap:0.25rem;cursor:pointer;">
                    <div style="width:24px;height:12px;background:var(--accent-purple);border-radius:6px;"></div>
                  </label>
                </div>
                <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.375rem;">
                  <div style="width:10px;height:10px;background:rgba(255,255,255,0.1);border-radius:2px;"></div>
                  <span style="color:rgba(255,255,255,0.2)">[ - ]</span>
                </div>
                ${[70,40,0,0,0].map(w => `
                  <div style="height:3px;background:rgba(255,255,255,${w ? '0.1' :'0.04'});border-radius:2px;margin-bottom:0.375rem;width:${w || 30}%"></div>
                `).join('')}
                <div style="margin-top:0.75rem;display:flex;justify-content:flex-end;">
                  <button style="background:var(--accent-purple);color:white;border:none;border-radius:4px;padding:0.2rem 0.5rem;font-size:0.6rem;cursor:pointer;">
                    Tiếp → 1
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Floating badge -->
        <div style="position:absolute;top:-1rem;right:-1rem;background:linear-gradient(135deg,var(--accent-purple),var(--accent-pink));border-radius:12px;padding:0.5rem 0.875rem;font-size:0.75rem;font-weight:700;color:white;box-shadow:var(--shadow-glow-purple);">
          🔥 1000+ học viên
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="section" id="features">
      <div class="section-header animate-fade-up">
        <span class="section-eyebrow">✦ Tính năng nổi bật</span>
        <h2 class="section-title-large">Tất cả công cụ học tiếng Anh<br>trong một nơi</h2>
        <p class="section-desc">Từ luyện nghe, luyện nói đến từ vựng và dịch thuật — mọi thứ bạn cần để học tiếng Anh hiệu quả.</p>
      </div>

      <div class="features-grid">
        ${[
          { icon: '🎧', color: 'purple', title: 'Dictation', desc: 'Luyện nghe và chép chính tả theo video YouTube. Cải thiện khả năng nghe và chính tả hiệu quả.' },
          { icon: '🎤', color: 'pink',   title: 'Shadowing',  desc: 'Luyện phát âm bằng cách đọc theo người bản xứ. Cải thiện giọng nói và tốc độ nói.' },
          { icon: '📚', color: 'cyan',   title: 'Thư Viện',   desc: 'Hơn 500+ video bài học được tuyển chọn từ BBC, CNN, YouTube. Học từ nội dung thực tế.' },
          { icon: '📝', color: 'green',  title: 'Từ Vựng',    desc: 'Lưu và ôn tập từ vựng cá nhân với flashcard thông minh. Học từ vựng trong ngữ cảnh thực.' },
          { icon: '🤖', color: 'orange', title: 'AI Chat',     desc: 'Luyện hội thoại cùng AI 24/7. Nhận phản hồi tức thì về ngữ pháp và cách dùng từ.' },
          { icon: '🔌', color: 'blue',   title: 'Extension',  desc: 'Tra từ và dịch thuật tức thì trên mọi trang web. Học tiếng Anh mọi lúc, mọi nơi.' },
        ].map(f => `
          <div class="feature-card">
            <div class="feature-icon ${f.color}">${f.icon}</div>
            <h3>${f.title}</h3>
            <p>${f.desc}</p>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- Stats Banner -->
    <div style="background:var(--bg-secondary);border-top:1px solid var(--border-subtle);border-bottom:1px solid var(--border-subtle);padding:2.5rem;">
      <div style="max-width:900px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);gap:2rem;text-align:center;">
        ${[
          { value: '1000+',  label: 'Người dùng' },
          { value: '500+',   label: 'Video bài học' },
          { value: '50,000+', label: 'Từ vựng học' },
          { value: '5.0 ⭐', label: 'Rating Chrome Store' },
        ].map(s => `
          <div>
            <div style="font-size:1.75rem;font-weight:900;background:linear-gradient(135deg,var(--accent-purple2),var(--accent-pink));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">${s.value}</div>
            <div style="font-size:0.8rem;color:var(--text-muted);margin-top:0.25rem;">${s.label}</div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- CTA -->
    <div class="cta-section">
      <h2>Bắt đầu học ngay hôm nay</h2>
      <p>Tham gia cùng 1000+ học viên đang cải thiện tiếng Anh mỗi ngày với S English</p>
      <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;position:relative;">
        <button class="btn btn-primary btn-lg" data-link="/register">🚀 Đăng ký miễn phí</button>
        <button class="btn btn-outline btn-lg" data-link="/dashboard">👀 Xem demo</button>
      </div>
    </div>

    <!-- Footer -->
    <footer class="footer">
      <div class="navbar-brand" style="justify-content:center;margin-bottom:1rem;">
        <div class="logo-icon">S</div>
        S English
      </div>
      <p class="footer-text">© 2026 S English. Học tiếng Anh thú vị và hiệu quả hơn mỗi ngày.</p>
    </footer>
  </div>
  `;
}
