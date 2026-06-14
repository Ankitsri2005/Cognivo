'use client';
import { Search, Bell } from 'lucide-react';
import useAppStore from '@/store/useAppStore';
import styles from './Header.module.css';

const Header = ({ title = 'Dashboard' }) => {
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);
  const conflicts = useAppStore((s) => s.conflicts);

  return (
    <header
      className={styles.header}
      style={{ left: sidebarOpen ? 'var(--sidebar-width)' : 'var(--sidebar-collapsed)' }}
    >
      <h1 className={styles.title}>{title}</h1>

      <div className={styles.right}>
        <div className={styles.searchWrap}>
          <Search size={15} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search nodes..."
            className={styles.searchInput}
          />
        </div>

        <button className={styles.iconBtn}>
          <Bell size={18} />
          {conflicts.length > 0 && (
            <span className={styles.badge}>{conflicts.length}</span>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
