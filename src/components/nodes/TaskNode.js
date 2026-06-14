'use client';
import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { CheckSquare, Calendar, AlertTriangle, Check } from 'lucide-react';
import { getQuadrantInfo } from '@/utils/eisenhower';
import styles from './TaskNode.module.css';

const TaskNode = ({ data, selected }) => {
  const quadrantInfo = data.quadrant ? getQuadrantInfo(data.quadrant) : null;
  const isOverdue = data.deadline && new Date(data.deadline) < new Date() && !data.completed;

  return (
    <div className={`${styles.node} ${selected ? styles.selected : ''} ${data.completed ? styles.completed : ''}`}>
      <Handle type="target" position={Position.Top} className={styles.handle} />

      <div className={styles.header}>
        <button className={`${styles.checkbox} ${data.completed ? styles.checked : ''}`}>
          {data.completed && <Check size={12} />}
        </button>
        <h4 className={styles.title}>{data.label}</h4>
        {data.priority && (
          <span className={`${styles.dot} ${styles[`dot${data.priority}`]}`} title={data.priority} />
        )}
      </div>

      {data.description && (
        <p className={styles.description}>{data.description}</p>
      )}

      <div className={styles.footer}>
        {data.deadline && (
          <span className={`${styles.deadline} ${isOverdue ? styles.overdue : ''}`}>
            {isOverdue && <AlertTriangle size={11} />}
            <Calendar size={11} />
            {new Date(data.deadline).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </span>
        )}
        {quadrantInfo && (
          <span className={styles.quadrant} style={{ color: quadrantInfo.color }}>
            {quadrantInfo.icon}
          </span>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className={styles.handle} />
      <Handle type="source" position={Position.Right} id="right" className={styles.handle} />
      <Handle type="target" position={Position.Left} id="left" className={styles.handle} />
    </div>
  );
};

export default memo(TaskNode);
