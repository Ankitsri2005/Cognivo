'use client';
import styles from './EisenhowerMatrix.module.css';
import { Zap, Calendar, Users, Trash2 } from 'lucide-react';

const QUADRANTS = [
  {
    key: 'q1',
    label: 'Do First',
    subtitle: 'Urgent & Important',
    icon: Zap,
    color: '#e74c3c',
    bgColor: 'rgba(192, 57, 43, 0.08)',
    borderColor: 'rgba(192, 57, 43, 0.2)',
  },
  {
    key: 'q2',
    label: 'Schedule',
    subtitle: 'Not Urgent & Important',
    icon: Calendar,
    color: '#52b788',
    bgColor: 'rgba(45, 106, 79, 0.08)',
    borderColor: 'rgba(45, 106, 79, 0.2)',
  },
  {
    key: 'q3',
    label: 'Delegate',
    subtitle: 'Urgent & Not Important',
    icon: Users,
    color: '#d4a03c',
    bgColor: 'rgba(212, 160, 60, 0.08)',
    borderColor: 'rgba(212, 160, 60, 0.2)',
  },
  {
    key: 'q4',
    label: 'Eliminate',
    subtitle: 'Not Urgent & Not Important',
    icon: Trash2,
    color: '#6b6b6b',
    bgColor: 'rgba(107, 107, 107, 0.08)',
    borderColor: 'rgba(107, 107, 107, 0.2)',
  },
];

const EisenhowerMatrix = ({ items = [] }) => {
  const grouped = QUADRANTS.map((q) => ({
    ...q,
    items: items.filter((item) => item.quadrant === q.key),
  }));

  return (
    <div className={styles.matrix}>
      <div className={styles.axisLabels}>
        <span className={styles.axisY}>← Not Urgent | Urgent →</span>
        <span className={styles.axisX}>Important ↑</span>
      </div>
      <div className={styles.grid}>
        {grouped.map((q) => {
          const Icon = q.icon;
          return (
            <div
              key={q.key}
              className={styles.quadrant}
              style={{
                borderLeftColor: q.color,
              }}
            >
              <div className={styles.quadHeader}>
                <Icon size={16} style={{ color: q.color }} />
                <div>
                  <span className={styles.quadLabel} style={{ color: q.color }}>
                    {q.label}
                  </span>
                  <span className={styles.quadSub}>{q.subtitle}</span>
                </div>
                <span className={styles.count} style={{ color: q.color }}>
                  {q.items.length}
                </span>
              </div>
              <div className={styles.itemList}>
                {q.items.map((item, i) => (
                  <div key={i} className={styles.item}>
                    <span className={styles.itemDot} style={{ background: q.color }} />
                    <span className={styles.itemText}>{item.text}</span>
                  </div>
                ))}
                {q.items.length === 0 && (
                  <span className={styles.empty}>No items</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EisenhowerMatrix;
