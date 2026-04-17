export const marketingNavItems = [
  {
    to: "/",
    label: { vi: "Trang chủ", en: "Home" },
  },
  {
    to: "/english/speaking",
    label: { vi: "Speaking", en: "Speaking" },
  },
  {
    to: "/english/writing",
    label: { vi: "Writing", en: "Writing" },
  },
  {
    to: "/english/listening",
    label: { vi: "Listening", en: "Listening" },
  },
  {
    to: "/english/reading",
    label: { vi: "Reading", en: "Reading" },
  },
  {
    to: "/english/pricing",
    label: { vi: "Pricing", en: "Pricing" },
    hiddenInNav: true,
  },
];

export const homePageContent = {
  hero: {
    ctaLabel: {
      vi: "Get My Free Test Score",
      en: "Get My Free Test Score",
    },
    description: {
      vi: "Môi trường phù hợp để học tiếng Anh hiệu quả.",
      en: "The right environment for effective English learning.",
    },
    proofBadges: {
      vi: ["General English", "IELTS support", "TOEIC support", "Study tracking"],
      en: ["General English", "IELTS support", "TOEIC support", "Study tracking"],
    },
    proofCopy: {
      vi: "Bắt đầu từ một môi trường học tiếng Anh rõ ràng, sau đó kéo dần sang mục tiêu IELTS hoặc TOEIC mà không phải đổi cách học.",
      en: "Start from a clear English learning system, then move into IELTS or TOEIC goals without changing the way you learn.",
    },
    proofTitle: {
      vi: "Một hệ học tiếng Anh chung cho luyện nền, luyện kỹ năng và ôn mục tiêu điểm.",
      en: "One English system for daily practice, skill building, and score goals.",
    },
    title: {
      vi: "Nâng trình cùng QuackUp, học và luyện tiếng Anh.",
      en: "QuackUp your level, study and practice English.",
    },
    skills: [
      {
        id: "speaking",
        icon: "speaking",
        title: "Speaking",
        to: "/english/speaking",
        description: {
          vi: "",
          en: "",
        },
      },
      {
        id: "writing",
        icon: "writing",
        title: "Writing",
        to: "/english/writing",
        description: {
          vi: "",
          en: "",
        },
      },
      {
        id: "listening",
        icon: "listening",
        title: "Listening",
        to: "/english/listening",
        description: {
          vi: "",
          en: "",
        },
      },
      {
        id: "reading",
        icon: "reading",
        title: "Reading",
        to: "/english/reading",
        description: {
          vi: "",
          en: "",
        },
      },
    ],
  },
  skillShowcase: {
    eyebrow: {
      vi: "Không gian kỹ năng",
      en: "Skill spaces",
    },
    title: {
      vi: "Không gian để học tiếng Anh theo cách bạn muốn.",
      en: "The space for learning English the way you want.",
    },
    description: {
      vi: "Từ speaking, writing, listening và reading đến practice và test, mỗi khối phục vụ một kiểu tiến bộ khác nhau trong cùng một hệ QuackUp.",
      en: "From speaking, writing, listening, and reading to practice and test, each block supports a different kind of progress inside the QuackUp system.",
    },
    comingSoonLabel: {
      vi: "Sắp thêm",
      en: "Coming next",
    },
    cards: [
      {
        id: "speaking",
        icon: "speaking",
        title: "Speaking",
        description: {
          vi: "Rèn phản xạ nói, nhịp câu và độ tự nhiên.",
          en: "Train response, pacing, and natural speech.",
        },
        to: "/english/speaking",
      },
      {
        id: "writing",
        icon: "writing",
        title: "Writing",
        description: {
          vi: "Viết rõ ý hơn với câu gọn và feedback ngắn.",
          en: "Write more clearly with shorter feedback loops.",
        },
        to: "/english/writing",
      },
      {
        id: "listening",
        icon: "listening",
        title: "Listening",
        description: {
          vi: "Nghe theo nhịp ngắn, replay và sửa đúng chỗ.",
          en: "Use short listening loops, replay, and focused fixes.",
        },
        to: "/english/listening",
      },
      {
        id: "reading",
        icon: "reading",
        title: "Reading",
        description: {
          vi: "Đọc theo block, giữ phrase và bám ngữ cảnh.",
          en: "Read by blocks, keep phrases, and stay in context.",
        },
        to: "/english/reading",
      },
      {
        id: "practice",
        icon: "practice",
        title: "Practice",
        description: {
          vi: "Nhịp luyện hằng ngày để giữ đều lâu dài.",
          en: "A daily rhythm designed for steady repetition.",
        },
      },
      {
        id: "test",
        icon: "test",
        title: "Test",
        description: {
          vi: "Kiểm tra trình độ và định hướng bước tiếp theo.",
          en: "Check your level and shape the next move.",
        },
      },
    ],
  },
  testimonials: {
    title: {
      vi: "Người học tiếng Anh nói gì về QuackUp",
      en: "What English Students Say",
    },
    description: {
      vi: "Khung này đang được giữ chỗ cho phản hồi thật từ người học.",
      en: "This space is reserved for real learner feedback.",
    },
  },
};

