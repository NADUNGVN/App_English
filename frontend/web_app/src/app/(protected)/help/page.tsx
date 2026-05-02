import { AppPlaceholderPage } from "../../../views/app/AppPlaceholderPage";

const copy = {
  eyebrow: { vi: "Hỗ trợ", en: "Support" },
  title: {
    vi: "Trợ giúp đang được hoàn thiện.",
    en: "Help is being prepared.",
  },
  description: {
    vi: "Các hướng dẫn, câu hỏi thường gặp và kênh liên hệ hỗ trợ sẽ được gom tại đây.",
    en: "Guides, common questions, and support contact points will be collected here.",
  },
  emptyTitle: {
    vi: "Khu trợ giúp sẽ sớm có nội dung",
    en: "The help area will have content soon",
  },
  emptyDescription: {
    vi: "Trước mắt, route này giúp menu tài khoản có luồng điều hướng rõ ràng và không bị 404.",
    en: "For now, this route gives the account menu a clear path without a 404.",
  },
} as const;

export default function HelpPage() {
  return <AppPlaceholderPage copy={copy} />;
}
