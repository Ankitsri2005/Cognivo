'use client';
import { useState } from 'react';
import { Sparkles, ArrowRight, Loader2, Zap } from 'lucide-react';
import Button from '@/components/ui/Button';
import EisenhowerMatrix from '@/components/eisenhower/EisenhowerMatrix';
import useAppStore from '@/store/useAppStore';
import useCanvasStore from '@/store/useCanvasStore';
import { classifyLocally } from '@/utils/eisenhower';
import { createGoalNode } from '@/utils/nodeFactory';
import styles from './BrainDumpPanel.module.css';

const SAMPLE_TEXT = `Finish DSA course by next week - very important for placements
Submit ML project report tomorrow - urgent deadline
Start going to the gym regularly for health
Read 2 books this month on system design
Reply to club emails about event coordination
Organize my desk and clean room
Prepare for tomorrow's quiz
Learn Docker for the internship project`;

const BrainDumpPanel = () => {
  const [text, setText] = useState('');
  const [results, setResults] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [useAI, setUseAI] = useState(false);

  const closePanel = useAppStore((s) => s.closePanel);
  const addToast = useAppStore((s) => s.addToast);
  const addNodes = useCanvasStore((s) => s.addNodes);

  const handleProcess = async () => {
    if (!text.trim()) return;
    setIsProcessing(true);

    try {
      if (useAI) {
        // Try API route
        const res = await fetch('/api/brain-dump', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
        });
        if (res.ok) {
          const data = await res.json();
          setResults(data.tasks);
        } else {
          // Fallback to local
          setResults(classifyLocally(text));
        }
      } else {
        // Local classification
        setResults(classifyLocally(text));
      }
    } catch {
      // Fallback
      setResults(classifyLocally(text));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddToCanvas = () => {
    if (!results) return;

    const nodes = results.map((item, i) => {
      return createGoalNode({
        label: item.text,
        priority: item.priority || 'medium',
        quadrant: item.quadrant,
        position: {
          x: 100 + (i % 3) * 320,
          y: 100 + Math.floor(i / 3) * 200,
        },
      });
    });

    addNodes(nodes);
    addToast({ type: 'success', message: `${nodes.length} nodes added to canvas!` });
    closePanel();
  };

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.headerIcon}>
          <Sparkles size={20} />
        </div>
        <div>
          <h2 className={styles.title}>Smart Brain Dump</h2>
          <p className={styles.subtitle}>
            Paste your thoughts, and we&apos;ll sort them into the Eisenhower Matrix
          </p>
        </div>
      </div>

      {!results ? (
        <>
          <div className={styles.inputSection}>
            <textarea
              className={styles.textarea}
              placeholder="Dump your thoughts here... List your goals, tasks, deadlines — one per line or as a paragraph..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={8}
            />

            <button
              className={styles.sampleBtn}
              onClick={() => setText(SAMPLE_TEXT)}
            >
              <Zap size={12} /> Load sample text
            </button>
          </div>

          <div className={styles.options}>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={useAI}
                onChange={(e) => setUseAI(e.target.checked)}
              />
              <span className={styles.toggleTrack}>
                <span className={styles.toggleThumb} />
              </span>
              <span className={styles.toggleLabel}>Use AI Classification</span>
            </label>
            <span className={styles.hint}>
              {useAI ? 'Requires Gemini API key' : 'Uses keyword matching (no API needed)'}
            </span>
          </div>

          <div className={styles.actions}>
            <Button variant="ghost" onClick={closePanel}>Cancel</Button>
            <Button
              icon={isProcessing ? Loader2 : Sparkles}
              loading={isProcessing}
              onClick={handleProcess}
              disabled={!text.trim()}
            >
              Process Brain Dump
            </Button>
          </div>
        </>
      ) : (
        <>
          <EisenhowerMatrix items={results} />

          <div className={styles.resultActions}>
            <Button variant="ghost" onClick={() => setResults(null)}>
              ← Back to Edit
            </Button>
            <Button icon={ArrowRight} onClick={handleAddToCanvas}>
              Add {results.length} Nodes to Canvas
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default BrainDumpPanel;
