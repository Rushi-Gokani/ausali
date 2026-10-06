import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './HomePackageParallax.css';

const FRAME_COUNT = 240;
const INITIAL_PRELOAD_COUNT = 24;

function clamp(value, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max);
}

function framePath(index) {
  return `/home-package-frames/frame_${String(index + 1).padStart(4, '0')}.webp`;
}

function HomePackageParallax() {
  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d', { alpha: true });

    if (!section || !pin || !canvas || !context) return undefined;

    gsap.registerPlugin(ScrollTrigger);

    const imageCache = new Array(FRAME_COUNT);
    const currentFrame = { index: 0 };
    const dimensions = { width: 0, height: 0 };
    const cleanup = {
      disposed: false,
      idleId: 0,
      preloadTimer: 0,
      raf: 0,
      resizeObserver: null
    };

    const drawFrame = () => {
      cleanup.raf = 0;

      const image = imageCache[currentFrame.index] || imageCache[0];
      if (!image || !image.complete || !image.naturalWidth) return;

      context.clearRect(0, 0, dimensions.width, dimensions.height);

      const scale = Math.min(dimensions.width / image.naturalWidth, dimensions.height / image.naturalHeight);
      const drawWidth = image.naturalWidth * scale;
      const drawHeight = image.naturalHeight * scale;
      const offsetX = (dimensions.width - drawWidth) / 2;
      const offsetY = (dimensions.height - drawHeight) / 2;

      context.imageSmoothingEnabled = scale < 1;
      context.imageSmoothingQuality = 'high';
      context.filter = 'contrast(1.18) brightness(1.18)';
      context.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
      context.filter = 'none';

      section.classList.add('is-canvas-ready');
    };

    const requestDraw = () => {
      if (cleanup.raf || cleanup.disposed) return;
      cleanup.raf = window.requestAnimationFrame(drawFrame);
    };

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 3);
      const nextWidth = Math.max(1, Math.round(rect.width));
      const nextHeight = Math.max(1, Math.round(rect.height));

      dimensions.width = nextWidth;
      dimensions.height = nextHeight;

      canvas.width = Math.round(nextWidth * dpr);
      canvas.height = Math.round(nextHeight * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      requestDraw();
    };

    const loadFrame = (index) => {
      const safeIndex = clamp(index, 0, FRAME_COUNT - 1);
      if (imageCache[safeIndex]) return imageCache[safeIndex];

      const image = new Image();
      image.decoding = 'async';

      const handleReady = () => {
        if (cleanup.disposed) return;
        if (safeIndex === currentFrame.index) requestDraw();
      };

      image.onload = handleReady;
      image.onerror = () => {
        if (safeIndex === currentFrame.index && safeIndex !== 0) {
          currentFrame.index = 0;
          requestDraw();
        }
      };
      image.src = framePath(safeIndex);
      image.decode?.().then(handleReady).catch(() => {});

      imageCache[safeIndex] = image;
      return image;
    };

    const preloadAround = (index) => {
      for (let offset = -5; offset <= 8; offset += 1) {
        const nextIndex = index + offset;
        if (nextIndex >= 0 && nextIndex < FRAME_COUNT) loadFrame(nextIndex);
      }
    };

    const scheduleProgressivePreload = () => {
      let cursor = INITIAL_PRELOAD_COUNT;

      const runBatch = (deadline) => {
        if (cleanup.disposed) return;

        let loadedInBatch = 0;
        while (
          cursor < FRAME_COUNT &&
          loadedInBatch < 10 &&
          (!deadline || deadline.timeRemaining() > 4 || deadline.didTimeout)
        ) {
          loadFrame(cursor);
          cursor += 1;
          loadedInBatch += 1;
        }

        if (cursor >= FRAME_COUNT) return;

        if ('requestIdleCallback' in window) {
          cleanup.idleId = window.requestIdleCallback(runBatch, { timeout: 500 });
        } else {
          cleanup.preloadTimer = window.setTimeout(() => runBatch(), 70);
        }
      };

      runBatch();
    };

    const updateProgress = (progress) => {
      const clampedProgress = clamp(progress);
      const nextFrame = Math.min(FRAME_COUNT - 1, Math.round(clampedProgress * (FRAME_COUNT - 1)));
      const isComplete = clampedProgress >= 0.985;

      section.style.setProperty('--package-parallax-progress', clampedProgress.toFixed(4));
      window.dispatchEvent(
        new CustomEvent('ausali:home-package-progress', {
          detail: { complete: isComplete, progress: clampedProgress }
        })
      );

      if (currentFrame.index !== nextFrame) {
        currentFrame.index = nextFrame;
        loadFrame(nextFrame);
        preloadAround(nextFrame);
        requestDraw();
      }

      if (sceneRef.current) {
        const drift = Math.sin(clampedProgress * Math.PI) * -18;
        sceneRef.current.style.transform = `translate3d(0, ${drift.toFixed(2)}px, 0)`;
      }
    };

    for (let index = 0; index < INITIAL_PRELOAD_COUNT; index += 1) {
      loadFrame(index);
    }

    resizeCanvas();
    updateProgress(0);
    loadFrame(0);

    scheduleProgressivePreload();

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let scrollTrigger = null;

    if (!reduceMotion.matches) {
      scrollTrigger = ScrollTrigger.create({
        trigger: section,
        pin,
        start: 'top top',
        end: () => `+=${Math.max(window.innerHeight * 4.2, 3200)}`,
        scrub: 0.45,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => updateProgress(self.progress),
        onRefresh: () => {
          resizeCanvas();
          updateProgress(scrollTrigger?.progress || 0);
        }
      });
    }

    if ('ResizeObserver' in window) {
      cleanup.resizeObserver = new ResizeObserver(resizeCanvas);
      cleanup.resizeObserver.observe(canvas);
    } else {
      window.addEventListener('resize', resizeCanvas);
    }

    return () => {
      cleanup.disposed = true;
      window.dispatchEvent(
        new CustomEvent('ausali:home-package-progress', {
          detail: { complete: false, progress: 0 }
        })
      );
      scrollTrigger?.kill();
      cleanup.resizeObserver?.disconnect();
      window.removeEventListener('resize', resizeCanvas);

      if (cleanup.raf) window.cancelAnimationFrame(cleanup.raf);
      if (cleanup.preloadTimer) window.clearTimeout(cleanup.preloadTimer);
      if (cleanup.idleId && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(cleanup.idleId);
      }
    };
  }, []);

  return (
    <section className="home-package-parallax" ref={sectionRef} aria-label="Home package architectural animation">
      <div className="home-package-parallax-pin" ref={pinRef}>
        <div className="home-package-scroll-copy" aria-label="Scroll to reveal the home package animation">
          <span className="home-package-scroll-kicker">SCROLL TO REVEAL</span>
          <h1>
            <span>THE BLUEPRINT</span>
            <span>THE PROCESS</span>
            <span>THE DREAM</span>
          </h1>
          <p>Move through the architectural package frame by frame.</p>
        </div>

        <div className="home-package-frame-scene" ref={sceneRef}>
          <canvas
            className="home-package-frame-canvas"
            ref={canvasRef}
            role="img"
            aria-label="Scroll controlled architectural home package frame animation"
          />
        </div>

        <div className="home-package-frame-vignette" aria-hidden="true"></div>
      </div>
    </section>
  );
}

export default HomePackageParallax;
