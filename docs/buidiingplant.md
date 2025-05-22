To transform your productivity app, **Qwest**, into a more comprehensive life planner with gamification features and an AI agent, I’ll guide you through the initial steps. This includes expanding the app to cover various life aspects, adding gamification elements like rewards and encouragement messages, and integrating a basic AI agent for personalized suggestions. Below, I’ll outline the approach and provide the necessary code modifications to get you started.

---

### Goals
1. **Life Planner Expansion**: Broaden the app to include personal goals, health, social activities, and more.
2. **Gamification**: Introduce points, encouragement messages, and tips when users complete tasks or goals, with rewards redeemable for in-app purchases.
3. **AI Agent**: Add a simple AI agent that offers contextual tips based on user actions.

---

### Approach

#### 1. Life Planner Features
- **Modify Task Categories**: Update `TaskList.tsx` to include diverse categories like personal, health, social, learning, etc.
- **Long-Term Goals**: Enhance `UserProfile.tsx` to support long-term goal tracking.
- **Journaling**: Already present in Qwest; ensure it integrates with the new features.

#### 2. Gamification
- **Rewards System**: Create a `RewardsContext` to manage points earned from completing tasks.
- **Encouragement Messages**: Use a `ToastContext` to display motivating messages and tips when tasks are completed.
- **In-App Purchases**: Plan a basic structure (to be expanded later) for spending points on custom themes or features.

#### 3. AI Agent
- **Basic Implementation**: Add an `AIAgent.tsx` component to display random productivity tips, with plans for deeper integration later.

---

### Solution

I’ll start by modifying the existing app structure with these enhancements. The following code updates will:
- Add a rewards system and toast notifications.
- Update the task list to award points and show messages.
- Integrate a simple AI agent into the dashboard.

#### Step 1: Set Up Rewards and Toast Contexts
We need to manage points and display messages across the app.

```typescript
import { createContext, useContext, useState } from "react";

type RewardsContextType = {
  points: number;
  addPoints: (points: number) => void;
};

const RewardsContext = createContext<RewardsContextType | undefined>(undefined);

export function RewardsProvider({ children }: { children: React.ReactNode }) {
  const [points, setPoints] = useState(0);

  const addPoints = (pointsToAdd: number) => {
    setPoints(points + pointsToAdd);
  };

  return (
    <RewardsContext.Provider value={{ points, addPoints }}>
      {children}
    </RewardsContext.Provider>
  );
}

export function useRewards() {
  const context = useContext(RewardsContext);
  if (context === undefined) {
    throw new Error("useRewards must be used within a RewardsProvider");
  }
  return context;
}
```

```typescript
import { createContext, useContext, useState } from "react";

type ToastContextType = {
  showToast: (message: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000); // Hide after 3 seconds
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toastMessage && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-[var(--app-accent)] text-white px-4 py-2 rounded-lg shadow-lg">
          {toastMessage}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
```

#### Step 2: Update TaskList for Gamification
Modify `TaskList.tsx` to award points and show encouragement messages when tasks are completed, and expand task categories.

```typescript
"use client";

import { useState } from "react";
import { Button, Icon } from "../DemoComponents";
import TaskItem from "./TaskItem";
import TaskForm from "./TaskForm";
import { useRewards } from "./RewardsContext";
import { useToast } from "./ToastContext";

export type Task = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: Date;
  priority: "low" | "medium" | "high";
  category: "work" | "personal" | "health" | "learning" | "social" | "other";
  tags?: string[];
};

const encouragementMessages = [
  "Great job! Keep up the momentum.",
  "You're on a roll! What's next?",
  "Nice work! You're making progress.",
  "Awesome! You're crushing your goals.",
  "Well done! Every step counts.",
];

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
  const { addPoints } = useRewards();
  const { showToast } = useToast();

  const handleAddTask = (task: Task) => {
    const newTasks = [...tasks, task];
    setTasks(newTasks);
    if (onAddTask) onAddTask(task);
    setShowForm(false);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    const newTasks = tasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    );
    setTasks(newTasks);
    if (onUpdateTask) onUpdateTask(updatedTask);
  };

  const handleDeleteTask = (taskId: string) => {
    const newTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(newTasks);
    if (onDeleteTask) onDeleteTask(taskId);
  };

  const handleToggleComplete = (taskId: string) => {
    const taskToUpdate = tasks.find((task) => task.id === taskId);
    if (taskToUpdate) {
      const updatedTask = { ...taskToUpdate, completed: !taskToUpdate.completed };
      const newTasks = tasks.map((task) =>
        task.id === taskId ? updatedTask : task
      );
      setTasks(newTasks);
      if (onUpdateTask) onUpdateTask(updatedTask);

      if (!taskToUpdate.completed) { // Task was just completed
        addPoints(10); // Award 10 points
        const randomMessage = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];
        showToast(randomMessage);
      }
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

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
          variant="primary"
          size="sm"
          onClick={() => setShowForm(!showForm)}
          icon={<Icon name="plus" size="sm" />}
        >
          Add Task
        </Button>
      </div>

      {showForm && (
        <div className="p-4 border-b border-[var(--app-card-border)]">
          <TaskForm onSubmit={handleAddTask} onCancel={() => setShowForm(false)} />
        </div>
      )}

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
```

