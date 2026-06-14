'use client';
import styles from './Badge.module.css';

const Badge = ({ children, variant = 'default', size = 'sm', dot = false }) => {
  return (
    <span className={`${styles.badge} ${styles[variant]} ${styles[size]}`}>
      {dot && <span className={styles.dot} />}
      {children}
    </span>
  );
};

export default Badge;
