// Node type registry for React Flow
export const NODE_TYPES_ENUM = {
  GOAL: 'goalNode',
  TASK: 'taskNode',
  MILESTONE: 'milestoneNode',
};

export const NODE_TYPE_CONFIG = {
  [NODE_TYPES_ENUM.GOAL]: {
    label: 'Goal',
    icon: 'Target',
    description: 'High-level life goal',
    defaultColor: '#2d6a4f',
    minWidth: 260,
    minHeight: 120,
  },
  [NODE_TYPES_ENUM.TASK]: {
    label: 'Task',
    icon: 'CheckSquare',
    description: 'Actionable sub-task',
    defaultColor: '#40916c',
    minWidth: 220,
    minHeight: 90,
  },
  [NODE_TYPES_ENUM.MILESTONE]: {
    label: 'Milestone',
    icon: 'Flag',
    description: 'Key checkpoint',
    defaultColor: '#52b788',
    minWidth: 180,
    minHeight: 80,
  },
};

export const EDGE_TYPES = {
  DEFAULT: 'smoothstep',
};

export const EISENHOWER_QUADRANTS = {
  Q1: { key: 'q1', label: 'Do First', subtitle: 'Urgent & Important', icon: 'Zap' },
  Q2: { key: 'q2', label: 'Schedule', subtitle: 'Not Urgent & Important', icon: 'Calendar' },
  Q3: { key: 'q3', label: 'Delegate', subtitle: 'Urgent & Not Important', icon: 'Users' },
  Q4: { key: 'q4', label: 'Eliminate', subtitle: 'Not Urgent & Not Important', icon: 'Trash2' },
};
