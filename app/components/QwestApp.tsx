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

const QwestApp = () => {
  const [activeSection, setActiveSection] = useState('map');
  const [userData, setUserData] = useState({
    level: 12,
    xp: 2450,
    streak: 7,
    totalGoals: 15,
    completedGoals: 8,
    achievements: 23,
    tokens: 145
  });

  const [goals, setGoals] = useState([
    {
      id: 1,
      title: "Morning Workout",
      category: "health",
      type: "daily",
      progress: 75,
      streak: 5,
      target: 30,
      completed: false,
      dueDate: new Date().toISOString().split('T')[0]
    },
    {
      id: 2,
      title: "Learn Spanish",
      category: "education",
      type: "weekly",
      progress: 60,
      streak: 3,
      target: 5,
      completed: false,
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    {
      id: 3,
      title: "Save $1000",
      category: "finance",
      type: "monthly",
      progress: 45,
      streak: 1,
      target: 1000,
      completed: false,
      dueDate: "2025-09-01"
    }
  ]);

  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "30-minute cardio workout",
      goalId: 1,
      completed: false,
      xpReward: 25,
      category: "health"
    },
    {
      id: 2,
      title: "Complete Spanish lesson",
      goalId: 2,
      completed: true,
      xpReward: 15,
      category: "education"
    },
    {
      id: 3,
      title: "Track daily expenses",
      goalId: 3,
      completed: false,
      xpReward: 10,
      category: "finance"
    }
  ]);

  const updateUserData = (updates: Partial<typeof userData>) => {
    setUserData(prev => ({ ...prev, ...updates }));
  };

  const updateGoals = (updatedGoals: typeof goals) => {
    setGoals(updatedGoals);
  };

  const updateTasks = (updatedTasks: typeof tasks) => {
    setTasks(updatedTasks);
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'map':
        return <MapSection goals={goals} userData={userData} tasks={tasks} />;
      case 'dashboard':
        return <DashboardSection userData={userData} goals={goals} tasks={tasks} />;
      case 'goals':
        return <GoalsSection goals={goals} setGoals={updateGoals} />;
      case 'tasks':
        return <TasksSection tasks={tasks} setTasks={updateTasks} goals={goals} userData={userData} updateUserData={updateUserData} />;
      case 'ai-coach':
        return <AICoachSection userData={userData} goals={goals} />;
      case 'calendar':
        return <CalendarSection goals={goals} tasks={tasks} />;
      case 'profile':
        return <ProfileSection userData={userData} goals={goals} />;
      default:
        return <MapSection goals={goals} userData={userData} tasks={tasks} />;
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