export const marketingFeaturePages = {
  speaking: {
    ctaLabel: {
      vi: "Bắt đầu luyện speaking",
      en: "Start speaking practice",
    },
    description: {
      vi: "Giữ nhịp nói, phản xạ câu, và cụm từ dùng được",
      en: "Train rhythm, response, and useful phrases",
    },
    eyebrow: {
      vi: "Speaking",
      en: "Speaking",
    },
    icon: "speaking",
    signals: {
      vi: ["Nhịp nói", "General English", "IELTS · TOEIC"],
      en: ["Speaking rhythm", "General English", "IELTS · TOEIC"],
    },
    title: {
      vi: "Luyện speaking tiếng Anh rõ",
      en: "Build clearer English speaking",
    },
  },
  writing: {
    ctaLabel: {
      vi: "Bắt đầu luyện writing",
      en: "Start writing practice",
    },
    description: {
      vi: "Tập trung vào ý, câu, và phản hồi ngắn để bạn viết tốt hơn cho học tập, công việc và các mục tiêu đánh giá.",
      en: "Focus on ideas, sentence quality, and short feedback loops for study, work, and score-driven goals.",
    },
    eyebrow: {
      vi: "Writing",
      en: "Writing",
    },
    icon: "writing",
    signals: {
      vi: ["Ý rõ", "Feedback nhanh", "Writing practice"],
      en: ["Clear ideas", "Fast feedback", "Writing practice"],
    },
    title: {
      vi: "Luyện tập viết tiếng anh mỗi ngày",
      en: "Practice English writing every day",
    },
  },
  listening: {
    ctaLabel: {
      vi: "Bắt đầu luyện listening",
      en: "Start listening practice",
    },
    description: {
      vi: "Từ clip đời thường đến bài nghe có mục tiêu cho General English, IELTS và TOEIC, bạn đều biết mình hụt ở đâu để sửa đúng chỗ.",
      en: "From everyday clips to goal-based English listening for IELTS and TOEIC, you can see exactly where the miss happened and fix it fast.",
    },
    eyebrow: {
      vi: "Listening",
      en: "Listening",
    },
    icon: "listening",
    signals: {
      vi: [],
      en: [],
    },
    title: {
      vi: "Luyện nghe tiếng Anh với phương pháp Shadowing",
      en: "Train English listening with the Shadowing method",
    },
  },
  reading: {
    ctaLabel: {
      vi: "Bắt đầu luyện reading",
      en: "Start reading practice",
    },
    description: {
      vi: "Đọc theo block, giữ phrase trong ngữ cảnh, và quay lại đúng đoạn khó cho General English cùng các mục tiêu IELTS và TOEIC.",
      en: "Read by blocks, keep phrases in context, and revisit the right hard sections for general English together with IELTS and TOEIC goals.",
    },
    eyebrow: {
      vi: "Reading",
      en: "Reading",
    },
    icon: "reading",
    signals: {
      vi: [],
      en: [],
    },
    title: {
      vi: "Luyện đọc tiếng Anh theo block, giữ phrase và bám ngữ cảnh.",
      en: "Practice English reading by blocks, keep phrases, and stay in context.",
    },
  },
};

export const marketingTestimonialsByPage = {
  home: {
    title: {
      vi: "Người học tiếng Anh nói gì về QuackUp",
      en: "What English Students Say",
    },
    description: {
      vi: "Khung này đang được giữ chỗ cho phản hồi thật từ người học.",
      en: "This space is reserved for real learner feedback.",
    },
  },
  speaking: {
    title: {
      vi: "Người học speaking nói gì",
      en: "What speaking learners say",
    },
    description: {
      vi: "Khu này sẽ dùng cho phản hồi về phản xạ nói, độ trôi và sự tự tin khi giao tiếp.",
      en: "This section is reserved for feedback about response speed, fluency, and speaking confidence.",
    },
  },
  writing: {
    title: {
      vi: "Người học writing nói gì",
      en: "What writing learners say",
    },
    description: {
      vi: "Khu này sẽ dùng cho phản hồi về ý tưởng, cấu trúc câu và tốc độ cải thiện khi viết.",
      en: "This section is reserved for feedback about clarity, sentence structure, and writing improvement.",
    },
  },
  listening: {
    title: {
      vi: "Người học listening nói gì",
      en: "What listening learners say",
    },
    description: {
      vi: "Khu này sẽ dùng cho phản hồi về khả năng nghe bắt ý, sửa chỗ hụt và giữ nhịp nghe đều.",
      en: "This section is reserved for feedback about catching key details, fixing misses, and keeping a steady listening rhythm.",
    },
  },
  reading: {
    title: {
      vi: "Người học reading nói gì",
      en: "What reading learners say",
    },
    description: {
      vi: "Khu này sẽ dùng cho phản hồi về tốc độ đọc, giữ phrase và bám ngữ cảnh khi xử lý đoạn văn.",
      en: "This section is reserved for feedback about reading speed, phrase retention, and staying in context.",
    },
  },
};

