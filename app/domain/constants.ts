/**
 * Constants for Qwest Map v1.0.0
 * Centralized category colors, tier mappings, and shared constants
 */

import { Category, Priority, GoalType, Difficulty } from './types';

// Category color mappings for different UI contexts
export const CATEGORY_COLORS = {
  // Gradient colors for backgrounds and icons
  gradients: {
    health: 'from-green-400 to-emerald-500',
    finance: 'from-blue-400 to-indigo-500',
    education: 'from-purple-400 to-violet-500',
    career: 'from-orange-400 to-red-500',
    relationships: 'from-pink-400 to-rose-500',
    personal: 'from-indigo-400 to-purple-500',
    work: 'from-blue-400 to-indigo-500',
    learning: 'from-purple-400 to-violet-500',
    social: 'from-pink-400 to-rose-500',
    other: 'from-gray-400 to-gray-500',
  },
  
  // Badge colors for labels and tags
  badges: {
    health: 'bg-green-100 text-green-800 border-green-200',
    finance: 'bg-blue-100 text-blue-800 border-blue-200',
    education: 'bg-purple-100 text-purple-800 border-purple-200',
    career: 'bg-orange-100 text-orange-800 border-orange-200',
    relationships: 'bg-pink-100 text-pink-800 border-pink-200',
    personal: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    work: 'bg-blue-100 text-blue-800 border-blue-200',
    learning: 'bg-purple-100 text-purple-800 border-purple-200',
    social: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    other: 'bg-gray-100 text-gray-800 border-gray-200',
  },
  
  // Text colors for titles and labels
  text: {
    health: 'text-green-600 border-green-200',
    finance: 'text-blue-600 border-blue-200',
    education: 'text-purple-600 border-purple-200',
    career: 'text-orange-600 border-orange-200',
    relationships: 'text-pink-600 border-pink-200',
    personal: 'text-indigo-600 border-indigo-200',
    work: 'text-blue-600 border-blue-200',
    learning: 'text-purple-600 border-purple-200',
    social: 'text-yellow-600 border-yellow-200',
    other: 'text-gray-600 border-gray-200',
  },
  
  // Border colors for time blocks and special elements
  borders: {
    health: 'bg-red-100 border-red-300 text-red-800',
    finance: 'bg-blue-100 border-blue-300 text-blue-800',
    education: 'bg-purple-100 border-purple-300 text-purple-800',
    career: 'bg-orange-100 border-orange-300 text-orange-800',
    relationships: 'bg-pink-100 border-pink-300 text-pink-800',
    personal: 'bg-green-100 border-green-300 text-green-800',
    work: 'bg-blue-100 border-blue-300 text-blue-800',
    learning: 'bg-purple-100 border-purple-300 text-purple-800',
    social: 'bg-yellow-100 border-yellow-300 text-yellow-800',
    other: 'bg-gray-100 border-gray-300 text-gray-800',
  },
} as const;

// Priority color mappings
export const PRIORITY_COLORS = {
  text: {
    high: 'text-red-500',
    medium: 'text-yellow-500',
    low: 'text-green-500',
  },
  badges: {
    high: 'bg-red-100 text-red-800 border-red-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    low: 'bg-green-100 text-green-800 border-green-200',
  },
} as const;

// Priority icons
export const PRIORITY_ICONS = {
  high: '!',
  medium: '◆',
  low: '○',
} as const;

// Difficulty color mappings
export const DIFFICULTY_COLORS = {
  Beginner: 'bg-green-100 text-green-800',
  Intermediate: 'bg-yellow-100 text-yellow-800',
  Advanced: 'bg-red-100 text-red-800',
} as const;

// Goal type/timeframe color mappings
export const GOAL_TYPE_COLORS = {
  daily: 'bg-green-100 text-green-800',
  weekly: 'bg-blue-100 text-blue-800',
  monthly: 'bg-purple-100 text-purple-800',
  quarterly: 'bg-orange-100 text-orange-800',
  yearly: 'bg-red-100 text-red-800',
} as const;

