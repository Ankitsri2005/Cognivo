'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { Search, Bell, Menu, X, Target, CheckSquare, Flag, ArrowRight } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import useAppStore from '@/store/useAppStore';
import useCanvasStore from '@/store/useCanvasStore';
import styles from './Header.module.css';

const NODE_TYPE_META = {
  goalNode: { icon: Target, label: 'Goal', color: '#52b788' },
  taskNode: { icon: CheckSquare, label: 'Task', color: '#74c69d' },
  milestoneNode: { icon: Flag, label: 'Milestone', color: '#d4a03c' },
};

const Header = ({ title = 'Dashboard' }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const sidebarOpen = useAppStore((s) => s.sidebarOpen);
  const conflicts = useAppStore((s) => s.conflicts);
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);
  const setActivePanel = useAppStore((s) => s.setActivePanel);
  const setSelectedNodeId = useAppStore((s) => s.setSelectedNodeId);

  const searchNodes = useCanvasStore((s) => s.searchNodes);
  const focusNode = useCanvasStore((s) => s.focusNode);

  const pathname = usePathname();
  const router = useRouter();

  const handleBellClick = () => {
    setActivePanel('conflicts');
    if (pathname !== '/canvas') {
      router.push('/canvas');
    }
  };

  // Run search whenever query changes
  const handleSearch = useCallback((value) => {
    setQuery(value);
    setActiveIndex(-1);
    if (!value.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    const found = searchNodes(value);
    setResults(found.slice(0, 8)); // max 8 results
    setIsOpen(true);
  }, [searchNodes]);

  // Navigate to canvas and focus the node
  const handleSelectNode = useCallback((node) => {
    setQuery('');
    setResults([]);
    setIsOpen(false);

    // Navigate to canvas if not already there
    if (pathname !== '/canvas') {
      router.push('/canvas');
      // Allow time for canvas to mount before focusing
      setTimeout(() => {
        focusNode(node.id);
        setSelectedNodeId(node.id);
        setActivePanel('node-detail');
      }, 600);
    } else {
      focusNode(node.id);
      setSelectedNodeId(node.id);
      setActivePanel('node-detail');
    }
  }, [pathname, router, focusNode, setSelectedNodeId, setActivePanel]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen || results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      handleSelectNode(results[activeIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setQuery('');
      setResults([]);
      inputRef.current?.blur();
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !inputRef.current?.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  // Ctrl+K / Cmd+K shortcut
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
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
        {/* ── Search Bar ── */}
        <div className={styles.searchContainer}>
          <div className={`${styles.searchWrap} ${isOpen && results.length > 0 ? styles.searchActive : ''}`}>
            <Search size={15} className={styles.searchIcon} />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search nodes…"
              className={styles.searchInput}
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => { if (results.length > 0) setIsOpen(true); }}
              onKeyDown={handleKeyDown}
              aria-label="Search nodes"
              aria-autocomplete="list"
              aria-expanded={isOpen}
              id="node-search-input"
            />
            {query ? (
              <button className={styles.clearBtn} onClick={clearSearch} title="Clear search">
                <X size={13} />
              </button>
            ) : (
              <kbd className={styles.kbdHint}>⌘K</kbd>
            )}
          </div>

          {/* Dropdown results */}
          {isOpen && results.length > 0 && (
            <div className={styles.searchDropdown} ref={dropdownRef}>
              <div className={styles.dropdownHeader}>
                <span>{results.length} node{results.length !== 1 ? 's' : ''} found</span>
              </div>
              {results.map((node, idx) => {
                const meta = NODE_TYPE_META[node.type] || NODE_TYPE_META.goalNode;
                const Icon = meta.icon;
                return (
                  <button
                    key={node.id}
                    className={`${styles.searchResult} ${idx === activeIndex ? styles.searchResultActive : ''}`}
                    onClick={() => handleSelectNode(node)}
                    onMouseEnter={() => setActiveIndex(idx)}
                  >
                    <div className={styles.resultIcon} style={{ color: meta.color, borderColor: `${meta.color}30`, background: `${meta.color}12` }}>
                      <Icon size={13} />
                    </div>
                    <div className={styles.resultContent}>
                      <span className={styles.resultLabel}>{node.data?.label || 'Untitled'}</span>
                      {node.data?.description && (
                        <span className={styles.resultDesc}>{node.data.description}</span>
                      )}
                    </div>
                    <div className={styles.resultMeta}>
                      <span className={styles.resultType} style={{ color: meta.color }}>{meta.label}</span>
                      {node.data?.deadline && (
                        <span className={styles.resultDeadline}>
                          {new Date(node.data.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      )}
                      <ArrowRight size={12} className={styles.resultArrow} />
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* No results */}
          {isOpen && query.trim() && results.length === 0 && (
            <div className={styles.searchDropdown} ref={dropdownRef}>
              <div className={styles.noResults}>
                <Search size={20} className={styles.noResultsIcon} />
                <span>No nodes match &quot;{query}&quot;</span>
              </div>
            </div>
          )}
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
