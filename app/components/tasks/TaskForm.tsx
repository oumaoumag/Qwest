"use client";

import { useState, useEffect } from "react";
import { Button, Icon } from "../DemoComponents";
import { Task } from "./TaskList";

type TaskFormProps = {
  task?: Task;
  onSubmit: (task: Task) => void;
  onCancel: () => void;
  isEditing?: boolean;
};

export default function TaskForm({
  task,
  onSubmit,
  onCancel,
  isEditing = false,
}: TaskFormProps) {
  const [formData, setFormData] = useState<Partial<Task>>({
    title: "",
    description: "",
    completed: false,
    dueDate: undefined,
    priority: "medium",
    tags: [],
  });
  const [tagInput, setTagInput] = useState("");

  // Initialize form data if editing
  useEffect(() => {
    if (task) {
      setFormData({
        ...task,
        dueDate: task.dueDate,
      });
    }
  }, [task]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } else if (name === "dueDate") {
      setFormData({
        ...formData,
        dueDate: value ? new Date(value) : undefined,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && formData.tags) {
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData({
          ...formData,
          tags: [...formData.tags, tagInput.trim()],
        });
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (formData.tags) {
      setFormData({
        ...formData,
        tags: formData.tags.filter((tag) => tag !== tagToRemove),
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title) return;
    
    const newTask: Task = {
      id: task?.id || Math.random().toString(36).substring(2, 9),
      title: formData.title || "",
      description: formData.description,
      completed: formData.completed || false,
      dueDate: formData.dueDate,
      priority: formData.priority as "low" | "medium" | "high" || "medium",
      tags: formData.tags || [],
    };
    
    onSubmit(newTask);
    
    // Reset form if not editing
    if (!isEditing) {
      setFormData({
        title: "",
        description: "",
        completed: false,
        dueDate: undefined,
        priority: "medium",
        tags: [],
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddTag();
    }
  };

  // Format date for input
  const formatDateForInput = (date?: Date) => {
    if (!date) return "";
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    
    return `${year}-${month}-${day}`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-[var(--app-foreground)] mb-1"
        >
          Task Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title || ""}
          onChange={handleInputChange}
          className="w-full px-3 py-2 bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-lg text-[var(--app-foreground)] placeholder-[var(--app-foreground-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--app-accent)]"
          placeholder="Enter task title"
          required
        />
      </div>
      
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-[var(--app-foreground)] mb-1"
        >
          Description (Optional)
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description || ""}
          onChange={handleInputChange}
          rows={3}
          className="w-full px-3 py-2 bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-lg text-[var(--app-foreground)] placeholder-[var(--app-foreground-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--app-accent)]"
          placeholder="Add details about this task"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="dueDate"
            className="block text-sm font-medium text-[var(--app-foreground)] mb-1"
          >
            Due Date
          </label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={formatDateForInput(formData.dueDate)}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-lg text-[var(--app-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--app-accent)]"
          />
        </div>
        
        <div>
          <label
            htmlFor="priority"
            className="block text-sm font-medium text-[var(--app-foreground)] mb-1"
          >
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority || "medium"}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-lg text-[var(--app-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--app-accent)]"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>
      
      <div>
        <label
          htmlFor="tags"
          className="block text-sm font-medium text-[var(--app-foreground)] mb-1"
        >
          Tags (Optional)
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            id="tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 px-3 py-2 bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-lg text-[var(--app-foreground)] placeholder-[var(--app-foreground-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--app-accent)]"
            placeholder="Add a tag and press Enter"
          />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleAddTag}
          >
            Add
          </Button>
        </div>
        
        {formData.tags && formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-[var(--app-accent-light)] text-[var(--app-accent)]"
              >
                {tag}
                <button
                  type="button"
                  className="ml-1 text-[var(--app-accent)] hover:text-[var(--app-accent-hover)]"
                  onClick={() => handleRemoveTag(tag)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
      
      {isEditing && (
        <div className="flex items-center">
          <input
            type="checkbox"
            id="completed"
            name="completed"
            checked={formData.completed}
            onChange={handleInputChange}
            className="h-4 w-4 text-[var(--app-accent)] border-[var(--app-card-border)] rounded focus:ring-[var(--app-accent)]"
          />
          <label
            htmlFor="completed"
            className="ml-2 text-sm text-[var(--app-foreground)]"
          >
            Mark as completed
          </label>
        </div>
      )}
      
      <div className="flex justify-end space-x-2">
        <Button variant="ghost" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          variant="primary"
          type="submit"
          disabled={!formData.title}
          icon={<Icon name={isEditing ? "check" : "plus"} size="sm" />}
        >
          {isEditing ? "Update Task" : "Add Task"}
        </Button>
      </div>
    </form>
  );
}
