'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';

import GoalNode from '@/components/nodes/GoalNode';
import TaskNode from '@/components/nodes/TaskNode';
import MilestoneNode from '@/components/nodes/MilestoneNode';
import Button from '@/components/ui/Button';
import useCanvasStore from '@/store/useCanvasStore';
import useAppStore from '@/store/useAppStore';
import { createGoalNode, createTaskNode, createMilestoneNode } from '@/utils/nodeFactory';
import { detectConflicts, getConflictEdges } from '@/utils/conflictDetector';
import { Target, CheckSquare, Flag, Plus } from 'lucide-react';
import styles from './CanvasWorkspace.module.css';

const nodeTypes = {
  goalNode: GoalNode,
  taskNode: TaskNode,
  milestoneNode: MilestoneNode,
};

const CanvasWorkspace = () => {
  const reactFlowWrapper = useRef(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const reactFlowInstance = useCanvasStore((s) => s.reactFlowInstance);
  const setReactFlowInstance = useCanvasStore((s) => s.setReactFlowInstance);

  const nodes = useCanvasStore((s) => s.nodes);
  const edges = useCanvasStore((s) => s.edges);
  const onNodesChange = useCanvasStore((s) => s.onNodesChange);
  const onEdgesChange = useCanvasStore((s) => s.onEdgesChange);
  const onConnect = useCanvasStore((s) => s.onConnect);
  const addNode = useCanvasStore((s) => s.addNode);
  const initFromStorage = useCanvasStore((s) => s.initFromStorage);
  const initialized = useCanvasStore((s) => s.initialized);

  const setSelectedNodeId = useAppStore((s) => s.setSelectedNodeId);
  const setActivePanel = useAppStore((s) => s.setActivePanel);
  const conflicts = useAppStore((s) => s.conflicts);
  const setConflicts = useAppStore((s) => s.setConflicts);

  useEffect(() => {
    if (!initialized) {
      initFromStorage();
    }
  }, [initialized, initFromStorage]);

  useEffect(() => {
    const detected = detectConflicts(nodes, 2);
    setConflicts(detected);
  }, [nodes, setConflicts]);

  const allEdges = [...edges, ...getConflictEdges(conflicts)];

  const onNodeClick = useCallback(
    (_, node) => {
      setSelectedNodeId(node.id);
      setActivePanel('node-detail');
    },
    [setSelectedNodeId, setActivePanel]
  );

  const handleAddNode = (type) => {
    const center = reactFlowInstance
      ? reactFlowInstance.screenToFlowPosition({
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
        })
      : { x: 300, y: 300 };

    let node;
    switch (type) {
      case 'goal':
        node = createGoalNode({
          label: 'New Goal',
          description: 'Click to edit this goal',
          position: center,
        });
        break;
      case 'task':
        node = createTaskNode({
          label: 'New Task',
          description: 'Click to edit this task',
          position: center,
        });
        break;
      case 'milestone':
        node = createMilestoneNode({
          label: 'Milestone',
          position: center,
        });
        break;
      default:
        return;
    }

    addNode(node);
    setShowAddMenu(false);
  };

  return (
    <div className={styles.wrapper} ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={allEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.1}
        maxZoom={2}
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#2d6a4f', strokeWidth: 2 },
        }}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant="dots"
          gap={20}
          size={1}
          color="rgba(255,255,255,0.05)"
        />
        <Controls
          showInteractive={false}
          position="bottom-left"
        />
        <MiniMap
          nodeStrokeColor="#2d6a4f"
          nodeColor="#1e1e1e"
          maskColor="rgba(0,0,0,0.6)"
          position="bottom-right"
        />

        {/* Floating Add Button */}
        <Panel position="top-right" className={styles.addPanel}>
          <div className={styles.addContainer}>
            <Button
              icon={Plus}
              onClick={() => setShowAddMenu(!showAddMenu)}
              className={styles.addMainBtn}
            >
              Add Node
            </Button>
            {showAddMenu && (
              <div className={styles.addMenu}>
                <button className={styles.addMenuItem} onClick={() => handleAddNode('goal')}>
                  <Target size={16} className={styles.goalIcon} />
                  <div>
                    <span className={styles.menuLabel}>Goal</span>
                    <span className={styles.menuDesc}>High-level objective</span>
                  </div>
                </button>
                <button className={styles.addMenuItem} onClick={() => handleAddNode('task')}>
                  <CheckSquare size={16} className={styles.taskIcon} />
                  <div>
                    <span className={styles.menuLabel}>Task</span>
                    <span className={styles.menuDesc}>Actionable sub-task</span>
                  </div>
                </button>
                <button className={styles.addMenuItem} onClick={() => handleAddNode('milestone')}>
                  <Flag size={16} className={styles.milestoneIcon} />
                  <div>
                    <span className={styles.menuLabel}>Milestone</span>
                    <span className={styles.menuDesc}>Key checkpoint</span>
                  </div>
                </button>
              </div>
            )}
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default CanvasWorkspace;
