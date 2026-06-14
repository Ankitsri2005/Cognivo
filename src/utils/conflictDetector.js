/**
 * Conflict Detection Engine
 * Scans all nodes with deadlines and detects overlapping/clashing deadlines
 */

/**
 * Detect deadline conflicts between nodes
 * @param {Array} nodes - Array of canvas nodes
 * @param {number} windowDays - Number of days to consider as "conflicting" proximity
 * @returns {Array} Array of conflict objects
 */
export const detectConflicts = (nodes, windowDays = 1) => {
  const nodesWithDeadlines = nodes.filter(
    (n) => n.data?.deadline && !n.data?.completed
  );

  const conflicts = [];

  for (let i = 0; i < nodesWithDeadlines.length; i++) {
    for (let j = i + 1; j < nodesWithDeadlines.length; j++) {
      const nodeA = nodesWithDeadlines[i];
      const nodeB = nodesWithDeadlines[j];

      const dateA = new Date(nodeA.data.deadline);
      const dateB = new Date(nodeB.data.deadline);
      const diffMs = Math.abs(dateA - dateB);
      const diffDays = diffMs / (1000 * 60 * 60 * 24);

      if (diffDays <= windowDays) {
        let severity = 'low';
        if (diffDays === 0) severity = 'high';
        else if (diffDays <= 0.5) severity = 'high';
        else if (diffDays <= 1) severity = 'medium';

        conflicts.push({
          id: `conflict-${nodeA.id}-${nodeB.id}`,
          nodeA: {
            id: nodeA.id,
            label: nodeA.data.label,
            deadline: nodeA.data.deadline,
            type: nodeA.type,
          },
          nodeB: {
            id: nodeB.id,
            label: nodeB.data.label,
            deadline: nodeB.data.deadline,
            type: nodeB.type,
          },
          diffDays: Math.round(diffDays * 10) / 10,
          severity,
          message: generateConflictMessage(nodeA, nodeB, diffDays),
        });
      }
    }
  }

  // Sort by severity
  const severityOrder = { high: 0, medium: 1, low: 2 };
  conflicts.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return conflicts;
};

const generateConflictMessage = (nodeA, nodeB, diffDays) => {
  if (diffDays === 0) {
    return `"${nodeA.data.label}" and "${nodeB.data.label}" are due on the same day!`;
  }
  if (diffDays < 1) {
    return `"${nodeA.data.label}" and "${nodeB.data.label}" are due within hours of each other.`;
  }
  return `"${nodeA.data.label}" and "${nodeB.data.label}" are due within ${Math.round(diffDays)} day(s) of each other.`;
};

/**
 * Get conflict edges for React Flow visualization
 */
export const getConflictEdges = (conflicts) => {
  return conflicts
    .filter((c) => c.severity === 'high' || c.severity === 'medium')
    .map((c) => ({
      id: `conflict-edge-${c.nodeA.id}-${c.nodeB.id}`,
      source: c.nodeA.id,
      target: c.nodeB.id,
      type: 'smoothstep',
      animated: true,
      style: {
        stroke: c.severity === 'high' ? '#8a2b2b' : '#9b7a22',
        strokeWidth: 2,
        strokeDasharray: '5,5',
      },
      label: '⚠ Conflict',
      labelStyle: {
        fill: c.severity === 'high' ? '#8a2b2b' : '#9b7a22',
        fontSize: 11,
        fontWeight: 600,
      },
      labelBgStyle: {
        fill: '#1a1a1a',
        fillOpacity: 0.9,
      },
      labelBgPadding: [4, 8],
      labelBgBorderRadius: 4,
    }));
};
