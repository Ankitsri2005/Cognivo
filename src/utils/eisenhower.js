/**
 * Eisenhower Matrix classification helpers
 */

/**
 * Map quadrant key to display info
 */
export const getQuadrantInfo = (quadrant) => {
  const map = {
    q1: {
      label: 'Do First',
      subtitle: 'Urgent & Important',
      color: '#e74c3c',
      bgColor: 'rgba(192, 57, 43, 0.12)',
      borderColor: 'rgba(192, 57, 43, 0.3)',
      icon: '🔥',
      priority: 'urgent',
    },
    q2: {
      label: 'Schedule',
      subtitle: 'Not Urgent & Important',
      color: '#52b788',
      bgColor: 'rgba(45, 106, 79, 0.12)',
      borderColor: 'rgba(45, 106, 79, 0.3)',
      icon: '📅',
      priority: 'high',
    },
    q3: {
      label: 'Delegate',
      subtitle: 'Urgent & Not Important',
      color: '#d4a03c',
      bgColor: 'rgba(212, 160, 60, 0.12)',
      borderColor: 'rgba(212, 160, 60, 0.3)',
      icon: '👥',
      priority: 'medium',
    },
    q4: {
      label: 'Eliminate',
      subtitle: 'Not Urgent & Not Important',
      color: '#6b6b6b',
      bgColor: 'rgba(107, 107, 107, 0.12)',
      borderColor: 'rgba(107, 107, 107, 0.3)',
      icon: '🗑️',
      priority: 'low',
    },
  };
  return map[quadrant] || map.q4;
};

/**
 * Classify text into Eisenhower quadrants using simple keyword matching (fallback when no API)
 */
export const classifyLocally = (text) => {
  const lines = text
    .split(/[\n.!?;]+/)
    .map((l) => l.trim())
    .filter((l) => l.length > 3);

  const urgentKeywords = [
    'today', 'tomorrow', 'asap', 'urgent', 'deadline', 'due',
    'overdue', 'immediately', 'right now', 'this week', 'next week',
    'submit', 'exam', 'test', 'interview',
  ];

  const importantKeywords = [
    'goal', 'career', 'learn', 'skill', 'project', 'important',
    'health', 'fitness', 'study', 'course', 'degree', 'internship',
    'research', 'thesis', 'portfolio', 'certification', 'growth',
  ];

  return lines.map((line) => {
    const lower = line.toLowerCase();
    const isUrgent = urgentKeywords.some((k) => lower.includes(k));
    const isImportant = importantKeywords.some((k) => lower.includes(k));

    let quadrant = 'q4';
    if (isUrgent && isImportant) quadrant = 'q1';
    else if (!isUrgent && isImportant) quadrant = 'q2';
    else if (isUrgent && !isImportant) quadrant = 'q3';

    return {
      text: line,
      quadrant,
      ...getQuadrantInfo(quadrant),
    };
  });
};
