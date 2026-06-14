'use client';
import { useState, useEffect } from 'react';
import { X, Save, Trash2, Calendar, Tag, FileText } from 'lucide-react';
import Button from '@/components/ui/Button';
import useAppStore from '@/store/useAppStore';
import useCanvasStore from '@/store/useCanvasStore';
import styles from './NodeDetailPanel.module.css';

const NodeDetailPanel = () => {
  const selectedNodeId = useAppStore((s) => s.selectedNodeId);
  const closePanel = useAppStore((s) => s.closePanel);
  const addToast = useAppStore((s) => s.addToast);
  const updateNodeData = useCanvasStore((s) => s.updateNodeData);
  const deleteNode = useCanvasStore((s) => s.deleteNode);
  const getNodeById = useCanvasStore((s) => s.getNodeById);

  const node = getNodeById(selectedNodeId);
  const [form, setForm] = useState({
    label: '',
    description: '',
    deadline: '',
    priority: 'medium',
  });

  useEffect(() => {
    if (node) {
      setForm({
        label: node.data.label || '',
        description: node.data.description || '',
        deadline: node.data.deadline || '',
        priority: node.data.priority || 'medium',
      });
    }
  }, [node]);

  if (!node) {
    return (
      <div className={styles.panel}>
        <div className={styles.empty}>
          <p>Select a node on the canvas to edit its details.</p>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    updateNodeData(selectedNodeId, form);
    addToast({ type: 'success', message: 'Node updated!' });
  };

  const handleDelete = () => {
    deleteNode(selectedNodeId);
    addToast({ type: 'info', message: 'Node deleted.' });
    closePanel();
  };

  const handleToggleComplete = () => {
    updateNodeData(selectedNodeId, { completed: !node.data.completed });
    addToast({
      type: 'success',
      message: node.data.completed ? 'Marked as incomplete.' : 'Marked as complete! 🎉',
    });
  };

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3 className={styles.title}>Edit Node</h3>
        <button className={styles.closeBtn} onClick={closePanel}>
          <X size={16} />
        </button>
      </div>

      <div className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label}>
            <Tag size={13} /> Label
          </label>
          <input
            type="text"
            value={form.label}
            onChange={(e) => setForm({ ...form, label: e.target.value })}
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            <FileText size={13} /> Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className={styles.textarea}
            rows={3}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            <Calendar size={13} /> Deadline
          </label>
          <input
            type="date"
            value={form.deadline}
            onChange={(e) => setForm({ ...form, deadline: e.target.value })}
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Priority</label>
          <div className={styles.priorityGroup}>
            {['urgent', 'high', 'medium', 'low'].map((p) => (
              <button
                key={p}
                className={`${styles.priorityBtn} ${form.priority === p ? styles.priorityActive : ''} ${styles[`prio${p}`]}`}
                onClick={() => setForm({ ...form, priority: p })}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.field}>
          <button className={styles.completeBtn} onClick={handleToggleComplete}>
            {node.data.completed ? '↩ Mark Incomplete' : '✓ Mark Complete'}
          </button>
        </div>
      </div>

      <div className={styles.actions}>
        <Button variant="danger" size="sm" icon={Trash2} onClick={handleDelete}>
          Delete
        </Button>
        <Button icon={Save} onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default NodeDetailPanel;
