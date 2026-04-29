import { ArrowRight, CaretDown, CaretUp, SpinnerGap } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AuthSplitShell } from "../../components/auth/AuthSplitShell.jsx";
import { GoogleAuthButton } from "../../components/auth/GoogleAuthButton.jsx";
import { useAppContext } from "../../hooks/useAppContext.js";

export function RegisterPage() {
  const { locale, loginWithGoogle, register } = useAppContext();
  const [searchParams] = useSearchParams();
  const [emailFormOpen, setEmailFormOpen] = useState(false);
  const [form, setForm] = useState({
    dailyGoalMinutes: 15,
    displayName: "",
    email: "",
    password: "",
    preferredLanguage: locale,
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [registeredNotice, setRegisteredNotice] = useState("");

  const copy = {
    vi: {
      body: "",
      confirmed: "Email đã được xác thực. Bây giờ bạn có thể đăng nhập.",
      email: "Email",
      emailToggle: "Đăng ký bằng email",
      eyebrow: "",
      google: "Sign up with Google",
      googleError: "Đăng nhập với Google chưa hoàn tất. Hãy thử lại.",
      legal:
        "Bằng việc tạo tài khoản, bạn đồng ý với điều khoản sử dụng và chính sách riêng tư của QuackUp.",
      name: "Tên hiển thị",
      password: "Mật khẩu",
      registered:
        "Tài khoản đã được tạo. Hãy kiểm tra email để xác thực trước khi đăng nhập.",
      sideDescription:
        "Tạo tài khoản để lưu tiến độ, mục tiêu học ngắn, và quay lại đúng kỹ năng bạn cần cho General English, IELTS hoặc TOEIC.",
      sideEyebrow: "QuackUp English",
      sideFooter: "General English · IELTS · TOEIC",
      sideMetricCaption:
        "Một tài khoản để giữ nhịp học ngắn, rõ, và quay lại đúng phần cần tiếp tục.",
      sideMetricPrimary: "15",
      sideMetricPrimaryLabel: "phút / ngày",
      sideMetricSecondary: "4",
      sideMetricSecondaryLabel: "Kỹ năng",
      sideTitle: "",
      signInNow: "Đăng nhập",
      submit: "Tạo tài khoản",
      switch: "Đã có tài khoản?",
      switchCta: "Đăng nhập",
      title: "Tạo tài khoản",
    },
    en: {
      body: "",
      confirmed: "Your email has been confirmed. You can sign in now.",
      email: "Email",
      emailToggle: "Sign up with email",
      eyebrow: "",
      google: "Sign up with Google",
      googleError: "Google sign-in did not complete. Please try again.",
      legal:
        "By creating an account, you agree to QuackUp's terms of service and privacy policy.",
      name: "Display name",
      password: "Password",
      registered: "Your account has been created. Check your email before you sign in.",
      sideDescription:
        "Create one account to save your progress, short daily target, and the next English skill you need for General English, IELTS, or TOEIC.",
      sideEyebrow: "QuackUp English",
      sideFooter: "General English · IELTS · TOEIC",
      sideMetricCaption:
        "One account to hold a short routine, a clear target, and the exact next block to continue.",
      sideMetricPrimary: "15",
      sideMetricPrimaryLabel: "minutes / day",
      sideMetricSecondary: "4",
      sideMetricSecondaryLabel: "skill spaces",
      sideTitle: "",
      signInNow: "Log in",
      submit: "Create account",
      switch: "Already have an account?",
      switchCta: "Log in",
      title: "Create account",
    },
  }[locale];

  const queryNotice = useMemo(() => {
    if (searchParams.get("confirmed") === "1") {
      return copy.confirmed;
    }

    return "";
  }, [copy.confirmed, searchParams]);

  const oauthError = useMemo(() => {
    return searchParams.get("oauthError") === "google" ? copy.googleError : "";
  }, [copy.googleError, searchParams]);

  const successNotice = registeredNotice || queryNotice;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setRegisteredNotice("");

    try {
      await register({
        ...form,
        preferredLanguage: locale,
      });
      setRegisteredNotice(copy.registered);
      setEmailFormOpen(false);
      setForm((current) => ({
        ...current,
        password: "",
      }));
    } catch (caughtError) {
      setError(caughtError.message);
      setEmailFormOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleRegister = () => {
    setError("");
    loginWithGoogle();
  };

  const handleEmailToggle = () => {
    setError("");
    setEmailFormOpen((current) => !current);
  };

  return (
    <AuthSplitShell
      formDescription={copy.body}
      formEyebrow={copy.eyebrow}
      formTitle={copy.title}
      sidePanel={{
        description: copy.sideDescription,
        eyebrow: copy.sideEyebrow,
        footer: copy.sideFooter,
        metricCaption: copy.sideMetricCaption,
        metricPrimary: copy.sideMetricPrimary,
        metricPrimaryLabel: copy.sideMetricPrimaryLabel,
        metricSecondary: copy.sideMetricSecondary,
        metricSecondaryLabel: copy.sideMetricSecondaryLabel,
        title: copy.sideTitle,
      }}
      variant="split"
    >
      <div className="space-y-5">
        {successNotice ? (
          <div className="space-y-5">
            <p className="rounded-[1.2rem] bg-emerald-50 px-4 py-3 text-sm leading-relaxed text-emerald-700">
              {successNotice}
            </p>

            <Link className="button-primary w-full justify-center" to="/login">
              <ArrowRight size={18} weight="bold" />
              {copy.signInNow}
            </Link>
          </div>
        ) : (
          <>
            <GoogleAuthButton label={copy.google} onClick={handleGoogleRegister} />

            <button
              className="inline-flex w-full items-center justify-center gap-2 text-[0.98rem] font-medium text-slate-700 transition duration-300 hover:text-ink-950"
              onClick={handleEmailToggle}
              type="button"
            >
              <span>{copy.emailToggle}</span>
              {emailFormOpen ? <CaretUp size={18} weight="bold" /> : <CaretDown size={18} weight="bold" />}
            </button>

            {oauthError && !emailFormOpen ? (
              <p className="rounded-[1.2rem] bg-rose-50 px-4 py-3 text-sm leading-relaxed text-rose-700">
                {oauthError}
              </p>
            ) : null}

            {emailFormOpen ? (
              <form className="grid gap-5 text-left" onSubmit={handleSubmit}>
                <div className="field-shell">
                  <label className="field-label" htmlFor="register-name">
                    {copy.name}
                  </label>
                  <input
                    autoComplete="name"
                    className="field-input"
                    id="register-name"
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        displayName: event.target.value,
                      }))
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
                      setForm((current) => ({
                        ...current,
                        password: event.target.value,
                      }))
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
                  className="button-primary w-full justify-center"
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
          </>
        )}

        <div className="space-y-4 pt-2">
          <p className="text-sm leading-relaxed text-slate-500">
            {copy.switch}{" "}
            <Link className="font-semibold text-brand-700" to="/login">
              {copy.switchCta}
            </Link>
          </p>

          <p className="text-[0.78rem] leading-[1.65] text-slate-400">{copy.legal}</p>
        </div>
      </div>
    </AuthSplitShell>
  );
}
