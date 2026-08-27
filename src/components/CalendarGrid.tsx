"use client";

import { CalendarEvent } from "@/lib/types";
import { getMonthMatrix, toDateKey, WEEKDAY_LABELS } from "@/lib/dateUtils";
import DayCell from "./DayCell";

interface CalendarGridProps {
  year: number;
  month: number;
  today: Date;
  selectedDateKey: string;
  eventsByDate: Map<string, CalendarEvent[]>;
  onSelectDate: (dateKey: string) => void;
}

export default function CalendarGrid({
  year,
  month,
  today,
  selectedDateKey,
  eventsByDate,
  onSelectDate,
}: CalendarGridProps) {
  const weeks = getMonthMatrix(year, month);
  const todayKey = toDateKey(today);

  return (
    <div className="overflow-hidden rounded-xl border border-black/10 bg-white/60 dark:border-white/10 dark:bg-white/5">
      <div className="grid grid-cols-7 border-b border-black/10 text-center text-xs font-semibold tracking-wide text-foreground/50 uppercase dark:border-white/10">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="py-2">
            {label}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {weeks.flatMap((week) =>
          week.map((date) => {
            const dateKey = toDateKey(date);
            return (
              <DayCell
                key={dateKey}
                date={date}
                dateKey={dateKey}
                isCurrentMonth={date.getMonth() === month}
                isToday={dateKey === todayKey}
                isSelected={dateKey === selectedDateKey}
                events={eventsByDate.get(dateKey) ?? []}
                onSelect={onSelectDate}
              />
            );
          }),
        )}
      </div>
    </div>
  );
}
