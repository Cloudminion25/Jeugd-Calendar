export const WEEKDAY_LABELS = ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"];

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function parseDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Builds a Monday-first grid of weeks covering the given month, padded
 * with the trailing/leading days needed to fill complete weeks.
 */
export function getMonthMatrix(year: number, month: number): Date[][] {
  const firstOfMonth = new Date(year, month, 1);
  const lastOfMonth = new Date(year, month + 1, 0);
  const startOffset = (firstOfMonth.getDay() + 6) % 7;
  const endOffset = 6 - ((lastOfMonth.getDay() + 6) % 7);
  const totalDays = startOffset + lastOfMonth.getDate() + endOffset;

  const days: Date[] = [];
  for (let i = 0; i < totalDays; i++) {
    days.push(new Date(year, month, 1 - startOffset + i));
  }

  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  return weeks;
}

export function formatMonthYear(date: Date): string {
  return date.toLocaleDateString("nl-NL", { month: "long", year: "numeric" });
}

export function formatFullDate(date: Date): string {
  return date.toLocaleDateString("nl-NL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
