"use client";

import { useState } from "react";
import { Button, Icon } from "../DemoComponents";

type UserProfileProps = {
  initialUserData?: UserData;
  onSave?: (userData: UserData) => void;
};

type UserData = {
  name: string;
  bio?: string;
  preferences: {
    dailyGoals: boolean;
    calendarSync: boolean;
    aiAssistant: boolean;
    darkMode?: boolean;
  };
};

export default function UserProfile({
  initialUserData = defaultUserData,
  onSave,
}: UserProfileProps) {
  const [userData, setUserData] = useState<UserData>(initialUserData);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

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

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    if (onSave) {
      onSave(userData);
    }
    
    setIsEditing(false);
    setIsSaving(false);
  };

  return (
    <div className="bg-[var(--app-card-bg)] backdrop-blur-md rounded-xl shadow-lg border border-[var(--app-card-border)] overflow-hidden transition-all animate-fade-in">
      <div className="px-5 py-3 border-b border-[var(--app-card-border)] flex justify-between items-center">
        <h3 className="text-lg font-medium text-[var(--app-foreground)]">
          Your Profile
        </h3>
        {!isEditing ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            icon={<Icon name="plus" size="sm" />}
          >
            Edit
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </Button>
        )}
      </div>
      
      <div className="p-5 space-y-6">
        {/* Profile Information */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-[var(--app-foreground)]"
            >
              Name
            </label>
            {isEditing ? (
              <input
                type="text"
                id="name"
                name="name"
                value={userData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-lg text-[var(--app-foreground)] placeholder-[var(--app-foreground-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--app-accent)]"
              />
            ) : (
              <p className="text-[var(--app-foreground)]">{userData.name}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-[var(--app-foreground)]"
            >
              Bio
            </label>
            {isEditing ? (
              <textarea
                id="bio"
                name="bio"
                value={userData.bio || ""}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-lg text-[var(--app-foreground)] placeholder-[var(--app-foreground-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--app-accent)]"
              />
            ) : (
              <p className="text-[var(--app-foreground-muted)]">
                {userData.bio || "No bio provided"}
              </p>
            )}
          </div>
        </div>
        
        {/* Preferences */}
        <div className="space-y-3">
          <h4 className="font-medium text-[var(--app-foreground)]">
            Preferences
          </h4>
          
          {isEditing ? (
            <div className="space-y-3">
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
                  Sync with calendar
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
          ) : (
            <ul className="space-y-1">
              <li className="flex items-start">
                <Icon
                  name={userData.preferences.dailyGoals ? "check" : "plus"}
                  className={`mt-1 mr-2 ${
                    userData.preferences.dailyGoals
                      ? "text-[var(--app-accent)]"
                      : "text-[var(--app-foreground-muted)]"
                  }`}
                />
                <span className="text-[var(--app-foreground-muted)]">
                  Daily goals and progress tracking
                </span>
              </li>
              <li className="flex items-start">
                <Icon
                  name={userData.preferences.calendarSync ? "check" : "plus"}
                  className={`mt-1 mr-2 ${
                    userData.preferences.calendarSync
                      ? "text-[var(--app-accent)]"
                      : "text-[var(--app-foreground-muted)]"
                  }`}
                />
                <span className="text-[var(--app-foreground-muted)]">
                  Calendar synchronization
                </span>
              </li>
              <li className="flex items-start">
                <Icon
                  name={userData.preferences.aiAssistant ? "check" : "plus"}
                  className={`mt-1 mr-2 ${
                    userData.preferences.aiAssistant
                      ? "text-[var(--app-accent)]"
                      : "text-[var(--app-foreground-muted)]"
                  }`}
                />
                <span className="text-[var(--app-foreground-muted)]">
                  AI assistant suggestions
                </span>
              </li>
            </ul>
          )}
        </div>
        
        {/* Save Button */}
        {isEditing && (
          <div className="flex justify-end">
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={isSaving}
              icon={isSaving ? undefined : <Icon name="check" size="sm" />}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

const defaultUserData: UserData = {
  name: "User",
  bio: "",
  preferences: {
    dailyGoals: true,
    calendarSync: false,
    aiAssistant: true,
    darkMode: false,
  },
};
