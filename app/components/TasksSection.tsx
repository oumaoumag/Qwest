"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { CheckCircle, Clock, Star, Plus, CheckSquare } from './ui/icons';

// Import domain utilities
import { TasksSectionProps } from '../domain/types';
import {
  getCategoryBadge,
  getCategoryIcon,
  calculateXpReward
} from '../domain/constants';
import { formatNumber } from '../domain/format';

export function TasksSection({ tasks, setTasks, goals, userData, updateUserData }: TasksSectionProps) {
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'completed'

  const handleCompleteTask = (taskId: number) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId && !task.completed) {
        // Award XP
        const xpReward = task.xpReward || calculateXpReward(task.category);
        updateUserData({ xp: userData.xp + xpReward });
        return { ...task, completed: true };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  const handleUncompleteTask = (taskId: number) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId && task.completed) {
        // Remove XP
        const xpReward = task.xpReward || calculateXpReward(task.category);
        updateUserData({ xp: Math.max(0, userData.xp - xpReward) });
        return { ...task, completed: false };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);
  const totalXpEarned = completedTasks.reduce((sum, task) => sum + (task.xpReward || 0), 0);

  const getGoalTitle = (goalId?: number) => {
    if (!goalId) return 'No Goal';
    const goal = goals.find(g => g.id === goalId);
    return goal ? goal.title : 'Unknown Goal';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Daily Tasks</h1>
          <p className="text-gray-600">Complete tasks to earn XP and build momentum</p>
        </div>
        <Button className="bg-green-500 hover:bg-green-600">
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTasks.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">XP Earned</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalXpEarned}</div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Today&apos;s Progress</h3>
              <div className="text-2xl font-bold text-blue-600">
                {Math.round((completedTasks.length / tasks.length) * 100)}%
              </div>
            </div>
            <Progress value={(completedTasks.length / tasks.length) * 100} className="h-3" />
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>{completedTasks.length} of {tasks.length} tasks completed</span>
              <span>{totalXpEarned} XP earned today</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filter Buttons */}
      <div className="flex items-center space-x-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All Tasks
        </Button>
        <Button
          variant={filter === 'pending' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('pending')}
        >
          Pending ({pendingTasks.length})
        </Button>
        <Button
          variant={filter === 'completed' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('completed')}
        >
          Completed ({completedTasks.length})
        </Button>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.map((task) => (
          <Card key={task.id} className={`transition-all duration-200 hover:shadow-md ${
            task.completed ? 'bg-green-50 border-green-200' : 'hover:border-blue-200'
          }`}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                {/* Checkbox */}
                <button
                  onClick={() => task.completed ? handleUncompleteTask(task.id) : handleCompleteTask(task.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    task.completed
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-gray-300 hover:border-green-400'
                  }`}
                >
                  {task.completed && <CheckCircle className="w-4 h-4" />}
                </button>

                {/* Task Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className={`font-medium ${
                        task.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                      }`}>
                        {task.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className={getCategoryBadge(task.category)}>
                          <span className="mr-1">{getCategoryIcon(task.category)}</span>
                          {task.category}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          Goal: {getGoalTitle(task.goalId)}
                        </span>
                      </div>
                    </div>

                    {/* XP Reward */}
                    <div className="flex items-center space-x-2">
                      <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                        task.completed 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        <Star className="w-3 h-3" />
                        <span>{formatNumber.xp(task.xpReward || 0)} XP</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredTasks.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
              <p className="text-gray-500 mb-4">
                {filter === 'pending'
                  ? "Great job! You&apos;ve completed all your tasks."
                  : filter === 'completed'
                  ? "No completed tasks yet. Start working on your goals!"
                  : "Add some tasks to get started on your journey."
                }
              </p>
              <Button className="bg-green-500 hover:bg-green-600">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Task
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
