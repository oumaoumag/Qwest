"use client";

import { useState } from "react";
import { Button, Icon } from "../DemoComponents";
import TaskItem from "./TaskItem";
import TaskForm from "./TaskForm";

export type Task = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: Date;
  priority: "low" | "medium" | "high";
  tags?: string[];
};

type TaskListProps = {
  initialTasks?: Task[];
  onAddTask?: (task: Task) => void;
  onUpdateTask?: (task: Task) => void;
  onDeleteTask?: (taskId: string) => void;
};

export default function TaskList({
  initialTasks = [],
  onAddTask,
  onUpdateTask,
  onDeleteTask,
}: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [sortBy, setSortBy] = useState<"dueDate" | "priority" | "title">("dueDate");

  // Add a new task
  const handleAddTask = (task: Task) => {
    const newTasks = [...tasks, task];
    setTasks(newTasks);

    if (onAddTask) {
      onAddTask(task);
    }

    setShowForm(false);
  };

  // Update a task
  const handleUpdateTask = (updatedTask: Task) => {
    const newTasks = tasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    );
    setTasks(newTasks);

    if (onUpdateTask) {
      onUpdateTask(updatedTask);
    }
  };

  // Delete a task
  const handleDeleteTask = (taskId: string) => {
    const newTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(newTasks);

    if (onDeleteTask) {
      onDeleteTask(taskId);
    }
  };

  // Toggle task completion
  const handleToggleComplete = (taskId: string) => {
    const taskToUpdate = tasks.find((task) => task.id === taskId);

    if (taskToUpdate) {
      const updatedTask = {
        ...taskToUpdate,
        completed: !taskToUpdate.completed,
      };

      handleUpdateTask(updatedTask);
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "dueDate") {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.getTime() - b.dueDate.getTime();
    }

    if (sortBy === "priority") {
      const priorityValues = { high: 0, medium: 1, low: 2 };
      return priorityValues[a.priority] - priorityValues[b.priority];
    }

    if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    }

    return 0;
  });

  return (
    <div className="bg-[var(--app-card-bg)] backdrop-blur-md rounded-xl shadow-lg border border-[var(--app-card-border)] overflow-hidden transition-all animate-fade-in">
      <div className="px-5 py-3 border-b border-[var(--app-card-border)] flex justify-between items-center">
        <h3 className="text-lg font-medium text-[var(--app-foreground)]">
          Tasks
        </h3>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowForm(!showForm)}
          icon={<Icon name="plus" size="sm" />}
        >
          Add Task
        </Button>
      </div>

      {/* Task form */}
      {showForm && (
        <div className="p-4 border-b border-[var(--app-card-border)]">
          <TaskForm onSubmit={handleAddTask} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {/* Filters and sorting */}
      <div className="px-4 py-2 border-b border-[var(--app-card-border)] flex justify-between items-center">
        <div className="flex space-x-2">
          <button
            className={`px-2 py-1 text-xs rounded-md ${
              filter === "all"
                ? "bg-[var(--app-accent)] text-white"
                : "text-[var(--app-foreground-muted)] hover:bg-[var(--app-background)]"
            }`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={`px-2 py-1 text-xs rounded-md ${
              filter === "active"
                ? "bg-[var(--app-accent)] text-white"
                : "text-[var(--app-foreground-muted)] hover:bg-[var(--app-background)]"
            }`}
            onClick={() => setFilter("active")}
          >
            Active
          </button>
          <button
            className={`px-2 py-1 text-xs rounded-md ${
              filter === "completed"
                ? "bg-[var(--app-accent)] text-white"
                : "text-[var(--app-foreground-muted)] hover:bg-[var(--app-background)]"
            }`}
            onClick={() => setFilter("completed")}
          >
            Completed
          </button>
        </div>
        <div className="flex items-center">
          <label className="text-xs text-[var(--app-foreground-muted)] mr-2">
            Sort by:
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "dueDate" | "priority" | "title")}
            className="text-xs bg-[var(--app-background)] border border-[var(--app-card-border)] rounded-md px-2 py-1 text-[var(--app-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--app-accent)]"
          >
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="title">Title</option>
          </select>
        </div>
      </div>

      {/* Task list */}
      <div className="p-4">
        {sortedTasks.length > 0 ? (
          <ul className="space-y-2">
            {sortedTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleComplete={handleToggleComplete}
                onUpdate={handleUpdateTask}
                onDelete={handleDeleteTask}
              />
            ))}
          </ul>
        ) : (
          <div className="text-center py-6">
            <p className="text-[var(--app-foreground-muted)]">
              {filter === "all"
                ? "No tasks yet. Add your first task!"
                : filter === "active"
                ? "No active tasks."
                : "No completed tasks."}
            </p>
          </div>
        )}
      </div>

      {/* Task summary */}
      <div className="px-4 py-2 border-t border-[var(--app-card-border)] text-xs text-[var(--app-foreground-muted)]">
        <div className="flex justify-between">
          <span>
            {tasks.filter((task) => !task.completed).length} active tasks
          </span>
          <span>
            {tasks.filter((task) => task.completed).length} completed
          </span>
        </div>
      </div>
    </div>
  );
}