#### Step 3: Add AI Agent
Create a simple AI agent component to display productivity tips.

```typescript
import { useEffect, useState } from "react";

const aiSuggestions = [
  "Remember to take regular breaks to stay productive.",
  "Try to focus on one task at a time for better results.",
  "Set realistic goals to avoid burnout.",
  "Don't forget to hydrate and stretch during work sessions.",
  "Review your completed tasks to see your progress.",
];

export default function AIAgent() {
  const [suggestion, setSuggestion] = useState("");

  useEffect(() => {
    const randomSuggestion = aiSuggestions[Math.floor(Math.random() * aiSuggestions.length)];
    setSuggestion(randomSuggestion);
  }, []);

  return (
    <div className="bg-[var(--app-card-bg)] backdrop-blur-md rounded-xl shadow-lg border border-[var(--app-card-border)] p-4">
      <h3 className="text-lg font-medium text-[var(--app-foreground)] mb-2">
        AI Assistant
      </h3>
      <p className="text-[var(--app-foreground-muted)]">{suggestion}</p>
    </div>
  );
}
```

#### Step 4: Integrate Providers and AI Agent
Update `providers.tsx` to include the new contexts and add the AI agent to `ProductivityHub.tsx`.

```typescript
"use client";

import { type ReactNode } from "react";
import { base } from "wagmi/chains";
import { MiniKitProvider } from "@coinbase/onchainkit/minikit";
import { RewardsProvider } from "./RewardsContext";
import { ToastProvider } from "./ToastContext";

export function Providers(props: { children: ReactNode }) {
  return (
    <MiniKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
      chain={base}
      config={{
        appearance: {
          mode: "auto",
          theme: "mini-app-theme",
          name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME,
          logo: process.env.NEXT_PUBLIC_ICON_URL,
        },
      }}
    >
      <RewardsProvider>
        <ToastProvider>
          {props.children}
        </ToastProvider>
      </RewardsProvider>
    </MiniKitProvider>
  );
}
```

