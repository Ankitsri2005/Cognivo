import { NODE_TYPES_ENUM } from '@/constants/nodeTypes';

let nodeIdCounter = Date.now();

const generateId = () => {
  nodeIdCounter += 1;
  return `node-${nodeIdCounter}`;
};

/**
 * Create a Goal node
 */
export const createGoalNode = ({ label, description = '', deadline = '', priority = 'medium', quadrant = '', position = null }) => {
  return {
    id: generateId(),
    type: NODE_TYPES_ENUM.GOAL,
    position: position || { x: Math.random() * 600 + 100, y: Math.random() * 400 + 100 },
    data: {
      label,
      description,
      deadline,
      priority,
      quadrant,
      createdAt: new Date().toISOString(),
      completed: false,
    },
  };
};

/**
 * Create a Task node
 */
export const createTaskNode = ({ label, description = '', deadline = '', priority = 'medium', quadrant = '', position = null }) => {
  return {
    id: generateId(),
    type: NODE_TYPES_ENUM.TASK,
    position: position || { x: Math.random() * 600 + 100, y: Math.random() * 400 + 100 },
    data: {
      label,
      description,
      deadline,
      priority,
      quadrant,
      createdAt: new Date().toISOString(),
      completed: false,
    },
  };
};

/**
 * Create a Milestone node
 */
export const createMilestoneNode = ({ label, description = '', deadline = '', position = null }) => {
  return {
    id: generateId(),
    type: NODE_TYPES_ENUM.MILESTONE,
    position: position || { x: Math.random() * 600 + 100, y: Math.random() * 400 + 100 },
    data: {
      label,
      description,
      deadline,
      createdAt: new Date().toISOString(),
      completed: false,
    },
  };
};

/**
 * Create a chain of connected nodes (for YouTube roadmap)
 */
export const createRoadmapChain = (steps, startPosition = { x: 200, y: 100 }) => {
  const nodes = [];
  const edges = [];
  const verticalGap = 160;

  steps.forEach((step, i) => {
    const node = createTaskNode({
      label: step.title || step,
      description: step.description || '',
      deadline: step.deadline || '',
      priority: step.priority || 'medium',
      position: {
        x: startPosition.x,
        y: startPosition.y + i * verticalGap,
      },
    });
    nodes.push(node);

    if (i > 0) {
      edges.push({
        id: `edge-${nodes[i - 1].id}-${node.id}`,
        source: nodes[i - 1].id,
        target: node.id,
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#2d6a4f', strokeWidth: 2 },
      });
    }
  });

  return { nodes, edges };
};
