'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Brain,
  LayoutDashboard,
  Map,
  Sparkles,
  Video,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
} from 'lucide-react';
import useAppStore from '@/store/useAppStore';
import styles from './Sidebar.module.css';

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/canvas', label: 'Canvas', icon: Map },
];

const ACTION_ITEMS = [
  { key: 'brain-dump', label: 'Brain Dump', icon: Sparkles, color: '#52b788' },
  { key: 'youtube', label: 'YouTube Extract', icon: Video, color: '#c0392b' },
  { key: 'conflicts', label: 'Detect Conflicts', icon: AlertTriangle, color: '#d4a03c' },
];

const Sidebar = () => {
  const pathname = usePathname();
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);
  const closeSidebar = useAppStore((s) => s.closeSidebar);
  const setActivePanel = useAppStore((s) => s.setActivePanel);
  const router = useRouter();

  useEffect(() => {
    if (window.innerWidth <= 768) {
      closeSidebar();
    }
  }, [pathname, closeSidebar]);

  const isMobile = () => typeof window !== 'undefined' && window.innerWidth <= 768;

  return (
    <>
      {sidebarOpen && (
        <div className={styles.backdrop} onClick={closeSidebar} />
      )}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : styles.collapsed}`}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <Brain size={22} />
          </div>
          {sidebarOpen && (
            <div className={styles.logoText}>
              <span className={styles.logoTitle}>Cognivo</span>
              <span className={styles.logoSub}>Visual Canvas</span>
            </div>
          )}
          {sidebarOpen && (
            <button className={styles.mobileClose} onClick={closeSidebar}>
              <X size={18} />
            </button>
          )}
        </div>

        <nav className={styles.nav}>
          <span className={styles.sectionLabel}>{sidebarOpen ? 'Navigation' : ''}</span>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                title={!sidebarOpen ? item.label : undefined}
                onClick={() => { if (isMobile()) closeSidebar(); }}
              >
                <Icon size={18} />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className={styles.actions}>
          <span className={styles.sectionLabel}>{sidebarOpen ? 'Quick Actions' : ''}</span>
          {ACTION_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                className={styles.actionItem}
                onClick={() => {
                  setActivePanel(item.key);
                  if (pathname !== '/canvas') {
                    router.push('/canvas');
                  }
                  if (isMobile()) closeSidebar();
                }}
                title={!sidebarOpen ? item.label : undefined}
              >
                <span className={styles.actionIcon} style={{ color: item.color }}>
                  <Icon size={16} />
                </span>
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </div>

        {sidebarOpen && (
          <div className={styles.addBtnWrap}>
            <Link
              href="/canvas"
              className={styles.addBtn}
              onClick={() => { if (isMobile()) closeSidebar(); }}
            >
              <Plus size={18} />
              <span>Open Canvas</span>
            </Link>
          </div>
        )}

        <button className={styles.toggle} onClick={toggleSidebar}>
          {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
