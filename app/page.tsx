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

  const decrement = useCallback(() => {
    setCount((current) => {
      const next = Math.max(0, current - 1);
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }, []);

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
      if (event.key === 'Backspace') {
        event.preventDefault();
        if (event.repeat) return;
        decrement();
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
  }, [decrement, increment, keepScreenAwake, reset]);

  return (
    <main className="counter-shell">
      <section className="counter-stage" aria-labelledby="counter-value">
        <button
          id="counter-value"
          type="button"
          className="count"
          aria-label={`현재 숫자 ${count.toLocaleString()}. 클릭하여 하나 내리기`}
          title="클릭하여 숫자 하나 내리기"
          onClick={decrement}
        >
          {count.toLocaleString()}
        </button>

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
      </section>

      <footer className="footer-actions">
        <Button
          type="button"
          variant="outline"
          size="icon-lg"
          onClick={reset}
          className="reset-button"
          aria-label="초기화"
          title="초기화"
        >
          <RotateCcw aria-hidden="true" />
        </Button>
      </footer>
    </main>
  );
}
