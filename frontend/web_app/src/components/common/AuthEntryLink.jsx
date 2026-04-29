import { Link } from "react-router-dom";
import { useAppContext } from "../../hooks/useAppContext.js";

export const AUTH_ENTRY_PATH = "/register";

export function AuthEntryLink({
  children,
  className = "",
  onClick,
  toIfAuthenticated = "/dashboard",
}) {
  const { isAuthenticated } = useAppContext();

  return (
    <Link
      className={className}
      onClick={onClick}
      rel={!isAuthenticated ? "noreferrer" : undefined}
      target={!isAuthenticated ? "_blank" : undefined}
      to={isAuthenticated ? toIfAuthenticated : AUTH_ENTRY_PATH}
    >
      {children}
    </Link>
  );
}
