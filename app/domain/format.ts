/**
 * Format utilities for Qwest Map v1.0.0
 * Centralized date formatting and other shared formatting functions
 */

// Date formatting utilities
export const formatDate = {
  // Format due date with relative terms (Today, Tomorrow, etc.)
  dueDate: (date?: Date): string => {
    if (!date) return "No due date";
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const taskDate = new Date(date);
    taskDate.setHours(0, 0, 0, 0);
    
    if (taskDate.getTime() === today.getTime()) return "Today";
    if (taskDate.getTime() === tomorrow.getTime()) return "Tomorrow";
    if (taskDate.getTime() === yesterday.getTime()) return "Yesterday";
    
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
    });
  },

  // Format time for display (12-hour format)
  time: (time: string): string => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${period}`;
  },

  // Format date for input fields (YYYY-MM-DD)
  inputDate: (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  },

  // Format date range
  dateRange: (startDate: Date, endDate: Date): string => {
    const start = formatDate.dueDate(startDate);
    const end = formatDate.dueDate(endDate);
    
    if (start === end) return start;
    return `${start} - ${end}`;
  },

  // Format relative time (e.g., "2 hours ago", "in 3 days")
  relative: (date: Date): string => {
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.ceil(diffMs / (1000 * 60));

    if (Math.abs(diffMinutes) < 60) {
      if (diffMinutes > 0) return `in ${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''}`;
      return `${Math.abs(diffMinutes)} minute${Math.abs(diffMinutes) !== 1 ? 's' : ''} ago`;
    }

    if (Math.abs(diffHours) < 24) {
      if (diffHours > 0) return `in ${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
      return `${Math.abs(diffHours)} hour${Math.abs(diffHours) !== 1 ? 's' : ''} ago`;
    }

    if (diffDays > 0) return `in ${diffDays} day${diffDays !== 1 ? 's' : ''}`;
    return `${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''} ago`;
  },

  // Format timestamp for notifications
  timestamp: (date: Date): string => {
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  },
};

// Number formatting utilities
export const formatNumber = {
  // Format XP with commas
  xp: (xp: number): string => {
    return xp.toLocaleString();
  },

  // Format percentage
  percentage: (value: number, decimals: number = 0): string => {
    return `${value.toFixed(decimals)}%`;
  },

  // Format currency (for financial goals)
  currency: (amount: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  },

  // Format large numbers with K, M suffixes
  compact: (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  },

  // Format ordinal numbers (1st, 2nd, 3rd, etc.)
  ordinal: (num: number): string => {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const value = num % 100;
    return num + (suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0]);
  },
};

// Text formatting utilities
export const formatText = {
  // Capitalize first letter
  capitalize: (text: string): string => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  },

  // Convert to title case
  titleCase: (text: string): string => {
    return text.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  },

  // Truncate text with ellipsis
  truncate: (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - 3) + '...';
  },

  // Format category name for display
  category: (category: string): string => {
    return formatText.titleCase(category.replace(/[_-]/g, ' '));
  },

  // Format goal type for display
  goalType: (type: string): string => {
    return formatText.titleCase(type);
  },

  // Format priority for display
  priority: (priority: string): string => {
    return formatText.titleCase(priority);
  },

  // Format difficulty for display
  difficulty: (difficulty: string): string => {
    return difficulty; // Already properly formatted
  },
};

// Duration formatting utilities
export const formatDuration = {
  // Format duration in minutes to human readable
  minutes: (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} min${minutes !== 1 ? 's' : ''}`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
      return `${hours} hour${hours !== 1 ? 's' : ''}`;
    }
    
    return `${hours}h ${remainingMinutes}m`;
  },

  // Format streak duration
  streak: (days: number): string => {
    if (days === 0) return 'No streak';
    if (days === 1) return '1 day streak';
    if (days < 7) return `${days} day streak`;
    
    const weeks = Math.floor(days / 7);
    const remainingDays = days % 7;
    
    if (remainingDays === 0) {
      return `${weeks} week${weeks !== 1 ? 's' : ''} streak`;
    }
    
    return `${weeks}w ${remainingDays}d streak`;
  },

  // Format time until deadline
  timeUntil: (date: Date): string => {
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    
    if (diffMs < 0) return 'Overdue';
    
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
    
    if (diffDays > 1) return `${diffDays} days left`;
    if (diffHours > 1) return `${diffHours} hours left`;
    
    return 'Due soon';
  },
};

// Progress formatting utilities
export const formatProgress = {
  // Format progress with completed/total format
  fraction: (completed: number, total: number): string => {
    return `${completed}/${total}`;
  },

  // Format progress bar label
  label: (current: number, target: number, unit?: string): string => {
    const unitStr = unit ? ` ${unit}` : '';
    return `${current}${unitStr} of ${target}${unitStr}`;
  },

  // Format completion status
  status: (completed: boolean, progress?: number): string => {
    if (completed) return 'Completed';
    if (progress !== undefined && progress > 0) return 'In Progress';
    return 'Not Started';
  },
};

// Validation utilities
export const validate = {
  // Check if date is overdue
  isOverdue: (date?: Date): boolean => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDate = new Date(date);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate < today;
  },

  // Check if date is today
  isToday: (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  },

  // Check if date is this week
  isThisWeek: (date: Date): boolean => {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));
    return date >= startOfWeek && date <= endOfWeek;
  },

  // Check if string is valid email
  isEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Check if string is valid URL
  isUrl: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },
};

// Utility function to get days until deadline
export const getDaysUntilDeadline = (dueDate: string): number => {
  const today = new Date();
  const deadline = new Date(dueDate);
  const diffTime = deadline.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Utility function to format days until deadline with color coding
export const formatDaysUntilDeadline = (dueDate: string): { text: string; color: string } => {
  const days = getDaysUntilDeadline(dueDate);
  
  if (days < 0) {
    return { text: `${Math.abs(days)} days overdue`, color: 'text-red-600' };
  }
  if (days === 0) {
    return { text: 'Due today', color: 'text-orange-600' };
  }
  if (days === 1) {
    return { text: 'Due tomorrow', color: 'text-yellow-600' };
  }
  if (days <= 7) {
    return { text: `${days} days left`, color: 'text-yellow-600' };
  }
  
  return { text: `${days} days left`, color: 'text-gray-600' };
};
