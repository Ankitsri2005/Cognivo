import { create } from 'zustand';

const useAppStore = create((set) => ({
  sidebarOpen: typeof window !== 'undefined' ? window.innerWidth > 768 : true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  closeSidebar: () => set({ sidebarOpen: false }),

  // Active panel
  activePanel: null, // 'brain-dump' | 'youtube' | 'conflicts' | 'node-detail' | null
  setActivePanel: (panel) => set({ activePanel: panel }),
  closePanel: () => set({ activePanel: null }),

  // Selected node
  selectedNodeId: null,
  setSelectedNodeId: (id) => set({ selectedNodeId: id }),

  // Toast notifications
  toasts: [],
  addToast: (toast) =>
    set((s) => ({
      toasts: [
        ...s.toasts,
        {
          id: Date.now(),
          type: 'info',
          duration: 3000,
          ...toast,
        },
      ],
    })),
  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  // Conflict state
  conflicts: [],
  setConflicts: (conflicts) => set({ conflicts }),

  // Loading states
  isBrainDumpLoading: false,
  setBrainDumpLoading: (v) => set({ isBrainDumpLoading: v }),
  isYouTubeLoading: false,
  setYouTubeLoading: (v) => set({ isYouTubeLoading: v }),
}));

export default useAppStore;
