"use client";

import { useMemo, useState } from "react";
import { CalendarEvent } from "@/lib/types";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { toDateKey, parseDateKey, formatMonthYear } from "@/lib/dateUtils";
import CalendarGrid from "./CalendarGrid";
import DayPanel from "./DayPanel";
import EventModal from "./EventModal";

type ModalState =
  | { open: false }
  | { open: true; defaultDate: string; editingEvent?: CalendarEvent };

function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function CalendarApp() {
  const today = useMemo(() => new Date(), []);
  const [events, setEvents] = useLocalStorage<CalendarEvent[]>(
    "jeugd-calendar-events",
    [],
  );
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDateKey, setSelectedDateKey] = useState(toDateKey(today));
  const [modalState, setModalState] = useState<ModalState>({ open: false });

  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const event of events) {
      const list = map.get(event.date) ?? [];
      list.push(event);
      map.set(event.date, list);
    }
    for (const list of map.values()) {
      list.sort((a, b) => a.time.localeCompare(b.time));
    }
    return map;
  }, [events]);

  function goToMonth(delta: number) {
    const next = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  }

  function goToToday() {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    setSelectedDateKey(toDateKey(today));
  }

  function openNewEventModal(dateKey: string) {
    setModalState({ open: true, defaultDate: dateKey });
  }

  function openEditEventModal(event: CalendarEvent) {
    setModalState({
      open: true,
      defaultDate: event.date,
      editingEvent: event,
    });
  }

  function closeModal() {
    setModalState({ open: false });
  }

  function saveEvent(event: CalendarEvent) {
    setEvents((prev) => {
      const exists = prev.some((e) => e.id === event.id);
      if (exists) {
        return prev.map((e) => (e.id === event.id ? event : e));
      }
      return [...prev, event];
    });
    setSelectedDateKey(event.date);
    closeModal();
  }

  function deleteEvent(id: string) {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    closeModal();
  }

  const selectedDate = useMemo(
    () => parseDateKey(selectedDateKey),
    [selectedDateKey],
  );

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 p-3 sm:p-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground sm:text-2xl">
            Jeugd Kalender
          </h1>
          <p className="text-sm text-foreground/60">
            Plan en beheer activiteiten en evenementen
          </p>
        </div>
        <button
          onClick={() => openNewEventModal(selectedDateKey)}
          className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500"
        >
          + Nieuw evenement
        </button>
      </header>

      <div className="flex items-center justify-between gap-3 rounded-xl border border-black/10 bg-white/60 p-2 dark:border-white/10 dark:bg-white/5">
        <div className="flex items-center gap-1">
          <button
            aria-label="Vorige maand"
            onClick={() => goToMonth(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-lg hover:bg-black/5 dark:hover:bg-white/10"
          >
            ‹
          </button>
          <button
            aria-label="Volgende maand"
            onClick={() => goToMonth(1)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-lg hover:bg-black/5 dark:hover:bg-white/10"
          >
            ›
          </button>
        </div>
        <h2 className="text-base font-semibold capitalize sm:text-lg">
          {formatMonthYear(new Date(viewYear, viewMonth, 1))}
        </h2>
        <button
          onClick={goToToday}
          className="rounded-full border border-black/10 px-3 py-1.5 text-sm font-medium hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
        >
          Vandaag
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-4 lg:flex-row">
        <div className="lg:flex-1">
          <CalendarGrid
            year={viewYear}
            month={viewMonth}
            today={today}
            selectedDateKey={selectedDateKey}
            eventsByDate={eventsByDate}
            onSelectDate={setSelectedDateKey}
          />
        </div>
        <div className="lg:w-80 lg:shrink-0">
          <DayPanel
            date={selectedDate}
            events={eventsByDate.get(selectedDateKey) ?? []}
            onAddEvent={() => openNewEventModal(selectedDateKey)}
            onEditEvent={openEditEventModal}
          />
        </div>
      </div>

      {modalState.open && (
        <EventModal
          defaultDate={modalState.defaultDate}
          editingEvent={modalState.editingEvent}
          onClose={closeModal}
          onSave={saveEvent}
          onDelete={deleteEvent}
          createId={createId}
        />
      )}
    </div>
  );
}