// Quest Tier color mappings for Epic Map
export const QUEST_TIER_COLORS = {
  micro: 'from-emerald-400 to-green-500',
  shorter: 'from-blue-400 to-cyan-500',
  short: 'from-purple-400 to-violet-500',
  long: 'from-orange-400 to-amber-500',
  longer: 'from-red-400 to-rose-500',
  epic: 'from-yellow-400 via-orange-500 to-red-600',
} as const;

// Quest Tier labels and descriptions
export const QUEST_TIER_INFO = {
  micro: { label: 'Mini Quest', description: 'Small, focused actions completed in hours', size: 'xs' },
  shorter: { label: 'Quick Quest', description: 'Fast achievements that add bursts of progress', size: 'sm' },
  short: { label: 'Standard Quest', description: 'Practical missions that keep momentum strong', size: 'md' },
  long: { label: 'Grand Quest', description: 'Significant chapters in your personal storyline', size: 'lg' },
  longer: { label: 'Epic Quest', description: 'Major stepping stones toward your Ultimate Goal', size: 'xl' },
  epic: { label: 'Ultimate Quest', description: 'The longest-term vision that defines your horizon', size: '2xl' },
} as const;

// Category icons/emojis
export const CATEGORY_ICONS = {
  health: '💪',
  finance: '💰',
  education: '📚',
  career: '💼',
  relationships: '❤️',
  personal: '🎯',
  work: '💼',
  learning: '📚',
  social: '👥',
  other: '📋',
} as const;

// XP rewards by category and difficulty
export const XP_REWARDS = {
  base: {
    health: 25,
    finance: 20,
    education: 30,
    career: 35,
    relationships: 20,
    personal: 25,
    work: 30,
    learning: 30,
    social: 15,
    other: 20,
  },
  multipliers: {
    Beginner: 1,
    Intermediate: 1.5,
    Advanced: 2,
  },
  goalTypeMultipliers: {
    daily: 1,
    weekly: 2,
    monthly: 5,
    quarterly: 10,
    yearly: 20,
  },
} as const;

// Epic Map visualization constants
export const MAP_CONSTANTS = {
  nodeSize: {
    micro: { width: 40, height: 40 },
    shorter: { width: 50, height: 50 },
    short: { width: 60, height: 60 },
    long: { width: 80, height: 80 },
    longer: { width: 100, height: 100 },
    epic: { width: 120, height: 120 },
  },
  spacing: {
    horizontal: 180,
    vertical: 120,
    pathCurve: 50, // How much the path curves
  },
  pathWidth: 6,
  colors: {
    completed: 'from-green-500 to-emerald-600',
    locked: 'from-gray-400 to-gray-500',
    active: 'from-blue-500 to-indigo-600',
    milestone: 'from-yellow-400 via-orange-500 to-red-500',
    ultimate: 'from-purple-600 via-pink-500 to-red-500',
    path: {
      completed: '#10b981',
      active: '#3b82f6',
      locked: '#9ca3af',
      glowing: '#fbbf24',
    },
  },
  animations: {
    celebration: {
      micro: 'animate-bounce',
      shorter: 'animate-pulse',
      short: 'animate-spin',
      long: 'animate-ping',
      longer: 'animate-bounce animate-pulse',
      epic: 'animate-spin animate-pulse animate-ping',
    },
    pathGlow: 'animate-pulse',
    milestoneGlow: 'animate-ping',
  },
} as const;

// Animation durations (in milliseconds)
export const ANIMATION_DURATIONS = {
  celebration: 3000,
  nodeTransition: 300,
  pathAnimation: 1000,
  fadeIn: 200,
  fadeOut: 150,
} as const;

