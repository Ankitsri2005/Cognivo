'use client';
import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Flag, Calendar } from 'lucide-react';
import styles from './MilestoneNode.module.css';

const MilestoneNode = ({ data, selected }) => {
  return (
    <div className={`${styles.node} ${selected ? styles.selected : ''} ${data.completed ? styles.completed : ''}`}>
      <Handle type="target" position={Position.Top} className={styles.handle} />
      <Handle type="target" position={Position.Left} id="left" className={styles.handle} />

      <div className={styles.diamond}>
        <div className={styles.inner}>
          <Flag size={16} />
        </div>
      </div>

      <h4 className={styles.title}>{data.label}</h4>

      {data.deadline && (
        <span className={styles.deadline}>
          <Calendar size={10} />
          {new Date(data.deadline).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })}
        </span>
      )}

      <Handle type="source" position={Position.Bottom} className={styles.handle} />
      <Handle type="source" position={Position.Right} id="right" className={styles.handle} />
    </div>
  );
};

export default memo(MilestoneNode);
