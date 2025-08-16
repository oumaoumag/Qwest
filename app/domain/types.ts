/**
 * Domain types for Qwest Map v1.0.0
 * Strict TypeScript types with no 'any' usage
 */

// Core category types
export type Category = 
  | 'health' 
  | 'finance' 
  | 'education' 
  | 'career' 
  | 'relationships' 
  | 'personal' 
  | 'work' 
  | 'learning' 
  | 'social' 
  | 'other';

// Priority levels
export type Priority = 'low' | 'medium' | 'high';

// Goal types/timeframes - Epic Quest Tiers
export type GoalType = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

// Quest Tiers for the Epic Map
export type QuestTier = 'micro' | 'shorter' | 'short' | 'long' | 'longer' | 'epic';

// Difficulty levels
export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

// Task status
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

// Goal status
export type GoalStatus = 'active' | 'completed' | 'paused' | 'cancelled';

// Base entity interface
interface BaseEntity {
  id: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Task entity
export interface Task extends BaseEntity {
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: Date;
  priority: Priority;
  category: Category;
  tags?: string[];
  cid: string; // IPFS CID
  goalId?: number; // Optional reference to parent goal
  xpReward?: number;
  status?: TaskStatus;
}

// Goal entity
export interface Goal extends BaseEntity {
  title: string;
  description?: string;
  category: Category;
  progress: number; // 0-100
  completed: boolean;
  type: GoalType;
  target: number;
  streak: number;
  dueDate: string; // ISO date string
  status?: GoalStatus;
  xpReward?: number;
  difficulty?: Difficulty;
  questTier?: QuestTier; // Epic quest classification
  isUltimateGoal?: boolean; // The longest-term vision
  parentGoalId?: number; // Reference to parent goal for hierarchy
}

// User data and progress
export interface UserData {
  level: number;
  xp: number;
  streak: number;
  totalGoals: number;
  completedGoals: number;
  achievements: number;
  tokens: number;
}

// Quest node for epic map visualization
export interface QuestNode {
  id: number;
  title: string;
  category: Category;
  progress: number;
  completed: boolean;
  locked: boolean;
  difficulty: Difficulty;
  xp: number;
  streak: number;
  tasks: Task[];
  questTier: QuestTier;
  isUltimateGoal: boolean;
  isMilestone: boolean; // Major checkpoint
  position: {
    x: number;
    y: number;
  };
  connections: number[]; // IDs of connected nodes
  pathSegment: number; // Which segment of the winding path
  celebrationLevel: 'none' | 'small' | 'medium' | 'large' | 'epic'; // Animation intensity
}

// Map path coordinates
export interface MapPath {
  id: string;
  points: Array<{
    x: number;
    y: number;
  }>;
  completed: boolean;
}

// Calendar event
export interface CalendarEvent {
  id: number;
  type: 'goal-deadline' | 'recurring-task' | 'custom';
  title: string;
  category: Category;
  completed: boolean;
  date?: Date;
  startTime?: string;
  endTime?: string;
  description?: string;
  color?: string;
}

// Planner item
export interface PlannerItem {
  id: string;
  title: string;
  description?: string;
  category: Category;
  startTime: string;
  endTime: string;
  completed: boolean;
  date: Date;
}

// Achievement/Badge
export interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  category?: Category;
  xpReward: number;
}

// Notification
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

// Component prop types
export interface MapSectionProps {
  goals: Goal[];
  userData: UserData;
  tasks: Task[];
  onGoalComplete?: (goalId: number) => void;
  onCelebration?: (achievement: Achievement) => void;
}

export interface GoalsSectionProps {
  goals: Goal[];
  setGoals: (goals: Goal[]) => void;
  onGoalUpdate?: (goal: Goal) => void;
}

export interface TasksSectionProps {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  goals: Goal[];
  userData: UserData;
  updateUserData: (updates: Partial<UserData>) => void;
  onTaskComplete?: (taskId: number) => void;
}

export interface CalendarSectionProps {
  goals: Goal[];
  tasks: Task[];
  events?: CalendarEvent[];
  onEventCreate?: (event: CalendarEvent) => void;
  onEventUpdate?: (event: CalendarEvent) => void;
  onEventDelete?: (eventId: number) => void;
}

export interface DashboardSectionProps {
  userData: UserData;
  goals: Goal[];
  tasks: Task[];
  achievements?: Achievement[];
}

export interface ProfileSectionProps {
  userData: UserData;
  goals: Goal[];
  achievements?: Achievement[];
  onUserDataUpdate?: (updates: Partial<UserData>) => void;
}

// Form types
export interface TaskFormData {
  title: string;
  description?: string;
  dueDate?: Date;
  priority: Priority;
  category: Category;
  tags?: string[];
}

export interface GoalFormData {
  title: string;
  description?: string;
  category: Category;
  type: GoalType;
  target: number;
  dueDate: string;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Filter and sort types
export interface TaskFilter {
  status?: 'all' | 'active' | 'completed';
  category?: Category | 'all';
  priority?: Priority | 'all';
  sortBy?: 'dueDate' | 'priority' | 'title' | 'category';
  sortOrder?: 'asc' | 'desc';
}

export interface GoalFilter {
  status?: 'all' | 'active' | 'completed';
  category?: Category | 'all';
  type?: GoalType | 'all';
  sortBy?: 'dueDate' | 'progress' | 'title' | 'category';
  sortOrder?: 'asc' | 'desc';
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
