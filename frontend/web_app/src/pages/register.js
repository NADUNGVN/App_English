// ── Register Page ──
export async function renderRegister() {
  return `
  <div class="page-auth">
    <div class="auth-card animate-fade-up">
      <div class="auth-logo">
        <div class="logo-mark">S</div>
        <h2>Tạo tài khoản</h2>
        <p>Bắt đầu hành trình học tiếng Anh miễn phí</p>
      </div>

      <button class="social-btn">
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Đăng ký với Google
      </button>

      <div class="divider">hoặc</div>

      <form id="register-form">
        <div class="form-group">
          <label class="form-label" for="reg-name">Họ và tên</label>
          <input class="form-input" id="reg-name" type="text" placeholder="Nguyễn Văn A" required />
        </div>
        <div class="form-group">
          <label class="form-label" for="reg-email">Email</label>
          <input class="form-input" id="reg-email" type="email" placeholder="name@example.com" required />
        </div>
        <div class="form-group">
          <label class="form-label" for="reg-password">Mật khẩu</label>
          <input class="form-input" id="reg-password" type="password" placeholder="Ít nhất 8 ký tự" required />
          <!-- Strength meter -->
          <div style="display:flex;gap:4px;margin-top:0.5rem;">
            <div id="str-1" style="flex:1;height:3px;background:var(--border-color);border-radius:2px;transition:background 0.3s;"></div>
            <div id="str-2" style="flex:1;height:3px;background:var(--border-color);border-radius:2px;transition:background 0.3s;"></div>
            <div id="str-3" style="flex:1;height:3px;background:var(--border-color);border-radius:2px;transition:background 0.3s;"></div>
            <div id="str-4" style="flex:1;height:3px;background:var(--border-color);border-radius:2px;transition:background 0.3s;"></div>
          </div>
        </div>

        <!-- Daily goal -->
        <div class="form-group">
          <label class="form-label">Mục tiêu học mỗi ngày</label>
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:0.5rem;">
            ${[
              { val: '5',  label: '5 phút',  emoji: '🌱' },
              { val: '10', label: '10 phút', emoji: '🔥', active: true },
              { val: '15', label: '15 phút', emoji: '⚡' },
              { val: '20', label: '20 phút', emoji: '🚀' },
            ].map(g => `
              <label class="goal-option ${g.active ? 'active' : ''}" style="
                background:${g.active ? 'rgba(124,58,237,0.15)' : 'var(--bg-secondary)'};
                border:1px solid ${g.active ? 'var(--accent-purple)' : 'var(--border-color)'};
                border-radius:var(--radius-md);padding:0.625rem 0.25rem;
                text-align:center;cursor:pointer;transition:all 0.2s;
              ">
                <input type="radio" name="daily-goal" value="${g.val}" ${g.active ? 'checked' : ''} style="display:none;" />
                <div style="font-size:1.25rem;">${g.emoji}</div>
                <div style="font-size:0.7rem;font-weight:600;color:${g.active ? 'var(--accent-purple2)' : 'var(--text-secondary)'};">${g.label}</div>
              </label>
            `).join('')}
          </div>
        </div>

        <div style="display:flex;align-items:flex-start;gap:0.5rem;margin-bottom:1.25rem;">
          <input type="checkbox" id="accept-terms" style="accent-color:var(--accent-purple);width:14px;height:14px;cursor:pointer;margin-top:2px;" required />
          <label for="accept-terms" style="font-size:0.78rem;color:var(--text-secondary);cursor:pointer;line-height:1.5;">
            Tôi đồng ý với <a href="#" style="color:var(--accent-purple2)">Điều khoản dịch vụ</a> 
            và <a href="#" style="color:var(--accent-purple2)">Chính sách bảo mật</a>
          </label>
        </div>

        <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;padding:0.875rem;">
          🚀 Tạo tài khoản miễn phí
        </button>
      </form>

      <div class="form-footer">
        Đã có tài khoản? <a href="#" data-link="/login">Đăng nhập</a>
      </div>
    </div>
  </div>
  `;
}
