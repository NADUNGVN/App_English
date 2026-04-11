// ── Login Page ──
export async function renderLogin() {
  return `
  <div class="page-auth">
    <div class="auth-card animate-fade-up">
      <div class="auth-logo">
        <div class="logo-mark">S</div>
        <h2>Chào mừng trở lại!</h2>
        <p>Đăng nhập để tiếp tục học tiếng Anh</p>
      </div>

      <!-- Social Login -->
      <button class="social-btn" id="btn-google">
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Tiếp tục với Google
      </button>

      <div class="divider">hoặc</div>

      <!-- Email form -->
      <form id="login-form">
        <div class="form-group">
          <label class="form-label" for="login-email">Email</label>
          <input 
            class="form-input" 
            id="login-email" 
            type="email" 
            placeholder="name@example.com" 
            autocomplete="email"
            required
          />
        </div>

        <div class="form-group">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.375rem;">
            <label class="form-label" for="login-password" style="margin:0">Mật khẩu</label>
            <a href="#" style="font-size:0.75rem;color:var(--accent-purple2);">Quên mật khẩu?</a>
          </div>
          <div style="position:relative;">
            <input 
              class="form-input" 
              id="login-password" 
              type="password" 
              placeholder="••••••••" 
              autocomplete="current-password"
              required
              style="padding-right:2.75rem;"
            />
            <button type="button" id="toggle-pw" style="position:absolute;right:0.75rem;top:50%;transform:translateY(-50%);background:transparent;border:none;cursor:pointer;color:var(--text-muted);font-size:1rem;">
              👁
            </button>
          </div>
        </div>

        <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:1.25rem;">
          <input type="checkbox" id="remember-me" style="accent-color:var(--accent-purple);width:14px;height:14px;cursor:pointer;" />
          <label for="remember-me" style="font-size:0.8rem;color:var(--text-secondary);cursor:pointer;">Ghi nhớ đăng nhập</label>
        </div>

        <button type="submit" class="btn btn-primary w-full" style="width:100%;justify-content:center;padding:0.875rem;">
          Đăng nhập
        </button>
      </form>

      <div class="form-footer">
        Chưa có tài khoản? <a href="#" data-link="/register">Đăng ký miễn phí</a>
      </div>

      <div style="text-align:center;margin-top:1rem;">
        <a href="#" data-link="/" style="font-size:0.75rem;color:var(--text-muted);">← Về trang chủ</a>
      </div>
    </div>

    <!-- Script hook for login form -->
    <script>
      document.addEventListener('DOMContentLoaded', function() {}, {once:true});
    </script>
  </div>
  `;
}
