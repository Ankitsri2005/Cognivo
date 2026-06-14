'use client';
import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Target, Calendar, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { getQuadrantInfo } from '@/utils/eisenhower';
import styles from './GoalNode.module.css';

const GoalNode = ({ data, selected }) => {
  const quadrantInfo = data.quadrant ? getQuadrantInfo(data.quadrant) : null;

  const getPriorityClass = () => {
    switch (data.priority) {
      case 'urgent': return styles.priorityUrgent;
      case 'high': return styles.priorityHigh;
      case 'medium': return styles.priorityMedium;
      case 'low': return styles.priorityLow;
      default: return styles.priorityMedium;
    }
  };

  const isOverdue = data.deadline && new Date(data.deadline) < new Date() && !data.completed;

  return (
    <div className={`${styles.node} ${selected ? styles.selected : ''} ${data.completed ? styles.completed : ''}`}>
      <Handle type="target" position={Position.Top} className={styles.handle} />

      <div className={styles.header}>
        <div className={styles.iconWrap}>
          {data.completed ? (
            <CheckCircle2 size={18} className={styles.checkIcon} />
          ) : (
            <Target size={18} />
          )}
        </div>
        <span className={styles.typeLabel}>Goal</span>
        {data.priority && (
          <span className={`${styles.priorityBadge} ${getPriorityClass()}`}>
            {data.priority}
          </span>
        )}
      </div>

      <h3 className={styles.title}>{data.label}</h3>

      {data.description && (
        <p className={styles.description}>{data.description}</p>
      )}

      <div className={styles.footer}>
        {data.deadline && (
          <span className={`${styles.deadline} ${isOverdue ? styles.overdue : ''}`}>
            {isOverdue && <AlertTriangle size={12} />}
            <Calendar size={12} />
            {new Date(data.deadline).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </span>
        )}
        {quadrantInfo && (
          <span
            className={styles.quadrantBadge}
            style={{
              backgroundColor: quadrantInfo.bgColor,
              borderColor: quadrantInfo.borderColor,
              color: quadrantInfo.color,
            }}
          >
            {quadrantInfo.icon} {quadrantInfo.label}
          </span>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className={styles.handle} />
      <Handle type="source" position={Position.Right} id="right" className={styles.handle} />
      <Handle type="target" position={Position.Left} id="left" className={styles.handle} />
    </div>
  );
};

export default memo(GoalNode);
