import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  getInternalAdminCookieName,
  getInternalAdminSessionFromCookieValue,
} from "../../../server/modules/internal/adminAuth";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const session = getInternalAdminSessionFromCookieValue(
    cookieStore.get(getInternalAdminCookieName())?.value,
  );

  if (!session) {
    redirect("/internal/login");
  }

  return children;
}
