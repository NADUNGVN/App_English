import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { LoadingPanel } from "../components/common/StatePanels.jsx";
import { useAppContext } from "../hooks/useAppContext.js";
import { AppShell } from "../layouts/AppShell.jsx";
import { PublicLayout } from "../layouts/PublicLayout.jsx";
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
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/learning" element={<LearningPage />} />
          <Route path="/dictation" element={<DictationPage />} />
          <Route path="/vocabulary" element={<VocabularyPage />} />
          <Route path="/dictionary" element={<DictionaryPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/statistics" element={<StatisticsPage />} />
          <Route path="/shadowing" element={<ShadowingPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
}
