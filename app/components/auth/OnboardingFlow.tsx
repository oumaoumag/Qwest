"use client";

import { useState } from "react";
import { Button, Icon } from "../DemoComponents";

type OnboardingStep = {
  title: string;
  description: string;
  icon?: "heart" | "star" | "check" | "plus" | "arrow-right";
};

type OnboardingFlowProps = {
  onComplete: () => void;
  steps?: OnboardingStep[];
};

export default function OnboardingFlow({
  onComplete,
  steps = defaultSteps,
}: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState({
    name: "",
    preferences: {
      dailyGoals: true,
      calendarSync: false,
      aiAssistant: true,
    },
  });

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setUserData({
        ...userData,
        preferences: {
          ...userData.preferences,
          [name]: checked,
        },
      });
    } else {
      setUserData({
        ...userData,
        [name]: value,
      });
    }
  };

  return (
    <div className="bg-[var(--app-card-bg)] backdrop-blur-md rounded-xl shadow-lg border border-[var(--app-card-border)] overflow-hidden transition-all p-6 animate-fade-in">
      {/* Progress indicator */}
      <div className="flex justify-between mb-6">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`h-1 rounded-full flex-1 mx-1 ${
              index <= currentStep
                ? "bg-[var(--app-accent)]"
                : "bg-[var(--app-card-border)]"
            }`}
          />
        ))}
      </div>

      {/* Step content */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-[var(--app-foreground)]">
          {steps[currentStep].title}
        </h2>
        <p className="text-[var(--app-foreground-muted)]">
          {steps[currentStep].description}
        </p>
      </div>

      {/* Step-specific content */}
      <div className="mb-6">
        {currentStep === 0 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-[var(--app-foreground)]"
              >
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={userData.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
                className="w-full px-3 py-2 bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-lg text-[var(--app-foreground)] placeholder-[var(--app-foreground-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--app-accent)]"
              />
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="dailyGoals"
                name="dailyGoals"
                checked={userData.preferences.dailyGoals}
                onChange={handleInputChange}
                className="h-4 w-4 text-[var(--app-accent)] border-[var(--app-card-border)] rounded focus:ring-[var(--app-accent)]"
              />
              <label
                htmlFor="dailyGoals"
                className="text-[var(--app-foreground)]"
              >
                Set daily goals and track progress
              </label>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="calendarSync"
                name="calendarSync"
                checked={userData.preferences.calendarSync}
                onChange={handleInputChange}
                className="h-4 w-4 text-[var(--app-accent)] border-[var(--app-card-border)] rounded focus:ring-[var(--app-accent)]"
              />
              <label
                htmlFor="calendarSync"
                className="text-[var(--app-foreground)]"
              >
                Sync with calendar (coming soon)
              </label>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="aiAssistant"
                name="aiAssistant"
                checked={userData.preferences.aiAssistant}
                onChange={handleInputChange}
                className="h-4 w-4 text-[var(--app-accent)] border-[var(--app-card-border)] rounded focus:ring-[var(--app-accent)]"
              />
              <label
                htmlFor="aiAssistant"
                className="text-[var(--app-foreground)]"
              >
                Enable AI assistant suggestions
              </label>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="p-4 bg-[var(--app-background)] rounded-lg border border-[var(--app-card-border)]">
              <h3 className="font-medium text-[var(--app-foreground)] mb-2">
                Your Productivity Hub is Ready!
              </h3>
              <p className="text-[var(--app-foreground-muted)] text-sm">
                {userData.name ? `Welcome, ${userData.name}! ` : ""}
                Your productivity journey starts now. We&apos;ve set up your account with the preferences you selected.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between">
        <Button
          variant="ghost"
          onClick={handleBack}
          disabled={currentStep === 0}
          className={currentStep === 0 ? "invisible" : ""}
        >
          Back
        </Button>
        <Button
          variant="primary"
          onClick={handleNext}
          icon={
            currentStep === steps.length - 1 ? (
              <Icon name="check" size="sm" />
            ) : (
              <Icon name="arrow-right" size="sm" />
            )
          }
        >
          {currentStep === steps.length - 1 ? "Get Started" : "Next"}
        </Button>
      </div>
    </div>
  );
}

const defaultSteps: OnboardingStep[] = [
  {
    title: "Welcome to Productivity Hub",
    description:
      "Let's set up your account to help you stay organized and productive.",
    icon: "star",
  },
  {
    title: "Customize Your Experience",
    description:
      "Choose the features that matter most to you for a personalized experience.",
    icon: "heart",
  },
  {
    title: "You're All Set!",
    description:
      "Your productivity hub is ready to use. Start planning your day now.",
    icon: "check",
  },
];