```typescript
"use client";

import { useState, useEffect } from "react";
import Layout from "./common/Layout";
import OnboardingFlow from "./auth/OnboardingFlow";
import UserProfile from "./auth/UserProfile";
import AccountSettings from "./auth/AccountSettings";
import Calendar from "./calendar/Calendar";
import TaskList from "./tasks/TaskList";
import DailyPlanner from "./planner/DailyPlanner";
import AIAgent from "./AIAgent";
import FeedbackForm from "./feedback/FeedbackForm";
import { Button, Icon } from "./DemoComponents";

export default function ProductivityHub() {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "calendar" | "tasks" | "planner" | "profile" | "settings" | "feedback"
  >("dashboard");
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem("hasCompletedOnboarding");
    if (hasCompletedOnboarding === "true") setShowOnboarding(false);

    const savedUserName = localStorage.getItem("userName");
    if (savedUserName) setUserName(savedUserName);

    const savedSettings = localStorage.getItem("accountSettings");
    if (savedSettings) {
      try {
        JSON.parse(savedSettings);
      } catch (error) {
        console.error("Error parsing account settings:", error);
      }
    }
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem("hasCompletedOnboarding", "true");
    const savedUserData = localStorage.getItem("userData");
    if (savedUserData) {
      try {
        const userData = JSON.parse(savedUserData);
        if (userData.name) {
          setUserName(userData.name);
          localStorage.setItem("userName", userData.name);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
    setShowOnboarding(false);
  };

  const handleProfileUpdate = (userData: { name?: string; [key: string]: unknown }) => {
    if (userData.name) {
      setUserName(userData.name);
      localStorage.setItem("userName", userData.name);
    }
    localStorage.setItem("userData", JSON.stringify(userData));
  };

  const handleSettingsUpdate = (settings: unknown) => {
    localStorage.setItem("accountSettings", JSON.stringify(settings));
  };

  return (
    <Layout title="Productivity Hub">
      {showOnboarding ? (
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      ) : (
        <div className="space-y-6">
          <div className="flex overflow-x-auto pb-2 -mx-4 px-4">
            <button
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                activeTab === "dashboard"
                  ? "text-[var(--app-accent)] border-b-2 border-[var(--app-accent)]"
                  : "text-[var(--app-foreground-muted)] hover:text-[var(--app-foreground)]"
              }`}
              onClick={() => setActiveTab("dashboard")}
            >
              Dashboard
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                activeTab === "calendar"
                  ? "text-[var(--app-accent)] border-b-2 border-[var(--app-accent)]"
                  : "text-[var(--app-foreground-muted)] hover:text-[var(--app-foreground)]"
              }`}
              onClick={() => setActiveTab("calendar")}
            >
              Calendar
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                activeTab === "tasks"
                  ? "text-[var(--app-accent)] border-b-2 border-[var(--app-accent)]"
                  : "text-[var(--app-foreground-muted)] hover:text-[var(--app-foreground)]"
              }`}
              onClick={() => setActiveTab("tasks")}
            >
              Tasks
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                activeTab === "planner"
                  ? "text-[var(--app-accent)] border-b-2 border-[var(--app-accent)]"
                  : "text-[var(--app-foreground-muted)] hover:text-[var(--app-foreground)]"
              }`}
              onClick={() => setActiveTab("planner")}
            >
              Daily Planner
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                activeTab === "profile"
                  ? "text-[var(--app-accent)] border-b-2 border-[var(--app-accent)]"
                  : "text-[var(--app-foreground-muted)] hover:text-[var(--app-foreground)]"
              }`}
              onClick={() => setActiveTab("profile")}
            >
              Profile
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                activeTab === "settings"
                  ? "text-[var(--app-accent)] border-b-2 border-[var(--app-accent)]"
                  : "text-[var(--app-foreground-muted)] hover:text-[var(--app-foreground)]"
              }`}
              onClick={() => setActiveTab("settings")}
            >
              Settings
            </button>
          </div>

          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div className="bg-[var(--app-card-bg)] backdrop-blur-md rounded-xl shadow-lg border border-[var(--app-card-border)] overflow-hidden p-5">
                <h2 className="text-xl font-semibold text-[var(--app-foreground)] mb-2">
                  Welcome back, {userName}! 👋
                </h2>
                <p className="text-[var(--app-foreground-muted)]">
                  Here&apos;s your productivity hub. Track tasks, manage your schedule, and stay focused.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <AIAgent />
                </div>
                <div>
                  <TaskList />
                </div>
              </div>

              <DailyPlanner />

              <div className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("feedback")}
                  icon={<Icon name="star" size="sm" />}
                >
                  Share Feedback
                </Button>
              </div>
            </div>
          )}

          {activeTab === "calendar" && <Calendar />}
          {activeTab === "tasks" && <TaskList />}
          {activeTab === "planner" && <DailyPlanner />}
          {activeTab === "profile" && <UserProfile onSave={handleProfileUpdate} />}
          {activeTab === "settings" && <AccountSettings onSave={handleSettingsUpdate} />}
          {activeTab === "feedback" && <FeedbackForm onClose={() => setActiveTab("dashboard")} />}
        </div>
      )}
    </Layout>
  );
}
```

---

### Next Steps
- **Expand Life Planner Features**: Update `TaskForm.tsx` and `UserProfile.tsx` to include more categories and goal tracking (e.g., add a "goals" section).
- **Enhance Gamification**: Add badges and virtual currency to `RewardsContext.tsx`, and create a `Store.tsx` for in-app purchases.
- **Advance AI Agent**: Integrate OpenAI API (already in your tech stack) to make suggestions based on user habits and task history.
