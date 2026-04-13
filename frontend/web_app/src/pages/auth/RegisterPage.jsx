import { ArrowRight, SignIn, SpinnerGap } from "@phosphor-icons/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
      body: "Tạo tài khoản để lưu mục tiêu, ngôn ngữ hiển thị, và tiến độ học trên mọi lần đăng nhập.",
      eyebrow: "Tạo tài khoản",
      email: "Email",
      goal: "Mục tiêu mỗi ngày",
      goalSuffix: "phút",
      google: "Tiếp tục với Google",
      language: "Ngôn ngữ ưu tiên",
      name: "Tên hiển thị",
      password: "Mật khẩu",
      submit: "Tạo tài khoản",
      switch: "Đã có tài khoản?",
      switchCta: "Đăng nhập",
      title: "Bắt đầu nhịp học đầu tiên của bạn.",
    },
    en: {
      body: "Create an account to save your goals, interface language, and learning progress every time you sign in.",
      eyebrow: "Create account",
      email: "Email",
      goal: "Daily goal",
      goalSuffix: "min",
      google: "Continue with Google",
      language: "Preferred language",
      name: "Display name",
      password: "Password",
      submit: "Create account",
      switch: "Already have an account?",
      switchCta: "Log in",
      title: "Start your first steady study rhythm.",
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
    <section className="page-shell py-10">
      <div className="mx-auto max-w-4xl">
        <div className="surface-panel grid gap-8 p-6 sm:p-8 lg:grid-cols-[0.86fr,1.14fr]">
          <div className="surface-panel-soft flex flex-col justify-between p-6">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-700">
                {copy.eyebrow}
              </p>
              <h1 className="display-title max-w-[10ch] text-[3.25rem]">{copy.title}</h1>
              <p className="text-sm leading-relaxed text-slate-500">{copy.body}</p>
            </div>
            <img
              alt="QuackUp mascot"
              className="mx-auto h-64 w-64 object-contain"
              src="/quackup-mascot-cream.png"
            />
          </div>

          <form className="grid gap-5" onSubmit={handleSubmit}>
            <div className="field-shell">
              <label className="field-label" htmlFor="register-name">
                {copy.name}
              </label>
              <input
                className="field-input"
                id="register-name"
                onChange={(event) =>
                  setForm((current) => ({ ...current, displayName: event.target.value }))
                }
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
                className="field-input"
                id="register-email"
                onChange={(event) =>
                  setForm((current) => ({ ...current, email: event.target.value }))
                }
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
              <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
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
              onClick={handleGoogleRegister}
              type="button"
            >
              <SignIn size={18} weight="duotone" />
              {copy.google}
            </button>

            <p className="text-sm text-slate-500">
              {copy.switch}{" "}
              <Link className="font-semibold text-brand-700" to="/login">
                {copy.switchCta}
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
