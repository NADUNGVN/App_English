import { ProtectedRoute } from "../../components/providers/RouteGuards";
import { AppShell } from "../../layouts/AppShell";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <AppShell>{children}</AppShell>
    </ProtectedRoute>
  );
}
