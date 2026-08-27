"use client";

import { CalendarEvent } from "@/lib/types";

interface DayCellProps {
  date: Date;
  dateKey: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  events: CalendarEvent[];
  onSelect: (dateKey: string) => void;
}

const MAX_VISIBLE_EVENTS = 2;

export default function DayCell({
  date,
  dateKey,
  isCurrentMonth,
  isToday,
  isSelected,
  events,
  onSelect,
}: DayCellProps) {
  const visibleEvents = events.slice(0, MAX_VISIBLE_EVENTS);
  const overflowCount = events.length - visibleEvents.length;

  return (
    <button
      type="button"
      onClick={() => onSelect(dateKey)}
      className={`flex min-h-16 flex-col items-start gap-1 border-b border-r border-black/5 p-1 text-left transition-colors last:border-r-0 hover:bg-indigo-50 sm:min-h-24 sm:p-2 dark:border-white/5 dark:hover:bg-white/10 ${
        isCurrentMonth ? "" : "opacity-40"
      } ${
        isSelected
          ? "bg-indigo-50 ring-1 ring-inset ring-indigo-400 dark:bg-indigo-500/10"
          : ""
      }`}
    >
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium sm:text-sm ${
          isToday ? "bg-indigo-600 text-white" : "text-foreground/80"
        }`}
      >
        {date.getDate()}
      </span>

      {events.length > 0 && (
        <div className="flex gap-0.5 sm:hidden">
          {events.slice(0, 3).map((event) => (
            <span
              key={event.id}
              className="h-1.5 w-1.5 rounded-full bg-indigo-500"
            />
          ))}
        </div>
      )}

      <div className="hidden w-full flex-col gap-0.5 sm:flex">
        {visibleEvents.map((event) => (
          <span
            key={event.id}
            className="w-full truncate rounded bg-indigo-100 px-1 py-0.5 text-[11px] text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-200"
          >
            {event.time} {event.title}
          </span>
        ))}
        {overflowCount > 0 && (
          <span className="text-[11px] font-medium text-foreground/50">
            +{overflowCount} meer
          </span>
        )}
      </div>
    </button>
  );
}
