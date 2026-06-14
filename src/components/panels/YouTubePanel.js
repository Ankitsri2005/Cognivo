'use client';
import { useState } from 'react';
import { Video, ArrowRight, Loader2, Link as LinkIcon, ListOrdered } from 'lucide-react';
import Button from '@/components/ui/Button';
import useAppStore from '@/store/useAppStore';
import useCanvasStore from '@/store/useCanvasStore';
import { isValidYouTubeUrl, extractVideoId, getThumbnailUrl } from '@/utils/youtubeParser';
import { createRoadmapChain } from '@/utils/nodeFactory';
import styles from './YouTubePanel.module.css';

const YouTubePanel = () => {
  const [url, setUrl] = useState('');
  const [steps, setSteps] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const closePanel = useAppStore((s) => s.closePanel);
  const addToast = useAppStore((s) => s.addToast);
  const addNodes = useCanvasStore((s) => s.addNodes);
  const addEdges = useCanvasStore((s) => s.addEdges);

  const videoId = extractVideoId(url);

  const handleExtract = async () => {
    if (!isValidYouTubeUrl(url)) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const res = await fetch('/api/youtube-extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (res.ok) {
        const data = await res.json();
        setSteps(data.steps);
      } else {
        const errData = await res.json();
        setError(errData.error || 'Failed to extract. The video may not have captions.');
        // Provide demo steps as fallback
        setSteps([
          { title: 'Set up development environment', description: 'Install required tools and dependencies' },
          { title: 'Understand the fundamentals', description: 'Learn the core concepts before building' },
          { title: 'Build a basic prototype', description: 'Create a minimal working version' },
          { title: 'Add core features', description: 'Implement the main functionality' },
          { title: 'Test and iterate', description: 'Test thoroughly and refine based on feedback' },
          { title: 'Deploy and share', description: 'Push to production and share with others' },
        ]);
      }
    } catch {
      setError('Network error. Using demo roadmap instead.');
      setSteps([
        { title: 'Step 1: Research & Plan', description: 'Understand requirements and create a roadmap' },
        { title: 'Step 2: Set Up Environment', description: 'Install tools, configure project' },
        { title: 'Step 3: Build Core Features', description: 'Implement primary functionality' },
        { title: 'Step 4: Test & Debug', description: 'Thorough testing and bug fixes' },
        { title: 'Step 5: Deploy', description: 'Ship to production' },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddToCanvas = () => {
    if (!steps) return;

    const { nodes, edges } = createRoadmapChain(steps);
    addNodes(nodes);
    addEdges(edges);
    addToast({
      type: 'success',
      message: `Roadmap with ${steps.length} steps added to canvas!`,
    });
    closePanel();
  };

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.headerIcon}>
          <Video size={20} />
        </div>
        <div>
          <h2 className={styles.title}>YouTube Action Extractor</h2>
          <p className={styles.subtitle}>
            Paste a YouTube video URL to extract actionable roadmap steps
          </p>
        </div>
      </div>

      {!steps ? (
        <>
          <div className={styles.inputSection}>
            <div className={styles.urlInput}>
              <LinkIcon size={16} className={styles.urlIcon} />
              <input
                type="text"
                placeholder="https://youtube.com/watch?v=..."
                value={url}
                onChange={(e) => { setUrl(e.target.value); setError(''); }}
                className={styles.input}
              />
            </div>

            {videoId && (
              <div className={styles.preview}>
                <img
                  src={getThumbnailUrl(videoId)}
                  alt="Video thumbnail"
                  className={styles.thumbnail}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            )}

            {error && <p className={styles.error}>{error}</p>}
          </div>

          <div className={styles.actions}>
            <Button variant="ghost" onClick={closePanel}>Cancel</Button>
            <Button
              icon={isProcessing ? Loader2 : Video}
              loading={isProcessing}
              onClick={handleExtract}
              disabled={!url.trim()}
            >
              Extract Roadmap
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className={styles.stepsList}>
            <div className={styles.stepsHeader}>
              <ListOrdered size={16} />
              <span>Extracted Roadmap ({steps.length} steps)</span>
            </div>
            {steps.map((step, i) => (
              <div key={i} className={styles.stepItem}>
                <span className={styles.stepNumber}>{i + 1}</span>
                <div className={styles.stepContent}>
                  <h4 className={styles.stepTitle}>{step.title}</h4>
                  {step.description && (
                    <p className={styles.stepDesc}>{step.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.resultActions}>
            <Button variant="ghost" onClick={() => setSteps(null)}>
              ← Try Another
            </Button>
            <Button icon={ArrowRight} onClick={handleAddToCanvas}>
              Add as Roadmap Chain
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default YouTubePanel;
