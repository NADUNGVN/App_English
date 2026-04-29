import {
  dictationSegments,
  dictionaryEntries,
  leaderboardRows,
  lessons,
  statisticsBars,
} from "../data/mockContent";
import { vocabularyLibraryData } from "../data/mockVocabularyLibrary";

const wait = (duration = 180) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, duration);
  });

function resolveLocaleValue(value, locale) {
  if (Array.isArray(value)) {
    return value.map((item) => resolveLocaleValue(item, locale));
  }

  if (value && typeof value === "object") {
    if ("vi" in value && "en" in value) {
      return value[locale] ?? value.vi;
    }

    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [
        key,
        resolveLocaleValue(nestedValue, locale),
      ]),
    );
  }

  return value;
}

function translateList(list, locale) {
  return list.map((item) => resolveLocaleValue(item, locale));
}

export const mockContentRepository = {
  async getDashboard(locale, user) {
    await wait();

    return {
      heading:
        locale === "vi"
          ? `Chào mừng trở lại, ${user?.displayName ?? "người học"}`
          : `Welcome back, ${user?.displayName ?? "learner"}`,
      summary:
        locale === "vi"
          ? "Giữ nhịp học ngắn, đều, và rõ mục tiêu cho từng buổi."
          : "Keep your practice short, steady, and clear for each session.",
      stats: [
        {
          label: locale === "vi" ? "Chuỗi hiện tại" : "Current streak",
          value: "07",
          detail: locale === "vi" ? "ngày liên tiếp" : "days in a row",
        },
        {
          label: locale === "vi" ? "Phút hôm nay" : "Minutes today",
          value: "24",
          detail: locale === "vi" ? "mục tiêu 30 phút" : "30 minute target",
        },
        {
          label: locale === "vi" ? "Từ cần ôn" : "Words to review",
          value: "18",
          detail: locale === "vi" ? "ưu tiên cụm tự nhiên" : "prioritize natural phrases",
        },
        {
          label: locale === "vi" ? "Độ chính xác" : "Accuracy",
          value: "92%",
          detail: locale === "vi" ? "trong ba buổi gần nhất" : "across the last three sessions",
        },
      ],
      focusList: translateList(lessons.slice(0, 3), locale),
      activity: [
        {
          title:
            locale === "vi"
              ? "Bạn hoàn thành 6 phút dictation"
              : "You finished a 6 minute dictation",
          time: locale === "vi" ? "12 phút trước" : "12 minutes ago",
        },
        {
          title:
            locale === "vi"
              ? "Danh sách ôn từ được cập nhật"
              : "Your review list was refreshed",
          time: locale === "vi" ? "1 giờ trước" : "1 hour ago",
        },
        {
          title:
            locale === "vi"
              ? "Mục tiêu ngày mai đã được chốt"
              : "Tomorrow's study goal has been saved",
          time: locale === "vi" ? "Hôm nay" : "Today",
        },
      ],
      leaderboard: leaderboardRows.slice(0, 3),
    };
  },

  async getLearning(locale) {
    await wait();

    return {
      intro:
        locale === "vi"
          ? "Chọn một clip ngắn rồi tập nghe theo từng câu."
          : "Pick a short clip and practice one sentence at a time.",
      lessons: translateList(lessons, locale),
      categories:
        locale === "vi"
          ? ["Tất cả", "BBC", "CNN", "TED-Ed", "Phỏng vấn"]
          : ["All", "BBC", "CNN", "TED-Ed", "Interviews"],
    };
  },

  async getVocabulary(locale) {
    await wait();

    return resolveLocaleValue(vocabularyLibraryData, locale);
  },

  async getDictionary(locale) {
    await wait();

    return {
      entries: translateList(dictionaryEntries, locale),
      recent: ["clarify", "resilient", "brief", "shift"],
    };
  },

  async getLeaderboard(locale) {
    await wait();

    return {
      heading:
        locale === "vi"
          ? "Nhịp học đều đặn tạo ra khoảng cách."
          : "Steady practice creates the gap.",
      rows: leaderboardRows,
    };
  },

  async getStatistics(locale) {
    await wait();

    return {
      summary: [
        {
          label: locale === "vi" ? "Chuỗi học" : "Streak",
          value: "07",
          suffix: locale === "vi" ? "ngày" : "days",
        },
        {
          label: locale === "vi" ? "Trung bình/ngày" : "Average/day",
          value: "28",
          suffix: locale === "vi" ? "phút" : "min",
        },
        {
          label: locale === "vi" ? "Từ mới tuần này" : "New words this week",
          value: "34",
          suffix: locale === "vi" ? "mục" : "items",
        },
        {
          label: locale === "vi" ? "Độ chính xác" : "Accuracy",
          value: "92",
          suffix: "%",
        },
      ],
      bars: statisticsBars,
      modules: [
        { label: "Dictation", value: 78 },
        { label: "Shadowing", value: 54 },
        { label: locale === "vi" ? "Từ vựng" : "Vocabulary", value: 66 },
      ],
    };
  },

  async getDictation(locale) {
    await wait();

    return {
      lesson: resolveLocaleValue(lessons[0], locale),
      summary:
        locale === "vi"
          ? "Đi từng câu, bắt đúng động từ và cụm nghe được."
          : "Work sentence by sentence and catch the key verbs and phrases.",
      controls:
        locale === "vi"
          ? ["Phụ đề", "Chậm lại", "Nhắc lại", "Tốc độ chuẩn"]
          : ["Subtitles", "Slow down", "Repeat", "Normal speed"],
      segments: translateList(dictationSegments, locale),
    };
  },
};
