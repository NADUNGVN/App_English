import { ArrowRight, SignIn, SpinnerGap } from "@phosphor-icons/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthSplitShell } from "../../components/auth/AuthSplitShell.jsx";
import { useAppContext } from "../../hooks/useAppContext.js";

export function RegisterPage() {
  const { locale, loginWithGoogle, register } = useAppContext();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    dailyGoalMinutes: 15,
    displayName: "",
    email: "",
    password: "",
    preferredLanguage: locale,
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const copy = {
    vi: {
      body: "Tạo tài khoản để lưu ngôn ngữ, mục tiêu mỗi ngày, và tiến độ học trên từng lần quay lại.",
      eyebrow: "Tạo tài khoản",
      email: "Email",
      goal: "Mục tiêu mỗi ngày",
      goalSuffix: "phút",
      google: "Tiếp tục với Google",
      language: "Ngôn ngữ ưu tiên",
      name: "Tên hiển thị",
      orEmail: "Hoặc tạo bằng email",
      password: "Mật khẩu",
      showcaseBody:
        "Tạo một tài khoản gọn để giữ lại mục tiêu học, ngôn ngữ hiển thị, và tiến độ giữa các phiên nghe, nói, đọc, viết và từ vựng.",
      showcaseEyebrow: "QuackUp English",
      showcaseFacts: [
        "Nghe, nói, đọc, viết trong cùng một hệ",
        "Từ vựng luôn giữ theo ngữ cảnh",
        "Tiến độ được lưu theo từng phiên học",
      ],
      showcaseMetricCaption:
        "Thiết lập một lần, sau đó quay lại với đúng mục tiêu và phần cần học tiếp.",
      showcaseMetricPrimary: "5-10",
      showcaseMetricPrimaryLabel: "phút",
      showcaseMetricSecondary: "mỗi ngày",
      showcaseMetricSecondaryLabel: "đủ để giữ nhịp",
      showcaseTitle: "Khóa nhịp học đầu tiên của bạn bằng một tài khoản rõ ràng và nhẹ.",
      submit: "Tạo tài khoản",
      switch: "Đã có tài khoản?",
      switchCta: "Đăng nhập",
      title: "Bắt đầu với QuackUp English theo nhịp học của riêng bạn.",
    },
    en: {
      body: "Create an account to save your interface language, daily target, and learning progress each time you return.",
      eyebrow: "Create account",
      email: "Email",
      goal: "Daily goal",
      goalSuffix: "min",
      google: "Continue with Google",
      language: "Preferred language",
      name: "Display name",
      orEmail: "Or create with email",
      password: "Password",
      showcaseBody:
        "Create one clear account to keep your study target, interface language, and progress across listening, speaking, reading, writing, and vocabulary.",
      showcaseEyebrow: "QuackUp English",
      showcaseFacts: [
        "One system across five study spaces",
        "Vocabulary kept inside real context",
        "Progress saved session by session",
      ],
      showcaseMetricCaption:
        "Set it up once, then come back to the exact target and material that matters next.",
      showcaseMetricPrimary: "5-10",
      showcaseMetricPrimaryLabel: "minutes",
      showcaseMetricSecondary: "daily",
      showcaseMetricSecondaryLabel: "is enough to hold rhythm",
      showcaseTitle: "Lock your first study rhythm with an account that stays clear and light.",
      submit: "Create account",
      switch: "Already have an account?",
      switchCta: "Log in",
      title: "Start with QuackUp English on your own steady rhythm.",
    },
  }[locale];

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await register(form);
      navigate("/login?registered=1", { replace: true });
    } catch (caughtError) {
      setError(caughtError.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleRegister = () => {
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
          onClick={handleGoogleRegister}
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

        <form className="grid gap-5" onSubmit={handleSubmit}>
          <div className="field-shell">
            <label className="field-label" htmlFor="register-name">
              {copy.name}
            </label>
            <input
              autoComplete="name"
              className="field-input"
              id="register-name"
              onChange={(event) =>
                setForm((current) => ({ ...current, displayName: event.target.value }))
              }
              placeholder={locale === "vi" ? "Tên của bạn" : "Your name"}
              required
              type="text"
              value={form.displayName}
            />
          </div>

          <div className="field-shell">
            <label className="field-label" htmlFor="register-email">
              {copy.email}
            </label>
            <input
              autoComplete="email"
              className="field-input"
              id="register-email"
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
            <label className="field-label" htmlFor="register-password">
              {copy.password}
            </label>
            <input
              autoComplete="new-password"
              className="field-input"
              id="register-password"
              minLength={8}
              onChange={(event) =>
                setForm((current) => ({ ...current, password: event.target.value }))
              }
              required
              type="password"
              value={form.password}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="field-shell">
              <label className="field-label" htmlFor="register-language">
                {copy.language}
              </label>
              <select
                className="field-input"
                id="register-language"
                onChange={(event) =>
                  setForm((current) => ({ ...current, preferredLanguage: event.target.value }))
                }
                value={form.preferredLanguage}
              >
                <option value="vi">Tiếng Việt</option>
                <option value="en">English</option>
              </select>
            </div>

            <div className="field-shell">
              <label className="field-label" htmlFor="register-goal">
                {copy.goal}
              </label>
              <select
                className="field-input"
                id="register-goal"
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    dailyGoalMinutes: Number(event.target.value),
                  }))
                }
                value={form.dailyGoalMinutes}
              >
                {[10, 15, 20, 30].map((value) => (
                  <option key={value} value={value}>
                    {value} {copy.goalSuffix}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error ? (
            <p className="rounded-[1.2rem] bg-rose-50 px-4 py-3 text-sm leading-relaxed text-rose-700">
              {error}
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
          <Link className="font-semibold text-brand-700" to="/login">
            {copy.switchCta}
          </Link>
        </p>
      </div>
    </AuthSplitShell>
  );
}
