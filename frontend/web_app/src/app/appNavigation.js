import {
  BookOpenText,
  BookmarkSimple,
  ChartBar,
  ChatTeardropText,
  ChatsCircle,
  ClockCounterClockwise,
  HeartStraight,
  HouseLine,
  NotePencil,
  Ranking,
  SpeakerHigh,
  Subtitles,
  Translate,
  Trophy,
  UsersThree,
  Video,
} from "@phosphor-icons/react";

export const appSidebarSections = [
  {
    key: "main",
    label: null,
    collapsible: false,
    defaultExpanded: true,
    placement: "nav",
  },
  {
    key: "you",
    label: { vi: "Bạn", en: "You" },
    collapsible: false,
    defaultExpanded: true,
    placement: "footer",
  },
  {
    key: "community",
    label: { vi: "Cộng đồng", en: "Community" },
    collapsible: false,
    defaultExpanded: true,
    placement: "nav",
  },
];

export const appNavigationItems = [
  {
    to: "/dashboard",
    label: { vi: "Trang chủ", en: "Home" },
    icon: HouseLine,
    section: "main",
    visibleInSidebar: true,
  },
  {
    to: "/vocabulary",
    label: { vi: "Từ vựng", en: "Vocabulary" },
    icon: Translate,
    section: "main",
    visibleInSidebar: true,
  },
  {
    to: "/dictation",
    label: { vi: "Luyện nghe", en: "Listening" },
    icon: Subtitles,
    section: "main",
    visibleInSidebar: true,
  },
  {
    to: "/shadowing",
    label: { vi: "Luyện nói", en: "Speaking" },
    icon: ChatsCircle,
    section: "main",
    visibleInSidebar: true,
  },
  {
    to: "/reading",
    label: { vi: "Luyện đọc", en: "Reading" },
    icon: BookOpenText,
    section: "main",
    visibleInSidebar: true,
    placeholderCopy: {
      eyebrow: { vi: "Luyện đọc", en: "Reading practice" },
      title: {
        vi: "Không gian luyện đọc đang được hoàn thiện.",
        en: "Reading practice is being prepared.",
      },
      description: {
        vi: "Bài đọc, ghi chú và các bài luyện đi kèm sẽ được đưa vào không gian này.",
        en: "Reading passages, notes, and related drills will live in this space.",
      },
      emptyTitle: {
        vi: "Trang này sẽ sớm có nội dung",
        en: "This page will have content soon",
      },
      emptyDescription: {
        vi: "Bạn có thể quay lại sau khi phần luyện đọc được xuất bản trong một đợt cập nhật tiếp theo.",
        en: "You can return here once reading practice is published in a later update.",
      },
    },
  },
  {
    to: "/writing",
    label: { vi: "Luyện viết", en: "Writing" },
    icon: NotePencil,
    section: "main",
    visibleInSidebar: true,
    placeholderCopy: {
      eyebrow: { vi: "Luyện viết", en: "Writing practice" },
      title: {
        vi: "Không gian luyện viết đang được hoàn thiện.",
        en: "Writing practice is being prepared.",
      },
      description: {
        vi: "Các bài viết ngắn, gợi ý sửa lỗi và khung phản hồi sẽ được đặt ở đây.",
        en: "Short writing drills, feedback cues, and correction helpers will live here.",
      },
      emptyTitle: {
        vi: "Trang này sẽ sớm có nội dung",
        en: "This page will have content soon",
      },
      emptyDescription: {
        vi: "Hiện tại bạn có thể tiếp tục các không gian luyện nghe, nói và từ vựng trước.",
        en: "For now, you can continue with listening, speaking, and vocabulary practice.",
      },
    },
  },
  {
    to: "/review",
    label: { vi: "Ôn tập", en: "Review" },
    icon: ClockCounterClockwise,
    section: "you",
    visibleInSidebar: true,
    placeholderCopy: {
      eyebrow: { vi: "Bạn", en: "You" },
      title: {
        vi: "Khu ôn tập đang được hoàn thiện.",
        en: "The review space is being prepared.",
      },
      description: {
        vi: "Các nội dung cần quay lại, danh sách ưu tiên và nhịp ôn tập sẽ được gom vào đây.",
        en: "Items to revisit, priorities, and review rhythm will be collected here.",
      },
      emptyTitle: {
        vi: "Ôn tập sẽ sớm xuất hiện",
        en: "Review will arrive soon",
      },
      emptyDescription: {
        vi: "Chúng tôi đang kết nối dữ liệu học gần đây để tạo nên trang ôn tập này.",
        en: "We are connecting recent learning data to build this review page.",
      },
    },
  },
  {
    to: "/watch-history",
    label: { vi: "Lịch sử xem", en: "Watch history" },
    icon: Video,
    section: "you",
    visibleInSidebar: true,
    placeholderCopy: {
      eyebrow: { vi: "Bạn", en: "You" },
      title: {
        vi: "Lịch sử xem đang được hoàn thiện.",
        en: "Watch history is being prepared.",
      },
      description: {
        vi: "Các video gần đây và tuyến xem lại sẽ được hiển thị ở đây.",
        en: "Recent videos and revisit history will be shown here.",
      },
      emptyTitle: {
        vi: "Chưa có lịch sử xem",
        en: "No watch history yet",
      },
      emptyDescription: {
        vi: "Trang này đang chờ dữ liệu lịch sử xem từ các buổi học sau đăng nhập.",
        en: "This page is waiting for viewing history from your signed-in study sessions.",
      },
    },
  },
  {
    to: "/saved-videos",
    label: { vi: "Video đã lưu", en: "Saved videos" },
    icon: BookmarkSimple,
    section: "you",
    visibleInSidebar: true,
    placeholderCopy: {
      eyebrow: { vi: "Bạn", en: "You" },
      title: {
        vi: "Kho video đã lưu đang được hoàn thiện.",
        en: "Saved videos are being prepared.",
      },
      description: {
        vi: "Các video bạn đánh dấu để học lại sẽ được đặt tại không gian này.",
        en: "Videos you bookmark for later practice will live in this space.",
      },
      emptyTitle: {
        vi: "Chưa có video đã lưu",
        en: "No saved videos yet",
      },
      emptyDescription: {
        vi: "Khi tính năng lưu video hoàn tất, các mục bạn giữ lại sẽ hiện ở đây.",
        en: "Once saving is completed, the videos you keep will appear here.",
      },
    },
  },
  {
    to: "/community",
    label: { vi: "Cộng đồng", en: "Community" },
    icon: UsersThree,
    section: "community",
    visibleInSidebar: true,
    placeholderCopy: {
      eyebrow: { vi: "Cộng đồng", en: "Community" },
      title: {
        vi: "Không gian cộng đồng đang được hoàn thiện.",
        en: "The community space is being prepared.",
      },
      description: {
        vi: "Bài viết, trao đổi và các hoạt động chia sẻ giữa người học sẽ xuất hiện tại đây.",
        en: "Posts, shared activity, and learner conversations will appear here.",
      },
      emptyTitle: {
        vi: "Cộng đồng sẽ sớm mở",
        en: "Community will open soon",
      },
      emptyDescription: {
        vi: "Trang này đang được chuẩn bị để kết nối người học trong các đợt cập nhật tiếp theo.",
        en: "This page is being prepared to connect learners in a later update.",
      },
    },
  },
  {
    to: "/leaderboard",
    label: { vi: "Bảng xếp hạng", en: "Leaderboard" },
    icon: Trophy,
    section: "community",
    visibleInSidebar: true,
  },
  {
    to: "/community/chat",
    label: { vi: "Trò chuyện", en: "Chat" },
    icon: ChatTeardropText,
    section: "community",
    visibleInSidebar: true,
    placeholderCopy: {
      eyebrow: { vi: "Cộng đồng", en: "Community" },
      title: {
        vi: "Khu trò chuyện đang được hoàn thiện.",
        en: "The chat space is being prepared.",
      },
      description: {
        vi: "Bạn sẽ có thể trao đổi theo chủ đề học, bài nghe và kinh nghiệm luyện tập tại đây.",
        en: "You will be able to discuss lessons, listening clips, and practice tips here.",
      },
      emptyTitle: {
        vi: "Trò chuyện sẽ sớm xuất hiện",
        en: "Chat will arrive soon",
      },
      emptyDescription: {
        vi: "Chúng tôi đang hoàn thiện luồng trò chuyện để đưa vào khối cộng đồng.",
        en: "We are finishing the chat flow before adding it to the community area.",
      },
    },
  },
  {
    to: "/community/feedback",
    label: { vi: "Feedback từ người dùng", en: "User feedback" },
    icon: HeartStraight,
    section: "community",
    visibleInSidebar: true,
    placeholderCopy: {
      eyebrow: { vi: "Cộng đồng", en: "Community" },
      title: {
        vi: "Khu feedback đang được hoàn thiện.",
        en: "The feedback space is being prepared.",
      },
      description: {
        vi: "Ý kiến, đề xuất và các phản hồi từ người dùng sẽ được hiển thị ở đây.",
        en: "Suggestions, ideas, and user feedback will be displayed here.",
      },
      emptyTitle: {
        vi: "Feedback sẽ sớm xuất hiện",
        en: "Feedback will arrive soon",
      },
      emptyDescription: {
        vi: "Trang này sẽ tập hợp các góp ý từ người học khi module cộng đồng được mở rộng.",
        en: "This page will collect learner feedback as the community module expands.",
      },
    },
  },
  {
    to: "/learning",
    label: { vi: "Thư viện", en: "Library" },
    icon: BookOpenText,
    section: "hidden",
    visibleInSidebar: false,
  },
  {
    to: "/dictionary",
    label: { vi: "Từ điển", en: "Dictionary" },
    icon: SpeakerHigh,
    section: "hidden",
    visibleInSidebar: false,
  },
  {
    to: "/statistics",
    label: { vi: "Thống kê", en: "Statistics" },
    icon: ChartBar,
    section: "hidden",
    visibleInSidebar: false,
  },
];

const sortedNavigationItems = [...appNavigationItems].sort(
  (left, right) => right.to.length - left.to.length,
);

export function resolveAppNavigationItem(pathname) {
  return sortedNavigationItems.find(
    (item) => pathname === item.to || pathname.startsWith(`${item.to}/`),
  );
}
