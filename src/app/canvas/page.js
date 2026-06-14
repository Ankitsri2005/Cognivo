'use client';
import { Suspense } from 'react';
import Header from '@/components/layout/Header';
import CanvasWorkspace from '@/components/canvas/CanvasWorkspace';
import BrainDumpPanel from '@/components/panels/BrainDumpPanel';
import YouTubePanel from '@/components/panels/YouTubePanel';
import ConflictPanel from '@/components/panels/ConflictPanel';
import NodeDetailPanel from '@/components/panels/NodeDetailPanel';
import useAppStore from '@/store/useAppStore';
import styles from './page.module.css';

export default function CanvasPage() {
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);
  const activePanel = useAppStore((s) => s.activePanel);
  const closePanel = useAppStore((s) => s.closePanel);

  const renderPanel = () => {
    switch (activePanel) {
      case 'brain-dump': return <BrainDumpPanel />;
      case 'youtube': return <YouTubePanel />;
      case 'conflicts': return <ConflictPanel />;
      case 'node-detail': return <NodeDetailPanel />;
      default: return null;
    }
  };

  return (
    <>
      <Header title="Visual Canvas" />
      <div
        className={styles.main}
        style={{ left: sidebarOpen ? 'var(--sidebar-width)' : 'var(--sidebar-collapsed)' }}
      >
        <div className={styles.canvasContainer}>
          <Suspense fallback={<div className={styles.loading}>Loading Canvas...</div>}>
            <CanvasWorkspace />
          </Suspense>
        </div>

        {/* Side Panel Overlay */}
        <div className={`${styles.sidePanel} ${activePanel ? styles.panelOpen : ''}`}>
          {renderPanel()}
        </div>

        {/* Backdrop for mobile or smaller screens when panel is open */}
        {activePanel && (
          <div className={styles.panelBackdrop} onClick={closePanel} />
        )}
      </div>
    </>
  );
}
