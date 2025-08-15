"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import CalendarEvent from "./CalendarEvent";

type CalendarProps = {
  events?: CalendarEventType[];
  onAddEvent?: (event: CalendarEventType) => void;
  onEditEvent?: (event: CalendarEventType) => void;
  onDeleteEvent?: (eventId: string) => void;
};

export type CalendarEventType = {
  id: string;
  title: string;
  date: Date;
  startTime?: string;
  endTime?: string;
  description?: string;
  color?: string;
};

export default function Calendar({
  events = [],
  onAddEvent,
  onEditEvent,
  onDeleteEvent,
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<CalendarEventType>>({
    title: "",
    date: new Date(),
    startTime: "",
    endTime: "",
    description: "",
    color: "#3b82f6", // Default blue color
  });

  // Get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get day of week for first day of month (0 = Sunday, 6 = Saturday)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ day: 0, date: null });
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push({ day: i, date });
    }

    return days;
  };

  // Format month and year
  const formatMonthYear = () => {
    return currentDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  // Handle day click
  const handleDayClick = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
      setNewEvent({
        ...newEvent,
        date,
      });
    }
  };

  // Handle event form submission
  const handleSubmitEvent = () => {
    if (!newEvent.title || !newEvent.date) return;

    const event: CalendarEventType = {
      id: Math.random().toString(36).substring(2, 9), // Generate a random ID
      title: newEvent.title,
      date: newEvent.date,
      startTime: newEvent.startTime,
      endTime: newEvent.endTime,
      description: newEvent.description,
      color: newEvent.color,
    };

    if (onAddEvent) {
      onAddEvent(event);
    }

    // Reset form
    setNewEvent({
      title: "",
      date: selectedDate || new Date(),
      startTime: "",
      endTime: "",
      description: "",
      color: "#3b82f6",
    });
    setShowEventForm(false);
  };

  // Get events for a specific date
  const getEventsForDate = (date: Date | null) => {
    if (!date) return [];

    return events.filter(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
    );
  };

  // Calendar days
  const calendarDays = generateCalendarDays();

  return (
    <div className="bg-[var(--app-card-bg)] backdrop-blur-md rounded-xl shadow-lg border border-[var(--app-card-border)] overflow-hidden transition-all animate-fade-in">
      <div className="px-5 py-3 border-b border-[var(--app-card-border)] flex justify-between items-center">
        <h3 className="text-lg font-medium text-[var(--app-foreground)]">
          Calendar
        </h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={goToPreviousMonth}
            className="p-1"
          >
            &lt;
          </Button>
          <span className="text-[var(--app-foreground)]">
            {formatMonthYear()}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={goToNextMonth}
            className="p-1"
          >
            &gt;
          </Button>
        </div>
      </div>

      <div className="p-4">
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {/* Weekday headers */}
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-[var(--app-foreground-muted)] py-2"
            >
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {calendarDays.map((day, index) => {
            const isToday =
              day.date &&
              day.date.getDate() === new Date().getDate() &&
              day.date.getMonth() === new Date().getMonth() &&
              day.date.getFullYear() === new Date().getFullYear();

            const isSelected =
              selectedDate &&
              day.date &&
              day.date.getDate() === selectedDate.getDate() &&
              day.date.getMonth() === selectedDate.getMonth() &&
              day.date.getFullYear() === selectedDate.getFullYear();

            const dayEvents = day.date ? getEventsForDate(day.date) : [];

            return (
              <div
                key={index}
                className={`min-h-[60px] p-1 border border-[var(--app-card-border)] rounded-md ${
                  day.day === 0 ? "bg-transparent" : "bg-[var(--app-background)]"
                } ${
                  isSelected
                    ? "ring-2 ring-[var(--app-accent)]"
                    : ""
                } ${
                  isToday
                    ? "bg-[var(--app-accent-light)]"
                    : ""
                }`}
                onClick={() => handleDayClick(day.date)}
              >
                {day.day > 0 && (
                  <>
                    <div className="text-right text-xs font-medium text-[var(--app-foreground-muted)]">
                      {day.day}
                    </div>
                    <div className="mt-1 space-y-1">
                      {dayEvents.slice(0, 2).map((event) => (
                        <div
                          key={event.id}
                          className="text-xs px-1 py-0.5 rounded truncate"
                          style={{ backgroundColor: event.color + "33" }} // Add transparency
                        >
                          {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-[var(--app-foreground-muted)]">
                          +{dayEvents.length - 2} more
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected date events */}
        {selectedDate && (
          <div className="mt-4 border-t border-[var(--app-card-border)] pt-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium text-[var(--app-foreground)]">
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </h4>
              <Button
                variant="default"
                size="sm"
                onClick={() => setShowEventForm(!showEventForm)}
              >
                Add Event
              </Button>
            </div>

            {/* Event form */}
            {showEventForm && (
              <div className="mb-4 p-3 border border-[var(--app-card-border)] rounded-lg bg-[var(--app-background)]">
                <div className="space-y-3">
                  <div>
                    <label
                      htmlFor="eventTitle"
                      className="block text-sm font-medium text-[var(--app-foreground)] mb-1"
                    >
                      Event Title
                    </label>
                    <input
                      type="text"
                      id="eventTitle"
                      value={newEvent.title || ""}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, title: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-lg text-[var(--app-foreground)] placeholder-[var(--app-foreground-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--app-accent)]"
                      placeholder="Enter event title"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="startTime"
                        className="block text-sm font-medium text-[var(--app-foreground)] mb-1"
                      >
                        Start Time
                      </label>
                      <input
                        type="time"
                        id="startTime"
                        value={newEvent.startTime || ""}
                        onChange={(e) =>
                          setNewEvent({ ...newEvent, startTime: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-lg text-[var(--app-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--app-accent)]"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="endTime"
                        className="block text-sm font-medium text-[var(--app-foreground)] mb-1"
                      >
                        End Time
                      </label>
                      <input
                        type="time"
                        id="endTime"
                        value={newEvent.endTime || ""}
                        onChange={(e) =>
                          setNewEvent({ ...newEvent, endTime: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-lg text-[var(--app-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--app-accent)]"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="eventDescription"
                      className="block text-sm font-medium text-[var(--app-foreground)] mb-1"
                    >
                      Description (Optional)
                    </label>
                    <textarea
                      id="eventDescription"
                      value={newEvent.description || ""}
                      onChange={(e) =>
                        setNewEvent({
                          ...newEvent,
                          description: e.target.value,
                        })
                      }
                      rows={2}
                      className="w-full px-3 py-2 bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-lg text-[var(--app-foreground)] placeholder-[var(--app-foreground-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--app-accent)]"
                      placeholder="Add details"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowEventForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleSubmitEvent}
                      disabled={!newEvent.title}
                    >
                      Add Event
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Events list */}
            <div className="space-y-2">
              {getEventsForDate(selectedDate).length > 0 ? (
                getEventsForDate(selectedDate).map((event) => (
                  <CalendarEvent
                    key={event.id}
                    event={event}
                    onEdit={onEditEvent}
                    onDelete={onDeleteEvent}
                  />
                ))
              ) : (
                <p className="text-[var(--app-foreground-muted)] text-sm">
                  No events scheduled for this day.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
