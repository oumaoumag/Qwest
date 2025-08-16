"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Star, Trophy, CheckCircle, Lock, Play, Target } from './ui/icons';

// Import domain utilities
import {
  QuestNode,
  MapSectionProps,
  Achievement
} from '../domain/types';
import {
  getDifficultyColor,
  ANIMATION_DURATIONS,
  QUEST_TIER_COLORS,
  QUEST_TIER_INFO,
  MAP_CONSTANTS
} from '../domain/constants';
import {
  generateQuestNodes,
  calculateOverallProgress,
  getNextAvailableQuest,
  shouldTriggerCelebration,
  generateQuestAchievement
} from '../domain/map-algo';

export function MapSection({ goals, userData, tasks, onGoalComplete, onCelebration }: MapSectionProps) {
  const [questNodes, setQuestNodes] = useState<QuestNode[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationAchievement, setCelebrationAchievement] = useState<Achievement | null>(null);
  const [previousNodes, setPreviousNodes] = useState<QuestNode[]>([]);

  // Generate quest nodes from live goal data
  useEffect(() => {
    const newQuestNodes = generateQuestNodes(goals, tasks);

    // Check for celebration trigger
    if (previousNodes.length > 0) {
      const { shouldCelebrate, completedNode } = shouldTriggerCelebration(previousNodes, newQuestNodes);

      if (shouldCelebrate && completedNode) {
        const achievement = generateQuestAchievement(completedNode);
        setCelebrationAchievement(achievement);
        setShowCelebration(true);

        // Call celebration callback if provided
        if (onCelebration) {
          onCelebration(achievement);
        }

        // Auto-hide celebration after duration
        setTimeout(() => {
          setShowCelebration(false);
        }, ANIMATION_DURATIONS.celebration);
      }
    }

    setPreviousNodes(questNodes);
    setQuestNodes(newQuestNodes);
  }, [goals, tasks, onCelebration, previousNodes, questNodes]);

  // Calculate overall progress using domain utility
  const overallProgress = calculateOverallProgress(questNodes);
  const nextQuest = getNextAvailableQuest(questNodes);

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-screen">
      {/* Epic Celebration Modal */}
      {showCelebration && celebrationAchievement && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-lg mx-4 text-center shadow-2xl border-4 border-yellow-400">
            <div className="text-8xl mb-6 animate-bounce">🏆</div>
            <div className="space-y-4">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
                QUEST COMPLETED!
              </h2>
              <h3 className="text-xl font-semibold text-gray-800">{celebrationAchievement.title}</h3>
              <p className="text-gray-600 text-lg">{celebrationAchievement.description}</p>
              <div className="flex items-center justify-center space-x-3 text-yellow-600 text-xl">
                <Star className="w-8 h-8 animate-spin" filled />
                <span className="font-bold text-2xl">+{celebrationAchievement.xpReward} XP</span>
                <Star className="w-8 h-8 animate-spin" filled />
              </div>
              <div className="text-sm text-gray-500 mt-4">
                Your legend grows stronger...
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Epic Header */}
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
            Your Life&apos;s Quest Board
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Your personal adventure board, where every milestone is a victory and every completed quest brings you closer to your ultimate destination.
          </p>
        </div>

        {/* Epic Progress Overview */}
        <div className="bg-gradient-to-r from-purple-100 via-pink-100 to-red-100 rounded-2xl p-8 max-w-2xl mx-auto border-2 border-purple-200 shadow-lg">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-gray-800">Epic Journey Progress</span>
              <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {questNodes.filter(n => n.completed).length}/{questNodes.length} Quests Conquered
              </span>
            </div>
            <Progress
              value={overallProgress}
              className="h-4 bg-gray-200"
            />
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <div className="flex items-center justify-center space-x-1">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span className="font-bold text-xl text-gray-800">{userData.level}</span>
                </div>
                <span className="text-sm text-gray-600">Hero Level</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-center space-x-1">
                  <Star className="w-5 h-5 text-blue-500" filled />
                  <span className="font-bold text-xl text-gray-800">{userData.xp.toLocaleString()}</span>
                </div>
                <span className="text-sm text-gray-600">Experience</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-center space-x-1">
                  <Target className="w-5 h-5 text-green-500" />
                  <span className="font-bold text-xl text-gray-800">{questNodes.filter(n => n.isMilestone && n.completed).length}</span>
                </div>
                <span className="text-sm text-gray-600">Milestones</span>
              </div>
            </div>
          </div>
        </div>

        {/* Next Epic Quest */}
        {nextQuest && (
          <div className="bg-gradient-to-r from-yellow-100 via-orange-100 to-red-100 rounded-2xl p-6 max-w-xl mx-auto border-2 border-orange-200 shadow-lg">
            <div className="text-center space-y-3">
              <div className="text-sm font-bold text-orange-700 uppercase tracking-wide">Next Epic Challenge</div>
              <div className="text-2xl font-bold text-gray-900">{nextQuest.title}</div>
              <div className="flex items-center justify-center space-x-2">
                <Badge variant="outline" className={`${getDifficultyColor(nextQuest.difficulty)} border-2`}>
                  {nextQuest.difficulty}
                </Badge>
                <Badge variant="outline" className={`bg-gradient-to-r ${QUEST_TIER_COLORS[nextQuest.questTier]} text-white border-0`}>
                  {QUEST_TIER_INFO[nextQuest.questTier].label}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 italic">
                {QUEST_TIER_INFO[nextQuest.questTier].description}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Epic Quest Path Visualization */}
      <div className="relative max-w-6xl mx-auto">
        {/* Path Background */}
        <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 border-2 border-purple-200 shadow-xl overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-400 rounded-full animate-pulse"></div>
            <div className="absolute top-32 right-20 w-16 h-16 bg-pink-400 rounded-full animate-bounce"></div>
            <div className="absolute bottom-20 left-32 w-12 h-12 bg-blue-400 rounded-full animate-ping"></div>
            <div className="absolute bottom-40 right-40 w-24 h-24 bg-purple-400 rounded-full animate-pulse"></div>
          </div>

          {/* Quest Nodes */}
          <div className="relative z-10 space-y-8">
            {questNodes.map((questNode, index) => {
              const nodeSize = MAP_CONSTANTS.nodeSize[questNode.questTier];
              const tierInfo = QUEST_TIER_INFO[questNode.questTier];

              return (
                <div key={questNode.id} className="relative">
                  {/* Connection Path */}
                  {index < questNodes.length - 1 && (
                    <div className="absolute left-1/2 top-full w-1 h-12 bg-gradient-to-b from-purple-400 to-pink-400 transform -translate-x-0.5 z-0 rounded-full shadow-lg" />
                  )}

                  {/* Epic Quest Card */}
                  <Card className={`relative z-10 transition-all duration-500 hover:scale-105 ${
                    questNode.completed
                      ? `border-4 border-green-400 bg-gradient-to-r from-green-50 to-emerald-50 shadow-2xl ${MAP_CONSTANTS.animations.celebration[questNode.questTier]}`
                      : questNode.locked
                      ? 'border-2 border-gray-300 bg-gray-50 opacity-70'
                      : `border-3 border-purple-300 bg-gradient-to-r from-purple-50 to-pink-50 hover:border-purple-400 cursor-pointer shadow-lg hover:shadow-2xl`
                  } ${questNode.isMilestone ? 'ring-4 ring-yellow-300 ring-opacity-50' : ''}`}>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-6">
                        {/* Epic Quest Icon */}
                        <div
                          className={`rounded-full flex items-center justify-center bg-gradient-to-br shadow-2xl relative ${
                            questNode.completed
                              ? 'from-green-500 to-emerald-600 animate-pulse'
                              : questNode.locked
                              ? 'from-gray-400 to-gray-500'
                              : `${QUEST_TIER_COLORS[questNode.questTier]} hover:scale-110 transition-transform`
                          } text-white`}
                          style={{
                            width: `${nodeSize.width}px`,
                            height: `${nodeSize.height}px`,
                            fontSize: `${nodeSize.width / 3}px`
                          }}
                        >
                          {questNode.isUltimateGoal && (
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold text-white animate-bounce">
                              👑
                            </div>
                          )}
                          {questNode.isMilestone && !questNode.isUltimateGoal && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full animate-ping"></div>
                          )}
                          {questNode.completed ? (
                            <CheckCircle className="w-full h-full p-2" />
                          ) : questNode.locked ? (
                            <Lock className="w-full h-full p-2" />
                          ) : (
                            <Target className="w-full h-full p-2" />
                          )}
                        </div>

                        {/* Epic Quest Content */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div className="space-y-3">
                              <div className="space-y-1">
                                <h3 className={`font-bold text-gray-900 ${
                                  questNode.questTier === 'epic' ? 'text-3xl' :
                                  questNode.questTier === 'longer' ? 'text-2xl' :
                                  questNode.questTier === 'long' ? 'text-xl' :
                                  'text-lg'
                                }`}>
                                  {questNode.title}
                                </h3>
                                {questNode.isUltimateGoal && (
                                  <p className="text-sm text-purple-600 font-semibold italic">
                                    🌟 Ultimate Quest - Your Life&apos;s Greatest Adventure
                                  </p>
                                )}
                                {questNode.isMilestone && !questNode.isUltimateGoal && (
                                  <p className="text-sm text-orange-600 font-semibold">
                                    🏆 Major Milestone
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center space-x-2 flex-wrap gap-1">
                                <Badge variant="outline" className={`${getDifficultyColor(questNode.difficulty)} border-2`}>
                                  {questNode.difficulty}
                                </Badge>
                                <Badge variant="outline" className={`bg-gradient-to-r ${QUEST_TIER_COLORS[questNode.questTier]} text-white border-0 font-bold`}>
                                  {tierInfo.label}
                                </Badge>
                                <Badge variant="outline" className="capitalize bg-gray-100">
                                  {questNode.category}
                                </Badge>
                                <span className="text-sm font-bold text-purple-600">{questNode.xp} XP</span>
                              </div>
                              <p className="text-sm text-gray-600 italic">
                                {tierInfo.description}
                              </p>
                            </div>

                            {/* Epic Completion Stars */}
                            {questNode.completed && (
                              <div className="flex flex-col items-center space-y-1">
                                <div className="flex items-center space-x-1">
                                  {Array.from({ length: questNode.questTier === 'epic' ? 5 : questNode.questTier === 'longer' ? 4 : 3 }).map((_, i) => (
                                    <Star key={i} className="w-5 h-5 text-yellow-500 animate-pulse" filled />
                                  ))}
                                </div>
                                <span className="text-xs text-yellow-600 font-bold">CONQUERED!</span>
                              </div>
                            )}
                          </div>

                          {/* Epic Progress Bar */}
                          {!questNode.completed && !questNode.locked && (
                            <div className="mt-4 space-y-3">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-700 font-medium">Quest Progress</span>
                                <span className="font-bold text-purple-600">{Math.round(questNode.progress)}%</span>
                              </div>
                              <Progress
                                value={questNode.progress}
                                className={`h-3 bg-gray-200 ${questNode.isMilestone ? 'border-2 border-yellow-300' : ''}`}
                              />
                              {questNode.progress > 0 && (
                                <div className="text-xs text-gray-500 italic">
                                  The adventure continues...
                                </div>
                              )}
                            </div>
                          )}

                          {/* Epic Streak indicator */}
                          {questNode.streak > 0 && (
                            <div className="mt-3 flex items-center space-x-2">
                              <div className="flex items-center space-x-2 bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 px-3 py-2 rounded-full text-sm font-bold border-2 border-orange-200">
                                <span className="text-lg">🔥</span>
                                <span>{questNode.streak} day epic streak</span>
                                <span className="text-lg">⚡</span>
                              </div>
                            </div>
                          )}

                          {/* Epic Action Button */}
                          <div className="mt-6">
                            {questNode.completed ? (
                              <Button
                                variant="outline"
                                className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-2 border-green-300 hover:from-green-200 hover:to-emerald-200 font-bold"
                                size={questNode.questTier === 'epic' ? 'lg' : 'default'}
                              >
                                <CheckCircle className="w-5 h-5 mr-2" />
                                {questNode.questTier === 'epic' ? 'LEGENDARY COMPLETE!' : 'Quest Complete!'}
                              </Button>
                            ) : questNode.locked ? (
                              <Button
                                variant="outline"
                                disabled
                                className="bg-gray-100 text-gray-500 border-gray-300"
                              >
                                <Lock className="w-4 h-4 mr-2" />
                                Quest Locked
                              </Button>
                            ) : (
                              <Button
                                className={`font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300 ${
                                  questNode.questTier === 'epic'
                                    ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 text-lg px-8 py-3'
                                    : questNode.questTier === 'longer'
                                    ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600'
                                    : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
                                }`}
                                size={questNode.questTier === 'epic' ? 'lg' : 'default'}
                                onClick={() => onGoalComplete && onGoalComplete(questNode.id)}
                              >
                                <Play className="w-5 h-5 mr-2" />
                                {questNode.progress > 0 ?
                                  (questNode.questTier === 'epic' ? 'Continue Epic Journey!' : 'Continue Quest') :
                                  (questNode.questTier === 'epic' ? 'Begin Ultimate Quest!' : 'Start Adventure')
                                }
                              </Button>
                            )}
                          </div>

                          {/* Epic Tasks Preview */}
                          {questNode.tasks.length > 0 && !questNode.locked && (
                            <div className="mt-6 p-4 bg-gradient-to-r from-white to-gray-50 rounded-xl border-2 border-gray-200 shadow-inner">
                              <div className="text-sm font-bold text-gray-800 mb-3 flex items-center space-x-2">
                                <span>⚔️</span>
                                <span>Quest Objectives ({questNode.tasks.filter(t => t.completed).length}/{questNode.tasks.length})</span>
                              </div>
                              <div className="space-y-2">
                                {questNode.tasks.slice(0, 3).map((task) => (
                                  <div key={task.id} className="flex items-center space-x-3 text-sm">
                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                      task.completed
                                        ? 'bg-green-500 border-green-500 text-white'
                                        : 'bg-white border-gray-400'
                                    }`}>
                                      {task.completed && <CheckCircle className="w-3 h-3" />}
                                    </div>
                                    <span className={`${
                                      task.completed
                                        ? 'text-gray-500 line-through'
                                        : 'text-gray-800 font-medium'
                                    }`}>
                                      {task.title}
                                    </span>
                                  </div>
                                ))}
                                {questNode.tasks.length > 3 && (
                                  <div className="text-xs text-gray-500 italic pl-7">
                                    +{questNode.tasks.length - 3} more epic objectives...
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
              );
            })}
          </div>
        </div>
      </div>

      {/* Epic Achievement Hall */}
      {questNodes.filter(n => n.completed).length > 0 && (
        <Card className="bg-gradient-to-r from-yellow-100 via-orange-100 to-red-100 border-4 border-yellow-400 shadow-2xl">
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <Trophy className="w-16 h-16 text-yellow-600 animate-bounce" />
                <span className="text-6xl animate-pulse">🏆</span>
                <Trophy className="w-16 h-16 text-yellow-600 animate-bounce" />
              </div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
                LEGENDARY PROGRESS!
              </h3>
              <p className="text-xl text-gray-700 font-semibold">
                You&apos;ve conquered {questNodes.filter(n => n.completed).length} epic quests on your journey to greatness!
              </p>
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{questNodes.filter(n => n.completed && n.questTier === 'epic').length}</div>
                  <div className="text-sm text-gray-600">Ultimate Quests</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{questNodes.filter(n => n.completed && n.isMilestone).length}</div>
                  <div className="text-sm text-gray-600">Milestones</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{questNodes.filter(n => n.completed).reduce((sum, n) => sum + n.xp, 0)}</div>
                  <div className="text-sm text-gray-600">Total XP</div>
                </div>
              </div>
              <Button
                variant="outline"
                className="bg-gradient-to-r from-yellow-200 to-orange-200 text-yellow-800 border-2 border-yellow-400 hover:from-yellow-300 hover:to-orange-300 font-bold text-lg px-8 py-3"
              >
                <Trophy className="w-5 h-5 mr-2" />
                View Hall of Legends
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
