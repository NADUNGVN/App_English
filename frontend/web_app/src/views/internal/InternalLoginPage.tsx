"use client";

import { LockKey, SpinnerGap } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function InternalLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@quackup.local");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/internal/auth/login", {
        body: JSON.stringify({ email, password }),
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload?.error ?? "Unable to sign in");
      }

      router.replace("/internal/listening-review");
      router.refresh();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[100dvh] bg-[rgb(255,252,247)] px-4 py-8 text-ink-950">
      <div className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-md items-center">
        <form
          className="w-full rounded-[1.5rem] border border-sand-200 bg-white/82 p-6 shadow-[0_28px_70px_-46px_rgba(120,53,15,0.32)]"
          onSubmit={handleSubmit}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-[1rem] border border-sand-200 bg-sand-50 text-ink-950">
            <LockKey size={24} weight="duotone" />
          </div>
          <p className="type-eyebrow-label mt-6">Internal admin</p>
          <h1 className="mt-2 text-[1.8rem] font-semibold tracking-[-0.045em]">
            Listening review sign in
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            This workspace is separate from learner accounts and only accepts the
            internal review admin credentials.
          </p>

          <div className="mt-6 grid gap-4">
            <label className="field-shell">
              <span className="field-label">Admin email</span>
              <input
                autoComplete="username"
                className="field-input"
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                value={email}
              />
            </label>
            <label className="field-shell">
              <span className="field-label">Password</span>
              <input
                autoComplete="current-password"
                className="field-input"
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                value={password}
              />
            </label>
          </div>

          {error ? (
            <div className="mt-4 rounded-[1rem] border border-rose-100 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">
              {error}
            </div>
          ) : null}

          <button
            className="button-primary mt-6 w-full disabled:pointer-events-none disabled:opacity-60"
            disabled={loading}
            type="submit"
          >
            {loading ? (
              <SpinnerGap className="animate-spin" size={18} weight="bold" />
            ) : (
              <LockKey size={18} weight="duotone" />
            )}
            Sign in
          </button>
        </form>
      </div>
    </main>
  );
}
