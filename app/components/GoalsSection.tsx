"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Plus, Target, CheckCircle, Flame, TrendingUp, Calendar } from './ui/icons';

interface GoalsSectionProps {
  goals: any[];
  setGoals: (goals: any[]) => void;
}

export function GoalsSection({ goals, setGoals }: GoalsSectionProps) {
  const [filter, setFilter] = useState('all');

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'health': return 'text-green-600 border-green-200';
      case 'finance': return 'text-blue-600 border-blue-200';
      case 'education': return 'text-purple-600 border-purple-200';
      case 'career': return 'text-orange-600 border-orange-200';
      case 'relationships': return 'text-pink-600 border-pink-200';
      case 'personal': return 'text-indigo-600 border-indigo-200';
      default: return 'text-gray-600 border-gray-200';
    }
  };

  const getTimeframeBadgeColor = (type: string) => {
    switch (type) {
      case 'daily': return 'bg-green-100 text-green-800';
      case 'weekly': return 'bg-blue-100 text-blue-800';
      case 'monthly': return 'bg-purple-100 text-purple-800';
      case 'quarterly': return 'bg-orange-100 text-orange-800';
      case 'yearly': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDaysUntilDeadline = (dueDate: string) => {
    const today = new Date();
    const deadline = new Date(dueDate);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Your Quest Goals</h1>
          <p className="text-gray-600">Create and manage your life adventures</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          New Goal
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Goals</CardTitle>
            <Target className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{goals.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{goals.filter(g => g.completed).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Streaks</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{goals.filter(g => g.streak > 0).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {goals.length > 0 ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length) : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goals Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {goals.map((goal) => {
          const daysLeft = getDaysUntilDeadline(goal.dueDate);
          const isOverdue = daysLeft < 0;
          const isDueSoon = daysLeft <= 3 && daysLeft >= 0;

          return (
            <Card key={goal.id} className={`hover:shadow-lg transition-shadow ${goal.completed ? 'border-green-200 bg-green-50/50' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <Badge variant="outline" className={getCategoryColor(goal.category)}>
                      {goal.category}
                    </Badge>
                    <Badge variant="secondary" className={getTimeframeBadgeColor(goal.type)}>
                      {goal.type}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <span className="sr-only">Edit</span>
                      ✏️
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-700">
                      <span className="sr-only">Delete</span>
                      🗑️
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">{goal.title}</h3>
                  {goal.streak > 0 && (
                    <div className="flex items-center space-x-1 text-orange-600 text-sm">
                      <Flame className="w-4 h-4" />
                      <span>{goal.streak} day streak</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-medium">{Math.round(goal.progress)}%</span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {isOverdue 
                        ? `${Math.abs(daysLeft)} days overdue`
                        : isDueSoon 
                        ? `${daysLeft} days left`
                        : new Date(goal.dueDate).toLocaleDateString()
                      }
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Target className="w-4 h-4" />
                    <span>{goal.target}</span>
                  </div>
                </div>

                {goal.completed ? (
                  <Button variant="outline" className="w-full bg-green-100 text-green-700 border-green-200">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Completed
                  </Button>
                ) : (
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Continue Goal
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {goals.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No goals yet</h3>
            <p className="text-gray-500 mb-4">
              Start your journey by creating your first goal!
            </p>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Goal
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
