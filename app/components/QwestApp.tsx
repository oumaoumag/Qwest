"use client";

import React, { useState } from 'react';
import { MapSection } from './MapSection';
import { DashboardSection } from './DashboardSection';
import { GoalsSection } from './GoalsSection';
import { TasksSection } from './TasksSection';
import { AICoachSection } from './AICoachSection';
import { CalendarSection } from './CalendarSection';
import { ProfileSection } from './ProfileSection';
import { Navigation } from './Navigation';

// Import domain types
import { Goal, Task, UserData, Achievement } from '../domain/types';
import { calculateXpReward } from '../domain/constants';

const QwestApp = () => {
  const [activeSection, setActiveSection] = useState('map');
  const [userData, setUserData] = useState<UserData>({
    level: 12,
    xp: 2450,
    streak: 7,
    totalGoals: 15,
    completedGoals: 8,
    achievements: 23,
    tokens: 145
  });

  const [goals, setGoals] = useState<Goal[]>([
    {
      id: 1,
      title: "Become a Fitness Legend",
      category: "health",
      type: "yearly",
      progress: 25,
      streak: 45,
      target: 365,
      completed: false,
      dueDate: "2025-12-31",
      xpReward: calculateXpReward('health', 'Advanced', 'yearly'),
      questTier: 'epic',
      isUltimateGoal: true
    },
    {
      id: 2,
      title: "Complete Marathon Training",
      category: "health",
      type: "quarterly",
      progress: 60,
      streak: 12,
      target: 90,
      completed: false,
      dueDate: "2025-06-01",
      xpReward: calculateXpReward('health', 'Advanced', 'quarterly'),
      questTier: 'longer',
      parentGoalId: 1
    },
    {
      id: 3,
      title: "Morning Workout Routine",
      category: "health",
      type: "daily",
      progress: 85,
      streak: 21,
      target: 30,
      completed: false,
      dueDate: new Date().toISOString().split('T')[0],
      xpReward: calculateXpReward('health', 'Beginner', 'daily'),
      questTier: 'shorter',
      parentGoalId: 2
    },
    {
      id: 4,
      title: "Master Spanish Fluency",
      category: "education",
      type: "yearly",
      progress: 40,
      streak: 67,
      target: 365,
      completed: false,
      dueDate: "2025-12-31",
      xpReward: calculateXpReward('education', 'Advanced', 'yearly'),
      questTier: 'longer'
    },
    {
      id: 5,
      title: "Complete Spanish Course",
      category: "education",
      type: "monthly",
      progress: 75,
      streak: 15,
      target: 30,
      completed: true,
      dueDate: "2025-03-31",
      xpReward: calculateXpReward('education', 'Intermediate', 'monthly'),
      questTier: 'long',
      parentGoalId: 4
    },
    {
      id: 6,
      title: "Build Emergency Fund",
      category: "finance",
      type: "quarterly",
      progress: 65,
      streak: 8,
      target: 10000,
      completed: false,
      dueDate: "2025-06-30",
      xpReward: calculateXpReward('finance', 'Advanced', 'quarterly'),
      questTier: 'long'
    },
    {
      id: 7,
      title: "Daily Expense Tracking",
      category: "finance",
      type: "daily",
      progress: 95,
      streak: 30,
      target: 1,
      completed: false,
      dueDate: new Date().toISOString().split('T')[0],
      xpReward: calculateXpReward('finance', 'Beginner', 'daily'),
      questTier: 'micro',
      parentGoalId: 6
    }
  ]);

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "30-minute cardio workout",
      goalId: 1,
      completed: false,
      xpReward: 25,
      category: "health",
      priority: "medium",
      tags: ["workout", "cardio"],
      cid: ""
    },
    {
      id: 2,
      title: "Complete Spanish lesson",
      goalId: 2,
      completed: true,
      xpReward: 15,
      category: "education",
      priority: "medium",
      tags: ["language", "learning"],
      cid: ""
    },
    {
      id: 3,
      title: "Track daily expenses",
      goalId: 3,
      completed: false,
      xpReward: 10,
      category: "finance",
      priority: "low",
      tags: ["budgeting", "tracking"],
      cid: ""
    }
  ]);

  const updateUserData = (updates: Partial<UserData>) => {
    setUserData(prev => ({ ...prev, ...updates }));
  };

  const updateGoals = (updatedGoals: Goal[]) => {
    setGoals(updatedGoals);
  };

  const updateTasks = (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
  };

  // Celebration handler for quest completion
  const handleCelebration = (achievement: Achievement) => {
    console.log('🎉 Achievement unlocked:', achievement);
    // Here you could show a toast notification, update achievements, etc.
  };

  // Goal completion handler
  const handleGoalComplete = (goalId: number) => {
    console.log('Goal completed:', goalId);
    // Here you could navigate to the goal details or show completion UI
  };

  // Task completion handler
  const handleTaskComplete = (taskId: number) => {
    console.log('Task completed:', taskId);
    // Here you could show completion feedback or update related goals
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'map':
        return (
          <MapSection
            goals={goals}
            userData={userData}
            tasks={tasks}
            onGoalComplete={handleGoalComplete}
            onCelebration={handleCelebration}
          />
        );
      case 'dashboard':
        return <DashboardSection userData={userData} goals={goals} tasks={tasks} />;
      case 'goals':
        return <GoalsSection goals={goals} setGoals={updateGoals} />;
      case 'tasks':
        return (
          <TasksSection
            tasks={tasks}
            setTasks={updateTasks}
            goals={goals}
            userData={userData}
            updateUserData={updateUserData}
            onTaskComplete={handleTaskComplete}
          />
        );
      case 'ai-coach':
        return <AICoachSection userData={userData} goals={goals} />;
      case 'calendar':
        return <CalendarSection goals={goals} tasks={tasks} />;
      case 'profile':
        return <ProfileSection userData={userData} goals={goals} />;
      default:
        return (
          <MapSection
            goals={goals}
            userData={userData}
            tasks={tasks}
            onGoalComplete={handleGoalComplete}
            onCelebration={handleCelebration}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Duolingo-style top header */}
      <Navigation
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        userData={userData}
      />

      {/* Main content area with Duolingo-style layout */}
      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            {renderActiveSection()}
          </div>
        </div>
      </main>
    </div>
  );

};

export default QwestApp;
