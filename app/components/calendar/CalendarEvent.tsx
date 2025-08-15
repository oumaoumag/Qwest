"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { CalendarEventType } from "./Calendar";

type CalendarEventProps = {
  event: CalendarEventType;
  onEdit?: (event: CalendarEventType) => void;
  onDelete?: (eventId: string) => void;
};

export default function CalendarEvent({
  event,
  onEdit,
  onDelete,
}: CalendarEventProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedEvent, setEditedEvent] = useState<CalendarEventType>(event);

  const handleEdit = () => {
    setIsEditing(true);
    setIsExpanded(true);
  };

  const handleSave = () => {
    if (onEdit) {
      onEdit(editedEvent);
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(event.id);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedEvent({
      ...editedEvent,
      [name]: value,
    });
  };

  return (
    <div
      className={`border border-[var(--app-card-border)] rounded-lg overflow-hidden transition-all ${
        isExpanded ? "bg-[var(--app-background)]" : ""
      }`}
      style={{
        borderLeftColor: event.color,
        borderLeftWidth: "4px",
      }}
    >
      <div
        className="px-3 py-2 flex justify-between items-center cursor-pointer"
        onClick={() => !isEditing && setIsExpanded(!isExpanded)}
      >
        <div className="flex-1">
          <div className="flex items-center">
            <h5 className="font-medium text-[var(--app-foreground)]">
              {event.title}
            </h5>
            {(event.startTime || event.endTime) && (
              <span className="ml-2 text-xs text-[var(--app-foreground-muted)]">
                {event.startTime && event.endTime
                  ? `${event.startTime} - ${event.endTime}`
                  : event.startTime || event.endTime}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-1">
          {!isEditing && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit();
                }}
                className="p-1 text-[var(--app-foreground-muted)] hover:text-[var(--app-foreground)]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                className="p-1 text-[var(--app-foreground-muted)] hover:text-red-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
              </button>
            </>
          )}
          {!isEditing && (
            <span className="text-[var(--app-foreground-muted)]">
              {isExpanded ? "▲" : "▼"}
            </span>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="px-3 py-2 border-t border-[var(--app-card-border)] bg-[var(--app-background)]">
          {isEditing ? (
            <div className="space-y-3">
              <div>
                <label
                  htmlFor="title"
                  className="block text-xs font-medium text-[var(--app-foreground-muted)] mb-1"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={editedEvent.title}
                  onChange={handleInputChange}
                  className="w-full px-2 py-1 text-sm bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-md text-[var(--app-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--app-accent)]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="startTime"
                    className="block text-xs font-medium text-[var(--app-foreground-muted)] mb-1"
                  >
                    Start Time
                  </label>
                  <input
                    type="time"
                    id="startTime"
                    name="startTime"
                    value={editedEvent.startTime || ""}
                    onChange={handleInputChange}
                    className="w-full px-2 py-1 text-sm bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-md text-[var(--app-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--app-accent)]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="endTime"
                    className="block text-xs font-medium text-[var(--app-foreground-muted)] mb-1"
                  >
                    End Time
                  </label>
                  <input
                    type="time"
                    id="endTime"
                    name="endTime"
                    value={editedEvent.endTime || ""}
                    onChange={handleInputChange}
                    className="w-full px-2 py-1 text-sm bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-md text-[var(--app-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--app-accent)]"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-xs font-medium text-[var(--app-foreground-muted)] mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={editedEvent.description || ""}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-2 py-1 text-sm bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-md text-[var(--app-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--app-accent)]"
                />
              </div>
              <div>
                <label
                  htmlFor="color"
                  className="block text-xs font-medium text-[var(--app-foreground-muted)] mb-1"
                >
                  Color
                </label>
                <input
                  type="color"
                  id="color"
                  name="color"
                  value={editedEvent.color || "#3b82f6"}
                  onChange={handleInputChange}
                  className="w-8 h-8 p-0 border border-[var(--app-card-border)] rounded-md cursor-pointer"
                />
              </div>
              <div className="flex justify-end space-x-2 mt-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsEditing(false);
                    setEditedEvent(event);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSave}
                >
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {event.description && (
                <p className="text-sm text-[var(--app-foreground-muted)]">
                  {event.description}
                </p>
              )}
              <div className="text-xs text-[var(--app-foreground-muted)]">
                {event.date.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
