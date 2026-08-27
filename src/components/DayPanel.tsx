"use client";

import { CalendarEvent } from "@/lib/types";
import { formatFullDate } from "@/lib/dateUtils";

interface DayPanelProps {
  date: Date;
  events: CalendarEvent[];
  onAddEvent: () => void;
  onEditEvent: (event: CalendarEvent) => void;
}

export default function DayPanel({
  date,
  events,
  onAddEvent,
  onEditEvent,
}: DayPanelProps) {
  return (
    <div className="flex h-full flex-col gap-3 rounded-xl border border-black/10 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-foreground/90 capitalize">
          {formatFullDate(date)}
        </h3>
        <button
          onClick={onAddEvent}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white hover:bg-indigo-500"
          aria-label="Evenement toevoegen"
        >
          +
        </button>
      </div>

      {events.length === 0 ? (
        <p className="text-sm text-foreground/50">
          Nog geen evenementen op deze dag.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {events.map((event) => (
            <li key={event.id}>
              <button
                onClick={() => onEditEvent(event)}
                className="w-full rounded-lg border border-black/10 bg-white p-3 text-left transition-colors hover:border-indigo-300 hover:bg-indigo-50 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-medium text-foreground">
                    {event.title}
                  </span>
                  <span className="shrink-0 text-xs font-semibold text-indigo-600 dark:text-indigo-300">
                    {event.time}
                  </span>
                </div>
                {event.description && (
                  <p className="mt-1 text-sm whitespace-pre-wrap text-foreground/60">
                    {event.description}
                  </p>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
