import { AppPlaceholderPage } from "../../../views/app/AppPlaceholderPage";

const copy = {
  eyebrow: { vi: "Tài khoản", en: "Account" },
  title: {
    vi: "Hồ sơ người học đang được hoàn thiện.",
    en: "Learner profile is being prepared.",
  },
  description: {
    vi: "Thông tin cá nhân, ảnh đại diện và mục tiêu học sẽ được quản lý tại đây.",
    en: "Personal information, avatar, and study goals will be managed here.",
  },
  emptyTitle: {
    vi: "Hồ sơ sẽ sớm có đầy đủ dữ liệu",
    en: "Profile details will arrive soon",
  },
  emptyDescription: {
    vi: "Hiện tại menu tài khoản đã có điểm vào ổn định để mở rộng phần hồ sơ trong bước tiếp theo.",
    en: "The account menu now has a stable entry point for the next profile update.",
  },
} as const;

export default function ProfilePage() {
  return <AppPlaceholderPage copy={copy} />;
}
