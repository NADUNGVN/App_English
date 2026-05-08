"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import type { ReactNode } from "react";
import { ErrorState, LoadingPanel } from "../common/StatePanels";
import { useAppContext } from "../../hooks/useAppContext";

type AppContextValue = {
  bootError?: unknown;
  isAuthenticated: boolean;
  isBooting: boolean;
  locale: "vi" | "en";
  retrySessionBootstrap: () => void;
};

type RouteGuardProps = {
  children: ReactNode;
};

export function ProtectedRoute({ children }: RouteGuardProps) {
  const appContext = useAppContext() as AppContextValue;
  const {
    bootError,
    isAuthenticated,
    isBooting,
    retrySessionBootstrap,
  } = appContext;
  const locale = appContext.locale === "en" ? "en" : "vi";
  const router = useRouter();
  const pathname = usePathname();
  const allowsDictationDemo = pathname === "/dictation" || pathname.startsWith("/dictation/");

  const copy = {
    vi: {
      retry: "Thử lại",
      title: "Không thể xác thực phiên làm việc lúc này.",
      description:
        "Dịch vụ đăng nhập đang tạm thời không phản hồi. Hãy thử lại trong giây lát.",
    },
    en: {
      retry: "Try again",
      title: "We couldn't verify your session right now.",
      description:
        "The authentication service is temporarily unavailable. Please try again in a moment.",
    },
  }[locale];

  useEffect(() => {
    if (!isBooting && !bootError && !isAuthenticated && !allowsDictationDemo) {
      router.replace("/register");
    }
  }, [allowsDictationDemo, bootError, isAuthenticated, isBooting, router]);

  if (isBooting) {
    if (allowsDictationDemo) {
      return children;
    }

    return (
      <div className="page-shell py-10">
        <LoadingPanel className="min-h-[320px]" lines={6} />
      </div>
    );
  }

  if (bootError) {
    if (allowsDictationDemo) {
      return children;
    }

    return (
      <div className="page-shell py-10">
        <ErrorState
          actionLabel={copy.retry}
          description={copy.description}
          onAction={retrySessionBootstrap}
          title={copy.title}
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    if (allowsDictationDemo) {
      return children;
    }

    return null;
  }

  return children;
}

export function PublicOnlyRoute({ children }: RouteGuardProps) {
  const { isAuthenticated, isBooting } = useAppContext() as Pick<
    AppContextValue,
    "isAuthenticated" | "isBooting"
  >;
  const router = useRouter();

  useEffect(() => {
    if (!isBooting && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isBooting, router]);

  if (isBooting) {
    return (
      <div className="page-shell py-10">
        <LoadingPanel className="min-h-[320px]" lines={6} />
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return children;
}
