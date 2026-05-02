import type { ListeningCategory, ListeningLessonDetail } from "./listening.types";

const zooVideoId = "jNQXAC9IVRw";
const transcriptSourceUrl =
  "https://www.youtubetranscript.dev/transcript/jNQXAC9IVRw/me-at-the-zoo";

export const listeningCategories: ListeningCategory[] = [
  {
    id: "bbc-learning-english",
    label: {
      vi: "BBC Learning English",
      en: "BBC Learning English",
    },
  },
  {
    id: "business",
    label: {
      vi: "Business",
      en: "Business",
    },
  },
  {
    id: "health-medicine",
    label: {
      vi: "Health & Medicine",
      en: "Health & Medicine",
    },
  },
  {
    id: "job-interview",
    label: {
      vi: "Job Interview",
      en: "Job Interview",
    },
  },
  {
    id: "technology-science",
    label: {
      vi: "Technology & Science",
      en: "Technology & Science",
    },
  },
  {
    id: "travel-culture",
    label: {
      vi: "Travel & Culture",
      en: "Travel & Culture",
    },
  },
  {
    id: "daily-conversations",
    label: {
      vi: "Daily Conversations",
      en: "Daily Conversations",
    },
  },
  {
    id: "ielts",
    isHot: true,
    label: {
      vi: "IELTS",
      en: "IELTS",
    },
  },
  {
    id: "toeic",
    isHot: true,
    label: {
      vi: "TOEIC",
      en: "TOEIC",
    },
  },
];

const zooSegments = [
  {
    id: "seg-elephants",
    order: 1,
    speaker: "Speaker",
    startSeconds: 0,
    endSeconds: 5,
    transcript: "All right, so here we are in front of the elephants.",
    prompt: {
      vi: "Nghe câu mở đầu và gõ lại chính xác.",
      en: "Listen to the opening line and type it exactly.",
    },
    targetPhrases: ["in front of", "the elephants"],
    hints: [
      {
        phrase: "in front of",
        type: "LINKING",
        explanation: {
          vi: "Cụm này dễ nghe dính thành một nhịp ngắn.",
          en: "This phrase often blends into one short rhythm.",
        },
      },
      {
        phrase: "the elephants",
        type: "WEAK_SOUND",
        explanation: {
          vi: "Âm /the/ rất nhẹ trước danh từ chính.",
          en: "The word 'the' is light before the main noun.",
        },
      },
    ],
    vocabulary: [
      {
        term: "in front of",
        meaning: {
          vi: "ở phía trước",
          en: "positioned before something",
        },
        context: "in front of the elephants",
      },
    ],
  },
  {
    id: "seg-cool",
    order: 2,
    speaker: "Speaker",
    startSeconds: 5,
    endSeconds: 11,
    transcript: "The cool thing about these guys is that they have really long trunks.",
    prompt: {
      vi: "Tập bắt cụm nối giữa ý chính và chi tiết.",
      en: "Catch the phrase that connects the main idea to the detail.",
    },
    targetPhrases: ["the cool thing", "really long trunks"],
    hints: [
      {
        phrase: "the cool thing",
        type: "EXACT_WORDING",
        explanation: {
          vi: "Người nói dùng cụm tự nhiên, không phải cách diễn đạt sách vở.",
          en: "The speaker uses a natural phrase rather than textbook wording.",
        },
      },
      {
        phrase: "really long trunks",
        type: "WEAK_SOUND",
        explanation: {
          vi: "Trọng âm rơi vào 'long trunks', còn 'really' lướt nhanh.",
          en: "The stress falls on 'long trunks' while 'really' moves quickly.",
        },
      },
    ],
    vocabulary: [
      {
        term: "trunks",
        meaning: {
          vi: "vòi voi",
          en: "long noses of elephants",
        },
        context: "really long trunks",
      },
    ],
  },
  {
    id: "seg-say",
    order: 3,
    speaker: "Speaker",
    startSeconds: 11,
    endSeconds: 18,
    transcript: "And that's cool, and that's pretty much all there is to say.",
    prompt: {
      vi: "Nghe phần kết và chú ý cụm nói tự nhiên.",
      en: "Listen to the closing line and focus on the natural phrase.",
    },
    targetPhrases: ["pretty much", "all there is to say"],
    hints: [
      {
        phrase: "pretty much",
        type: "UNKNOWN_PHRASE",
        explanation: {
          vi: "Cụm này có nghĩa gần như, hầu như.",
          en: "This phrase means almost or more or less.",
        },
      },
      {
        phrase: "all there is to say",
        type: "LINKING",
        explanation: {
          vi: "Các từ chức năng nối nhanh, dễ mất 'there is'.",
          en: "The function words link quickly, so 'there is' can disappear.",
        },
      },
    ],
    vocabulary: [
      {
        term: "pretty much",
        meaning: {
          vi: "gần như, hầu như",
          en: "almost; more or less",
        },
        context: "pretty much all there is to say",
      },
    ],
  },
] satisfies ListeningLessonDetail["segments"];