export const pricingContent = {
  eyebrow: {
    vi: "Pricing",
    en: "Pricing",
  },
  title: {
    vi: "Khung pricing để dẫn người học từ thử miễn phí sang nhịp học đều.",
    en: "A pricing structure that moves learners from free trial into a steady study rhythm.",
  },
  description: {
    vi: "Trang này là khung marketing cho pricing. Giá và quyền lợi có thể chỉnh sau, nhưng layout phải đủ rõ để mở rộng mà không vỡ cấu trúc.",
    en: "This page is the pricing marketing scaffold. Numbers and benefits can change later, but the layout should already be clear enough to scale.",
  },
  note: {
    vi: "Bản pricing hiện tại là draft frontend để khóa cấu trúc page trước.",
    en: "This pricing page is a frontend draft used to lock the structure first.",
  },
  plans: [
    {
      id: "starter",
      name: { vi: "Starter", en: "Starter" },
      price: { vi: "0đ", en: "$0" },
      cadence: { vi: "miễn phí", en: "free forever" },
      summary: {
        vi: "Dùng để bắt đầu, thử các block học ngắn, và cảm nhịp sản phẩm.",
        en: "Built for first sessions, short blocks, and getting the feel of the product.",
      },
      features: {
        vi: ["Phiên học ngắn mỗi ngày", "Lưu tiến độ cơ bản", "Truy cập khối mở đầu"],
        en: ["Short daily sessions", "Basic progress saving", "Access to starter blocks"],
      },
      highlight: false,
    },
    {
      id: "practice",
      name: { vi: "Practice", en: "Practice" },
      price: { vi: "169.000đ", en: "$7" },
      cadence: { vi: "/ tháng", en: "/ month" },
      summary: {
        vi: "Dành cho người học muốn giữ nhịp luyện đều với nhiều nội dung và lịch ôn rõ hơn.",
        en: "For learners who want a steady practice rhythm with more content and clearer review flow.",
      },
      features: {
        vi: [
          "Mở toàn bộ speaking, writing, listening, reading",
          "Ôn từ vựng theo nhịp",
          "Theo dõi tiến độ sâu hơn",
        ],
        en: [
          "Unlock speaking, writing, listening, and reading",
          "Vocabulary review rhythm",
          "Deeper progress tracking",
        ],
      },
      highlight: true,
    },
    {
      id: "intensive",
      name: { vi: "Intensive", en: "Intensive" },
      price: { vi: "329.000đ", en: "$13" },
      cadence: { vi: "/ tháng", en: "/ month" },
      summary: {
        vi: "Dành cho người học cần khối lượng luyện cao hơn và nhiều chu kỳ quay lại hơn.",
        en: "For learners who need more practice volume and more aggressive revisit cycles.",
      },
      features: {
        vi: ["Nhiều phiên luyện hơn", "Nhịp ôn dày hơn", "Ưu tiên khối nâng cao"],
        en: ["Higher practice volume", "Denser review rhythm", "Priority advanced blocks"],
      },
      highlight: false,
    },
  ],
  comparisonTitle: {
    vi: "Cấu trúc so sánh nên được giữ rõ ngay từ đầu.",
    en: "The comparison structure should be explicit from the start.",
  },
  comparisonRows: [
    {
      label: {
        vi: "Speaking / Writing / Listening / Reading",
        en: "Speaking / Writing / Listening / Reading",
      },
      values: ["Starter", "Full", "Full"],
    },
    {
      label: { vi: "Từ vựng theo ngữ cảnh", en: "Context vocabulary" },
      values: ["Basic", "Expanded", "Expanded"],
    },
    {
      label: { vi: "Theo dõi tiến độ", en: "Progress tracking" },
      values: ["Basic", "Advanced", "Advanced"],
    },
    {
      label: { vi: "Nhịp ôn quay lại", en: "Revisit rhythm" },
      values: ["Light", "Standard", "Dense"],
    },
  ],
};
