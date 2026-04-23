// constants/dashboardConstants.js
import {
  MdCheckCircleOutline,
  MdHighlightOff,
  MdOutlineAccessTime,
  MdOutlineHome,
} from "react-icons/md";

export const PAGE_SIZE_OPTIONS = [6, 12, 18, 24];

export const STATUS_CONFIG = {
  available: {
    label: "Available",
    bg: "bg-emerald-500",
    text: "text-white",
    dot: "bg-emerald-400",
    border: "border-emerald-100",
  },
  sold: {
    label: "Sold",
    bg: "bg-rose-500",
    text: "text-white",
    dot: "bg-rose-400",
    border: "border-rose-100",
  },
  rented: {
    label: "Rented",
    bg: "bg-indigo-500",
    text: "text-white",
    dot: "bg-indigo-400",
    border: "border-indigo-100",
  },
  pending: {
    label: "Pending",
    bg: "bg-amber-500",
    text: "text-white",
    dot: "bg-amber-400",
    border: "border-amber-100",
  },
};

export const STAT_STYLES = {
  gray: {
    value: "text-gray-600",
    iconBg: "bg-gray-100",
    iconText: "text-gray-500",
  },
  emerald: {
    value: "text-emerald-600",
    iconBg: "bg-emerald-100",
    iconText: "text-emerald-500",
  },
  slate: {
    value: "text-slate-600",
    iconBg: "bg-slate-100",
    iconText: "text-slate-500",
  },
  amber: {
    value: "text-amber-500",
    iconBg: "bg-amber-100",
    iconText: "text-amber-500",
  },
};

// Add helper for rooms visibility
export const TYPES_WITHOUT_ROOMS = new Set([
  "land", "plot", "agricultural", "farm", "industrial", "vacant"
]);
export function showRooms(type = "") {
  return !TYPES_WITHOUT_ROOMS.has(type.toLowerCase().trim());
}