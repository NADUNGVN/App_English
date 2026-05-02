import { AppPlaceholderPage } from "../../../views/app/AppPlaceholderPage";

const copy = {
  eyebrow: { vi: "Tài khoản", en: "Account" },
  title: {
    vi: "Cài đặt tài khoản đang được hoàn thiện.",
    en: "Account settings are being prepared.",
  },
  description: {
    vi: "Ngôn ngữ, thông báo và các tuỳ chọn học cá nhân sẽ được đặt trong khu vực này.",
    en: "Language, notifications, and personal learning options will live in this area.",
  },
  emptyTitle: {
    vi: "Cài đặt sẽ được mở rộng sau",
    en: "Settings will be expanded later",
  },
  emptyDescription: {
    vi: "Trang cài đặt hiện giữ cấu trúc điều hướng để menu tài khoản hoạt động nhất quán.",
    en: "This settings page keeps account navigation consistent while the full controls are built.",
  },
} as const;

export default function SettingsPage() {
  return <AppPlaceholderPage copy={copy} />;
}
