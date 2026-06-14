'use client';
import { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import useAppStore from '@/store/useAppStore';
import styles from './Toast.module.css';

const ICONS = {
  success: CheckCircle2,
  warning: AlertTriangle,
  error: AlertTriangle,
  info: Info,
};

const ToastItem = ({ toast, onRemove }) => {
  useEffect(() => {
    if (toast.duration) {
      const timer = setTimeout(() => onRemove(toast.id), toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast, onRemove]);

  const Icon = ICONS[toast.type] || ICONS.info;

  return (
    <div className={`${styles.toast} ${styles[toast.type]}`}>
      <Icon size={16} className={styles.icon} />
      <p className={styles.message}>{toast.message}</p>
      <button className={styles.close} onClick={() => onRemove(toast.id)}>
        <X size={14} />
      </button>
    </div>
  );
};

const ToastContainer = () => {
  const toasts = useAppStore((s) => s.toasts);
  const removeToast = useAppStore((s) => s.removeToast);

  if (toasts.length === 0) return null;

  return (
    <div className={styles.container}>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
};

export default ToastContainer;
