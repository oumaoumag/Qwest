"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Check } from "../ui/icons";

type AccountSettingsProps = {
  initialSettings?: AccountSettings;
  onSave?: (settings: AccountSettings) => void;
};

type AccountSettings = {
  notifications: {
    email: boolean;
    push: boolean;
    dailyDigest: boolean;
  };
  appearance: {
    darkMode: boolean;
    compactView: boolean;
  };
  privacy: {
    shareActivity: boolean;
    allowDataCollection: boolean;
  };
};

export default function AccountSettings({
  initialSettings = defaultSettings,
  onSave,
}: AccountSettingsProps) {
  // Try to load saved settings from localStorage
  const loadSavedSettings = (): AccountSettings => {
    try {
      const savedSettings = localStorage.getItem("accountSettings");
      if (savedSettings) {
        return JSON.parse(savedSettings) as AccountSettings;
      }
    } catch (error) {
      console.error("Error loading saved settings:", error);
    }
    return initialSettings;
  };

  const [settings, setSettings] = useState<AccountSettings>(loadSavedSettings());
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"notifications" | "appearance" | "privacy">("notifications");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    category: keyof AccountSettings
  ) => {
    const { name, checked } = e.target;

    setSettings({
      ...settings,
      [category]: {
        ...settings[category],
        [name]: checked,
      },
    });
  };

  const handleSave = async () => {
    setIsSaving(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (onSave) {
      onSave(settings);
    }

    setIsSaving(false);
  };

  return (
    <div className="bg-[var(--app-card-bg)] backdrop-blur-md rounded-xl shadow-lg border border-[var(--app-card-border)] overflow-hidden transition-all animate-fade-in">
      <div className="px-5 py-3 border-b border-[var(--app-card-border)]">
        <h3 className="text-lg font-medium text-[var(--app-foreground)]">
          Account Settings
        </h3>
      </div>

      <div className="flex border-b border-[var(--app-card-border)]">
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "notifications"
              ? "text-[var(--app-accent)] border-b-2 border-[var(--app-accent)]"
              : "text-[var(--app-foreground-muted)] hover:text-[var(--app-foreground)]"
          }`}
          onClick={() => setActiveTab("notifications")}
        >
          Notifications
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "appearance"
              ? "text-[var(--app-accent)] border-b-2 border-[var(--app-accent)]"
              : "text-[var(--app-foreground-muted)] hover:text-[var(--app-foreground)]"
          }`}
          onClick={() => setActiveTab("appearance")}
        >
          Appearance
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "privacy"
              ? "text-[var(--app-accent)] border-b-2 border-[var(--app-accent)]"
              : "text-[var(--app-foreground-muted)] hover:text-[var(--app-foreground)]"
          }`}
          onClick={() => setActiveTab("privacy")}
        >
          Privacy
        </button>
      </div>

      <div className="p-5 space-y-6">
        {activeTab === "notifications" && (
          <div className="space-y-4">
            <h4 className="font-medium text-[var(--app-foreground)]">
              Notification Preferences
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="email"
                    name="email"
                    checked={settings.notifications.email}
                    onChange={(e) => handleInputChange(e, "notifications")}
                    className="h-4 w-4 text-[var(--app-accent)] border-[var(--app-card-border)] rounded focus:ring-[var(--app-accent)]"
                  />
                  <label
                    htmlFor="email"
                    className="text-[var(--app-foreground)]"
                  >
                    Email notifications
                  </label>
                </div>
                <span className="text-xs text-[var(--app-foreground-muted)]">
                  For important updates
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="push"
                    name="push"
                    checked={settings.notifications.push}
                    onChange={(e) => handleInputChange(e, "notifications")}
                    className="h-4 w-4 text-[var(--app-accent)] border-[var(--app-card-border)] rounded focus:ring-[var(--app-accent)]"
                  />
                  <label
                    htmlFor="push"
                    className="text-[var(--app-foreground)]"
                  >
                    Push notifications
                  </label>
                </div>
                <span className="text-xs text-[var(--app-foreground-muted)]">
                  For reminders and alerts
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="dailyDigest"
                    name="dailyDigest"
                    checked={settings.notifications.dailyDigest}
                    onChange={(e) => handleInputChange(e, "notifications")}
                    className="h-4 w-4 text-[var(--app-accent)] border-[var(--app-card-border)] rounded focus:ring-[var(--app-accent)]"
                  />
                  <label
                    htmlFor="dailyDigest"
                    className="text-[var(--app-foreground)]"
                  >
                    Daily digest
                  </label>
                </div>
                <span className="text-xs text-[var(--app-foreground-muted)]">
                  Summary of your day
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "appearance" && (
          <div className="space-y-4">
            <h4 className="font-medium text-[var(--app-foreground)]">
              Appearance Settings
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="darkMode"
                    name="darkMode"
                    checked={settings.appearance.darkMode}
                    onChange={(e) => handleInputChange(e, "appearance")}
                    className="h-4 w-4 text-[var(--app-accent)] border-[var(--app-card-border)] rounded focus:ring-[var(--app-accent)]"
                  />
                  <label
                    htmlFor="darkMode"
                    className="text-[var(--app-foreground)]"
                  >
                    Dark mode
                  </label>
                </div>
                <span className="text-xs text-[var(--app-foreground-muted)]">
                  Easier on the eyes
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="compactView"
                    name="compactView"
                    checked={settings.appearance.compactView}
                    onChange={(e) => handleInputChange(e, "appearance")}
                    className="h-4 w-4 text-[var(--app-accent)] border-[var(--app-card-border)] rounded focus:ring-[var(--app-accent)]"
                  />
                  <label
                    htmlFor="compactView"
                    className="text-[var(--app-foreground)]"
                  >
                    Compact view
                  </label>
                </div>
                <span className="text-xs text-[var(--app-foreground-muted)]">
                  Show more content
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "privacy" && (
          <div className="space-y-4">
            <h4 className="font-medium text-[var(--app-foreground)]">
              Privacy Settings
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="shareActivity"
                    name="shareActivity"
                    checked={settings.privacy.shareActivity}
                    onChange={(e) => handleInputChange(e, "privacy")}
                    className="h-4 w-4 text-[var(--app-accent)] border-[var(--app-card-border)] rounded focus:ring-[var(--app-accent)]"
                  />
                  <label
                    htmlFor="shareActivity"
                    className="text-[var(--app-foreground)]"
                  >
                    Share activity
                  </label>
                </div>
                <span className="text-xs text-[var(--app-foreground-muted)]">
                  With friends only
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="allowDataCollection"
                    name="allowDataCollection"
                    checked={settings.privacy.allowDataCollection}
                    onChange={(e) => handleInputChange(e, "privacy")}
                    className="h-4 w-4 text-[var(--app-accent)] border-[var(--app-card-border)] rounded focus:ring-[var(--app-accent)]"
                  />
                  <label
                    htmlFor="allowDataCollection"
                    className="text-[var(--app-foreground)]"
                  >
                    Allow data collection
                  </label>
                </div>
                <span className="text-xs text-[var(--app-foreground-muted)]">
                  For app improvements
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <Button
            variant="default"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              "Saving..."
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

const defaultSettings: AccountSettings = {
  notifications: {
    email: true,
    push: true,
    dailyDigest: false,
  },
  appearance: {
    darkMode: false,
    compactView: false,
  },
  privacy: {
    shareActivity: false,
    allowDataCollection: true,
  },
};
