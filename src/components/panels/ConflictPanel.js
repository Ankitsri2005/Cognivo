'use client';
import { useEffect } from 'react';
import { AlertTriangle, ArrowRight, RefreshCw, Shield } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import useAppStore from '@/store/useAppStore';
import useCanvasStore from '@/store/useCanvasStore';
import { detectConflicts } from '@/utils/conflictDetector';
import styles from './ConflictPanel.module.css';

const SEVERITY_CONFIG = {
  high: { label: 'High', variant: 'danger', color: '#8a2b2b' },
  medium: { label: 'Medium', variant: 'warning', color: '#9b7a22' },
  low: { label: 'Low', variant: 'default', color: '#6b6b6b' },
};

const ConflictPanel = () => {
  const closePanel = useAppStore((s) => s.closePanel);
  const conflicts = useAppStore((s) => s.conflicts);
  const setConflicts = useAppStore((s) => s.setConflicts);
  const addToast = useAppStore((s) => s.addToast);
  const nodes = useCanvasStore((s) => s.nodes);

  const runDetection = () => {
    const detected = detectConflicts(nodes, 2);
    setConflicts(detected);
    addToast({
      type: detected.length > 0 ? 'warning' : 'success',
      message: detected.length > 0
        ? `⚠ ${detected.length} deadline conflict(s) detected!`
        : '✓ No deadline conflicts found.',
    });
  };

  useEffect(() => {
    runDetection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.headerIcon}>
          <Shield size={20} />
        </div>
        <div>
          <h2 className={styles.title}>Conflict Detection</h2>
          <p className={styles.subtitle}>
            Scanning for overlapping deadlines across your nodes
          </p>
        </div>
      </div>

      <div className={styles.summary}>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>{conflicts.length}</span>
          <span className={styles.statLabel}>Conflicts Found</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>
            {conflicts.filter((c) => c.severity === 'high').length}
          </span>
          <span className={styles.statLabel}>High Severity</span>
        </div>
        <Button variant="secondary" size="sm" icon={RefreshCw} onClick={runDetection}>
          Re-scan
        </Button>
      </div>

      {conflicts.length === 0 ? (
        <div className={styles.empty}>
          <Shield size={40} className={styles.emptyIcon} />
          <p>No deadline conflicts detected!</p>
          <span>Add deadlines to your nodes to enable conflict detection.</span>
        </div>
      ) : (
        <div className={styles.list}>
          {conflicts.map((conflict) => {
            const config = SEVERITY_CONFIG[conflict.severity];
            return (
              <div
                key={conflict.id}
                className={styles.conflictCard}
                style={{ borderLeftColor: config.color }}
              >
                <div className={styles.conflictHeader}>
                  <AlertTriangle size={14} style={{ color: config.color }} />
                  <Badge variant={config.variant} size="sm">
                    {config.label}
                  </Badge>
                  <span className={styles.diffDays}>
                    {conflict.diffDays === 0
                      ? 'Same day'
                      : `${conflict.diffDays} day(s) apart`}
                  </span>
                </div>
                <p className={styles.conflictMsg}>{conflict.message}</p>
                <div className={styles.conflictNodes}>
                  <span className={styles.nodeTag}>{conflict.nodeA.label}</span>
                  <ArrowRight size={12} className={styles.arrow} />
                  <span className={styles.nodeTag}>{conflict.nodeB.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className={styles.actions}>
        <Button variant="ghost" onClick={closePanel}>Close</Button>
      </div>
    </div>
  );
};

export default ConflictPanel;
