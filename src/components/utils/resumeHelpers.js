// components/utils/resumeHelpers.js
import { COLOR_PALETTES } from "@/lib/resume-data";

export function toArray(obj) {
  if (!obj) return [];
  if (Array.isArray(obj)) return obj;
  return Object.entries(obj).map(([key, value]) => ({ _id: key, ...value }));
}

export function sortByPriority(list) {
  if (!Array.isArray(list)) return [];
  return [...list].sort((a, b) => (Number(a.priority) || 0) - (Number(b.priority) || 0));
}

export function formatDate(dateString) {
  if (!dateString) return "";
  if (typeof dateString !== "string") return String(dateString);
  // Support YYYY-MM inputs natively
  const parts = dateString.split("-");
  if (parts.length === 2) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthIndex = parseInt(parts[1], 10) - 1;
    if (monthIndex >= 0 && monthIndex < 12) {
      return `${months[monthIndex]} ${parts[0]}`;
    }
  }
  return dateString;
}

export function getTheme(themeColorId = "light-blue") {
  return COLOR_PALETTES.find((p) => p.id === themeColorId) || COLOR_PALETTES[0];
}