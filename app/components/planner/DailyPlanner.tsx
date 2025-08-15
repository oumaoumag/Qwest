"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import TimeBlock from "./TimeBlock";
import PlannerForm from "./PlannerForm";

export type PlannerItem = {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  date: Date;
  category?: string;
  completed: boolean;
};

type DailyPlannerProps = {
  initialItems?: PlannerItem[];
  onAddItem?: (item: PlannerItem) => void;
  onUpdateItem?: (item: PlannerItem) => void;
  onDeleteItem?: (itemId: string) => void;
};

export default function DailyPlanner({
  initialItems = [],
  onAddItem,
  onUpdateItem,
  onDeleteItem,
}: DailyPlannerProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [plannerItems, setPlannerItems] = useState<PlannerItem[]>(initialItems);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<PlannerItem | null>(null);

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  // Navigate to previous day
  const goToPreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  // Navigate to next day
  const goToNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  // Go to today
  const goToToday = () => {
    setSelectedDate(new Date());
  };

  // Add a new planner item
  const handleAddItem = (item: PlannerItem) => {
    const newItems = [...plannerItems, item];
    setPlannerItems(newItems);
    
    if (onAddItem) {
      onAddItem(item);
    }
    
    setShowForm(false);
  };

  // Update a planner item
  const handleUpdateItem = (updatedItem: PlannerItem) => {
    const newItems = plannerItems.map((item) =>
      item.id === updatedItem.id ? updatedItem : item
    );
    setPlannerItems(newItems);
    
    if (onUpdateItem) {
      onUpdateItem(updatedItem);
    }
    
    setEditingItem(null);
  };

  // Delete a planner item
  const handleDeleteItem = (itemId: string) => {
    const newItems = plannerItems.filter((item) => item.id !== itemId);
    setPlannerItems(newItems);
    
    if (onDeleteItem) {
      onDeleteItem(itemId);
    }
  };

  // Toggle item completion
  const handleToggleComplete = (itemId: string) => {
    const itemToUpdate = plannerItems.find((item) => item.id === itemId);
    
    if (itemToUpdate) {
      const updatedItem = {
        ...itemToUpdate,
        completed: !itemToUpdate.completed,
      };
      
      handleUpdateItem(updatedItem);
    }
  };

  // Edit an item
  const handleEditItem = (item: PlannerItem) => {
    setEditingItem(item);
    setShowForm(true);
  };

  // Get items for the selected date
  const getItemsForDate = () => {
    return plannerItems.filter(
      (item) =>
        item.date.getDate() === selectedDate.getDate() &&
        item.date.getMonth() === selectedDate.getMonth() &&
        item.date.getFullYear() === selectedDate.getFullYear()
    );
  };

  // Sort items by start time
  const sortedItems = getItemsForDate().sort((a, b) => {
    return a.startTime.localeCompare(b.startTime);
  });

  // Generate time slots for the day (hourly)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      const formattedHour = hour.toString().padStart(2, "0");
      slots.push(`${formattedHour}:00`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  return (
    <div className="bg-[var(--app-card-bg)] backdrop-blur-md rounded-xl shadow-lg border border-[var(--app-card-border)] overflow-hidden transition-all animate-fade-in">
      <div className="px-5 py-3 border-b border-[var(--app-card-border)] flex justify-between items-center">
        <h3 className="text-lg font-medium text-[var(--app-foreground)]">
          Daily Planner
        </h3>
        <Button
          variant="default"
          size="sm"
          onClick={() => {
            setEditingItem(null);
            setShowForm(!showForm);
          }}
        >
          Add Activity
        </Button>
      </div>
      
      {/* Date navigation */}
      <div className="px-4 py-2 border-b border-[var(--app-card-border)] flex justify-between items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={goToPreviousDay}
          className="p-1"
        >
          &lt;
        </Button>
        <div className="flex flex-col items-center">
          <h4 className="font-medium text-[var(--app-foreground)]">
            {formatDate(selectedDate)}
          </h4>
          <button
            className="text-xs text-[var(--app-accent)] hover:underline"
            onClick={goToToday}
          >
            Today
          </button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={goToNextDay}
          className="p-1"
        >
          &gt;
        </Button>
      </div>
      
      {/* Planner form */}
      {showForm && (
        <div className="p-4 border-b border-[var(--app-card-border)]">
          <PlannerForm
            onSubmit={editingItem ? handleUpdateItem : handleAddItem}
            onCancel={() => {
              setShowForm(false);
              setEditingItem(null);
            }}
            initialDate={selectedDate}
            item={editingItem || undefined}
            isEditing={!!editingItem}
          />
        </div>
      )}
      
      {/* Daily schedule */}
      <div className="p-4">
        <div className="space-y-2">
          {timeSlots.map((timeSlot) => {
            const itemsInSlot = sortedItems.filter(
              (item) => item.startTime <= timeSlot && item.endTime > timeSlot
            );
            
            return (
              <div
                key={timeSlot}
                className="flex items-start"
              >
                <div className="w-16 text-xs text-[var(--app-foreground-muted)] pt-2">
                  {timeSlot}
                </div>
                <div className="flex-1 min-h-[40px] border-l border-[var(--app-card-border)] pl-2">
                  {itemsInSlot.length > 0 ? (
                    itemsInSlot.map((item) => (
                      <TimeBlock
                        key={item.id}
                        item={item}
                        onToggleComplete={handleToggleComplete}
                        onEdit={handleEditItem}
                        onDelete={handleDeleteItem}
                      />
                    ))
                  ) : (
                    <div className="h-10 border-b border-dashed border-[var(--app-card-border)]"></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Daily summary */}
      <div className="px-4 py-2 border-t border-[var(--app-card-border)] text-xs text-[var(--app-foreground-muted)]">
        <div className="flex justify-between">
          <span>
            {sortedItems.length} activities planned
          </span>
          <span>
            {sortedItems.filter((item) => item.completed).length} completed
          </span>
        </div>
      </div>
    </div>
  );
}