type LessonSeed = Omit<
  ListeningLessonDetail,
  | "segmentCount"
  | "segments"
  | "transcriptSourceUrl"
  | "youtubeEndSeconds"
  | "youtubeStartSeconds"
  | "youtubeVideoId"
>;

function thumbnailUrl(seed: string) {
  return `https://picsum.photos/seed/quackup-${seed}/960/540`;
}

function makeLesson(seed: LessonSeed): ListeningLessonDetail {
  return {
    ...seed,
    youtubeVideoId: zooVideoId,
    youtubeStartSeconds: 0,
    youtubeEndSeconds: 18,
    transcriptSourceUrl,
    segmentCount: zooSegments.length,
    segments: zooSegments,
  };
}

export const listeningLessons: ListeningLessonDetail[] = [
  makeLesson({
    id: "water-bbc",
    title: {
      vi: "Short speech: elephants at the zoo",
      en: "Short speech: elephants at the zoo",
    },
    description: {
      vi: "Một clip rất ngắn để luyện nghe chính xác từng câu trước khi chuyển sang shadowing.",
      en: "A very short clip for exact sentence listening before moving into shadowing.",
    },
    categoryId: "bbc-learning-english",
    source: "YouTube",
    level: "A2",
    durationMinutes: 3,
    thumbnailUrl: "https://i.ytimg.com/vi/jNQXAC9IVRw/hqdefault.jpg",
    isNew: true,
    skillFocus: [
      {
        vi: "Bắt từ chức năng yếu",
        en: "Catch weak function words",
      },
      {
        vi: "Gõ lại toàn câu",
        en: "Type the whole sentence",
      },
      {
        vi: "Shadowing sau khi hiểu câu",
        en: "Shadow after understanding",
      },
    ],
  }),
  makeLesson({
    id: "future-food",
    title: {
      vi: "The future of food",
      en: "The future of food",
    },
    description: {
      vi: "Luyện nghe nhịp giải thích ngắn, phù hợp cho các câu hỏi đời sống và khoa học nhẹ.",
      en: "Practice short explanatory rhythm for everyday science and lifestyle topics.",
    },
    categoryId: "bbc-learning-english",
    source: "BBC Learning English",
    level: "B1",
    durationMinutes: 6,
    thumbnailUrl: thumbnailUrl("future-food"),
    isNew: true,
    skillFocus: [
      {
        vi: "Nghe ý chính",
        en: "Hear the main idea",
      },
      {
        vi: "Cụm diễn giải",
        en: "Explanation chunks",
      },
    ],
  }),
  makeLesson({
    id: "smartphone",
    title: {
      vi: "Keeping kids off smartphones",
      en: "Keeping kids off smartphones",
    },
    description: {
      vi: "Tập trung vào nhịp nói tự nhiên và cụm từ sinh hoạt.",
      en: "Focus on natural rhythm and everyday phrasing.",
    },
    categoryId: "bbc-learning-english",
    source: "BBC Learning English",
    level: "B2",
    durationMinutes: 6,
    thumbnailUrl: thumbnailUrl("smartphone"),
    skillFocus: [
      {
        vi: "Nhịp nói ngắn",
        en: "Short spoken rhythm",
      },
      {
        vi: "Cụm diễn đạt tự nhiên",
        en: "Natural phrases",
      },
    ],
  }),
  makeLesson({
    id: "healthy",
    title: {
      vi: "Learning a new food culture",
      en: "Learning a new food culture",
    },
    description: {
      vi: "Lặp lại các câu ngắn, phân loại lỗi nghe và lưu cụm từ theo ngữ cảnh.",
      en: "Repeat short lines, classify listening errors, and save phrases with context.",
    },
    categoryId: "travel-culture",
    source: "BBC Learning English",
    level: "B2",
    durationMinutes: 6,
    thumbnailUrl: thumbnailUrl("food-culture"),
    skillFocus: [
      {
        vi: "Phân loại lỗi nghe",
        en: "Classify listening misses",
      },
      {
        vi: "Lưu phrase theo context",
        en: "Save phrases with context",
      },
    ],
  }),
  makeLesson({
    id: "taste",
    title: {
      vi: "What decides our taste?",
      en: "What decides our taste?",
    },
    description: {
      vi: "Một bài nghe ngắn cho người học mới, tập trung vào nghe đủ từ trong câu.",
      en: "A short starter drill focused on hearing every word in a sentence.",
    },
    categoryId: "health-medicine",
    source: "BBC Learning English",
    level: "A2",
    durationMinutes: 6,
    thumbnailUrl: thumbnailUrl("taste"),
    skillFocus: [
      {
        vi: "Nghe đủ câu",
        en: "Hear the full line",
      },
      {
        vi: "Lặp lại chậm",
        en: "Repeat slowly",
      },
    ],
  }),
  makeLesson({
    id: "sam-altman",
    title: {
      vi: "Interview rhythm drill",
      en: "Interview rhythm drill",
    },
    description: {
      vi: "Luyện cách giữ nhịp khi câu nói có nhiều cụm ngắn nối liên tục.",
      en: "Practice staying with the rhythm when a line has several short chunks.",
    },
    categoryId: "job-interview",
    source: "Interview English",
    level: "C1",
    durationMinutes: 4,
    thumbnailUrl: thumbnailUrl("interview-rhythm"),
    skillFocus: [
      {
        vi: "Nhịp phỏng vấn",
        en: "Interview rhythm",
      },
      {
        vi: "Cụm nối nhanh",
        en: "Fast linking chunks",
      },
    ],
  }),
  makeLesson({
    id: "food-culture",
    title: {
      vi: "Natural phrase drill",
      en: "Natural phrase drill",
    },
    description: {
      vi: "Tập nhận ra cụm nói tự nhiên, sau đó lưu phrase cùng transcript và timestamp.",
      en: "Recognize natural phrases, then save them with transcript and timestamp.",
    },
    categoryId: "daily-conversations",
    source: "Daily Conversations",
    level: "B1",
    durationMinutes: 4,
    thumbnailUrl: thumbnailUrl("natural-phrase"),
    skillFocus: [
      {
        vi: "Cụm tự nhiên",
        en: "Natural phrases",
      },
      {
        vi: "Lưu theo ngữ cảnh",
        en: "Save with context",
      },
    ],
  }),
  makeLesson({
    id: "laser-blasters",
    title: {
      vi: "Will laser blasters ever be possible?",
      en: "Will laser blasters ever be possible?",
    },
    description: {
      vi: "Nghe cách diễn giải một ý khoa học bằng câu ngắn, rõ nhịp.",
      en: "Hear a science idea explained through short, clearly paced lines.",
    },
    categoryId: "technology-science",
    source: "TED-Ed",
    level: "C1",
    durationMinutes: 6,
    thumbnailUrl: thumbnailUrl("laser-blasters"),
    isNew: true,
    skillFocus: [
      {
        vi: "Từ khóa khoa học",
        en: "Science keywords",
      },
      {
        vi: "Nối ý nhanh",
        en: "Fast idea linking",
      },
    ],
  }),
  makeLesson({
    id: "future-earth",
    title: {
      vi: "What Earth in 2125 could look like",
      en: "What Earth in 2125 could look like",
    },
    description: {
      vi: "Tập nghe dự đoán, so sánh và các cụm mô tả tương lai.",
      en: "Practice predictions, comparisons, and future-focused phrases.",
    },
    categoryId: "technology-science",
    source: "TED-Ed",
    level: "C1",
    durationMinutes: 5,
    thumbnailUrl: thumbnailUrl("future-earth"),
    isNew: true,
    skillFocus: [
      {
        vi: "Cụm dự đoán",
        en: "Prediction phrases",
      },
      {
        vi: "So sánh",
        en: "Comparisons",
      },
    ],
  }),
  makeLesson({
    id: "cool-planet",
    title: {
      vi: "The surprising way we can cool the planet",
      en: "The surprising way we can cool the planet",
    },
    description: {
      vi: "Luyện nghe chủ đề môi trường với cụm nối nguyên nhân và kết quả.",
      en: "Practice environmental listening with cause and result links.",
    },
    categoryId: "technology-science",
    source: "TED-Ed",
    level: "C1",
    durationMinutes: 5,
    thumbnailUrl: thumbnailUrl("cool-planet"),
    isNew: true,
    skillFocus: [
      {
        vi: "Nguyên nhân kết quả",
        en: "Cause and result",
      },
      {
        vi: "Từ học thuật",
        en: "Academic words",
      },
    ],
  }),
  makeLesson({
    id: "energy-toast",
    title: {
      vi: "The solution to our energy problems is a toaster",
      en: "The solution to our energy problems is a toaster",
    },
    description: {
      vi: "Nghe một lập luận ngắn có ví dụ đời thường và nhịp nói nhanh.",
      en: "Hear a short argument with everyday examples and fast rhythm.",
    },
    categoryId: "business",
    source: "TED-Ed",
    level: "B2",
    durationMinutes: 4,
    thumbnailUrl: thumbnailUrl("energy-toast"),
    isNew: true,
    skillFocus: [
      {
        vi: "Lập luận ngắn",
        en: "Short argument",
      },
      {
        vi: "Ví dụ đời thường",
        en: "Everyday examples",
      },
    ],
  }),
  makeLesson({
    id: "computer-power",
    title: {
      vi: "Have we reached the limit of computer power?",
      en: "Have we reached the limit of computer power?",
    },
    description: {
      vi: "Tập bắt số liệu, giới hạn và cách nhấn trọng âm trong câu kỹ thuật.",
      en: "Catch numbers, limits, and stress in technical sentences.",
    },
    categoryId: "technology-science",
    source: "TED-Ed",
    level: "C1",
    durationMinutes: 5,
    thumbnailUrl: thumbnailUrl("computer-power"),
    isNew: true,
    skillFocus: [
      {
        vi: "Số liệu",
        en: "Numbers",
      },
      {
        vi: "Cụm kỹ thuật",
        en: "Technical chunks",
      },
    ],
  }),
  makeLesson({
    id: "ielts-map",
    title: {
      vi: "IELTS map description drill",
      en: "IELTS map description drill",
    },
    description: {
      vi: "Luyện nghe các cụm mô tả vị trí và thay đổi trong bài IELTS.",
      en: "Practice location and change phrases for IELTS tasks.",
    },
    categoryId: "ielts",
    source: "IELTS",
    level: "B2",
    durationMinutes: 7,
    thumbnailUrl: thumbnailUrl("ielts-map"),
    skillFocus: [
      {
        vi: "Vị trí",
        en: "Location",
      },
      {
        vi: "Thay đổi",
        en: "Change",
      },
    ],
  }),
  makeLesson({
    id: "toeic-office",
    title: {
      vi: "TOEIC office announcements",
      en: "TOEIC office announcements",
    },
    description: {
      vi: "Nghe thông báo công sở, lịch hẹn và các cụm yêu cầu hành động.",
      en: "Hear office announcements, schedules, and action requests.",
    },
    categoryId: "toeic",
    source: "TOEIC",
    level: "B1",
    durationMinutes: 5,
    thumbnailUrl: thumbnailUrl("toeic-office"),
    skillFocus: [
      {
        vi: "Thông báo",
        en: "Announcements",
      },
      {
        vi: "Lịch hẹn",
        en: "Schedules",
      },
    ],
  }),
];
