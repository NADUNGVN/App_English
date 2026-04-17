import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <main className="min-h-[100dvh]">
      <Outlet />
    </main>
  );
}
