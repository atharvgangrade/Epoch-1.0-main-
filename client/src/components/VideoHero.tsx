import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    gsap?: any;
    ScrollTrigger?: any;
    Lenis?: any;
  }
}

const SETTLE_ZONE_VH = 85;
const TITLE_REVEAL_DELAY = 16;
const FRAME_COUNT = 287;

const CONFIG = {
  VIDEO_INTRO: {
    videoScrollVh: 1000,
    settleZoneVh: SETTLE_ZONE_VH,
    titleRevealDelayVh: TITLE_REVEAL_DELAY,
    get scrollLengthVh() {
      return this.videoScrollVh + this.settleZoneVh;
    },
    scrubSmoothing: 1,
    frameBasePath: `${import.meta.env.BASE_URL}frames/frame-`,
  },
};

export default function VideoHero() {
  const [preloaderPercent, setPreloaderPercent] = useState(0);
  const [preloaderStatus, setPreloaderStatus] = useState("INITIALIZING CORE ASSETS...");
  const [preloaderHidden, setPreloaderHidden] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  // Keep images array in a ref to avoid re-renders
  const imagesRef = useRef<HTMLImageElement[]>([]);

  // ── Preloader: tracks real image-load progress ────────────────────────────
  useEffect(() => {
    document.body.classList.add("is-loading");

    const statuses = [
      "INITIALIZING NEURAL CORES...",
      "CALIBRATING VIEWPORT MATRIX...",
      "BUFFERING TEMPORAL FRAMES...",
      "PRE-WARMING GSAP ENGINE...",
      "ALL SYSTEMS READY",
    ];

    let loadedCount = 0;
    let isFinished = false;

    const onFrameLoaded = () => {
      loadedCount++;
      const pct = Math.round((loadedCount / FRAME_COUNT) * 100);
      setPreloaderPercent(pct);
      const statusIdx = Math.min(
        statuses.length - 1,
        Math.floor((pct / 100) * statuses.length)
      );
      setPreloaderStatus(statuses[statusIdx]);

      if (loadedCount >= Math.floor(FRAME_COUNT * 0.8) && !isFinished) {
        isFinished = true;
        setTimeout(() => {
          setPreloaderHidden(true);
          document.body.classList.remove("is-loading");
          if (window.ScrollTrigger) window.ScrollTrigger.refresh();
          // Draw frame 0 on canvas once hidden
          const canvas = canvasRef.current;
          const img = imagesRef.current[0];
          if (canvas && img) {
            const ctx = canvas.getContext("2d");
            if (ctx) drawCover(ctx, canvas, img);
          }
        }, 350);
      }
    };

    // Preload all frames
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      const idx = i.toString().padStart(3, "0");
      img.src = `${CONFIG.VIDEO_INTRO.frameBasePath}${idx}.jpg`;
      img.onload = onFrameLoaded;
      img.onerror = onFrameLoaded; // count errors so we never hang
      imagesRef.current.push(img);
    }

    const safetyTimeout = setTimeout(() => {
      if (!isFinished) {
        isFinished = true;
        setPreloaderPercent(100);
        setPreloaderStatus("ALL SYSTEMS READY");
        setTimeout(() => {
          setPreloaderHidden(true);
          document.body.classList.remove("is-loading");
          if (window.ScrollTrigger) window.ScrollTrigger.refresh();
        }, 350);
      }
    }, 5000);

    return () => {
      clearTimeout(safetyTimeout);
      document.body.classList.remove("is-loading");
    };
  }, []);

  // ── GSAP + ScrollTrigger + Lenis ──────────────────────────────────────────
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lenisInstance: any = null;

    if (typeof window.Lenis !== "undefined" && !reduceMotion) {
      lenisInstance = new window.Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      if (window.ScrollTrigger) {
        lenisInstance.on("scroll", window.ScrollTrigger.update);
        if (window.gsap) {
          window.gsap.ticker.add((time: number) => {
            lenisInstance.raf(time * 1000);
          });
          window.gsap.ticker.lagSmoothing(0);
        }
      }
    }

    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const scrollPrompt = document.getElementById("videoScrollPrompt");
    const overlay = document.getElementById("videoContentOverlay");
    const overlayScrim = document.getElementById("videoOverlayScrim");
    const presentsCard = document.getElementById("videoPresentsCard");
    const loader = document.getElementById("videoLoader");

    if (!section || !canvas) return;

    if (loader) loader.style.display = "none";

    const currentFrame = { index: 0 };

    // Handle resize — keep canvas pixel-perfect
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const ctx = canvas.getContext("2d");
      const img = imagesRef.current[currentFrame.index];
      if (ctx && img && img.complete) drawCover(ctx, canvas, img);
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    const render = () => {
      const ctx = canvas.getContext("2d");
      const img = imagesRef.current[currentFrame.index];
      if (!ctx || !img || !img.complete) return;
      drawCover(ctx, canvas, img);
    };

    if (reduceMotion) {
      currentFrame.index = FRAME_COUNT - 1;
      render();
      section.style.height = "auto";
      if (scrollPrompt) scrollPrompt.style.display = "none";
      if (overlay) { overlay.style.opacity = "0"; overlay.style.visibility = "hidden"; }
      if (overlayScrim) overlayScrim.style.opacity = "0";
      if (presentsCard) { presentsCard.style.opacity = "1"; presentsCard.style.visibility = "visible"; }
      return;
    }

    const getScrollDistance = () => {
      const vh = window.innerHeight;
      return (CONFIG.VIDEO_INTRO.scrollLengthVh / 100) * vh;
    };

    if (window.gsap && window.ScrollTrigger) {
      window.gsap.registerPlugin(window.ScrollTrigger);

      const videoDuration = CONFIG.VIDEO_INTRO.videoScrollVh;
      const settleDuration = CONFIG.VIDEO_INTRO.settleZoneVh;
      const revealDelay = CONFIG.VIDEO_INTRO.titleRevealDelayVh;

      const tl = window.gsap.timeline({
        scrollTrigger: {
          id: "video-intro-trigger",
          trigger: section,
          start: "top top",
          end: () => `+=${getScrollDistance()}`,
          pin: true,
          pinSpacing: true,
          scrub: CONFIG.VIDEO_INTRO.scrubSmoothing,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self: any) => {
            if (scrollPrompt) {
              scrollPrompt.style.opacity = self.progress > 0.03 ? "0" : "1";
            }
          },
        },
      });

      // A. Frame scrub: frame 0 → 286 as scroll goes 0 → videoDuration
      tl.fromTo(
        currentFrame,
        { index: 0 },
        {
          index: FRAME_COUNT - 1,
          snap: "index",
          ease: "none",
          onUpdate: render,
          duration: videoDuration,
        },
        0
      );

      tl.addLabel("videoComplete", videoDuration);

      // B. Fade overlay out during early scrub
      if (overlay) {
        tl.fromTo(
          overlay,
          { autoAlpha: 1, y: 0, pointerEvents: "auto" },
          { autoAlpha: 0, y: -42, pointerEvents: "none", ease: "power1.out", duration: videoDuration * 0.35 },
          videoDuration * 0.1
        );
      }

      if (overlayScrim) {
        tl.fromTo(
          overlayScrim,
          { opacity: 1 },
          { opacity: 0.1, ease: "power1.out", duration: videoDuration * 0.4 },
          videoDuration * 0.1
        );
      }

      // C. Settle zone — Epoch logo reveal
      if (presentsCard) {
        const presentsInner = presentsCard.querySelector(".presents-card-inner");
        const presentsTitleWrap = presentsCard.querySelector(".presents-title-wrap");
        const presentsScrim = presentsCard.querySelector(".presents-scrim-backdrop");
        const presentsGlow = presentsCard.querySelector(".presents-horizon-glow");
        const presentsArc = presentsCard.querySelector(".presents-horizon-arc");
        const presentsBackdrop = [presentsScrim, presentsGlow, presentsArc].filter(Boolean);

        const activeSpan = Math.max(20, settleDuration - revealDelay);
        const entranceSpan = activeSpan * 0.38;
        const holdSpan = activeSpan * 0.37;
        const exitSpan = activeSpan * 0.25;
        const revealStart = revealDelay;
        const logoStart = revealStart + entranceSpan * 0.28;
        const logoDuration = entranceSpan * 0.78;
        const exitStart = revealStart + entranceSpan + holdSpan;
        const exitEnd = exitStart + exitSpan * 0.98;

        tl.fromTo(
          presentsCard,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: Math.min(3, revealDelay * 0.3), ease: "none" },
          `videoComplete+=${Math.max(0, revealStart - 2)}`
        );

        if (presentsScrim) {
          tl.fromTo(presentsScrim, { autoAlpha: 0 }, { autoAlpha: 1, ease: "power2.out", duration: logoDuration }, `videoComplete+=${logoStart}`);
        }
        if (presentsGlow && presentsArc) {
          tl.fromTo([presentsGlow, presentsArc], { autoAlpha: 0 }, { autoAlpha: 0.85, ease: "power2.out", duration: logoDuration }, `videoComplete+=${logoStart}`);
        }
        if (presentsTitleWrap) {
          tl.fromTo(presentsTitleWrap, { autoAlpha: 0, y: 70, scale: 0.94 }, { autoAlpha: 1, y: 0, scale: 1, ease: "power2.out", duration: logoDuration }, `videoComplete+=${logoStart}`);
        }
        if (presentsInner) {
          tl.to(presentsInner, { autoAlpha: 0, y: -20, scale: 1.02, ease: "power2.in", duration: exitSpan }, `videoComplete+=${exitStart}`);
        }
        if (presentsBackdrop.length) {
          tl.to(presentsBackdrop, { autoAlpha: 0, ease: "power2.in", duration: exitSpan }, `videoComplete+=${exitStart}`);
        }
        tl.to(presentsCard, { autoAlpha: 0, duration: Math.min(1, exitSpan * 0.1), ease: "none" }, `videoComplete+=${exitEnd}`);

        // Black end-scrim
        const endBlack = document.getElementById("videoEndBlack");
        if (endBlack) {
          tl.fromTo(
            endBlack,
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: exitSpan * 0.9, ease: "power2.inOut" },
            `videoComplete+=${exitStart}`
          );
        }
      }

      window.ScrollTrigger.refresh();
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      if (lenisInstance) lenisInstance.destroy();
      if (window.ScrollTrigger) {
        window.ScrollTrigger.getAll().forEach((t: any) => t.kill());
      }
    };
  }, []);

  return (
    <>
      {/* 1. Preloader */}
      <div
        className={`preloader-overlay ${preloaderHidden ? "hidden" : ""}`}
        id="sitePreloader"
        aria-live="polite"
        aria-label="Loading Epoch 1.0"
      >
        <div className="preloader-inner">
          <div className="preloader-logo">
            <svg width="44" height="44" viewBox="0 0 26 26" fill="none">
              <path d="M9 5L3 13L9 21" stroke="#3dff8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M17 5L23 13L17 21" stroke="#3dff8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="13" cy="13" r="2.4" fill="#3dff8a" />
            </svg>
          </div>
          <div className="preloader-system-title">CODEAI // INITIALIZING EPOCH 1.0</div>
          <div className="preloader-percent" id="preloaderPercent">{preloaderPercent}%</div>
          <div className="preloader-bar-track" aria-hidden="true">
            <div className="preloader-bar-fill" id="preloaderBar" style={{ width: `${preloaderPercent}%` }} />
          </div>
          <div className="preloader-status" id="preloaderStatus">{preloaderStatus}</div>
        </div>
      </div>

      {/* 2. Fullscreen Canvas Frame Scrubber */}
      <section
        className="video-intro-section"
        id="video-intro"
        ref={sectionRef}
        aria-label="Epoch 1.0 Fullscreen Intro"
      >
        <div className="video-fullscreen-wrap" id="videoFullscreenWrap">
          {/* Canvas replaces <video> */}
          <canvas
            ref={canvasRef}
            id="heroCanvas"
            className="intro-video"
            aria-hidden="true"
            style={{ display: "block" }}
          />

          <div className="video-loader" id="videoLoader" style={{ display: "none" }}>
            <div className="loader-spinner" />
            <div>INITIALIZING TIMELINE...</div>
          </div>

          <div className="video-overlay-scrim" id="videoOverlayScrim" />

          {/* Video Overlay Content */}
          <div className="video-content-overlay" id="videoContentOverlay">
            <div className="video-overlay-inner">
              <div className="video-overlay-badge">
                <span className="dot" />
                <span>CODEAI FLAGSHIP // 8-HR SPRINT</span>
              </div>
              <h1 className="video-overlay-title">
                <span className="grad">EPOCH 1.0</span>
              </h1>
              <div className="video-overlay-tagline">
                <strong>IDEAS OUTLIVE APOCALYPSES</strong>
                <span className="sep">//</span>
                <span style={{ color: "#ffffff" }}>SAME MINDS, NEW WORLDS</span>
              </div>
            </div>
          </div>

          {/* Epoch Logo Reveal */}
          <div className="video-presents-overlay" id="videoPresentsCard" aria-label="CodeAI Presents Epoch 1.0">
            <div className="presents-scrim-backdrop" aria-hidden="true" />
            <div className="presents-horizon-glow" aria-hidden="true" />
            <div className="presents-horizon-arc" aria-hidden="true" />
            <div className="presents-card-inner">
              <div className="presents-title-wrap presents-logo-wrap">
                <img
                  src={`${import.meta.env.BASE_URL}assets/epoch-1/epoch-logo.png`}
                  alt="Epoch 1.0 Logo"
                  className="presents-logo-img"
                  id="presentsLogoImg"
                  width={1254}
                  height={1254}
                  loading="eager"
                  decoding="async"
                />
              </div>
            </div>
          </div>

          {/* Black end-scrim */}
          <div
            id="videoEndBlack"
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background: "#050705",
              opacity: 0,
              visibility: "hidden",
              pointerEvents: "none",
              zIndex: 30,
            }}
          />

          {/* Scroll cue */}
          <div className="video-scroll-prompt" id="videoScrollPrompt">
            <div className="scroll-mouse-icon" />
            <span>SCROLL TO ENTER</span>
          </div>
        </div>
      </section>
    </>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Draw image to canvas with CSS background-size: cover behaviour */
function drawCover(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  img: HTMLImageElement
) {
  const canvasRatio = canvas.width / canvas.height;
  const imgRatio = img.naturalWidth / img.naturalHeight;

  let drawWidth: number, drawHeight: number, offsetX: number, offsetY: number;

  if (canvasRatio > imgRatio) {
    drawWidth = canvas.width;
    drawHeight = canvas.width / imgRatio;
    offsetX = 0;
    offsetY = (canvas.height - drawHeight) / 2;
  } else {
    drawWidth = canvas.height * imgRatio;
    drawHeight = canvas.height;
    offsetX = (canvas.width - drawWidth) / 2;
    offsetY = 0;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
}
