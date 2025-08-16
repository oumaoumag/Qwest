/**
 * Map Algorithm for Qwest Map v1.0.0
 * Functions to derive quest nodes from live goal data and generate SVG paths
 */

import { Goal, Task, QuestNode, MapPath, Difficulty, QuestTier } from './types';
import { MAP_CONSTANTS, calculateXpReward } from './constants';

// Convert goal type to difficulty
const getGoalDifficulty = (goalType: string): Difficulty => {
  switch (goalType) {
    case 'daily':
      return 'Beginner';
    case 'weekly':
      return 'Intermediate';
    case 'monthly':
    case 'quarterly':
    case 'yearly':
      return 'Advanced';
    default:
      return 'Beginner';
  }
};

// Determine quest tier based on goal properties
const determineQuestTier = (goal: Goal): QuestTier => {
  if (goal.isUltimateGoal) return 'epic';
  if (goal.questTier) return goal.questTier;

  // Auto-determine based on goal type and target
  switch (goal.type) {
    case 'daily':
      return goal.target <= 1 ? 'micro' : 'shorter';
    case 'weekly':
      return 'short';
    case 'monthly':
      return 'long';
    case 'quarterly':
    case 'yearly':
      return 'longer';
    default:
      return 'short';
  }
};

// Calculate epic winding path position for quest nodes
const calculateEpicPathPosition = (index: number, totalNodes: number, questTier: QuestTier): { x: number; y: number } => {
  const pathWidth = 800; // Total width of the path area
  const pathHeight = 600; // Total height of the path area

  // Create a winding S-curve path
  const progress = index / Math.max(totalNodes - 1, 1); // 0 to 1

  // S-curve formula for winding path
  const x = pathWidth * progress + 100; // Linear progression with padding
  const waveAmplitude = questTier === 'epic' ? 150 : 100; // Ultimate goals have bigger waves
  const frequency = 2; // Number of S-curves
  const y = pathHeight / 2 + waveAmplitude * Math.sin(progress * Math.PI * frequency) + 100;

  // Add some randomness for organic feel, but keep it deterministic
  const seedX = (index * 17) % 31; // Pseudo-random but consistent
  const seedY = (index * 23) % 37;
  const jitterX = (seedX - 15) * 2; // -30 to 30
  const jitterY = (seedY - 18) * 2; // -36 to 36

  return {
    x: Math.max(50, Math.min(pathWidth + 150, x + jitterX)),
    y: Math.max(50, Math.min(pathHeight + 150, y + jitterY)),
  };
};

// Determine if a goal should be locked based on dependencies
const isGoalLocked = (goalIndex: number, goals: Goal[]): boolean => {
  if (goalIndex === 0) return false; // First goal is never locked
  
  // Check if previous goal is completed
  const previousGoal = goals[goalIndex - 1];
  return !previousGoal.completed && goals[goalIndex].progress === 0;
};

