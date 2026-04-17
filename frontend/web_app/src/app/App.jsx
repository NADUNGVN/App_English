import { useEffect } from "react";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { appNavigationItems } from "./appNavigation.js";
import { ErrorState, LoadingPanel } from "../components/common/StatePanels.jsx";
import { useAppContext } from "../hooks/useAppContext.js";
import { AppShell } from "../layouts/AppShell.jsx";
import { AuthLayout } from "../layouts/AuthLayout.jsx";
import { MarketingLayout } from "../layouts/MarketingLayout.jsx";
import { AppPlaceholderPage } from "../pages/app/AppPlaceholderPage.jsx";
import { DashboardPage } from "../pages/app/DashboardPage.jsx";
import { DictionaryPage } from "../pages/app/DictionaryPage.jsx";
import { DictationPage } from "../pages/app/DictationPage.jsx";
import { LeaderboardPage } from "../pages/app/LeaderboardPage.jsx";
import { LearningPage } from "../pages/app/LearningPage.jsx";
import { ShadowingPage } from "../pages/app/ShadowingPage.jsx";
import { StatisticsPage } from "../pages/app/StatisticsPage.jsx";
import { VocabularyPage } from "../pages/app/VocabularyPage.jsx";
import { LoginPage } from "../pages/auth/LoginPage.jsx";
import { RegisterPage } from "../pages/auth/RegisterPage.jsx";
import { LandingPage } from "../pages/public/LandingPage.jsx";
import { MarketingFeaturePage } from "../pages/public/MarketingFeaturePage.jsx";
import { PricingPage } from "../pages/public/PricingPage.jsx";

const concreteRouteElements = {
  "/dashboard": DashboardPage,
  "/learning": LearningPage,
  "/dictation": DictationPage,
  "/vocabulary": VocabularyPage,
  "/dictionary": DictionaryPage,
  "/leaderboard": LeaderboardPage,
  "/statistics": StatisticsPage,
  "/shadowing": ShadowingPage,
};

function RouteScrollManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
}

function ProtectedRoute() {
  const { bootError, isAuthenticated, isBooting, locale, retrySessionBootstrap } =
    useAppContext();

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

  if (isBooting) {
    return (
      <div className="page-shell py-10">
        <LoadingPanel className="min-h-[320px]" lines={6} />
      </div>
    );
  }

  if (bootError) {
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
    return <Navigate replace to="/login" />;
  }

  return <Outlet />;
}

function PublicOnlyRoute() {
  const { isAuthenticated, isBooting } = useAppContext();

  if (isBooting) {
    return (
      <div className="page-shell py-10">
        <LoadingPanel className="min-h-[320px]" lines={6} />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate replace to="/dashboard" />;
  }

  return <Outlet />;
}

export default function App() {
  return (
    <>
      <RouteScrollManager />

      <Routes>
        <Route element={<MarketingLayout />}>
          <Route index element={<LandingPage />} />
          <Route
            path="/english/speaking"
            element={<MarketingFeaturePage pageKey="speaking" />}
          />
          <Route
            path="/english/writing"
            element={<MarketingFeaturePage pageKey="writing" />}
          />
          <Route
            path="/english/listening"
            element={<MarketingFeaturePage pageKey="listening" />}
          />
          <Route
            path="/english/reading"
            element={<MarketingFeaturePage pageKey="reading" />}
          />
          <Route path="/english/pricing" element={<PricingPage />} />
        </Route>

        <Route element={<PublicOnlyRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            {appNavigationItems.map((item) => {
              const ExistingPage = concreteRouteElements[item.to];

              if (ExistingPage) {
                return <Route key={item.to} path={item.to} element={<ExistingPage />} />;
              }

              if (item.placeholderCopy) {
                return (
                  <Route
                    key={item.to}
                    path={item.to}
                    element={<AppPlaceholderPage copy={item.placeholderCopy} />}
                  />
                );
              }

              return null;
            })}
          </Route>
        </Route>

        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </>
  );
}
