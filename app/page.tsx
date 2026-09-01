'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STORAGE_KEY = 'red-button-count';

export default function Home() {
  const [count, setCount] = useState(0);
  const [pressed, setPressed] = useState(false);
  const wakeLock = useRef<WakeLockSentinel | null>(null);
  const spaceHeld = useRef(false);

  const keepScreenAwake = useCallback(async () => {
    if (!('wakeLock' in navigator) || document.visibilityState !== 'visible') return;
    try {
      wakeLock.current = await navigator.wakeLock.request('screen');
    } catch {
      // Some browsers only allow this after a direct user interaction.
    }
  }, []);

  const increment = useCallback(() => {
    setCount((current) => {
      const next = current + 1;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
    void keepScreenAwake();
  }, [keepScreenAwake]);

  const reset = useCallback(() => {
    setCount(0);
    localStorage.setItem(STORAGE_KEY, '0');
  }, []);

  useEffect(() => {
    const saved = Number.parseInt(localStorage.getItem(STORAGE_KEY) ?? '0', 10);
    if (Number.isFinite(saved) && saved >= 0) setCount(saved);
    if ('serviceWorker' in navigator) void navigator.serviceWorker.register('/sw.js');
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault();
        if (spaceHeld.current) return;
        spaceHeld.current = true;
        setPressed(true);
        increment();
      }
      if (event.key === 'Escape') {
        event.preventDefault();
        reset();
      }
    };
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.code !== 'Space') return;
      event.preventDefault();
      spaceHeld.current = false;
      setPressed(false);
    };
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible' && wakeLock.current) void keepScreenAwake();
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      void wakeLock.current?.release();
    };
  }, [increment, keepScreenAwake, reset]);

  return (
    <main className="counter-shell">
      <header className="brand" aria-label="Red Button">
        <span className="brand-dot" aria-hidden="true" />
        <span>RED BUTTON</span>
      </header>

      <section className="counter-stage" aria-labelledby="counter-value">
        <p className="eyebrow">CURRENT COUNT</p>
        <output id="counter-value" className="count" aria-live="polite" aria-atomic="true">
          {count.toLocaleString()}
        </output>

        <button
          type="button"
          className={`big-red-button${pressed ? ' is-pressed' : ''}`}
          aria-label="숫자 하나 올리기"
          onPointerDown={() => {
            setPressed(true);
            increment();
          }}
          onPointerUp={() => setPressed(false)}
          onPointerCancel={() => setPressed(false)}
          onPointerLeave={() => setPressed(false)}
        >
          <span className="floor-shadow" aria-hidden="true" />
          <span className="mount-ring" aria-hidden="true" />
          <span className="recess" aria-hidden="true" />
          <span className="red-wall" aria-hidden="true" />
          <span className="red-cap" aria-hidden="true" />
        </button>

        <p className="hint">버튼을 누르거나 <kbd>Space</kbd></p>
      </section>

      <footer className="footer-actions">
        <Button type="button" variant="outline" size="lg" onClick={reset} className="reset-button">
          <RotateCcw aria-hidden="true" />
          초기화
        </Button>
        <span className="esc-hint"><kbd>Esc</kbd>로도 초기화</span>
      </footer>
    </main>
  );
}
