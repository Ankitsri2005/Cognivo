/**
 * Time Reality Check — Capacity Overload Detector
 *
 * Estimates the total hours of work planned (from existing nodes + new brain-dump tasks),
 * compares against available working hours before the nearest deadline,
 * and returns a human-readable warning when overloaded.
 */

/**
 * Estimate hours for a single task string using heuristics
 * @param {string} text - Task description
 * @returns {number} estimated hours
 */
export const estimateTaskHours = (text) => {
  const lower = text.toLowerCase();

  // Urgency / complexity signals
  const heavyKeywords = [
    'project', 'report', 'thesis', 'research', 'build', 'develop', 'implement',
    'design', 'create', 'course', 'certification', 'presentation', 'proposal',
  ];
  const mediumKeywords = [
    'study', 'prepare', 'review', 'finish', 'complete', 'read', 'write',
    'learn', 'practice', 'internship', 'assignment',
  ];
  const lightKeywords = [
    'reply', 'email', 'call', 'meeting', 'clean', 'organize', 'buy', 'schedule',
    'check', 'update', 'send', 'book',
  ];

  if (heavyKeywords.some((k) => lower.includes(k))) return 4;
  if (mediumKeywords.some((k) => lower.includes(k))) return 2;
  if (lightKeywords.some((k) => lower.includes(k))) return 0.5;

  // Default medium effort
  return 1.5;
};

/**
 * How many usable working hours exist between now and a deadline date.
 * Assumes 8 working hours per day.
 * @param {Date|null} deadline - target date, or null for "no deadline"
 * @returns {{ days: number, hours: number }}
 */
export const getAvailableHours = (deadline) => {
  const now = new Date();
  if (!deadline || isNaN(deadline.getTime())) {
    // If no deadline, assume 7 days out
    return { days: 7, hours: 56 };
  }

  const msLeft = deadline - now;
  if (msLeft <= 0) return { days: 0, hours: 0 };

  const daysLeft = msLeft / (1000 * 60 * 60 * 24);
  const usableHours = Math.max(0, daysLeft * 8);
  return { days: Math.ceil(daysLeft), hours: usableHours };
};

/**
 * Given existing canvas nodes + new brain-dump tasks,
 * find the soonest deadline and calculate whether the workload is realistic.
 *
 * @param {Array} existingNodes - canvas nodes from store
 * @param {Array} newTasks - classified tasks from brain dump [{ text, quadrant, ... }]
 * @returns {{ isOverloaded: boolean, warning: string|null, stats: Object }}
 */
export const checkCapacity = (existingNodes, newTasks) => {
  const now = new Date();

  // Collect hours from existing pending nodes
  let existingHours = 0;
  let soonestDeadline = null;

  const pendingNodes = existingNodes.filter((n) => !n.data?.completed);

  for (const node of pendingNodes) {
    existingHours += estimateTaskHours(node.data?.label || '');
    if (node.data?.deadline) {
      const d = new Date(node.data.deadline);
      if (!isNaN(d) && d > now) {
        if (!soonestDeadline || d < soonestDeadline) {
          soonestDeadline = d;
        }
      }
    }
  }

  // Collect hours from new brain-dump tasks
  let newTaskHours = 0;
  for (const task of newTasks) {
    // q1 (urgent+important) tasks get higher estimate, q4 lower
    const base = estimateTaskHours(task.text || '');
    const multiplier = task.quadrant === 'q1' ? 1.3
      : task.quadrant === 'q2' ? 1.1
      : task.quadrant === 'q4' ? 0.7
      : 1.0;
    newTaskHours += base * multiplier;
  }

  const totalHours = Math.round((existingHours + newTaskHours) * 10) / 10;
  const { days, hours: available } = getAvailableHours(soonestDeadline);

  // Build severity
  const ratio = available > 0 ? totalHours / available : Infinity;
  let severity = null; // 'ok' | 'warning' | 'danger'
  let warning = null;

  if (ratio >= 2) {
    severity = 'danger';
  } else if (ratio >= 1.25) {
    severity = 'warning';
  } else {
    severity = 'ok';
  }

  const deadlineLabel = soonestDeadline
    ? soonestDeadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : null;

  if (severity === 'danger') {
    warning = deadlineLabel
      ? `You have ~${totalHours}h of work planned but only ~${Math.round(available)}h available before ${deadlineLabel} (${days} day${days !== 1 ? 's' : ''}). This is unrealistic.`
      : `You have ~${totalHours}h of work planned. This is a heavy load — consider prioritizing.`;
  } else if (severity === 'warning') {
    warning = deadlineLabel
      ? `You have ~${totalHours}h of work planned for the next ${days} day${days !== 1 ? 's' : ''} (deadline: ${deadlineLabel}). It's tight but possible.`
      : `You have ~${totalHours}h of planned work. It's manageable, but stay focused.`;
  }

  return {
    isOverloaded: severity !== 'ok',
    severity,
    warning,
    stats: {
      totalHours,
      existingHours: Math.round(existingHours * 10) / 10,
      newTaskHours: Math.round(newTaskHours * 10) / 10,
      availableHours: Math.round(available * 10) / 10,
      daysRemaining: days,
      soonestDeadline: deadlineLabel,
      taskCount: pendingNodes.length + newTasks.length,
    },
  };
};
