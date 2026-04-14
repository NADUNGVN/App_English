import { ArrowRight, SignIn, SpinnerGap } from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAppContext } from "../../hooks/useAppContext.js";

export function LoginPage() {
  const { locale, login, loginWithGoogle } = useAppContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const copy = {
    vi: {
      body: "Đăng nhập để xem mục tiêu học hôm nay, thư viện bài học, và phần nội dung cần ôn lại.",
      eyebrow: "Đăng nhập",
      email: "Email",
      emailConfirmed: "Email đã được xác thực. Bây giờ bạn có thể đăng nhập.",
      google: "Tiếp tục với Google",
      oauthError: "Đăng nhập với Google chưa hoàn tất. Hãy thử lại.",
      password: "Mật khẩu",
      registered:
        "Tài khoản đã được tạo. Hãy kiểm tra email để xác thực trước khi đăng nhập.",
      submit: "Vào ứng dụng",
      switch: "Chưa có tài khoản?",
      switchCta: "Tạo tài khoản",
      title: "Quay lại với buổi học đang chờ bạn.",
    },
    en: {
      body: "Sign in to see today's study target, the lesson library, and the material that needs another pass.",
      eyebrow: "Login",
      email: "Email",
      emailConfirmed: "Your email has been confirmed. You can sign in now.",
      google: "Continue with Google",
      oauthError: "Google sign-in did not complete. Please try again.",
      password: "Password",
      registered:
        "Your account has been created. Check your email to confirm it before signing in.",
      submit: "Open app",
      switch: "Need an account?",
      switchCta: "Create one",
      title: "Return to the session waiting for you.",
    },
  }[locale];

  const oauthError = useMemo(() => {
    return searchParams.get("oauthError") === "google" ? copy.oauthError : "";
  }, [copy.oauthError, searchParams]);

  const successMessage = useMemo(() => {
    if (searchParams.get("confirmed") === "1") {
      return copy.emailConfirmed;
    }

    if (searchParams.get("registered") === "1") {
      return copy.registered;
    }

    return "";
  }, [copy.emailConfirmed, copy.registered, searchParams]);

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
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    setError("");
    loginWithGoogle();
  };

  return (
    <section className="page-shell grid min-h-[calc(100dvh-81px)] items-center py-8 lg:grid-cols-[0.95fr,1.05fr] lg:gap-10">
      <div className="surface-panel hidden h-full min-h-[520px] overflow-hidden p-8 lg:block">
        <div className="flex h-full flex-col justify-between rounded-[1.8rem] bg-hero-wash p-8">
          <div className="space-y-4">
            <p className="type-eyebrow-label">{copy.eyebrow}</p>
            <h1 className="type-display-auth max-w-[9ch]">{copy.title}</h1>
            <p className="type-body-lg max-w-md">{copy.body}</p>
          </div>
          <img
            alt="QuackUp mascot"
            className="mx-auto h-72 w-72 object-contain"
            src="/quackup-mascot-cream.png"
          />
        </div>
      </div>

      <div className="mx-auto w-full max-w-xl">
        <div className="surface-panel p-6 sm:p-8">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <p className="type-eyebrow-label">{copy.eyebrow}</p>
              <h2 className="type-title-page">{copy.title}</h2>
              <p className="type-body-sm">{copy.body}</p>
            </div>

            <div className="field-shell">
              <label className="field-label" htmlFor="login-email">
                {copy.email}
              </label>
              <input
                className="field-input"
                id="login-email"
                onChange={(event) =>
                  setForm((current) => ({ ...current, email: event.target.value }))
                }
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

            {successMessage ? (
              <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {successMessage}
              </p>
            ) : null}

            {error || oauthError ? (
              <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error || oauthError}
              </p>
            ) : null}

            <button className="button-primary w-full" disabled={submitting} type="submit">
              {submitting ? (
                <SpinnerGap className="animate-spin" size={18} />
              ) : (
                <ArrowRight size={18} weight="bold" />
              )}
              {copy.submit}
            </button>

            <button
              className="button-secondary w-full"
              onClick={handleGoogleLogin}
              type="button"
            >
              <SignIn size={18} weight="duotone" />
              {copy.google}
            </button>

            <p className="text-sm text-slate-500">
              {copy.switch}{" "}
              <Link className="font-semibold text-brand-700" to="/register">
                {copy.switchCta}
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