// Level thresholds for user progression
export const LEVEL_THRESHOLDS = [
  0, 100, 250, 500, 1000, 1750, 2750, 4000, 5500, 7250, 9250, 11500, 14000, 16750, 19750, 23000,
  26500, 30250, 34250, 38500, 43000, 47750, 52750, 58000, 63500, 69250, 75250, 81500, 88000, 94750,
] as const;

// Achievement thresholds
export const ACHIEVEMENT_THRESHOLDS = {
  streaks: [3, 7, 14, 30, 60, 100],
  goalsCompleted: [1, 5, 10, 25, 50, 100],
  categoriesCompleted: [1, 3, 5, 7],
  xpEarned: [100, 500, 1000, 5000, 10000, 25000],
} as const;

// Default values
export const DEFAULTS = {
  task: {
    priority: 'medium' as Priority,
    category: 'other' as Category,
    xpReward: 10,
  },
  goal: {
    type: 'weekly' as GoalType,
    category: 'personal' as Category,
    target: 1,
    xpReward: 50,
  },
  user: {
    level: 1,
    xp: 0,
    streak: 0,
    totalGoals: 0,
    completedGoals: 0,
    achievements: 0,
    tokens: 0,
  },
} as const;

// Validation constants
export const VALIDATION = {
  task: {
    titleMaxLength: 100,
    descriptionMaxLength: 500,
    tagsMaxCount: 10,
    tagMaxLength: 20,
  },
  goal: {
    titleMaxLength: 100,
    descriptionMaxLength: 500,
    targetMin: 1,
    targetMax: 1000,
  },
} as const;

// Helper functions for getting colors
export const getCategoryGradient = (category: Category): string => {
  return CATEGORY_COLORS.gradients[category] || CATEGORY_COLORS.gradients.other;
};

export const getCategoryBadge = (category: Category): string => {
  return CATEGORY_COLORS.badges[category] || CATEGORY_COLORS.badges.other;
};

export const getCategoryText = (category: Category): string => {
  return CATEGORY_COLORS.text[category] || CATEGORY_COLORS.text.other;
};

export const getCategoryBorder = (category: Category): string => {
  return CATEGORY_COLORS.borders[category] || CATEGORY_COLORS.borders.other;
};

export const getPriorityColor = (priority: Priority): string => {
  return PRIORITY_COLORS.text[priority];
};

export const getPriorityBadge = (priority: Priority): string => {
  return PRIORITY_COLORS.badges[priority];
};

export const getPriorityIcon = (priority: Priority): string => {
  return PRIORITY_ICONS[priority];
};

export const getDifficultyColor = (difficulty: Difficulty): string => {
  return DIFFICULTY_COLORS[difficulty];
};

export const getGoalTypeColor = (type: GoalType): string => {
  return GOAL_TYPE_COLORS[type];
};

export const getCategoryIcon = (category: Category): string => {
  return CATEGORY_ICONS[category] || CATEGORY_ICONS.other;
};

// Calculate XP reward based on category, difficulty, and goal type
export const calculateXpReward = (
  category: Category,
  difficulty?: Difficulty,
  goalType?: GoalType
): number => {
  const baseXp = XP_REWARDS.base[category] || XP_REWARDS.base.other;
  const difficultyMultiplier = difficulty ? XP_REWARDS.multipliers[difficulty] : 1;
  const typeMultiplier = goalType ? XP_REWARDS.goalTypeMultipliers[goalType] : 1;
  
  return Math.round(baseXp * difficultyMultiplier * typeMultiplier);
};

// Calculate user level from XP
export const calculateLevel = (xp: number): number => {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      return i + 1;
    }
  }
  return 1;
};

// Calculate XP needed for next level
export const getXpForNextLevel = (currentXp: number): number => {
  const currentLevel = calculateLevel(currentXp);
  if (currentLevel >= LEVEL_THRESHOLDS.length) {
    return 0; // Max level reached
  }
  return LEVEL_THRESHOLDS[currentLevel] - currentXp;
};
