import { z } from "zod";
import { listeningCategories, listeningLessons } from "./listening.fixtures";
import type { ListeningLessonDetail } from "./listening.types";

const localizedTextSchema = z.object({
  vi: z.string().trim().min(1),
  en: z.string().trim().min(1),
});

const importedLessonSeedSchema = z.object({
  id: z
    .string()
    .trim()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9-]+$/),
  title: localizedTextSchema,
  description: localizedTextSchema,
  categoryId: z
    .string()
    .trim()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9-]+$/),
  source: z.string().trim().min(1).max(80),
  level: z.enum(["A1", "A2", "B1", "B2", "C1"]),
  durationMinutes: z.number().int().min(1).max(30),
  thumbnailUrl: z.string().url(),
  externalUrl: z.string().url().optional(),
  isNew: z.boolean().optional(),
  skillFocus: z.array(localizedTextSchema).min(1).max(5),
  tags: z.array(z.string().trim().min(1).max(32)).min(1).max(8),
  topic: localizedTextSchema.optional(),
  youtubeVideoId: z.string().trim().max(64).optional(),
});

type ImportedLessonSeed = z.infer<typeof importedLessonSeedSchema>;

const categoryIds = new Set(listeningCategories.map((category) => category.id));
const existingLessonIds = new Set(listeningLessons.map((lesson) => lesson.id));

function thumbnailUrl(seed: string) {
  return `https://picsum.photos/seed/quackup-import-${seed}/960/540`;
}

