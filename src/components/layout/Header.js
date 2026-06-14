'use client';
import { Search, Bell, Menu } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import useAppStore from '@/store/useAppStore';
import styles from './Header.module.css';

const Header = ({ title = 'Dashboard' }) => {
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);
  const conflicts = useAppStore((s) => s.conflicts);
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);
  const setActivePanel = useAppStore((s) => s.setActivePanel);
  const pathname = usePathname();
  const router = useRouter();

  const handleBellClick = () => {
    setActivePanel('conflicts');
    if (pathname !== '/canvas') {
      router.push('/canvas');
    }
  };

  return (
    <header
      className={styles.header}
      style={{ left: sidebarOpen ? 'var(--sidebar-width)' : 'var(--sidebar-collapsed)' }}
    >
      <div className={styles.left}>
        <button className={styles.mobileMenuBtn} onClick={toggleSidebar}>
          <Menu size={20} />
        </button>
        <h1 className={styles.title}>{title}</h1>
      </div>

      <div className={styles.right}>
        <div className={styles.searchWrap}>
          <Search size={15} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search nodes..."
            className={styles.searchInput}
          />
        </div>

        <button className={styles.iconBtn} onClick={handleBellClick}>
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
