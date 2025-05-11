"use client";

import { useState, useEffect } from "react";
import { Button, Icon } from "../DemoComponents";
import { PlannerItem } from "./DailyPlanner";

type PlannerFormProps = {
  onSubmit: (item: PlannerItem) => void;
  onCancel: () => void;
  initialDate?: Date;
  item?: PlannerItem;
  isEditing?: boolean;
};

export default function PlannerForm({
  onSubmit,
  onCancel,
  initialDate = new Date(),
  item,
  isEditing = false,
}: PlannerFormProps) {
  const [formData, setFormData] = useState<Partial<PlannerItem>>({
    title: "",
    description: "",
    startTime: "09:00",
    endTime: "10:00",
    date: initialDate,
    category: "work",
    completed: false,
  });

  // Initialize form data if editing
  useEffect(() => {
    if (item) {
      setFormData({
        ...item,
      });
    }
  }, [item]);

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
    } else if (name === "date") {
      setFormData({
        ...formData,
        date: new Date(value),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.startTime || !formData.endTime) return;
    
    const newItem: PlannerItem = {
      id: item?.id || Math.random().toString(36).substring(2, 9),
      title: formData.title || "",
      description: formData.description,
      startTime: formData.startTime || "09:00",
      endTime: formData.endTime || "10:00",
      date: formData.date || new Date(),
      category: formData.category,
      completed: formData.completed || false,
    };
    
    onSubmit(newItem);
    
    // Reset form if not editing
    if (!isEditing) {
      setFormData({
        title: "",
        description: "",
        startTime: "09:00",
        endTime: "10:00",
        date: initialDate,
        category: "work",
        completed: false,
      });
    }
  };

  // Format date for input
  const formatDateForInput = (date: Date) => {
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
          Activity Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title || ""}
          onChange={handleInputChange}
          className="w-full px-3 py-2 bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-lg text-[var(--app-foreground)] placeholder-[var(--app-foreground-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--app-accent)]"
          placeholder="Enter activity title"
          required
        />
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-[var(--app-foreground)] mb-1"
          >
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formatDateForInput(formData.date || initialDate)}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-lg text-[var(--app-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--app-accent)]"
          />
        </div>
        
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
            name="startTime"
            value={formData.startTime || "09:00"}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-lg text-[var(--app-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--app-accent)]"
            required
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
            name="endTime"
            value={formData.endTime || "10:00"}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-lg text-[var(--app-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--app-accent)]"
            required
          />
        </div>
      </div>
      
      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-[var(--app-foreground)] mb-1"
        >
          Category
        </label>
        <select
          id="category"
          name="category"
          value={formData.category || "work"}
          onChange={handleInputChange}
          className="w-full px-3 py-2 bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-lg text-[var(--app-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--app-accent)]"
        >
          <option value="work">Work</option>
          <option value="personal">Personal</option>
          <option value="health">Health</option>
          <option value="learning">Learning</option>
          <option value="social">Social</option>
          <option value="other">Other</option>
        </select>
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
          placeholder="Add details about this activity"
        />
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
          disabled={!formData.title || !formData.startTime || !formData.endTime}
          icon={<Icon name={isEditing ? "check" : "plus"} size="sm" />}
        >
          {isEditing ? "Update Activity" : "Add Activity"}
        </Button>
      </div>
    </form>
  );
}
