"use client";

import React from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Star, Trophy, CheckCircle, Lock, Play, Target } from './ui/icons';

interface Goal {
  id: string;
  title: string;
  category: string;
  progress: number;
  completed: boolean;
  type: string;
  target: number;
  streak: number;
}

interface UserData {
  level: number;
  xp: number;
  streak: number;
}

interface Task {
  id: string;
  goalId: string;
  title: string;
  completed: boolean;
}

interface MapSectionProps {
  goals: Goal[];
  userData: UserData;
  tasks: Task[];
}

export function MapSection({ goals, userData, tasks }: MapSectionProps) {
  // Create a learning path from goals and tasks
  const learningPath = goals.map((goal, index) => ({
    id: goal.id,
    title: goal.title,
    category: goal.category,
    progress: goal.progress,
    completed: goal.completed,
    locked: index > 0 && !goals[index - 1].completed && goal.progress === 0,
    difficulty: goal.type === 'daily' ? 'Beginner' : goal.type === 'weekly' ? 'Intermediate' : 'Advanced',
    xp: Math.floor(goal.target * 10) || 50,
    streak: goal.streak,
    tasks: tasks.filter(task => task.goalId === goal.id)
  }));

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'health': return 'from-green-400 to-emerald-500';
      case 'finance': return 'from-blue-400 to-indigo-500';
      case 'education': return 'from-purple-400 to-violet-500';
      case 'career': return 'from-orange-400 to-red-500';
      case 'relationships': return 'from-pink-400 to-rose-500';
      case 'personal': return 'from-indigo-400 to-purple-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Your Quest Map
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Follow your personalized learning path. Complete goals to unlock new challenges and level up your life!
        </p>
        
        {/* Progress Overview */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 max-w-md mx-auto">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Overall Progress</span>
              <span className="text-sm font-bold text-gray-900">
                {goals.filter(g => g.completed).length}/{goals.length} Goals
              </span>
            </div>
            <Progress 
              value={(goals.filter(g => g.completed).length / goals.length) * 100} 
              className="h-3"
            />
            <div className="flex items-center justify-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span className="font-medium">Level {userData.level}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-blue-500" filled />
                <span className="font-medium">{userData.xp} XP</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Path */}
      <div className="max-w-4xl mx-auto">
        <div className="space-y-6">
          {learningPath.map((item, index) => (
            <div key={item.id} className="relative">
              {/* Connection Line */}
              {index < learningPath.length - 1 && (
                <div className="absolute left-1/2 top-full w-0.5 h-6 bg-gradient-to-b from-gray-300 to-gray-200 transform -translate-x-0.5 z-0" />
              )}
              
              {/* Goal Card */}
              <Card className={`relative z-10 transition-all duration-300 hover:shadow-lg ${
                item.completed 
                  ? 'border-green-200 bg-gradient-to-r from-green-50 to-emerald-50' 
                  : item.locked 
                  ? 'border-gray-200 bg-gray-50 opacity-60' 
                  : 'border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 hover:border-blue-300 cursor-pointer'
              }`}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br ${
                      item.completed 
                        ? 'from-green-500 to-emerald-600' 
                        : item.locked 
                        ? 'from-gray-400 to-gray-500' 
                        : getCategoryColor(item.category)
                    } text-white shadow-lg`}>
                      {item.completed ? (
                        <CheckCircle className="w-8 h-8" />
                      ) : item.locked ? (
                        <Lock className="w-8 h-8" />
                      ) : (
                        <Target className="w-8 h-8" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className={getDifficultyColor(item.difficulty)}>
                              {item.difficulty}
                            </Badge>
                            <Badge variant="outline" className="capitalize">
                              {item.category}
                            </Badge>
                            <span className="text-sm text-gray-600">{item.xp} XP</span>
                          </div>
                        </div>

                        {/* Stars for completed goals */}
                        {item.completed && (
                          <div className="flex items-center space-x-1">
                            <Star className="w-5 h-5 text-yellow-500" filled />
                            <Star className="w-5 h-5 text-yellow-500" filled />
                            <Star className="w-5 h-5 text-yellow-500" filled />
                          </div>
                        )}
                      </div>

                      {/* Progress Bar */}
                      {!item.completed && !item.locked && (
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-medium">{Math.round(item.progress)}%</span>
                          </div>
                          <Progress value={item.progress} className="h-2" />
                        </div>
                      )}

                      {/* Streak indicator */}
                      {item.streak > 0 && (
                        <div className="mt-3 flex items-center space-x-2">
                          <div className="flex items-center space-x-1 bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                            <span>🔥</span>
                            <span>{item.streak} day streak</span>
                          </div>
                        </div>
                      )}

                      {/* Action Button */}
                      <div className="mt-4">
                        {item.completed ? (
                          <Button variant="outline" className="bg-green-100 text-green-700 border-green-200 hover:bg-green-200">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Completed
                          </Button>
                        ) : item.locked ? (
                          <Button variant="outline" disabled className="bg-gray-100 text-gray-500">
                            <Lock className="w-4 h-4 mr-2" />
                            Locked
                          </Button>
                        ) : (
                          <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white">
                            <Play className="w-4 h-4 mr-2" />
                            {item.progress > 0 ? 'Continue' : 'Start Quest'}
                          </Button>
                        )}
                      </div>

                      {/* Tasks Preview */}
                      {item.tasks.length > 0 && !item.locked && (
                        <div className="mt-4 p-3 bg-white rounded-lg border border-gray-100">
                          <div className="text-sm font-medium text-gray-700 mb-2">
                            Tasks ({item.tasks.filter(t => t.completed).length}/{item.tasks.length})
                          </div>
                          <div className="space-y-1">
                            {item.tasks.slice(0, 2).map((task) => (
                              <div key={task.id} className="flex items-center space-x-2 text-sm">
                                <div className={`w-3 h-3 rounded-full ${
                                  task.completed ? 'bg-green-500' : 'bg-gray-300'
                                }`} />
                                <span className={task.completed ? 'text-gray-500 line-through' : 'text-gray-700'}>
                                  {task.title}
                                </span>
                              </div>
                            ))}
                            {item.tasks.length > 2 && (
                              <div className="text-xs text-gray-500">
                                +{item.tasks.length - 2} more tasks
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Achievement Celebration */}
      {goals.filter(g => g.completed).length > 0 && (
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <CardContent className="p-6 text-center">
            <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">Amazing Progress!</h3>
            <p className="text-gray-600 mb-4">
              You&apos;ve completed {goals.filter(g => g.completed).length} goals. Keep up the fantastic work!
            </p>
            <Button variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200">
              View All Achievements
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
