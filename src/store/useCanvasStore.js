import { create } from 'zustand';
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from 'reactflow';

const STORAGE_KEY = 'vsb-canvas-state';

// Load initial state from localStorage
const loadState = () => {
  if (typeof window === 'undefined') return { nodes: [], edges: [] };
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { nodes: parsed.nodes || [], edges: parsed.edges || [] };
    }
  } catch (e) {
    console.error('Failed to load canvas state:', e);
  }
  return { nodes: [], edges: [] };
};

// Save state to localStorage
const saveState = (nodes, edges) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ nodes, edges }));
  } catch (e) {
    console.error('Failed to save canvas state:', e);
  }
};

const useCanvasStore = create((set, get) => ({
  nodes: [],
  edges: [],
  initialized: false,

  // Initialize from localStorage (call once on mount)
  initFromStorage: () => {
    const state = loadState();
    set({ nodes: state.nodes, edges: state.edges, initialized: true });
  },

  // React Flow callbacks
  onNodesChange: (changes) => {
    set((state) => {
      const newNodes = applyNodeChanges(changes, state.nodes);
      saveState(newNodes, state.edges);
      return { nodes: newNodes };
    });
  },

  onEdgesChange: (changes) => {
    set((state) => {
      const newEdges = applyEdgeChanges(changes, state.edges);
      saveState(state.nodes, newEdges);
      return { edges: newEdges };
    });
  },

  onConnect: (connection) => {
    set((state) => {
      const newEdges = addEdge(
        {
          ...connection,
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#2d6a4f', strokeWidth: 2 },
        },
        state.edges
      );
      saveState(state.nodes, newEdges);
      return { edges: newEdges };
    });
  },

  // CRUD operations
  addNode: (node) => {
    set((state) => {
      const newNodes = [...state.nodes, node];
      saveState(newNodes, state.edges);
      return { nodes: newNodes };
    });
  },

  addNodes: (newNodesArr) => {
    set((state) => {
      const newNodes = [...state.nodes, ...newNodesArr];
      saveState(newNodes, state.edges);
      return { nodes: newNodes };
    });
  },

  addEdges: (newEdgesArr) => {
    set((state) => {
      const newEdges = [...state.edges, ...newEdgesArr];
      saveState(state.nodes, newEdges);
      return { edges: newEdges };
    });
  },

  updateNodeData: (nodeId, data) => {
    set((state) => {
      const newNodes = state.nodes.map((n) =>
        n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n
      );
      saveState(newNodes, state.edges);
      return { nodes: newNodes };
    });
  },

  deleteNode: (nodeId) => {
    set((state) => {
      const newNodes = state.nodes.filter((n) => n.id !== nodeId);
      const newEdges = state.edges.filter(
        (e) => e.source !== nodeId && e.target !== nodeId
      );
      saveState(newNodes, newEdges);
      return { nodes: newNodes, edges: newEdges };
    });
  },

  clearCanvas: () => {
    set({ nodes: [], edges: [] });
    saveState([], []);
  },

  // Get nodes with deadlines
  getNodesWithDeadlines: () => {
    return get().nodes.filter((n) => n.data?.deadline);
  },

  // Get node by id
  getNodeById: (id) => {
    return get().nodes.find((n) => n.id === id);
  },
}));

export default useCanvasStore;
