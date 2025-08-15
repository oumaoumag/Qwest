"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import {
  Trophy,
  Star,
  Flame,
  Target,
  Calendar,
  TrendingUp,
  Award,
  Settings
} from './ui/icons';

interface UserData {
  level: number;
  xp: number;
  streak: number;
  totalGoals: number;
  completedGoals: number;
  achievements: number;
  tokens: number;
}

interface Goal {
  id: number;
  title: string;
  category: string;
  type: string;
  progress: number;
  streak: number;
  target: number;
  completed: boolean;
  dueDate: string;
}

interface ProfileSectionProps {
  userData: UserData;
  goals: Goal[];
}

export function ProfileSection({ userData, goals }: ProfileSectionProps) {
  const achievements = [
    { id: 1, title: "First Steps", description: "Complete your first goal", earned: true, icon: "🎯" },
    { id: 2, title: "Streak Master", description: "Maintain a 7-day streak", earned: true, icon: "🔥" },
    { id: 3, title: "Goal Crusher", description: "Complete 5 goals", earned: userData.completedGoals >= 5, icon: "💪" },
    { id: 4, title: "Consistency King", description: "Maintain a 30-day streak", earned: userData.streak >= 30, icon: "👑" },
    { id: 5, title: "Level Up", description: "Reach level 10", earned: userData.level >= 10, icon: "⭐" },
    { id: 6, title: "XP Master", description: "Earn 5000 XP", earned: userData.xp >= 5000, icon: "💎" },
  ];

  const stats = [
    { label: "Current Level", value: userData.level, icon: Trophy, color: "text-purple-600" },
    { label: "Total XP", value: userData.xp.toLocaleString(), icon: Star, color: "text-yellow-600" },
    { label: "Current Streak", value: `${userData.streak} days`, icon: Flame, color: "text-orange-600" },
    { label: "Goals Completed", value: userData.completedGoals, icon: Target, color: "text-green-600" },
    { label: "Total Goals", value: userData.totalGoals, icon: Calendar, color: "text-blue-600" },
    { label: "Success Rate", value: `${Math.round((userData.completedGoals / userData.totalGoals) * 100)}%`, icon: TrendingUp, color: "text-indigo-600" },
  ];

  const categoryStats = ['health', 'education', 'finance'].map(category => {
    const categoryGoals = goals.filter(goal => goal.category === category);
    const completedInCategory = categoryGoals.filter(goal => goal.completed).length;
    const avgProgress = categoryGoals.length > 0 
      ? categoryGoals.reduce((sum, goal) => sum + goal.progress, 0) / categoryGoals.length 
      : 0;

    return {
      category,
      total: categoryGoals.length,
      completed: completedInCategory,
      progress: avgProgress,
      icon: category === 'health' ? '💪' : category === 'education' ? '📚' : '💰'
    };
  });

  const currentLevelProgress = ((userData.xp % 1000) / 1000) * 100;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto">
          U
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
          <p className="text-gray-600">Level {userData.level} Quest Master</p>
        </div>
        <Button variant="outline" className="mt-4">
          <Settings className="w-4 h-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      {/* Level Progress */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Level Progress</h3>
                <p className="text-sm text-gray-600">
                  {1000 - (userData.xp % 1000)} XP to level {userData.level + 1}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">Level {userData.level}</div>
                <div className="text-sm text-gray-500">{userData.xp} XP</div>
              </div>
            </div>
            <Progress value={currentLevelProgress} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-4 text-center">
                <Icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Category Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Goal Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categoryStats.map((category) => (
              <div key={category.category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{category.icon}</span>
                    <span className="font-medium capitalize">{category.category}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {category.completed}/{category.total} completed
                  </div>
                </div>
                <Progress value={category.progress} className="h-2" />
                <div className="text-xs text-gray-500">
                  {Math.round(category.progress)}% average progress
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-500" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border transition-all ${
                  achievement.earned
                    ? 'border-yellow-200 bg-yellow-50'
                    : 'border-gray-200 bg-gray-50 opacity-60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{achievement.title}</h4>
                    <p className="text-xs text-gray-600">{achievement.description}</p>
                  </div>
                  {achievement.earned && (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      Earned
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Target className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Completed &quot;Learn Spanish&quot; goal</p>
                <p className="text-xs text-gray-600">2 hours ago</p>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                +15 XP
              </Badge>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Flame className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Maintained 7-day streak</p>
                <p className="text-xs text-gray-600">Today</p>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Streak!
              </Badge>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <Trophy className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Reached Level 12</p>
                <p className="text-xs text-gray-600">Yesterday</p>
              </div>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                Level Up!
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
