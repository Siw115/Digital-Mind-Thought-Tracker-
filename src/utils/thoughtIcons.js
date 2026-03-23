import { TWEMOJI_BASE_PATH } from "../data/twemojiIcons";

const categoryIconRules = [
  { keywords: ["learn", "study"], icon: "1f9e0.png", label: "Brain icon" },
  { keywords: ["career", "job"], icon: "1f680.png", label: "Rocket icon" },
  { keywords: ["personal", "life"], icon: "1f31f.png", label: "Star icon" },
  { keywords: ["idea", "concept"], icon: "1f4a1.png", label: "Idea icon" },
  { keywords: ["note", "journal"], icon: "1f4dd.png", label: "Note icon" },
  { keywords: ["design", "ui"], icon: "1f3a8.png", label: "Palette icon" },
  { keywords: ["dev", "code", "build", "ai"], icon: "1f916.png", label: "Robot icon" },
];

const statusFallbackIcons = {
  idea: { icon: "1f4a1.png", label: "Idea icon" },
  "in-progress": { icon: "1f3af.png", label: "Target icon" },
  done: { icon: "2705.png", label: "Check icon" },
};

export function getIconForThought(thought) {
  if (thought.iconFile) {
    return {
      src: `${TWEMOJI_BASE_PATH}/${thought.iconFile}`,
      alt: "Custom thought icon",
    };
  }

  const category = (thought.category || "").toLowerCase();

  for (const rule of categoryIconRules) {
    const matched = rule.keywords.some((keyword) => category.includes(keyword));
    if (matched) {
      return {
        src: `${TWEMOJI_BASE_PATH}/${rule.icon}`,
        alt: rule.label,
      };
    }
  }

  const fallback = statusFallbackIcons[thought.status] || statusFallbackIcons.idea;
  return {
    src: `${TWEMOJI_BASE_PATH}/${fallback.icon}`,
    alt: fallback.label,
  };
}
