// ── QuackUp Landing Page (v2) ──
// Features: real logos, EN/VI toggle, black-block fix, clean CTA buttons

export async function renderLanding() {

  // ── i18n helper – wrap text in language spans ──
  // When data-lang="vi" → .t-vi shown, .t-en hidden (and vice versa)
  const vi = (text) => `<span class="t-vi">${text}</span>`;
  const en = (text) => `<span class="t-en">${text}</span>`;
  const t  = (viText, enText) => `${vi(viText)}${en(enText)}`;

  return `
  <div class="qk-page" id="quackup-landing" data-lang="vi">

    <!-- ══════════════════════════════════════════
         HEADER
    ══════════════════════════════════════════ -->
    <header class="qk-header" id="qk-header">
      <div class="qk-header-inner">

        <!-- Logo: uses real QuackUp logo image -->
        <a class="qk-logo" data-link="/" aria-label="QuackUp Home">
          <img src="/quackup-logo.png" alt="QuackUp" class="qk-logo-img" />
        </a>

        <!-- Nav Links -->
        <nav class="qk-nav" id="qk-nav">
          <a href="#how-it-works" class="qk-nav-link">${t('Cách hoạt động', 'How It Works')}</a>
          <a href="#features"     class="qk-nav-link">${t('Tính năng', 'Features')}</a>
          <a href="#about"        class="qk-nav-link">${t('Giới thiệu', 'About')}</a>
          <a href="mailto:support@quackup.app" class="qk-nav-link">${t('Liên hệ', 'Contact')}</a>
        </nav>

        <!-- Actions -->
        <div class="qk-header-actions">
          <!-- Language Toggle -->
          <button class="qk-lang-btn" id="qk-lang-btn" aria-label="Switch language">
            <span class="t-vi">🌐 EN</span>
            <span class="t-en">🌐 VI</span>
          </button>

          <button class="qk-btn qk-btn-ghost" data-link="/login">
            ${t('Đăng nhập', 'Login')}
          </button>
          <button class="qk-btn qk-btn-primary" data-link="/register">
            ${t('Bắt đầu miễn phí', 'Get Started Free')}
          </button>

          <!-- Mobile hamburger -->
          <button class="qk-hamburger" id="qk-hamburger" aria-label="Menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </header>

    <!-- ══════════════════════════════════════════
         BODY
    ══════════════════════════════════════════ -->
    <main class="qk-main">

      <!-- ── 1. HERO ── -->
      <section class="qk-hero" id="hero">
        <div class="qk-blob qk-blob-1"></div>
        <div class="qk-blob qk-blob-2"></div>
        <div class="qk-blob qk-blob-3"></div>

        <div class="qk-hero-inner">
          <!-- Left: Text content -->
          <div class="qk-hero-content">
            <div class="qk-hero-badge">
              <span class="qk-dot"></span>
              ${t('Hoàn toàn miễn phí · Free forever', 'Completely Free · Forever')}
            </div>

            <h1 class="qk-hero-title">
              ${t('Crack the Code,<br><span class="qk-gradient-text">Quack the Language.</span>',
                  'Crack the Code,<br><span class="qk-gradient-text">Quack the Language.</span>')}
            </h1>

            <p class="qk-hero-tagline">
              ${t('Phá vỡ rào cản, tự tin nói tiếng Anh',
                  'Break barriers, speak English with confidence')}
            </p>

            <p class="qk-hero-desc">
              ${t(
                'Học tiếng Anh giao tiếp qua phương pháp <strong>Dictation</strong> và <strong>Shadowing</strong> với video thực tế. Lộ trình từ IPA cơ bản đến IELTS/TOEIC — rõ ràng, hiệu quả, và vui.',
                'Master conversational English through <strong>Dictation</strong> and <strong>Shadowing</strong> with real videos. A clear roadmap from IPA basics to IELTS/TOEIC — effective and fun.'
              )}
            </p>

            <div class="qk-hero-actions">
              <button class="qk-btn qk-btn-primary qk-btn-lg" data-link="/register">
                ${t('Học miễn phí ngay', 'Start Learning Free')}
              </button>
              <button class="qk-btn qk-btn-outline qk-btn-lg" id="qk-watch-demo">
                ▶ ${t('Xem demo', 'Watch Demo')}
              </button>
            </div>

            <!-- Trust signals -->
            <div class="qk-hero-trust">
              <div class="qk-trust-item">
                <span class="qk-trust-icon">✅</span>
                <span>${t('Không cần thẻ tín dụng', 'No credit card required')}</span>
              </div>
              <div class="qk-trust-item">
                <span class="qk-trust-icon">✅</span>
                <span>${t('Lộ trình học rõ ràng', 'Structured learning path')}</span>
              </div>
              <div class="qk-trust-item">
                <span class="qk-trust-icon">✅</span>
                <span>${t('Video thực tế từ BBC, CNN, TED', 'Real videos from BBC, CNN, TED')}</span>
              </div>
            </div>
          </div>

          <!-- Right: Duck mascot + floating cards -->
          <div class="qk-hero-visual">
            <div class="qk-mascot-wrap">
              <div class="qk-mascot-glow"></div>
              <!-- Generated duck mascot with transparent background -->
              <div class="qk-mascot-card qk-float">
                <img src="/quackup-mascot.png" alt="QuackUp Duck Mascot" class="qk-mascot-img" />
              </div>
            </div>

            <!-- Floating stat cards -->
            <div class="qk-float-card qk-float-card-1 qk-float-slow">
              <span class="qk-float-icon">🔥</span>
              <div>
                <div class="qk-float-val">${t('7 ngày', '7 Days')}</div>
                <div class="qk-float-sub">${t('Streak liên tiếp', 'Streak')}</div>
              </div>
            </div>

            <div class="qk-float-card qk-float-card-2 qk-float">
              <span class="qk-float-icon">⭐</span>
              <div>
                <div class="qk-float-val">+240 XP</div>
                <div class="qk-float-sub">${t('Tuần này', 'This week')}</div>
              </div>
            </div>

            <div class="qk-float-card qk-float-card-3 qk-float-slow">
              <span class="qk-float-icon">📖</span>
              <div>
                <div class="qk-float-val">${t('52 từ', '52 Words')}</div>
                <div class="qk-float-sub">${t('Từ vựng đã học', 'Vocabulary learned')}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Wave divider -->
        <div class="qk-wave">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#f9fafb"/>
          </svg>
        </div>
      </section>

      <!-- ── 2. HOW IT WORKS ── -->
      <section class="qk-section qk-how" id="how-it-works">
        <div class="qk-container">
          <div class="qk-section-header">
            <span class="qk-eyebrow">✦ ${t('Đơn giản &amp; Hiệu quả', 'Simple &amp; Effective')}</span>
            <h2 class="qk-section-title">
              ${t('Bắt đầu chỉ trong <span class="qk-gradient-text">3 bước</span>',
                  'Get started in just <span class="qk-gradient-text">3 steps</span>')}
            </h2>
            <p class="qk-section-desc">
              ${t('Không cần kinh nghiệm, không cần thời gian nhiều.<br>15 phút mỗi ngày là đủ để tạo ra sự thay đổi thật sự.',
                  'No experience needed, no big time commitment.<br>Just 15 minutes a day to make a real difference.')}
            </p>
          </div>

          <div class="qk-steps">
            <!-- Step 1 -->
            <div class="qk-step">
              <div class="qk-step-num">01</div>
              <div class="qk-step-icon-wrap"><span class="qk-step-icon">🦆</span></div>
              <h3 class="qk-step-title">${t('Tạo tài khoản miễn phí', 'Create a free account')}</h3>
              <p class="qk-step-desc">${t('Đăng ký trong vòng 30 giây. Không cần thẻ tín dụng.', 'Sign up in 30 seconds. No credit card needed.')}</p>
            </div>

            <div class="qk-step-arrow">→</div>

            <!-- Step 2 -->
            <div class="qk-step">
              <div class="qk-step-num">02</div>
              <div class="qk-step-icon-wrap"><span class="qk-step-icon">🎯</span></div>
              <h3 class="qk-step-title">${t('Chọn lộ trình của bạn', 'Pick your learning path')}</h3>
              <p class="qk-step-desc">${t('Từ IPA cơ bản đến IELTS/TOEIC — chọn điểm xuất phát phù hợp với bạn.', 'From IPA basics to IELTS/TOEIC — start where you belong.')}</p>
            </div>

            <div class="qk-step-arrow">→</div>

            <!-- Step 3 -->
            <div class="qk-step">
              <div class="qk-step-num">03</div>
              <div class="qk-step-icon-wrap"><span class="qk-step-icon">📈</span></div>
              <h3 class="qk-step-title">${t('Luyện tập mỗi ngày', 'Practice every day')}</h3>
              <p class="qk-step-desc">${t('Dictation, Shadowing, Từ vựng — 15 phút mỗi ngày tạo ra sự thay đổi lớn.', 'Dictation, Shadowing, Vocab — 15 mins daily makes a big difference.')}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ── 3. FEATURES ── -->
      <section class="qk-section qk-features" id="features">
        <div class="qk-container">
          <div class="qk-section-header">
            <span class="qk-eyebrow">✦ ${t('Tính năng nổi bật', 'What You Get')}</span>
            <h2 class="qk-section-title">
              ${t('Mọi công cụ bạn cần để<br><span class="qk-gradient-text">thành thạo tiếng Anh</span>',
                  'Everything you need to<br><span class="qk-gradient-text">master English</span>')}
            </h2>
            <p class="qk-section-desc">
              ${t('Từ luyện nghe, luyện nói đến từ vựng và lộ trình học chuẩn hoá — tất cả trong một nền tảng duy nhất.',
                  'Listening, speaking, vocabulary and a structured roadmap — all in one platform.')}
            </p>
          </div>

          <div class="qk-features-grid">

            <div class="qk-feat-card qk-feat-amber">
              <div class="qk-feat-header">
                <div class="qk-feat-icon">🎧</div>
                <span class="qk-feat-tag">${t('Luyện Nghe', 'Listening')}</span>
              </div>
              <h3 class="qk-feat-title">Dictation</h3>
              <p class="qk-feat-desc">${t('Nghe video thực tế, gõ lại nội dung nghe được. Phụ đề song ngữ giúp bạn hiểu từng từ.', 'Listen to real YouTube videos, pause and type what you hear. Bilingual subtitles help you understand every word.')}</p>
              <div class="qk-feat-footer"><span class="qk-feat-more">${t('Tìm hiểu thêm', 'Learn more')} →</span></div>
            </div>

            <div class="qk-feat-card qk-feat-teal">
              <div class="qk-feat-header">
                <div class="qk-feat-icon">🎤</div>
                <span class="qk-feat-tag">${t('Luyện Nói', 'Speaking')}</span>
              </div>
              <h3 class="qk-feat-title">Shadowing</h3>
              <p class="qk-feat-desc">${t('Đọc theo người bản ngữ từng câu. Cải thiện phát âm, nhịp điệu và độ lưu loát.', 'Repeat after native speakers line by line. Train your accent, rhythm and fluency naturally.')}</p>
              <div class="qk-feat-footer"><span class="qk-feat-more">${t('Tìm hiểu thêm', 'Learn more')} →</span></div>
            </div>

            <div class="qk-feat-card qk-feat-amber">
              <div class="qk-feat-header">
                <div class="qk-feat-icon">📝</div>
                <span class="qk-feat-tag">${t('Từ Vựng', 'Vocabulary')}</span>
              </div>
              <h3 class="qk-feat-title">${t('Từ Vựng Thông Minh', 'Smart Vocab')}</h3>
              <p class="qk-feat-desc">${t('Lưu từ mới ngay khi học. Tạo bài kiểm tra cá nhân và ôn tập theo lịch trình khoa học.', 'Save new words while learning. Create personalized quizzes and review with spaced repetition.')}</p>
              <div class="qk-feat-footer"><span class="qk-feat-more">${t('Tìm hiểu thêm', 'Learn more')} →</span></div>
            </div>

            <div class="qk-feat-card qk-feat-teal">
              <div class="qk-feat-header">
                <div class="qk-feat-icon">🗺️</div>
                <span class="qk-feat-tag">${t('Lộ Trình', 'Roadmap')}</span>
              </div>
              <h3 class="qk-feat-title">${t('Lộ Trình Rõ Ràng', 'Structured Path')}</h3>
              <p class="qk-feat-desc">${t('Bắt đầu từ IPA cơ bản, tăng dần lên IELTS/TOEIC. Học có hệ thống, không lạc đường.', 'Start from IPA basics and level up step by step to IELTS/TOEIC readiness. Never get lost.')}</p>
              <div class="qk-feat-footer"><span class="qk-feat-more">${t('Tìm hiểu thêm', 'Learn more')} →</span></div>
            </div>

          </div>

          <!-- Inline CTA -->
          <div class="qk-features-cta">
            <p>${t('Sẵn sàng bắt đầu hành trình của bạn?', 'Ready to start your journey?')}</p>
            <button class="qk-btn qk-btn-primary qk-btn-lg" data-link="/register">
              ${t('Bắt đầu miễn phí ngay', 'Start Free Today')}
            </button>
          </div>
        </div>
      </section>

    </main>

    <!-- ══════════════════════════════════════════
         FOOTER
    ══════════════════════════════════════════ -->
    <footer class="qk-footer" id="qk-footer">
      <div class="qk-footer-inner">

        <!-- Col 1: Brand -->
        <div class="qk-footer-brand">
          <div class="qk-footer-logo">
            <img src="/quackup-logo.png" alt="QuackUp" class="qk-footer-logo-img" />
          </div>
          <p class="qk-footer-brand-desc">
            ${t(
              'Nền tảng học tiếng Anh giao tiếp. Luyện tập với video thực tế, phương pháp Dictation &amp; Shadowing và lộ trình học rõ ràng từ cơ bản đến IELTS/TOEIC.',
              'Your conversational English learning platform. Practice with real videos using Dictation &amp; Shadowing with a clear roadmap from basics to IELTS/TOEIC.'
            )}
          </p>
          <a href="mailto:support@quackup.app" class="qk-footer-email">
            ✉ support@quackup.app
          </a>
        </div>

        <!-- Col 2 -->
        <div class="qk-footer-col">
          <h4 class="qk-footer-col-title">${t('SẢN PHẨM', 'PRODUCT')}</h4>
          <ul class="qk-footer-links">
            <li><a href="#features">${t('Tính năng', 'Features')}</a></li>
            <li><a href="#how-it-works">${t('Lộ trình học', 'Learning path')}</a></li>
            <li><a href="#" data-link="/vocabulary">${t('Từ vựng', 'Vocabulary')}</a></li>
            <li><a href="#" data-link="/dictionary">${t('Từ điển', 'Dictionary')}</a></li>
          </ul>
        </div>

        <!-- Col 3 -->
        <div class="qk-footer-col">
          <h4 class="qk-footer-col-title">${t('TÀI NGUYÊN', 'RESOURCES')}</h4>
          <ul class="qk-footer-links">
            <li><a href="#about">${t('Về chúng tôi', 'About us')}</a></li>
            <li><a href="mailto:support@quackup.app">${t('Liên hệ', 'Contact')}</a></li>
            <li><a href="#">Blog</a></li>
          </ul>
        </div>

        <!-- Col 4 -->
        <div class="qk-footer-col">
          <h4 class="qk-footer-col-title">${t('PHÁP LÝ', 'LEGAL')}</h4>
          <ul class="qk-footer-links">
            <li><a href="#">${t('Chính sách bảo mật', 'Privacy Policy')}</a></li>
            <li><a href="#">${t('Điều khoản &amp; Điều kiện', 'Terms &amp; Conditions')}</a></li>
          </ul>
        </div>

      </div>

      <!-- Footer bottom bar -->
      <div class="qk-footer-bottom">
        <span>© 2026 QuackUp. ${t('Bảo lưu mọi quyền.', 'All rights reserved.')}</span>
        <span class="qk-footer-love">From QuackUp With 🦆</span>
      </div>
    </footer>

  </div>

  <script>
  (function() {
    // ── FIX: Override dark body background ──
    document.body.style.background = '#ffffff';
    document.body.style.overflowX = 'hidden';
    const rootEl = document.getElementById('root');
    if (rootEl) {
      rootEl.style.background = '#ffffff';
      rootEl.style.display = 'block';
      rootEl.style.height = 'auto';
      rootEl.style.overflow = 'visible';
    }

    // ── Sticky header ──
    const header = document.getElementById('qk-header');
    if (header) {
      window.addEventListener('scroll', () => {
        header.classList.toggle('qk-header-scrolled', window.scrollY > 60);
      });
    }

    // ── Mobile hamburger ──
    const ham = document.getElementById('qk-hamburger');
    const nav = document.getElementById('qk-nav');
    if (ham && nav) {
      ham.addEventListener('click', () => {
        ham.classList.toggle('open');
        nav.classList.toggle('open');
      });
    }

    // ── Smooth scroll for anchor links ──
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // ── Language Toggle ──
    const page = document.getElementById('quackup-landing');
    const langBtn = document.getElementById('qk-lang-btn');
    let currentLang = localStorage.getItem('qk-lang') || 'vi';

    function applyLang(lang) {
      if (!page) return;
      page.dataset.lang = lang;
      currentLang = lang;
      localStorage.setItem('qk-lang', lang);
    }

    // Apply stored language on load
    applyLang(currentLang);

    if (langBtn) {
      langBtn.addEventListener('click', () => {
        applyLang(currentLang === 'vi' ? 'en' : 'vi');
      });
    }

    // ── Scroll-based animate-in ──
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('qk-visible');
          e.target.classList.remove('qk-anim');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.qk-step, .qk-feat-card').forEach(el => {
      el.classList.add('qk-anim');
      observer.observe(el);
    });

    // ── Cleanup: reset body when leaving landing ──
    const cleanup = () => {
      document.body.style.background = '';
      document.body.style.overflowX = '';
      if (rootEl) {
        rootEl.style.background = '';
        rootEl.style.display = '';
        rootEl.style.height = '';
        rootEl.style.overflow = '';
      }
    };
    // Watch for SPA navigation (when landing is removed from DOM)
    const mutObs = new MutationObserver(() => {
      if (!document.getElementById('quackup-landing')) {
        cleanup();
        mutObs.disconnect();
      }
    });
    if (rootEl) mutObs.observe(rootEl, { childList: true, subtree: false });
  })();
  </script>
  `;
}