// Generate epic quest nodes from goals and tasks
export const generateQuestNodes = (goals: Goal[], tasks: Task[]): QuestNode[] => {
  // Sort goals by hierarchy: Ultimate goal first, then by quest tier and creation date
  const sortedGoals = [...goals].sort((a, b) => {
    if (a.isUltimateGoal && !b.isUltimateGoal) return -1;
    if (!a.isUltimateGoal && b.isUltimateGoal) return 1;

    const tierOrder = { epic: 0, longer: 1, long: 2, short: 3, shorter: 4, micro: 5 };
    const aTier = determineQuestTier(a);
    const bTier = determineQuestTier(b);

    if (tierOrder[aTier] !== tierOrder[bTier]) {
      return tierOrder[aTier] - tierOrder[bTier];
    }

    return a.id - b.id; // Fallback to creation order
  });

  return sortedGoals.map((goal, index) => {
    const goalTasks = tasks.filter(task => task.goalId === goal.id);
    const difficulty = getGoalDifficulty(goal.type);
    const questTier = determineQuestTier(goal);
    const locked = isGoalLocked(index, sortedGoals);
    const position = calculateEpicPathPosition(index, sortedGoals.length, questTier);

    // Calculate connections for the winding path
    const connections: number[] = [];
    if (index > 0) connections.push(sortedGoals[index - 1].id);
    if (index < sortedGoals.length - 1) connections.push(sortedGoals[index + 1].id);

    // Determine if this is a milestone (major checkpoint)
    const isMilestone = questTier === 'epic' || questTier === 'longer' ||
                       (index > 0 && index % 3 === 0); // Every 3rd quest is a milestone

    // Determine celebration level based on quest tier and completion
    const celebrationLevel = goal.completed ?
      (questTier === 'epic' ? 'epic' :
       questTier === 'longer' ? 'large' :
       questTier === 'long' ? 'medium' :
       'small') : 'none';

    const questNode: QuestNode = {
      id: goal.id,
      title: goal.title,
      category: goal.category,
      progress: goal.progress,
      completed: goal.completed,
      locked,
      difficulty,
      xp: goal.xpReward || calculateXpReward(goal.category, difficulty, goal.type),
      streak: goal.streak,
      tasks: goalTasks,
      questTier,
      isUltimateGoal: goal.isUltimateGoal || false,
      isMilestone,
      position,
      connections,
      pathSegment: Math.floor(index / 3), // Group nodes into path segments
      celebrationLevel,
    };

    return questNode;
  });
};

// Generate SVG path between two points
const generatePathBetweenPoints = (
  start: { x: number; y: number },
  end: { x: number; y: number }
): string => {
  const midX = (start.x + end.x) / 2;
  const midY = (start.y + end.y) / 2;

  // Create a curved path using quadratic bezier
  const controlX = midX + (Math.random() - 0.5) * 50; // Add some randomness
  const controlY = midY - 30; // Curve upward

  // Return the path data (currently unused but could be used for SVG paths)
  return `M ${start.x} ${start.y} Q ${controlX} ${controlY} ${end.x} ${end.y}`;
};

// Get node size for a specific quest tier
const getNodeSize = (questTier: QuestTier) => {
  return MAP_CONSTANTS.nodeSize[questTier];
};

// Generate map paths connecting quest nodes
export const generateMapPaths = (questNodes: QuestNode[]): MapPath[] => {
  const paths: MapPath[] = [];

  for (let i = 0; i < questNodes.length - 1; i++) {
    const currentNode = questNodes[i];
    const nextNode = questNodes[i + 1];
    const currentNodeSize = getNodeSize(currentNode.questTier);
    const nextNodeSize = getNodeSize(nextNode.questTier);

    // Generate path data for potential SVG rendering
    generatePathBetweenPoints(
      {
        x: currentNode.position.x + currentNodeSize.width / 2,
        y: currentNode.position.y + currentNodeSize.height / 2,
      },
      {
        x: nextNode.position.x + nextNodeSize.width / 2,
        y: nextNode.position.y + nextNodeSize.height / 2,
      }
    );

    paths.push({
      id: `path-${currentNode.id}-${nextNode.id}`,
      points: [
        {
          x: currentNode.position.x + currentNodeSize.width / 2,
          y: currentNode.position.y + currentNodeSize.height / 2,
        },
        {
          x: nextNode.position.x + nextNodeSize.width / 2,
          y: nextNode.position.y + nextNodeSize.height / 2,
        },
      ],
      completed: currentNode.completed,
    });
  }

  return paths;
};

// Calculate map dimensions based on quest nodes
export const calculateMapDimensions = (questNodes: QuestNode[]): { width: number; height: number } => {
  if (questNodes.length === 0) {
    return { width: 400, height: 300 };
  }

  const maxX = Math.max(...questNodes.map(node => {
    const nodeSize = getNodeSize(node.questTier);
    return node.position.x + nodeSize.width;
  }));
  const maxY = Math.max(...questNodes.map(node => {
    const nodeSize = getNodeSize(node.questTier);
    return node.position.y + nodeSize.height;
  }));

  return {
    width: maxX + 100, // Add padding
    height: maxY + 100, // Add padding
  };
};

