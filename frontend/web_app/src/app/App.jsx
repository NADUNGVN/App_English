import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { appNavigationItems } from "./appNavigation.js";
import { LoadingPanel } from "../components/common/StatePanels.jsx";
import { useAppContext } from "../hooks/useAppContext.js";
import { AppShell } from "../layouts/AppShell.jsx";
import { PublicLayout } from "../layouts/PublicLayout.jsx";
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

function ProtectedRoute() {
  const { isAuthenticated, isBooting } = useAppContext();

  if (isBooting) {
    return (
      <div className="page-shell py-10">
        <LoadingPanel className="min-h-[320px]" lines={6} />
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
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<LandingPage />} />
        <Route element={<PublicOnlyRoute />}>
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
  );
}
