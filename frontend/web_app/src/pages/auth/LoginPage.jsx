import { ArrowRight, CaretDown, CaretUp, SpinnerGap } from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AuthSplitShell } from "../../components/auth/AuthSplitShell.jsx";
import { GoogleAuthButton } from "../../components/auth/GoogleAuthButton.jsx";
import { useAppContext } from "../../hooks/useAppContext.js";

export function LoginPage() {
  const { locale, login, loginWithGoogle } = useAppContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [emailFormOpen, setEmailFormOpen] = useState(() => {
    const confirmed = searchParams.get("confirmed") === "1";
    const registered = searchParams.get("registered") === "1";
    return confirmed || registered;
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const copy = {
    vi: {
      confirmed: "Email đã được xác thực. Bạn có thể đăng nhập ngay bây giờ.",
      email: "Email",
      emailToggle: "Đăng nhập bằng email",
      google: "Continue with Google",
      legal: "Bằng việc tiếp tục, bạn đồng ý với điều khoản sử dụng và chính sách riêng tư của QuackUp.",
      oauthError: "Đăng nhập với Google chưa hoàn tất. Hãy thử lại.",
      password: "Mật khẩu",
      registered: "Tài khoản đã sẵn sàng. Đăng nhập khi bạn sẵn sàng tiếp tục học.",
      submit: "Đăng nhập",
      switchLead: "Chưa có tài khoản?",
      switchCta: "Tạo tài khoản miễn phí",
      title: "Đăng nhập",
    },
    en: {
      confirmed: "Your email has been confirmed. You can sign in now.",
      email: "Email",
      emailToggle: "Log in with email",
      google: "Continue with Google",
      legal: "By continuing, you agree to QuackUp's terms of service and privacy policy.",
      oauthError: "Google sign-in did not complete. Please try again.",
      password: "Password",
      registered: "Your account is ready. Sign in when you are ready.",
      submit: "Log in",
      switchLead: "Don't have an account?",
      switchCta: "Register for free",
      title: "Log in",
    },
  }[locale];

  const oauthError = useMemo(() => {
    return searchParams.get("oauthError") === "google" ? copy.oauthError : "";
  }, [copy.oauthError, searchParams]);

  const successMessage = useMemo(() => {
    if (searchParams.get("confirmed") === "1") {
      return copy.confirmed;
    }

    if (searchParams.get("registered") === "1") {
      return copy.registered;
    }

    return "";
  }, [copy.confirmed, copy.registered, searchParams]);

  useEffect(() => {
    if (!window.location.hash) {
      return;
    }

    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${window.location.search}`,
    );
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await login(form);
      navigate("/dashboard", { replace: true });
    } catch (caughtError) {
      setError(caughtError.message);
      setEmailFormOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    setError("");
    loginWithGoogle();
  };

  const handleEmailToggle = () => {
    setError("");
    setEmailFormOpen((current) => !current);
  };

  return (
    <AuthSplitShell formTitle={copy.title}>
      <div className="space-y-6">
        <p className="text-[0.95rem] leading-relaxed text-slate-500">
          {copy.switchLead}{" "}
          <Link className="font-semibold text-brand-700 transition hover:text-brand-600" to="/register">
            {copy.switchCta}
          </Link>
        </p>

        <GoogleAuthButton label={copy.google} onClick={handleGoogleLogin} />

        <div className="space-y-4">
          <button
            className="inline-flex items-center justify-center gap-2 text-[0.98rem] font-medium text-slate-700 transition duration-300 hover:text-ink-950"
            onClick={handleEmailToggle}
            type="button"
          >
            <span>{copy.emailToggle}</span>
            {emailFormOpen ? <CaretUp size={18} weight="bold" /> : <CaretDown size={18} weight="bold" />}
          </button>

          {successMessage && emailFormOpen ? (
            <p className="rounded-[1.2rem] bg-emerald-50 px-4 py-3 text-left text-sm leading-relaxed text-emerald-700">
              {successMessage}
            </p>
          ) : null}

          {oauthError && !emailFormOpen ? (
            <p className="rounded-[1.2rem] bg-rose-50 px-4 py-3 text-left text-sm leading-relaxed text-rose-700">
              {oauthError}
            </p>
          ) : null}

          {emailFormOpen ? (
            <form className="grid gap-5 text-left" onSubmit={handleSubmit}>
              <div className="field-shell">
                <label className="field-label" htmlFor="login-email">
                  {copy.email}
                </label>
                <input
                  autoComplete="email"
                  className="field-input"
                  id="login-email"
                  onChange={(event) =>
                    setForm((current) => ({ ...current, email: event.target.value }))
                  }
                  placeholder="name@example.com"
                  required
                  type="email"
                  value={form.email}
                />
              </div>

              <div className="field-shell">
                <label className="field-label" htmlFor="login-password">
                  {copy.password}
                </label>
                <input
                  autoComplete="current-password"
                  className="field-input"
                  id="login-password"
                  onChange={(event) =>
                    setForm((current) => ({ ...current, password: event.target.value }))
                  }
                  required
                  type="password"
                  value={form.password}
                />
              </div>

              {error || oauthError ? (
                <p className="rounded-[1.2rem] bg-rose-50 px-4 py-3 text-sm leading-relaxed text-rose-700">
                  {error || oauthError}
                </p>
              ) : null}

              <button
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-brand-500 px-5 py-3 text-sm font-semibold leading-[1.2] text-white transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[1px] hover:bg-brand-600 active:translate-y-[1px] active:scale-[0.98]"
                disabled={submitting}
                type="submit"
              >
                {submitting ? (
                  <SpinnerGap className="animate-spin" size={18} />
                ) : (
                  <ArrowRight size={18} weight="bold" />
                )}
                {copy.submit}
              </button>
            </form>
          ) : null}
        </div>

        <p className="mx-auto max-w-[18rem] text-[0.78rem] leading-[1.7] text-slate-400">
          {copy.legal}
        </p>
      </div>
    </AuthSplitShell>
  );
}
