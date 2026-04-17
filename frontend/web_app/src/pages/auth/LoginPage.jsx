import { ArrowRight, SignIn, SpinnerGap } from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AuthSplitShell } from "../../components/auth/AuthSplitShell.jsx";
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
      body: "Đăng nhập để mở lại mục tiêu hôm nay, bài đang học, và phần cần ôn tiếp theo.",
      eyebrow: "Đăng nhập",
      email: "Email",
      emailConfirmed: "Email đã được xác thực. Bây giờ bạn có thể đăng nhập.",
      google: "Tiếp tục với Google",
      oauthError: "Đăng nhập với Google chưa hoàn tất. Hãy thử lại.",
      orEmail: "Hoặc dùng email",
      password: "Mật khẩu",
      registered:
        "Tài khoản đã được tạo. Hãy kiểm tra email để xác thực trước khi đăng nhập.",
      showcaseBody:
        "QuackUp gom nghe, nói, đọc, viết và từ vựng vào cùng một nhịp học rõ ràng. Khi quay lại, bạn thấy đúng việc cần làm tiếp theo.",
      showcaseEyebrow: "QuackUp English",
      showcaseFacts: [
        "Dictation theo clip ngắn",
        "Shadowing theo cụm tự nhiên",
        "Từ vựng đi cùng ngữ cảnh",
      ],
      showcaseMetricCaption:
        "Phiên ngắn hơn, rõ mục tiêu hơn, và đủ nhẹ để bạn quay lại đều mỗi ngày.",
      showcaseMetricPrimary: "5-10",
      showcaseMetricPrimaryLabel: "phút",
      showcaseMetricSecondary: "mỗi ngày",
      showcaseMetricSecondaryLabel: "nhịp học",
      showcaseTitle: "Một phiên đủ gọn để bạn quay lại đều hơn mỗi ngày.",
      submit: "Đăng nhập",
      switch: "Chưa có tài khoản?",
      switchCta: "Tạo tài khoản",
      title: "Quay lại với nhịp học đang chờ bạn.",
    },
    en: {
      body: "Sign in to reopen today's target, the lesson in progress, and the material worth another pass.",
      eyebrow: "Log in",
      email: "Email",
      emailConfirmed: "Your email has been confirmed. You can sign in now.",
      google: "Continue with Google",
      oauthError: "Google sign-in did not complete. Please try again.",
      orEmail: "Or use email",
      password: "Password",
      registered:
        "Your account has been created. Check your email to confirm it before signing in.",
      showcaseBody:
        "QuackUp keeps listening, speaking, reading, writing, and vocabulary inside one clear rhythm. When you return, you see exactly what to do next.",
      showcaseEyebrow: "QuackUp English",
      showcaseFacts: [
        "Clip-based dictation",
        "Natural chunk shadowing",
        "Vocabulary saved in context",
      ],
      showcaseMetricCaption:
        "Shorter sessions, clearer targets, and a practice rhythm that is easy to revisit.",
      showcaseMetricPrimary: "5-10",
      showcaseMetricPrimaryLabel: "minutes",
      showcaseMetricSecondary: "daily",
      showcaseMetricSecondaryLabel: "rhythm",
      showcaseTitle: "A study session compact enough to repeat every day.",
      submit: "Log in",
      switch: "Need an account?",
      switchCta: "Create one",
      title: "Return to the study rhythm waiting for you.",
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
    <AuthSplitShell
      formDescription={copy.body}
      formEyebrow={copy.eyebrow}
      formTitle={copy.title}
      showcase={{
        description: copy.showcaseBody,
        eyebrow: copy.showcaseEyebrow,
        facts: copy.showcaseFacts,
        metricCaption: copy.showcaseMetricCaption,
        metricPrimary: copy.showcaseMetricPrimary,
        metricPrimaryLabel: copy.showcaseMetricPrimaryLabel,
        metricSecondary: copy.showcaseMetricSecondary,
        metricSecondaryLabel: copy.showcaseMetricSecondaryLabel,
        title: copy.showcaseTitle,
      }}
    >
      <div className="space-y-5">
        <button
          className="button-secondary w-full justify-center"
          onClick={handleGoogleLogin}
          type="button"
        >
          <SignIn size={18} weight="duotone" />
          {copy.google}
        </button>

        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-[rgb(226,214,197)]" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            {copy.orEmail}
          </span>
          <span className="h-px flex-1 bg-[rgb(226,214,197)]" />
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
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

          {successMessage ? (
            <p className="rounded-[1.2rem] bg-emerald-50 px-4 py-3 text-sm leading-relaxed text-emerald-700">
              {successMessage}
            </p>
          ) : null}

          {error || oauthError ? (
            <p className="rounded-[1.2rem] bg-rose-50 px-4 py-3 text-sm leading-relaxed text-rose-700">
              {error || oauthError}
            </p>
          ) : null}

          <button className="button-primary w-full justify-center" disabled={submitting} type="submit">
            {submitting ? (
              <SpinnerGap className="animate-spin" size={18} />
            ) : (
              <ArrowRight size={18} weight="bold" />
            )}
            {copy.submit}
          </button>
        </form>

        <p className="text-sm leading-relaxed text-slate-500">
          {copy.switch}{" "}
          <Link className="font-semibold text-brand-700" to="/register">
            {copy.switchCta}
          </Link>
        </p>
      </div>
    </AuthSplitShell>
  );
}
