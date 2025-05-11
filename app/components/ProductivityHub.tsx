"use client";

import { useState, useEffect } from "react";
import Layout from "./common/Layout";
import OnboardingFlow from "./auth/OnboardingFlow";
import UserProfile from "./auth/UserProfile";
import AccountSettings from "./auth/AccountSettings";
import Calendar from "./calendar/Calendar";
import TaskList from "./tasks/TaskList";
import DailyPlanner from "./planner/DailyPlanner";
// import AIAssistant from "./assistant/AIAssistant";
import FeedbackForm from "./feedback/FeedbackForm";
import { Button, Icon } from "./DemoComponents";

export default function ProductivityHub() {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "calendar" | "tasks" | "planner" | "profile" | "settings" | "feedback"
  >("dashboard");
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [userName, setUserName] = useState("User");

  // Check if user has completed onboarding and load saved data
  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem("hasCompletedOnboarding");
    if (hasCompletedOnboarding === "true") {
      setShowOnboarding(false);
    }

    const savedUserName = localStorage.getItem("userName");
    if (savedUserName) {
      setUserName(savedUserName);
    }

    // Load any saved settings (not used directly in this component but good practice)
    const savedSettings = localStorage.getItem("accountSettings");
    if (savedSettings) {
      try {
        JSON.parse(savedSettings);
        // Settings are loaded by the AccountSettings component
      } catch (error) {
        console.error("Error parsing account settings:", error);
      }
    }
  }, []);

  // Handle onboarding completion
  const handleOnboardingComplete = () => {
    localStorage.setItem("hasCompletedOnboarding", "true");

    // Save user name if available from onboarding
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

  // Handle user profile update
  const handleProfileUpdate = (userData: { name?: string;[key: string]: unknown }) => {
    if (userData.name) {
      setUserName(userData.name);
      localStorage.setItem("userName", userData.name);
    }

    localStorage.setItem("userData", JSON.stringify(userData));
  };

  // Handle account settings update
  const handleSettingsUpdate = (settings: unknown) => {
    localStorage.setItem("accountSettings", JSON.stringify(settings));
  };

  return (
    <Layout title="Productivity Hub">
      {showOnboarding ? (
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      ) : (
        <div className="space-y-6">
          {/* Navigation Tabs */}
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
                className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${activeTab === "settings"
                  ? "text-[var(--app-accent)] border-b-2 border-[var(--app-accent)]"
                  : "text-[var(--app-foreground-muted)] hover:text-[var(--app-foreground)]"
                  }`}
                onClick={() => setActiveTab("settings")}
              >
                Settings
              </button>
          </div>

          {/* Dashboard */}
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
                  {/* <AIAssistant userName={userName} /> */}
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

          {/* Calendar */}
          {activeTab === "calendar" && <Calendar />}

          {/* Tasks */}
          {activeTab === "tasks" && <TaskList />}


          {/* Daily Planner */}
          {activeTab === "planner" && <DailyPlanner />}

          {/* Profile */}
          {activeTab === "profile" && (
            <UserProfile onSave={handleProfileUpdate} />
          )}

            {/* Settings */}
            {activeTab === "settings" && (
              <AccountSettings onSave={handleSettingsUpdate} />
            )}

          {/* Feedback */}
          {activeTab === "feedback" && (
            <FeedbackForm onClose={() => setActiveTab("dashboard")} />
          )}
        </div>
      )}
    </Layout>
  );
}
