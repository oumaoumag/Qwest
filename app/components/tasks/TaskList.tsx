"use client";

import { useState, useEffect, useCallback } from "react";
import TaskItem from "./TaskItem";
import TaskForm from "./TaskForm";
import { Button } from "../ui/button";
import { Plus } from "../ui/icons";



export type Task = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: Date;
  priority: "low" | "medium" | "high";
  category: "work" | "personal" | "health" | "learning" | "social" | "other";
  tags?: string[];
  cid: string; // For IPFS integration
};



// type TaskListProps = {
//   initialTasks?: Task[];
//   onAddTask?: (task: Task) => void;
//   onUpdateTask?: (task: Task) => void;
//   onDeleteTask?: (taskId: string) => void;
// };

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [sortBy, setSortBy] = useState<"dueDate" | "priority" | "title">("dueDate");
  const [loading, setLoading] = useState(false);

  // Simplified without blockchain functionality for now
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      // For now, just use local state without blockchain interaction
      // Tasks will be managed locally
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load taks when wallet connects or signer  changes
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Add a new task
  const handleAddTask = async (task: Task) => {
    setLoading(true);
    try {
      // For now, just add to local state without blockchain interaction
      setTasks(prev => [...prev, task]);
      setShowForm(false);
    } catch (error) {
      console.error("Failed to create task:", error);
    } finally {
    setLoading(false);
  }
};

// Toggle task completion
const handleToggleComplete = async (taskId: string) => {
  setLoading(true);
  try {
    setTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  } catch (error) {
    console.error("Failed to complete task:", error);
  } finally {
    setLoading(false);
  }
};

  // Filter tasks (client-side, since blockchain data is fetched)
  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  // Sort tasks (client-side)
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
    if (sortBy === "title") return a.title.localeCompare(b.title);
    return 0;
  });

  return (
    <div className="bg-[var(--app-card-bg)] backdrop-blur-md rounded-xl shadow-lg border border-[var(--app-card-border)] overflow-hidden transition-all animate-fade-in">
      <div className="px-5 py-3 border-b border-[var(--app-card-border)] flex justify-between items-center">
        <h3 className="text-lg font-medium text-[var(--app-foreground)]">
          Tasks
        </h3>
        <Button
          variant="default"
          size="sm"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus className="w-4 h-4 mr-2" />
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
        {loading ? (
          <p className="text-center text-[var(--app-foreground-muted)]">Loading tasks...</p>
        ) : sortedTasks.length > 0 ? (
          <ul className="space-y-2">
            {sortedTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleComplete={handleToggleComplete}
                onUpdate={() => {}} // TOD0: implement
                onDelete={() => {}} // TOD0: implement
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
          <span>{tasks.filter((task) => !task.completed).length} active tasks</span>
          <span>{tasks.filter((task) => task.completed).length} completed</span>
        </div>
      </div>
    </div>
  );
}
