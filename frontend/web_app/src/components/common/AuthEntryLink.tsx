// @ts-nocheck
"use client";

import Link from "next/link";
import { useAppContext } from "../../hooks/useAppContext";

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
      href={isAuthenticated ? toIfAuthenticated : AUTH_ENTRY_PATH}
      onClick={onClick}
      rel={!isAuthenticated ? "noreferrer" : undefined}
      target={!isAuthenticated ? "_blank" : undefined}
    >
      {children}
    </Link>
  );
}
