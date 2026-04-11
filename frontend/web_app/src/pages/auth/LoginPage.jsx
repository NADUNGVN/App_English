import { ArrowRight, SpinnerGap } from "@phosphor-icons/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../../hooks/useAppContext.js";

export function LoginPage() {
  const { locale, login } = useAppContext();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "demo@quackup.app",
    password: "password123",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const copy = {
    vi: {
      eyebrow: "Đăng nhập",
      title: "Quay lại với buổi học đang chờ bạn.",
      body: "Đăng nhập để xem mục tiêu học hôm nay, thư viện bài học, và phần nội dung cần ôn lại.",
      email: "Email",
      password: "Mật khẩu",
      submit: "Vào ứng dụng",
      switch: "Chưa có tài khoản?",
      switchCta: "Tạo tài khoản",
    },
    en: {
      eyebrow: "Login",
      title: "Return to the session waiting for you.",
      body: "Sign in to see today's study target, the lesson library, and the material that needs another pass.",
      email: "Email",
      password: "Password",
      submit: "Open app",
      switch: "Need an account?",
      switchCta: "Create one",
    },
  }[locale];

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

  return (
    <section className="page-shell grid min-h-[calc(100dvh-81px)] items-center py-8 lg:grid-cols-[0.95fr,1.05fr] lg:gap-10">
      <div className="surface-panel hidden h-full min-h-[520px] overflow-hidden p-8 lg:block">
        <div className="flex h-full flex-col justify-between rounded-[1.8rem] bg-hero-wash p-8">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-700">{copy.eyebrow}</p>
            <h1 className="display-title max-w-[9ch] text-[3.65rem]">
              {copy.title}
            </h1>
            <p className="max-w-md text-base leading-relaxed text-slate-600">{copy.body}</p>
          </div>
          <img alt="QuackUp mascot" className="mx-auto h-72 w-72 object-contain" src="/quackup-mascot-cream.png" />
        </div>
      </div>

      <div className="mx-auto w-full max-w-xl">
        <div className="surface-panel p-6 sm:p-8">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-700">{copy.eyebrow}</p>
              <h2 className="page-heading text-[2rem]">{copy.title}</h2>
              <p className="text-sm leading-relaxed text-slate-500">{copy.body}</p>
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
                type="password"
                value={form.password}
              />
            </div>

            {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}

            <button className="button-primary w-full" disabled={submitting} type="submit">
              {submitting ? <SpinnerGap className="animate-spin" size={18} /> : <ArrowRight size={18} weight="bold" />}
              {copy.submit}
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
