import { PublicOnlyRoute } from "../../components/providers/RouteGuards";
import { AuthLayout } from "../../layouts/AuthLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PublicOnlyRoute>
      <AuthLayout>{children}</AuthLayout>
    </PublicOnlyRoute>
  );
}
