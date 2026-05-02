import type { Metadata } from "next";
import { AppProvider } from "../components/providers/AppProvider";
import { RouteScrollManager } from "../components/providers/RouteScrollManager";
import "../styles/index.css";

export const metadata: Metadata = {
  title: "QuackUp English",
  description: "Short English practice across listening, speaking, vocabulary, and review.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html data-scroll-behavior="smooth" lang="en">
      <body>
        <AppProvider>
          <RouteScrollManager />
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
