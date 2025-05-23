"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useSigner } from "wagmi";
import TaskManagerABI from "../../abis/TaskManager.json";
import { Icon } from "../DemoComponents";
import TaskForn from "./TaskForm";
import { useToast } from "../context/ToastContext";
import { Task } from "./TaskList"

const TASK_MANAGER_ADDRESS = "CONTRACT_ADDRESS"; // Replace with actual address

type TaskItemProps = {
  task: Task;
  onToggleComplete: (taskId: string) => void;
  onUpdate: (task: Task) => void;
  onDelete: (taskId: string) => void;
};

export default function TaskItem({
  task,
  onToggleComplete,
  onUpdate,
  onDelete,
}: TaskItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleComplete(task.id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setIsExpanded(true);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(task.id);
  };

  const handleUpdate = (updatedTask: Task) => {
    onUpdate(updatedTask);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  // Format due date
  const formatDueDate = (date?: Date) => {
    if (!date) return "No due date";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const taskDate = new Date(date);
    taskDate.setHours(0, 0, 0, 0);

    if (taskDate.getTime() === today.getTime()) {
      return "Today";
    } else if (taskDate.getTime() === tomorrow.getTime()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
      });
    }
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500";
      case "medium":
        return "text-yellow-500";
      case "low":
        return "text-green-500";
      default:
        return "text-[var(--app-foreground-muted)]";
    }
  };

  // Get priority icon
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return "!";
      case "medium":
        return "◆";
      case "low":
        return "○";
      default:
        return "○";
    }
  };

  // Check if task is overdue
  const isOverdue = () => {
    if (!task.dueDate) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const taskDate = new Date(task.dueDate);
    taskDate.setHours(0, 0, 0, 0);

    return taskDate < today && !task.completed;
  };

  return (
    <li
      className={`border border-[var(--app-card-border)] rounded-lg overflow-hidden transition-all ${
        task.completed ? "opacity-70" : ""
      }`}
    >
      <div
        className={`px-3 py-2 flex items-center cursor-pointer ${
          isExpanded ? "border-b border-[var(--app-card-border)]" : ""
        }`}
        onClick={() => !isEditing && setIsExpanded(!isExpanded)}
      >
        <button
          className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
            task.completed
              ? "bg-[var(--app-accent)] border-[var(--app-accent)]"
              : "border-[var(--app-foreground-muted)] bg-transparent"
          }`}
          onClick={handleToggle}
        >
          {task.completed && (
            <Icon
              name="check"
              size="sm"
              className="text-[var(--app-background)]"
            />
          )}
        </button>

        <div className="flex-1">
          <div className="flex items-center">
            <span
              className={`mr-2 ${getPriorityColor(task.priority)}`}
              title={`Priority: ${task.priority}`}
            >
              {getPriorityIcon(task.priority)}
            </span>
            <h4
              className={`font-medium ${
                task.completed
                  ? "line-through text-[var(--app-foreground-muted)]"
                  : "text-[var(--app-foreground)]"
              }`}
            >
              {task.title}
            </h4>
          </div>

          {task.dueDate && (
            <div
              className={`text-xs ${
                isOverdue()
                  ? "text-red-500"
                  : "text-[var(--app-foreground-muted)]"
              }`}
            >
              {isOverdue() ? "Overdue: " : "Due: "}
              {formatDueDate(task.dueDate)}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-1">
          {!isEditing && (
            <>
              <button
                onClick={handleEdit}
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
                onClick={handleDelete}
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
        <div className="px-3 py-2 bg-[var(--app-background)]">
          {isEditing ? (
            <TaskForm
              task={task}
              onSubmit={handleUpdate}
              onCancel={handleCancel}
              isEditing={true}
            />
          ) : (
            <div className="space-y-2">
              {task.description && (
                <p className="text-sm text-[var(--app-foreground-muted)]">
                  {task.description}
                </p>
              )}

              {task.tags && task.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {task.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 text-xs rounded-full bg-[var(--app-accent-light)] text-[var(--app-accent)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </li>
  );
}
