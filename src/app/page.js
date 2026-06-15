'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Map, Zap, Calendar, Target, CheckSquare } from 'lucide-react';
import Header from '@/components/layout/Header';
import EisenhowerMatrix from '@/components/eisenhower/EisenhowerMatrix';
import useAppStore from '@/store/useAppStore';
import useCanvasStore from '@/store/useCanvasStore';
import styles from './page.module.css';

export default function Dashboard() {
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);
  const nodes = useCanvasStore((s) => s.nodes);
  const initialized = useCanvasStore((s) => s.initialized);
  const initFromStorage = useCanvasStore((s) => s.initFromStorage);
  const setActivePanel = useAppStore((s) => s.setActivePanel);
  const router = useRouter();

  useEffect(() => {
    if (!initialized) {
      initFromStorage();
    }
  }, [initialized, initFromStorage]);

  const goalsCount = nodes.filter((n) => n.type === 'goalNode').length;
  const tasksCount = nodes.filter((n) => n.type === 'taskNode').length;
  const completedCount = nodes.filter((n) => n.data?.completed).length;

  const matrixItems = nodes
    .filter((n) => n.data?.quadrant && !n.data?.completed)
    .map((n) => ({
      text: n.data.label,
      quadrant: n.data.quadrant,
      priority: n.data.priority,
    }));

  return (
    <>
      <Header title="Dashboard" />
      <div
        className={styles.main}
        style={{ paddingLeft: sidebarOpen ? 'calc(var(--sidebar-width) + var(--space-xl))' : 'calc(var(--sidebar-collapsed) + var(--space-xl))' }}
      >
        <div className={styles.content}>
          <div className="bento-grid">
            <div className={`glass-card bento-span-4 ${styles.heroCard}`}>
              <div className={styles.heroContent}>
                <h2 className={styles.heroTitle}>
                  Your <span className="text-gradient">Cognivo</span>
                </h2>
                <p className={styles.heroSub}>
                  Map your life goals, manage tasks, and eliminate chaos with an infinite spatial canvas.
                </p>
                <div className={styles.heroActions}>
                  <Link href="/canvas" className={styles.primaryBtn}>
                    Open Canvas <ArrowRight size={16} />
                  </Link>
                  <button
                    className={styles.secondaryBtn}
                    onClick={() => {
                      setActivePanel('brain-dump');
                      router.push('/canvas');
                    }}
                  >
                    <Zap size={16} /> Smart Brain Dump
                  </button>
                </div>
              </div>
            </div>

            <div className={`glass-card glass-card-hover ${styles.statCard}`}>
              <div className={styles.statIcon} style={{ color: 'var(--green-500)', background: 'var(--primary-muted)' }}>
                <Target size={20} />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{goalsCount}</span>
                <span className={styles.statLabel}>Active Goals</span>
              </div>
            </div>

            <div className={`glass-card glass-card-hover ${styles.statCard}`}>
              <div className={styles.statIcon} style={{ color: 'var(--warning)', background: 'var(--warning-muted)' }}>
                <CheckSquare size={20} />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{tasksCount}</span>
                <span className={styles.statLabel}>Pending Tasks</span>
              </div>
            </div>

            <div className={`glass-card glass-card-hover ${styles.statCard}`}>
              <div className={styles.statIcon} style={{ color: 'var(--info)', background: 'var(--info-muted)' }}>
                <Calendar size={20} />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{completedCount}</span>
                <span className={styles.statLabel}>Completed</span>
              </div>
            </div>

            <div className={`glass-card glass-card-hover ${styles.statCard}`}>
              <div className={styles.statIcon} style={{ color: 'var(--text-primary)', background: 'var(--bg-hover)' }}>
                <Map size={20} />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{nodes.length}</span>
                <span className={styles.statLabel}>Total Nodes</span>
              </div>
            </div>

            <div className={`glass-card bento-span-4 ${styles.matrixCard}`}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Priority Matrix</h3>
                <span className={styles.cardSubtitle}>Your tasks organized by urgency and importance</span>
              </div>
              {matrixItems.length > 0 ? (
                <div className={styles.matrixWrapper}>
                  <EisenhowerMatrix items={matrixItems} />
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <p>No prioritized tasks yet.</p>
                  <button
                    className={styles.linkBtn}
                    onClick={() => {
                      setActivePanel('brain-dump');
                      router.push('/canvas');
                    }}
                  >
                    Run a Brain Dump to get started
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
