"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  TrendingUp, 
  Target, 
  CheckCircle, 
  Clock,
  Trophy,
  Flame,
  Star,
  Calendar,
  BarChart3
} from './ui/icons';

interface DashboardSectionProps {
  userData: any;
  goals: any[];
  tasks: any[];
}

export function DashboardSection({ userData, goals, tasks }: DashboardSectionProps) {
  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);
  const totalXpToday = completedTasks.reduce((sum, task) => sum + task.xpReward, 0);

  const weeklyStats = [
    { day: 'Mon', xp: 45, completed: true },
    { day: 'Tue', xp: 60, completed: true },
    { day: 'Wed', xp: 30, completed: true },
    { day: 'Thu', xp: 55, completed: true },
    { day: 'Fri', xp: 40, completed: true },
    { day: 'Sat', xp: 25, completed: false },
    { day: 'Sun', xp: 0, completed: false },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header - Duolingo style */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">Your Progress</h1>
        <p className="text-gray-600">Keep up the great work on your journey!</p>
      </div>

      {/* Stats Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-2 border-gray-100 text-center">
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{userData.streak}</div>
              <div className="text-sm text-gray-500">Day Streak</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-100 text-center">
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{userData.xp.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Total XP</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-100 text-center">
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-violet-500 rounded-full flex items-center justify-center mx-auto">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{userData.level}</div>
              <div className="text-sm text-gray-500">Current Level</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-100 text-center">
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{userData.completedGoals}</div>
              <div className="text-sm text-gray-500">Goals Done</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Progress */}
      <Card className="border-2 border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            <span>Today's Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-lg font-bold text-gray-900">
                {completedTasks.length} of {tasks.length} tasks completed
              </div>
              <div className="text-sm text-gray-600">
                You've earned {totalXpToday} XP today!
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round((completedTasks.length / tasks.length) * 100)}%
              </div>
              <div className="text-sm text-gray-500">Complete</div>
            </div>
          </div>
          
          <Progress 
            value={(completedTasks.length / tasks.length) * 100} 
            className="h-4"
          />

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span>{completedTasks.length} completed</span>
            </div>
            <div className="flex items-center space-x-2 text-orange-600">
              <Clock className="w-4 h-4" />
              <span>{pendingTasks.length} remaining</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Activity */}
      <Card className="border-2 border-gray-100">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-purple-500" />
            <span>This Week</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-end h-32 px-2">
              {weeklyStats.map((day, index) => (
                <div key={day.day} className="flex flex-col items-center space-y-2 flex-1">
                  <div className="flex-1 flex items-end">
                    <div
                      className={`w-6 rounded-t-lg transition-all duration-300 ${
                        day.completed 
                          ? 'bg-gradient-to-t from-purple-400 to-purple-500' 
                          : 'bg-gray-200'
                      }`}
                      style={{ height: `${Math.max(day.xp / 60 * 100, 10)}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 font-medium">{day.day}</div>
                  <div className="text-xs text-gray-400">{day.xp}</div>
                </div>
              ))}
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2 text-purple-600">
                <Star className="w-4 h-4" />
                <span>5 day streak this week</span>
              </div>
              <div className="text-gray-500">
                255 XP earned
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Goal Categories Progress */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Goal Categories</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {['health', 'education', 'finance'].map((category) => {
            const categoryGoals = goals.filter(goal => goal.category === category);
            const avgProgress = categoryGoals.length > 0 
              ? categoryGoals.reduce((sum, goal) => sum + goal.progress, 0) / categoryGoals.length 
              : 0;

            const colors: Record<string, string> = {
              health: 'from-green-400 to-emerald-500',
              education: 'from-blue-400 to-indigo-500',
              finance: 'from-yellow-400 to-orange-500'
            };

            const icons: Record<string, string> = {
              health: '💪',
              education: '📚',
              finance: '💰'
            };

            return (
              <Card key={category} className="border-2 border-gray-100 hover:border-purple-200 transition-all duration-200">
                <CardContent className="p-4 text-center space-y-3">
                  <div className="text-2xl">{icons[category]}</div>
                  <div>
                    <h3 className="font-medium text-gray-900 capitalize">{category}</h3>
                    <p className="text-sm text-gray-500">{categoryGoals.length} goals</p>
                  </div>
                  <div className="space-y-2">
                    <div className={`text-lg font-bold bg-gradient-to-r ${colors[category]} bg-clip-text text-transparent`}>
                      {Math.round(avgProgress)}%
                    </div>
                    <Progress value={avgProgress} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Motivational Card */}
      <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
        <CardContent className="p-6 text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-gray-900">You're doing amazing!</h3>
            <p className="text-gray-600">
              You're {userData.streak} days into your journey. Keep building those healthy habits!
            </p>
          </div>
          <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0">
            View All Achievements
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
