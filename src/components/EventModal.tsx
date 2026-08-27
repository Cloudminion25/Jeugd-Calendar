"use client";

import { FormEvent, useState } from "react";
import { CalendarEvent } from "@/lib/types";

interface EventModalProps {
  defaultDate: string;
  editingEvent?: CalendarEvent;
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
  onDelete: (id: string) => void;
  createId: () => string;
}

const inputClass =
  "rounded-lg border border-black/15 bg-white px-3 py-2 text-sm font-normal outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-white/15 dark:bg-white/5";

export default function EventModal({
  defaultDate,
  editingEvent,
  onClose,
  onSave,
  onDelete,
  createId,
}: EventModalProps) {
  const [title, setTitle] = useState(editingEvent?.title ?? "");
  const [date, setDate] = useState(editingEvent?.date ?? defaultDate);
  const [time, setTime] = useState(editingEvent?.time ?? "09:00");
  const [description, setDescription] = useState(
    editingEvent?.description ?? "",
  );
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Titel is verplicht.");
      return;
    }
    if (!date || !time) {
      setError("Datum en tijd zijn verplicht.");
      return;
    }
    onSave({
      id: editingEvent?.id ?? createId(),
      title: title.trim(),
      date,
      time,
      description: description.trim(),
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full overflow-y-auto rounded-t-2xl bg-background p-5 shadow-xl sm:max-w-md sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {editingEvent ? "Evenement bewerken" : "Nieuw evenement"}
          </h2>
          <button
            onClick={onClose}
            aria-label="Sluiten"
            className="flex h-8 w-8 items-center justify-center rounded-full text-xl hover:bg-black/5 dark:hover:bg-white/10"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm font-medium">
            Titel
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Bijv. Speurtocht in het bos"
              className={inputClass}
            />
          </label>

          <div className="flex gap-3">
            <label className="flex flex-1 flex-col gap-1 text-sm font-medium">
              Datum
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={inputClass}
              />
            </label>
            <label className="flex w-32 flex-col gap-1 text-sm font-medium">
              Tijd
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className={inputClass}
              />
            </label>
          </div>

          <label className="flex flex-col gap-1 text-sm font-medium">
            Extra informatie
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Locatie, wat mee te nemen, bijzonderheden..."
              rows={3}
              className={`resize-none ${inputClass}`}
            />
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="mt-2 flex items-center justify-between gap-3">
            {editingEvent ? (
              <button
                type="button"
                onClick={() => onDelete(editingEvent.id)}
                className="rounded-full px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
              >
                Verwijderen
              </button>
            ) : (
              <span />
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
              >
                Annuleren
              </button>
              <button
                type="submit"
                className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
              >
                Opslaan
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
