"use client";

import { useState } from "react";
import { PlannerItem } from "./DailyPlanner";

type TimeBlockProps = {
  item: PlannerItem;
  onToggleComplete: (itemId: string) => void;
  onEdit: (item: PlannerItem) => void;
  onDelete: (itemId: string) => void;
};

export default function TimeBlock({
  item,
  onToggleComplete,
  onEdit,
  onDelete,
}: TimeBlockProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Format time for display
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${period}`;
  };

  // Calculate duration in minutes
  const calculateDuration = () => {
    const [startHours, startMinutes] = item.startTime.split(":").map(Number);
    const [endHours, endMinutes] = item.endTime.split(":").map(Number);
    
    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;
    
    return endTotalMinutes - startTotalMinutes;
  };

  // Get category color
  const getCategoryColor = () => {
    switch (item.category) {
      case "work":
        return "bg-blue-100 border-blue-300 text-blue-800";
      case "personal":
        return "bg-green-100 border-green-300 text-green-800";
      case "health":
        return "bg-red-100 border-red-300 text-red-800";
      case "learning":
        return "bg-purple-100 border-purple-300 text-purple-800";
      case "social":
        return "bg-yellow-100 border-yellow-300 text-yellow-800";
      default:
        return "bg-gray-100 border-gray-300 text-gray-800";
    }
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleComplete(item.id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(item);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(item.id);
  };

  return (
    <div
      className={`mb-1 rounded-md border ${getCategoryColor()} ${
        item.completed ? "opacity-60" : ""
      } cursor-pointer transition-all`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="px-2 py-1 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
              item.completed
                ? "bg-[var(--app-accent)] border-[var(--app-accent)]"
                : "border-current bg-transparent"
            }`}
            onClick={handleToggle}
          >
            {item.completed && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-3 h-3"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </button>
          <div>
            <h5
              className={`text-sm font-medium ${
                item.completed ? "line-through" : ""
              }`}
            >
              {item.title}
            </h5>
            <div className="text-xs">
              {formatTime(item.startTime)} - {formatTime(item.endTime)}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={handleEdit}
            className="p-1 hover:text-[var(--app-accent)]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
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
            onClick={handleDelete}
            className="p-1 hover:text-red-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
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
        </div>
      </div>
      
      {isExpanded && item.description && (
        <div className="px-2 py-1 text-xs border-t border-current bg-white bg-opacity-50">
          {item.description}
        </div>
      )}
    </div>
  );
}