const importedLessonSeeds = [
  {
    id: "bbc-food-waste",
    title: {
      vi: "How food waste changes the climate",
      en: "How food waste changes the climate",
    },
    description: {
      vi: "Một bài nghe ngắn về thực phẩm, môi trường và các cụm nguyên nhân - kết quả.",
      en: "A short listening card about food, climate, and cause-result phrases.",
    },
    categoryId: "bbc-learning-english",
    source: "BBC Learning English",
    level: "B1",
    durationMinutes: 6,
    thumbnailUrl: thumbnailUrl("bbc-food-waste"),
    isNew: true,
    skillFocus: [
      { vi: "Nghe ý chính", en: "Catch the main idea" },
      { vi: "Cụm nguyên nhân", en: "Cause phrases" },
    ],
    tags: ["climate", "food", "environment"],
    topic: { vi: "Môi trường", en: "Environment" },
  },
  {
    id: "bbc-ai-at-work",
    title: {
      vi: "Will AI change the way we work?",
      en: "Will AI change the way we work?",
    },
    description: {
      vi: "Tập nghe nhịp giải thích về công việc, công nghệ và các dự đoán trong tương lai.",
      en: "Practice explanatory rhythm around work, technology, and future predictions.",
    },
    categoryId: "bbc-learning-english",
    source: "BBC Learning English",
    level: "B2",
    durationMinutes: 6,
    thumbnailUrl: thumbnailUrl("bbc-ai-at-work"),
    isNew: true,
    skillFocus: [
      { vi: "Dự đoán", en: "Predictions" },
      { vi: "Từ vựng công việc", en: "Work vocabulary" },
    ],
    tags: ["ai", "work", "future"],
    topic: { vi: "Công nghệ", en: "Technology" },
  },
  {
    id: "bbc-sleep-better",
    title: {
      vi: "Why sleep is harder than it looks",
      en: "Why sleep is harder than it looks",
    },
    description: {
      vi: "Luyện nghe chủ đề sức khỏe với câu ngắn, từ nối nhẹ và nhịp nói tự nhiên.",
      en: "Practice health listening with short lines, weak linkers, and natural rhythm.",
    },
    categoryId: "bbc-learning-english",
    source: "BBC Learning English",
    level: "A2",
    durationMinutes: 6,
    thumbnailUrl: thumbnailUrl("bbc-sleep-better"),
    isNew: true,
    skillFocus: [
      { vi: "Từ chức năng yếu", en: "Weak function words" },
      { vi: "Câu giải thích ngắn", en: "Short explanations" },
    ],
    tags: ["sleep", "health", "routine"],
    topic: { vi: "Sức khỏe", en: "Health" },
  },
  {
    id: "bbc-money-habits",
    title: {
      vi: "Small money habits that add up",
      en: "Small money habits that add up",
    },
    description: {
      vi: "Một card luyện nghe về thói quen tài chính cá nhân và ví dụ đời thường.",
      en: "A listening card about personal finance habits and everyday examples.",
    },
    categoryId: "bbc-learning-english",
    source: "BBC Learning English",
    level: "B1",
    durationMinutes: 6,
    thumbnailUrl: thumbnailUrl("bbc-money-habits"),
    isNew: true,
    skillFocus: [
      { vi: "Ví dụ đời thường", en: "Everyday examples" },
      { vi: "Cụm số lượng", en: "Quantity phrases" },
    ],
    tags: ["money", "habits", "lifestyle"],
    topic: { vi: "Đời sống", en: "Lifestyle" },
  },
  {
    id: "business-startup-pitch",
    title: {
      vi: "A clear startup pitch in two minutes",
      en: "A clear startup pitch in two minutes",
    },
    description: {
      vi: "Nghe cấu trúc trình bày vấn đề, giải pháp và lợi ích trong bối cảnh startup.",
      en: "Hear problem, solution, and benefit structure in a startup context.",
    },
    categoryId: "business",
    source: "Business English",
    level: "B2",
    durationMinutes: 4,
    thumbnailUrl: thumbnailUrl("business-startup-pitch"),
    isNew: true,
    skillFocus: [
      { vi: "Cấu trúc thuyết trình", en: "Pitch structure" },
      { vi: "Từ khóa kinh doanh", en: "Business keywords" },
    ],
    tags: ["startup", "pitch", "business"],
    topic: { vi: "Kinh doanh", en: "Business" },
  },
  {
    id: "business-customer-support",
    title: {
      vi: "Handling a difficult customer call",
      en: "Handling a difficult customer call",
    },
    description: {
      vi: "Tập nghe lời xin lỗi, xác nhận vấn đề và đề xuất hướng xử lý trong cuộc gọi.",
      en: "Practice apologies, issue confirmation, and resolution language in a call.",
    },
    categoryId: "business",
    source: "Business English",
    level: "B1",
    durationMinutes: 5,
    thumbnailUrl: thumbnailUrl("business-customer-support"),
    isNew: true,
    skillFocus: [
      { vi: "Xác nhận thông tin", en: "Confirm details" },
      { vi: "Ngôn ngữ hỗ trợ", en: "Support language" },
    ],
    tags: ["support", "customer", "call"],
    topic: { vi: "Dịch vụ khách hàng", en: "Customer support" },
  },
  {
    id: "business-team-meeting",
    title: {
      vi: "A quick team meeting update",
      en: "A quick team meeting update",
    },
    description: {
      vi: "Luyện nghe báo cáo tiến độ, deadline và các cụm chuyển lượt nói trong meeting.",
      en: "Practice progress updates, deadlines, and turn-taking phrases in meetings.",
    },
    categoryId: "business",
    source: "Business English",
    level: "B2",
    durationMinutes: 5,
    thumbnailUrl: thumbnailUrl("business-team-meeting"),
    skillFocus: [
      { vi: "Báo cáo tiến độ", en: "Progress updates" },
      { vi: "Chuyển lượt nói", en: "Turn taking" },
    ],
    tags: ["meeting", "deadline", "team"],
    topic: { vi: "Công việc", en: "Work" },
  },
  {
    id: "business-market-trends",
    title: {
      vi: "Explaining a market trend",
      en: "Explaining a market trend",
    },
    description: {
      vi: "Nghe cách mô tả xu hướng tăng giảm, nguyên nhân và tác động kinh doanh.",
      en: "Hear how speakers describe rises, drops, causes, and business impact.",
    },
    categoryId: "business",
    source: "Business English",
    level: "C1",
    durationMinutes: 6,
    thumbnailUrl: thumbnailUrl("business-market-trends"),
    skillFocus: [
      { vi: "Mô tả xu hướng", en: "Trend language" },
      { vi: "Số liệu", en: "Numbers" },
    ],
    tags: ["market", "trend", "numbers"],
    topic: { vi: "Thị trường", en: "Market" },
  },
  {
    id: "health-sleep-science",
    title: {
      vi: "The science of a good night's sleep",
      en: "The science of a good night's sleep",
    },
    description: {
      vi: "Card sức khỏe tập trung vào thuật ngữ đơn giản và câu giải thích có nhịp chậm.",
      en: "A health card focused on simple science terms and slower explanations.",
    },
    categoryId: "health-medicine",
    source: "Health English",
    level: "B1",
    durationMinutes: 5,
    thumbnailUrl: thumbnailUrl("health-sleep-science"),
    skillFocus: [
      { vi: "Thuật ngữ sức khỏe", en: "Health terms" },
      { vi: "Nhịp giải thích", en: "Explanation rhythm" },
    ],
    tags: ["sleep", "science", "health"],
    topic: { vi: "Giấc ngủ", en: "Sleep" },
  },
  {
    id: "health-stress-management",
    title: {
      vi: "Simple ways to manage stress",
      en: "Simple ways to manage stress",
    },
    description: {
      vi: "Nghe lời khuyên, ví dụ và các cụm điều kiện trong chủ đề quản lý căng thẳng.",
      en: "Listen for advice, examples, and conditional phrases about stress management.",
    },
    categoryId: "health-medicine",
    source: "Health English",
    level: "A2",
    durationMinutes: 4,
    thumbnailUrl: thumbnailUrl("health-stress-management"),
    skillFocus: [
      { vi: "Lời khuyên", en: "Advice language" },
      { vi: "Câu điều kiện đơn giản", en: "Simple conditionals" },
    ],
    tags: ["stress", "advice", "wellbeing"],
    topic: { vi: "Sức khỏe tinh thần", en: "Wellbeing" },
  },
  {
    id: "health-nutrition-labels",
    title: {
      vi: "Understanding nutrition labels",
      en: "Understanding nutrition labels",
    },
    description: {
      vi: "Luyện nghe số liệu, đơn vị đo và từ vựng thực phẩm trong bối cảnh y tế nhẹ.",
      en: "Practice numbers, measurements, and food vocabulary in a light health context.",
    },
    categoryId: "health-medicine",
    source: "Health English",
    level: "B2",
    durationMinutes: 5,
    thumbnailUrl: thumbnailUrl("health-nutrition-labels"),
    skillFocus: [
      { vi: "Số liệu dinh dưỡng", en: "Nutrition numbers" },
      { vi: "Đơn vị đo", en: "Measurements" },
    ],
    tags: ["nutrition", "food", "numbers"],
    topic: { vi: "Dinh dưỡng", en: "Nutrition" },
  },
  {
    id: "job-interview-strengths",
    title: {
      vi: "Talking about your strengths",
      en: "Talking about your strengths",
    },
    description: {
      vi: "Nghe câu trả lời phỏng vấn ngắn, cách đưa ví dụ và nhấn mạnh điểm mạnh.",
      en: "Hear short interview answers, examples, and strength-focused phrasing.",
    },
    categoryId: "job-interview",
    source: "Interview English",
    level: "B1",
    durationMinutes: 4,
    thumbnailUrl: thumbnailUrl("job-interview-strengths"),
    skillFocus: [
      { vi: "Câu trả lời phỏng vấn", en: "Interview answers" },
      { vi: "Đưa ví dụ", en: "Giving examples" },
    ],
    tags: ["interview", "strengths", "career"],
    topic: { vi: "Phỏng vấn", en: "Interview" },
  },
  {
    id: "job-salary-negotiation",
    title: {
      vi: "Negotiating salary politely",
      en: "Negotiating salary politely",
    },
    description: {
      vi: "Tập nghe cách nói lịch sự, đề xuất mức lương và phản hồi trong thương lượng.",
      en: "Practice polite language, salary proposals, and negotiation responses.",
    },
    categoryId: "job-interview",
    source: "Interview English",
    level: "C1",
    durationMinutes: 5,
    thumbnailUrl: thumbnailUrl("job-salary-negotiation"),
    skillFocus: [
      { vi: "Ngôn ngữ lịch sự", en: "Polite language" },
      { vi: "Thương lượng", en: "Negotiation" },
    ],
    tags: ["salary", "negotiation", "career"],
    topic: { vi: "Nghề nghiệp", en: "Career" },
  },
  {
    id: "job-remote-work",
    title: {
      vi: "Explaining remote work experience",
      en: "Explaining remote work experience",
    },
    description: {
      vi: "Nghe cách mô tả kinh nghiệm làm việc từ xa, công cụ và phối hợp nhóm.",
      en: "Hear how candidates describe remote work, tools, and team coordination.",
    },
    categoryId: "job-interview",
    source: "Interview English",
    level: "B2",
    durationMinutes: 4,
    thumbnailUrl: thumbnailUrl("job-remote-work"),
    skillFocus: [
      { vi: "Kinh nghiệm làm việc", en: "Work experience" },
      { vi: "Công cụ làm việc", en: "Work tools" },
    ],
    tags: ["remote", "tools", "career"],
    topic: { vi: "Làm việc từ xa", en: "Remote work" },
  },
  {
    id: "tech-quantum-computing",
    title: {
      vi: "Quantum computing in simple words",
      en: "Quantum computing in simple words",
    },
    description: {
      vi: "Card khoa học công nghệ cho các cụm định nghĩa, so sánh và giải thích trừu tượng.",
      en: "A tech-science card for definitions, comparisons, and abstract explanations.",
    },
    categoryId: "technology-science",
    source: "TED-Ed",
    level: "C1",
    durationMinutes: 6,
    thumbnailUrl: thumbnailUrl("tech-quantum-computing"),
    isNew: true,
    skillFocus: [
      { vi: "Định nghĩa", en: "Definitions" },
      { vi: "So sánh", en: "Comparisons" },
    ],
    tags: ["quantum", "computing", "science"],
    topic: { vi: "Khoa học máy tính", en: "Computer science" },
  },
  {
    id: "tech-electric-cars",
    title: {
      vi: "How electric cars store energy",
      en: "How electric cars store energy",
    },
    description: {
      vi: "Nghe từ vựng năng lượng, pin và chuỗi nguyên nhân trong chủ đề xe điện.",
      en: "Practice energy, battery, and causal chain vocabulary around electric cars.",
    },
    categoryId: "technology-science",
    source: "TED-Ed",
    level: "B2",
    durationMinutes: 5,
    thumbnailUrl: thumbnailUrl("tech-electric-cars"),
    skillFocus: [
      { vi: "Từ kỹ thuật", en: "Technical words" },
      { vi: "Chuỗi nguyên nhân", en: "Causal chains" },
    ],
    tags: ["energy", "cars", "battery"],
    topic: { vi: "Năng lượng", en: "Energy" },
  },
  {
    id: "tech-climate-data",
    title: {
      vi: "Reading climate data out loud",
      en: "Reading climate data out loud",
    },
    description: {
      vi: "Tập nghe số liệu, phần trăm, mốc thời gian và mô tả thay đổi khí hậu.",
      en: "Practice numbers, percentages, time markers, and climate-change descriptions.",
    },
    categoryId: "technology-science",
    source: "Science English",
    level: "B2",
    durationMinutes: 5,
    thumbnailUrl: thumbnailUrl("tech-climate-data"),
    skillFocus: [
      { vi: "Phần trăm", en: "Percentages" },
      { vi: "Mốc thời gian", en: "Time markers" },
    ],
    tags: ["climate", "data", "numbers"],
    topic: { vi: "Dữ liệu", en: "Data" },
  },
  {
    id: "tech-cybersecurity",
    title: {
      vi: "What makes a password safe?",
      en: "What makes a password safe?",
    },
    description: {
      vi: "Nghe chủ đề an toàn mạng với câu hỏi, cảnh báo và hướng dẫn hành động.",
      en: "Listen for questions, warnings, and action guidance in cybersecurity.",
    },
    categoryId: "technology-science",
    source: "Technology English",
    level: "B1",
    durationMinutes: 4,
    thumbnailUrl: thumbnailUrl("tech-cybersecurity"),
    skillFocus: [
      { vi: "Cảnh báo", en: "Warnings" },
      { vi: "Hướng dẫn hành động", en: "Action guidance" },
    ],
    tags: ["security", "password", "internet"],
    topic: { vi: "An toàn mạng", en: "Cybersecurity" },
  },
  {
    id: "tech-space-debris",
    title: {
      vi: "Why space debris is a problem",
      en: "Why space debris is a problem",
    },
    description: {
      vi: "Luyện nghe thuật ngữ không gian, rủi ro và cách giải thích vấn đề phức tạp.",
      en: "Practice space terms, risk language, and complex problem explanations.",
    },
    categoryId: "technology-science",
    source: "TED-Ed",
    level: "C1",
    durationMinutes: 5,
    thumbnailUrl: thumbnailUrl("tech-space-debris"),
    skillFocus: [
      { vi: "Thuật ngữ không gian", en: "Space terms" },
      { vi: "Mô tả rủi ro", en: "Risk language" },
    ],
    tags: ["space", "risk", "science"],
    topic: { vi: "Không gian", en: "Space" },
  },
  {
    id: "travel-airport-delay",
    title: {
      vi: "At the airport during a delay",
      en: "At the airport during a delay",
    },
    description: {
      vi: "Nghe thông báo sân bay, giờ khởi hành và các cụm xin lỗi trong du lịch.",
      en: "Hear airport announcements, departure times, and apology phrases.",
    },
    categoryId: "travel-culture",
    source: "Travel English",
    level: "A2",
    durationMinutes: 4,
    thumbnailUrl: thumbnailUrl("travel-airport-delay"),
    skillFocus: [
      { vi: "Thông báo", en: "Announcements" },
      { vi: "Giờ giấc", en: "Times" },
    ],
    tags: ["airport", "delay", "travel"],
    topic: { vi: "Sân bay", en: "Airport" },
  },
  {
    id: "travel-hotel-checkin",
    title: {
      vi: "Checking in at a hotel",
      en: "Checking in at a hotel",
    },
    description: {
      vi: "Tập nghe hội thoại khách sạn, yêu cầu xác nhận và thông tin đặt phòng.",
      en: "Practice hotel conversation, confirmation requests, and booking details.",
    },
    categoryId: "travel-culture",
    source: "Travel English",
    level: "A1",
    durationMinutes: 3,
    thumbnailUrl: thumbnailUrl("travel-hotel-checkin"),
    skillFocus: [
      { vi: "Hội thoại ngắn", en: "Short dialogue" },
      { vi: "Xác nhận thông tin", en: "Confirming details" },
    ],
    tags: ["hotel", "booking", "travel"],
    topic: { vi: "Khách sạn", en: "Hotel" },
  },
  {
    id: "travel-street-food",
    title: {
      vi: "Ordering street food politely",
      en: "Ordering street food politely",
    },
    description: {
      vi: "Nghe cách gọi món, hỏi giá và dùng câu lịch sự trong bối cảnh văn hóa.",
      en: "Hear ordering, asking prices, and polite phrases in a cultural setting.",
    },
    categoryId: "travel-culture",
    source: "Travel English",
    level: "A2",
    durationMinutes: 4,
    thumbnailUrl: thumbnailUrl("travel-street-food"),
    skillFocus: [
      { vi: "Gọi món", en: "Ordering food" },
      { vi: "Câu lịch sự", en: "Polite phrases" },
    ],
    tags: ["food", "culture", "travel"],
    topic: { vi: "Ẩm thực", en: "Food culture" },
  },
  {
    id: "travel-city-tour",
    title: {
      vi: "A city tour guide explains history",
      en: "A city tour guide explains history",
    },
    description: {
      vi: "Luyện nghe hướng dẫn viên nói về địa danh, lịch sử và mốc thời gian.",
      en: "Practice a tour guide describing landmarks, history, and time markers.",
    },
    categoryId: "travel-culture",
    source: "Travel English",
    level: "B1",
    durationMinutes: 5,
    thumbnailUrl: thumbnailUrl("travel-city-tour"),
    skillFocus: [
      { vi: "Địa danh", en: "Landmarks" },
      { vi: "Mốc lịch sử", en: "Historical markers" },
    ],
    tags: ["city", "history", "travel"],
    topic: { vi: "Du lịch thành phố", en: "City travel" },
  },
  {
    id: "daily-family-plans",
    title: {
      vi: "Making weekend plans with family",
      en: "Making weekend plans with family",
    },
    description: {
      vi: "Card hội thoại đời thường về kế hoạch cuối tuần, đề xuất và phản hồi ngắn.",
      en: "A daily conversation card about weekend plans, suggestions, and short replies.",
    },
    categoryId: "daily-conversations",
    source: "Daily Conversations",
    level: "A2",
    durationMinutes: 3,
    thumbnailUrl: thumbnailUrl("daily-family-plans"),
    skillFocus: [
      { vi: "Đề xuất", en: "Suggestions" },
      { vi: "Phản hồi ngắn", en: "Short replies" },
    ],
    tags: ["family", "plans", "weekend"],
    topic: { vi: "Gia đình", en: "Family" },
  },
  {
    id: "daily-shopping-return",
    title: {
      vi: "Returning an item at a shop",
      en: "Returning an item at a shop",
    },
    description: {
      vi: "Nghe tình huống đổi trả hàng, lý do, hóa đơn và câu hỏi lịch sự.",
      en: "Listen to a return scenario with reasons, receipts, and polite questions.",
    },
    categoryId: "daily-conversations",
    source: "Daily Conversations",
    level: "B1",
    durationMinutes: 4,
    thumbnailUrl: thumbnailUrl("daily-shopping-return"),
    skillFocus: [
      { vi: "Lý do", en: "Reasons" },
      { vi: "Câu hỏi lịch sự", en: "Polite questions" },
    ],
    tags: ["shopping", "return", "dialogue"],
    topic: { vi: "Mua sắm", en: "Shopping" },
  },
  {
    id: "daily-neighbor-chat",
    title: {
      vi: "A short chat with a neighbor",
      en: "A short chat with a neighbor",
    },
    description: {
      vi: "Tập nghe small talk, lời chào, câu hỏi ngắn và nhịp nói thân mật.",
      en: "Practice small talk, greetings, short questions, and casual rhythm.",
    },
    categoryId: "daily-conversations",
    source: "Daily Conversations",
    level: "A1",
    durationMinutes: 2,
    thumbnailUrl: thumbnailUrl("daily-neighbor-chat"),
    skillFocus: [
      { vi: "Small talk", en: "Small talk" },
      { vi: "Lời chào", en: "Greetings" },
    ],
    tags: ["neighbor", "greeting", "small-talk"],
    topic: { vi: "Đời thường", en: "Daily life" },
  },
  {
    id: "ielts-academic-map",
    title: {
      vi: "IELTS listening: campus map",
      en: "IELTS listening: campus map",
    },
    description: {
      vi: "Luyện nghe vị trí, hướng đi và mô tả bản đồ trong bối cảnh học thuật.",
      en: "Practice location, directions, and map descriptions in an academic context.",
    },
    categoryId: "ielts",
    source: "IELTS Practice",
    level: "B1",
    durationMinutes: 6,
    thumbnailUrl: thumbnailUrl("ielts-academic-map"),
    skillFocus: [
      { vi: "Vị trí", en: "Location" },
      { vi: "Chỉ đường", en: "Directions" },
    ],
    tags: ["ielts", "map", "directions"],
    topic: { vi: "IELTS Listening", en: "IELTS Listening" },
  },
  {
    id: "ielts-energy-lecture",
    title: {
      vi: "IELTS lecture: renewable energy",
      en: "IELTS lecture: renewable energy",
    },
    description: {
      vi: "Nghe bài giảng ngắn về năng lượng, nguyên nhân và ví dụ học thuật.",
      en: "Hear a short lecture about energy, causes, and academic examples.",
    },
    categoryId: "ielts",
    source: "IELTS Practice",
    level: "B2",
    durationMinutes: 7,
    thumbnailUrl: thumbnailUrl("ielts-energy-lecture"),
    skillFocus: [
      { vi: "Bài giảng", en: "Lecture listening" },
      { vi: "Ví dụ học thuật", en: "Academic examples" },
    ],
    tags: ["ielts", "energy", "lecture"],
    topic: { vi: "IELTS Academic", en: "IELTS Academic" },
  },
  {
    id: "ielts-campus-tour",
    title: {
      vi: "IELTS conversation: campus tour",
      en: "IELTS conversation: campus tour",
    },
    description: {
      vi: "Tập nghe hội thoại định hướng, tên địa điểm và câu hỏi xác nhận.",
      en: "Practice orientation dialogue, place names, and confirmation questions.",
    },
    categoryId: "ielts",
    source: "IELTS Practice",
    level: "A2",
    durationMinutes: 5,
    thumbnailUrl: thumbnailUrl("ielts-campus-tour"),
    skillFocus: [
      { vi: "Tên địa điểm", en: "Place names" },
      { vi: "Xác nhận", en: "Confirmation" },
    ],
    tags: ["ielts", "campus", "conversation"],
    topic: { vi: "IELTS Conversation", en: "IELTS Conversation" },
  },
  {
    id: "toeic-office-announcement",
    title: {
      vi: "TOEIC office announcement",
      en: "TOEIC office announcement",
    },
    description: {
      vi: "Nghe thông báo công sở, lịch họp, phòng ban và yêu cầu hành động.",
      en: "Hear workplace announcements, meeting times, departments, and action requests.",
    },
    categoryId: "toeic",
    source: "TOEIC Practice",
    level: "B1",
    durationMinutes: 4,
    thumbnailUrl: thumbnailUrl("toeic-office-announcement"),
    skillFocus: [
      { vi: "Thông báo công sở", en: "Office announcements" },
      { vi: "Yêu cầu hành động", en: "Action requests" },
    ],
    tags: ["toeic", "office", "announcement"],
    topic: { vi: "TOEIC Office", en: "TOEIC Office" },
  },
  {
    id: "toeic-client-call",
    title: {
      vi: "TOEIC client phone call",
      en: "TOEIC client phone call",
    },
    description: {
      vi: "Luyện nghe cuộc gọi với khách hàng, thay đổi lịch và xác nhận thông tin.",
      en: "Practice client calls, schedule changes, and information confirmation.",
    },
    categoryId: "toeic",
    source: "TOEIC Practice",
    level: "B2",
    durationMinutes: 5,
    thumbnailUrl: thumbnailUrl("toeic-client-call"),
    skillFocus: [
      { vi: "Cuộc gọi", en: "Phone calls" },
      { vi: "Đổi lịch", en: "Schedule changes" },
    ],
    tags: ["toeic", "client", "call"],
    topic: { vi: "TOEIC Calls", en: "TOEIC Calls" },
  },
  {
    id: "toeic-travel-itinerary",
    title: {
      vi: "TOEIC travel itinerary",
      en: "TOEIC travel itinerary",
    },
    description: {
      vi: "Nghe lịch trình công tác, thời gian, địa điểm và thay đổi kế hoạch.",
      en: "Hear business travel itineraries, times, locations, and plan changes.",
    },
    categoryId: "toeic",
    source: "TOEIC Practice",
    level: "A2",
    durationMinutes: 4,
    thumbnailUrl: thumbnailUrl("toeic-travel-itinerary"),
    skillFocus: [
      { vi: "Lịch trình", en: "Itineraries" },
      { vi: "Thay đổi kế hoạch", en: "Plan changes" },
    ],
    tags: ["toeic", "travel", "schedule"],
    topic: { vi: "TOEIC Travel", en: "TOEIC Travel" },
  },
] satisfies ImportedLessonSeed[];

function validateImportedLessonSeeds(seeds: ImportedLessonSeed[]) {
  const seenIds = new Set<string>();

  return seeds.map((seed) => {
    const parsed = importedLessonSeedSchema.parse(seed);

    if (seenIds.has(parsed.id) || existingLessonIds.has(parsed.id)) {
      throw new Error(`Duplicate imported listening lesson id: ${parsed.id}`);
    }

    if (!categoryIds.has(parsed.categoryId)) {
      throw new Error(
        `Imported listening lesson ${parsed.id} uses unknown category: ${parsed.categoryId}`,
      );
    }

    seenIds.add(parsed.id);
    return parsed;
  });
}

export const importedListeningLessons: ListeningLessonDetail[] =
  validateImportedLessonSeeds(importedLessonSeeds).map((seed) => ({
    ...seed,
    contentStatus: "METADATA_ONLY",
    youtubeVideoId: seed.youtubeVideoId ?? "",
    youtubeStartSeconds: 0,
    youtubeEndSeconds: seed.durationMinutes * 60,
    transcriptSourceUrl: seed.externalUrl ?? "",
    segmentCount: 0,
    segments: [],
  }));
