export const marketingNavItems = [
  {
    to: "/",
    label: { vi: "Trang chủ", en: "Home" },
  },
  {
    to: "/english/speaking",
    label: { vi: "Luyện nói", en: "Speaking" },
  },
  {
    to: "/english/writing",
    label: { vi: "Luyện viết", en: "Writing" },
  },
  {
    to: "/english/listening",
    label: { vi: "Luyện nghe", en: "Listening" },
  },
  {
    to: "/english/reading",
    label: { vi: "Luyện đọc", en: "Reading" },
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
      vi: "",
      en: "",
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
      vi: "Luyện nghe với Shadowing",
      en: "Train Listening with Shadowing",
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
      vi: "Luyện đọc tiếng Anh theo block.",
      en: "Practice English reading by blocks.",
    },
  },
};

export const marketingTestimonialsByPage = {
  home: {
    variant: "carousel",
    title: {
      vi: "Người học tiếng Anh nói gì về QuackUp",
      en: "What English Students Say",
    },
    description: {
      vi: "",
      en: "",
    },
    items: [
      {
        id: "home-linh-bui",
        initials: "LB",
        name: "Linh Bui",
        rating: 5,
        quote: {
          vi: "QuackUp giúp tôi giữ nhịp học 20 phút mỗi tối. Tôi không còn phải nghĩ hôm nay nên học kỹ năng nào trước.",
          en: "QuackUp helped me keep a 20-minute evening study rhythm. I no longer waste time deciding which skill to start with.",
        },
        meta: {
          vi: "General English, Đà Nẵng",
          en: "General English, Da Nang",
        },
        badge: {
          vi: "Nhịp học 21 ngày",
          en: "21-day rhythm",
        },
      },
      {
        id: "home-omar-khaled",
        initials: "OK",
        name: "Omar Khaled",
        rating: 5,
        quote: {
          vi: "Tôi dùng phần speaking và writing xen kẽ trong cùng một tuần. Cách chia block ngắn làm tôi quay lại đều hơn trước.",
          en: "I alternate speaking and writing in the same week. The short blocks make it much easier to keep coming back.",
        },
        meta: {
          vi: "IELTS self-study, Hà Nội",
          en: "IELTS self-study, Hanoi",
        },
        badge: {
          vi: "Tăng đều mỗi tuần",
          en: "Steady weekly gain",
        },
      },
      {
        id: "home-mai-chau",
        initials: "MC",
        name: "Mai Chau Le",
        rating: 5,
        quote: {
          vi: "Tôi thích việc có thể đi từ nền tiếng Anh chung sang mục tiêu TOEIC mà không phải đổi hệ học hay đổi cảm giác giao diện.",
          en: "I like that I can move from general English into TOEIC prep without changing the learning flow or the interface feel.",
        },
        meta: {
          vi: "TOEIC review, Hải Phòng",
          en: "TOEIC review, Hai Phong",
        },
        badge: {
          vi: "TOEIC reset rõ ràng",
          en: "Clear TOEIC reset",
        },
      },
      {
        id: "home-hana-yusuf",
        initials: "HY",
        name: "Hana Yusuf",
        rating: 5,
        quote: {
          vi: "Phần nghe ngắn rồi sửa ngay sau đó phù hợp với tôi hơn kiểu học dồn. Cảm giác tiến bộ rõ hơn sau từng buổi.",
          en: "The short listening loops with immediate fixes work better for me than long study sessions. Progress feels visible after each session.",
        },
        meta: {
          vi: "Daily practice, Cần Thơ",
          en: "Daily practice, Can Tho",
        },
        badge: {
          vi: "Giữ đều 4 tuần",
          en: "4-week streak",
        },
      },
      {
        id: "home-victor-hoang",
        initials: "VH",
        name: "Victor Hoang",
        rating: 5,
        quote: {
          vi: "Dashboard và lộ trình rất gọn. Tôi nhìn là biết mình đang học kỹ năng nào và bước tiếp theo là gì.",
          en: "The dashboard and study flow are compact. I can tell at a glance what skill I am training and what the next step is.",
        },
        meta: {
          vi: "Skill rotation, TP.HCM",
          en: "Skill rotation, Ho Chi Minh City",
        },
        badge: {
          vi: "Đi đúng lộ trình",
          en: "Clear next step",
        },
      },
      {
        id: "home-sofia-petrescu",
        initials: "SP",
        name: "Sofia Petrescu",
        rating: 5,
        quote: {
          vi: "Tôi dùng QuackUp để giữ tiếng Anh đều trong tuần làm việc. Không cần buổi học quá dài nhưng vẫn thấy mình không bị tụt.",
          en: "I use QuackUp to keep my English active during busy work weeks. Sessions stay short, but I never feel like I am slipping back.",
        },
        meta: {
          vi: "Working professional, Nha Trang",
          en: "Working professional, Nha Trang",
        },
        badge: {
          vi: "Giữ nền ổn định",
          en: "Stable foundation",
        },
      },
      {
        id: "home-an-pham",
        initials: "AP",
        name: "An Pham",
        rating: 5,
        quote: {
          vi: "Tôi thấy phần review và phần luyện kỹ năng nối với nhau tự nhiên. Điều đó làm tôi ít bỏ dở giữa chừng hơn.",
          en: "The review flow and the skill practice blocks connect naturally. That makes me much less likely to drop the routine halfway.",
        },
        meta: {
          vi: "Mixed-goal learner, Huế",
          en: "Mixed-goal learner, Hue",
        },
        badge: {
          vi: "Quay lại đều hơn",
          en: "More consistent return",
        },
      },
    ],
  },
  speaking: {
    variant: "grid",
    title: {
      vi: "Người học speaking nói gì",
      en: "What speaking learners say",
    },
    description: {
      vi: "",
      en: "",
    },
    items: [
      {
        id: "speaking-quynh-nguyen",
        initials: "QN",
        name: "Quynh Nguyen",
        rating: 5,
        quote: {
          vi: "Tôi bớt bị đứng lại giữa câu vì phần speaking ép tôi phản xạ theo nhịp ngắn. Điều này hợp hơn việc nói một đoạn quá dài.",
          en: "I pause much less in the middle of sentences because the speaking blocks train quick response in short rounds.",
        },
        meta: {
          vi: "Speaking practice, Hà Nội",
          en: "Speaking practice, Hanoi",
        },
        badge: {
          vi: "Phản xạ nhanh hơn",
          en: "Faster response",
        },
      },
      {
        id: "speaking-mateo-silva",
        initials: "MS",
        name: "Mateo Silva",
        rating: 5,
        quote: {
          vi: "Điểm mạnh của phần này là tôi nghe lại được nhịp nói của mình và chỉnh ngay ở cụm bị gãy, không phải chờ đến cuối buổi.",
          en: "The best part is hearing my own speaking rhythm and fixing the broken phrases immediately instead of waiting until the end.",
        },
        meta: {
          vi: "Conversation goal, TP.HCM",
          en: "Conversation goal, Ho Chi Minh City",
        },
        badge: {
          vi: "Nhịp câu rõ hơn",
          en: "Clearer pacing",
        },
      },
      {
        id: "speaking-aiko-tran",
        initials: "AT",
        name: "Aiko Tran",
        rating: 5,
        quote: {
          vi: "Tôi dùng phần speaking để giữ độ tự nhiên trước các buổi họp tiếng Anh. QuackUp làm tôi đỡ sợ cảm giác phải nói ngay.",
          en: "I use the speaking flow to stay natural before English meetings. It makes the pressure of answering immediately much easier to handle.",
        },
        meta: {
          vi: "Work English, Bình Dương",
          en: "Work English, Binh Duong",
        },
        badge: {
          vi: "Tự tin hơn khi nói",
          en: "More confident speaking",
        },
      },
      {
        id: "speaking-karim-dabbous",
        initials: "KD",
        name: "Karim Dabbous",
        rating: 5,
        quote: {
          vi: "Tôi thích cách phần speaking tách việc phản xạ và phát âm thành các bước nhỏ. Nó khiến tôi thấy tiến bộ thật, không bị mơ hồ.",
          en: "I like how the speaking practice breaks response and pronunciation into smaller steps. Progress feels concrete instead of vague.",
        },
        meta: {
          vi: "IELTS speaking prep, Đà Lạt",
          en: "IELTS speaking prep, Da Lat",
        },
        badge: {
          vi: "Bám sát mục tiêu nói",
          en: "Speaking goal aligned",
        },
      },
    ],
  },
  writing: {
    variant: "grid",
    title: {
      vi: "Người học writing nói gì",
      en: "What writing learners say",
    },
    description: {
      vi: "",
      en: "",
    },
    items: [
      {
        id: "writing-thu-ha",
        initials: "TH",
        name: "Thu Ha Pham",
        rating: 5,
        quote: {
          vi: "Tôi viết gọn hơn vì phần writing khiến tôi nhìn rõ câu nào đang dài và ý nào đang bị lệch khỏi trọng tâm.",
          en: "I write more tightly now because the writing flow makes it obvious when a sentence is too long or an idea drifts off target.",
        },
        meta: {
          vi: "Writing practice, Hải Phòng",
          en: "Writing practice, Hai Phong",
        },
        badge: {
          vi: "Câu gọn hơn",
          en: "Tighter sentences",
        },
      },
      {
        id: "writing-daniel-noor",
        initials: "DN",
        name: "Daniel Noor",
        rating: 5,
        quote: {
          vi: "Điểm tôi thích nhất là vòng phản hồi ngắn. Tôi sửa được ngay ở đoạn đang viết thay vì đợi gom rất nhiều lỗi rồi mới xem lại.",
          en: "My favorite part is the short feedback loop. I can fix a paragraph while writing it instead of waiting for a huge list of mistakes later.",
        },
        meta: {
          vi: "Work writing, Cần Thơ",
          en: "Work writing, Can Tho",
        },
        badge: {
          vi: "Feedback vào đúng lúc",
          en: "Timely feedback",
        },
      },
      {
        id: "writing-minh-anh",
        initials: "MA",
        name: "Minh Anh Do",
        rating: 5,
        quote: {
          vi: "Phần writing hợp với tôi vì nó kéo sự chú ý về ý chính trước, rồi mới đến câu chữ. Tôi ít bị lan man hơn nhiều.",
          en: "The writing structure works for me because it brings the focus back to the main idea first, then the sentence form. I ramble much less now.",
        },
        meta: {
          vi: "IELTS writing prep, Huế",
          en: "IELTS writing prep, Hue",
        },
        badge: {
          vi: "Ý rõ hơn",
          en: "Clearer ideas",
        },
      },
      {
        id: "writing-salma-idris",
        initials: "SI",
        name: "Salma Idris",
        rating: 5,
        quote: {
          vi: "Tôi thích việc mỗi lần viết xong đều biết phải sửa chỗ nào trước. Không còn cảm giác nhìn cả đoạn văn và không biết bắt đầu từ đâu.",
          en: "I like always knowing what to fix first after each draft. I no longer look at a full paragraph and wonder where to begin.",
        },
        meta: {
          vi: "Daily writing, Đà Nẵng",
          en: "Daily writing, Da Nang",
        },
        badge: {
          vi: "Sửa đúng trọng tâm",
          en: "Focused revision",
        },
      },
    ],
  },
  listening: {
    variant: "hidden",
    title: {
      vi: "Người học listening nói gì",
      en: "What listening learners say",
    },
    description: {
      vi: "",
      en: "",
    },
    items: [],
  },
  reading: {
    variant: "hidden",
    title: {
      vi: "Người học reading nói gì",
      en: "What reading learners say",
    },
    description: {
      vi: "",
      en: "",
    },
    items: [],
  },
};

export const pricingContent = {
  eyebrow: {
    vi: "Pricing",
    en: "Pricing",
  },
  title: {
    vi: "",
    en: "",
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