// Get the next available quest node
export const getNextAvailableQuest = (questNodes: QuestNode[]): QuestNode | null => {
  return questNodes.find(node => !node.completed && !node.locked) || null;
};

// Calculate overall progress percentage
export const calculateOverallProgress = (questNodes: QuestNode[]): number => {
  if (questNodes.length === 0) return 0;
  
  const totalProgress = questNodes.reduce((sum, node) => sum + node.progress, 0);
  return totalProgress / questNodes.length;
};

// Get quest nodes by status
export const getQuestNodesByStatus = (questNodes: QuestNode[]) => {
  return {
    completed: questNodes.filter(node => node.completed),
    active: questNodes.filter(node => !node.completed && !node.locked),
    locked: questNodes.filter(node => node.locked),
  };
};

// Check if a celebration should be triggered
export const shouldTriggerCelebration = (
  previousNodes: QuestNode[],
  currentNodes: QuestNode[]
): { shouldCelebrate: boolean; completedNode?: QuestNode } => {
  // Find newly completed nodes
  const previousCompleted = new Set(previousNodes.filter(n => n.completed).map(n => n.id));
  const currentCompleted = currentNodes.filter(n => n.completed);
  
  const newlyCompleted = currentCompleted.find(node => !previousCompleted.has(node.id));
  
  return {
    shouldCelebrate: !!newlyCompleted,
    completedNode: newlyCompleted,
  };
};

// Generate achievement data when a quest is completed
export const generateQuestAchievement = (questNode: QuestNode) => {
  return {
    id: Date.now(), // Simple ID generation
    title: `Quest Completed: ${questNode.title}`,
    description: `You've successfully completed the ${questNode.title} quest and earned ${questNode.xp} XP!`,
    icon: '🏆',
    unlockedAt: new Date(),
    category: questNode.category,
    xpReward: questNode.xp,
  };
};

// Sort quest nodes by priority (incomplete first, then by difficulty)
export const sortQuestNodesByPriority = (questNodes: QuestNode[]): QuestNode[] => {
  return [...questNodes].sort((a, b) => {
    // Completed nodes go to the end
    if (a.completed && !b.completed) return 1;
    if (!a.completed && b.completed) return -1;
    
    // Locked nodes go to the end among incomplete
    if (!a.completed && !b.completed) {
      if (a.locked && !b.locked) return 1;
      if (!a.locked && b.locked) return -1;
    }
    
    // Sort by difficulty (Beginner first)
    const difficultyOrder = { Beginner: 0, Intermediate: 1, Advanced: 2 };
    return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
  });
};

// Get recommended next quests
export const getRecommendedQuests = (questNodes: QuestNode[], limit: number = 3): QuestNode[] => {
  const availableQuests = questNodes.filter(node => !node.completed && !node.locked);
  const sortedQuests = sortQuestNodesByPriority(availableQuests);
  return sortedQuests.slice(0, limit);
};

// Calculate streak bonus for quest completion
export const calculateStreakBonus = (streak: number): number => {
  if (streak < 3) return 0;
  if (streak < 7) return 5;
  if (streak < 14) return 10;
  if (streak < 30) return 20;
  return 30;
};

// Update quest node progress based on task completion
export const updateQuestProgress = (questNode: QuestNode, tasks: Task[]): QuestNode => {
  const questTasks = tasks.filter(task => task.goalId === questNode.id);
  const completedTasks = questTasks.filter(task => task.completed);
  
  const progress = questTasks.length > 0 
    ? (completedTasks.length / questTasks.length) * 100 
    : questNode.progress;
  
  const completed = progress >= 100;
  
  return {
    ...questNode,
    progress,
    completed,
    tasks: questTasks,
  };
};
