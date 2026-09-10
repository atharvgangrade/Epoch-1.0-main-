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

const CONFIG = {
  VIDEO_INTRO: {
    videoScrollVh: 320,
    settleZoneVh: SETTLE_ZONE_VH,
    titleRevealDelayVh: TITLE_REVEAL_DELAY,
    get scrollLengthVh() {
      return this.videoScrollVh + this.settleZoneVh;
    },
    scrubSmoothing: 0.5,
    src: `${import.meta.env.BASE_URL}video-intro.mp4?v=2`,
  },
};

// ── Scroll-to-play tuning constants ──────────────────────────────────────────
const SCROLL_STOP_DEBOUNCE_MS = 120;
const PLAYBACK_RATE_TARGET    = 3.0;
const DELTA_THRESHOLD         = 2.5;
const RAMP_UP_MS              = 80;
const RAMP_DOWN_MS            = 120;

export default function VideoHero() {
  const [preloaderPercent, setPreloaderPercent] = useState(0);
  const [preloaderStatus, setPreloaderStatus] = useState("INITIALIZING CORE ASSETS...");
  const [preloaderHidden, setPreloaderHidden] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

  // Preloader animation (0% -> 100%)
  useEffect(() => {
    document.body.classList.add("is-loading");
    let currentPercent = 0;
    let targetPercent = 15;
    let isFinished = false;

    const video = videoRef.current;
    if (video) {
      if (video.readyState >= 1) {
        targetPercent = Math.max(targetPercent, 85);
      } else {
        const onMeta = () => {
          targetPercent = Math.max(targetPercent, 85);
        };
        video.addEventListener("loadedmetadata", onMeta, { once: true });
      }
    }

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        targetPercent = Math.max(targetPercent, 65);
      });
    }

    const statuses = [
      "INITIALIZING NEURAL CORES...",
      "CALIBRATING VIEWPORT MATRIX...",
      "BUFFERING TEMPORAL FRAMES...",
      "PRE-WARMING GSAP ENGINE...",
      "ALL SYSTEMS READY",
    ];

    const interval = setInterval(() => {
      if (currentPercent < targetPercent) {
        const step = Math.max(1, Math.floor((targetPercent - currentPercent) * 0.25));
        currentPercent = Math.min(100, currentPercent + step);
      } else if (targetPercent >= 80 && currentPercent < 100) {
        currentPercent += 2;
      } else if (targetPercent < 80) {
        targetPercent = Math.min(85, targetPercent + 2);
      }

      setPreloaderPercent(currentPercent);
      const statusIdx = Math.min(
        statuses.length - 1,
        Math.floor((currentPercent / 100) * statuses.length)
      );
      setPreloaderStatus(statuses[statusIdx]);

      if (currentPercent >= 100 && !isFinished) {
        isFinished = true;
        clearInterval(interval);
        setTimeout(() => {
          setPreloaderHidden(true);
          document.body.classList.remove("is-loading");
          if (window.ScrollTrigger) {
            window.ScrollTrigger.refresh();
          }
        }, 350);
      }
    }, 32);

    const safetyTimeout = setTimeout(() => {
      targetPercent = 100;
    }, 4500);

    return () => {
      clearInterval(interval);
      clearTimeout(safetyTimeout);
      document.body.classList.remove("is-loading");
    };
  }, []);

  // GSAP + ScrollTrigger + Lenis exact replica implementation
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
    const video = videoRef.current;
    const scrollPrompt = document.getElementById("videoScrollPrompt");
    const overlay = document.getElementById("videoContentOverlay");
    const overlayScrim = document.getElementById("videoOverlayScrim");
    const presentsCard = document.getElementById("videoPresentsCard");
    const loader = document.getElementById("videoLoader");

    if (!section || !video) return;

    let rafId: number | null = null;
    let cleanupScrollPlay: (() => void) | null = null;

    const setupTrigger = () => {
      if (loader) loader.classList.add("hidden");

      const duration = video.duration || 0;
      if (duration <= 0 || isNaN(duration)) return;

      if (reduceMotion) {
        video.currentTime = Math.max(0, duration - 0.05);
        section.style.height = "auto";
        if (scrollPrompt) scrollPrompt.style.display = "none";
        if (overlay) {
          overlay.style.opacity = "0";
          overlay.style.visibility = "hidden";
        }
        if (overlayScrim) overlayScrim.style.opacity = "0";
        if (presentsCard) {
          presentsCard.style.opacity = "1";
          presentsCard.style.visibility = "visible";
        }
        return;
      }

      // ── Scroll-to-play state ─────────────────────────────────────────────
      let currentDirection: 1 | -1 | 0 = 0;
      let stopDebounceTimer: ReturnType<typeof setTimeout> | null = null;
      let reverseRafId: number | null = null;
      let rateGsapTween: any = null;
      let reverseRate = 0;
      let reverseLastTs: number | null = null;

      const killRateTween = () => {
        if (rateGsapTween) { rateGsapTween.kill(); rateGsapTween = null; }
      };

      const stopReverseRaf = () => {
        if (reverseRafId !== null) {
          cancelAnimationFrame(reverseRafId);
          reverseRafId = null;
          reverseLastTs = null;
        }
      };

      const stopPlayback = () => {
        currentDirection = 0;
        killRateTween();
        if (!video.paused) {
          if (window.gsap) {
            rateGsapTween = window.gsap.to(video, {
              playbackRate: 0,
              duration: RAMP_DOWN_MS / 1000,
              ease: "power1.in",
              onComplete: () => { video.pause(); rateGsapTween = null; },
            });
          } else {
            video.pause();
          }
        } else if (reverseRafId !== null) {
          if (window.gsap) {
            const proxy = { rate: reverseRate };
            rateGsapTween = window.gsap.to(proxy, {
              rate: 0,
              duration: RAMP_DOWN_MS / 1000,
              ease: "power1.in",
              onUpdate: () => { reverseRate = proxy.rate; },
              onComplete: () => { stopReverseRaf(); rateGsapTween = null; },
            });
          } else {
            stopReverseRaf();
          }
        }
      };

      const startForward = () => {
        stopReverseRaf();
        killRateTween();
        reverseRate = 0;
        if (video.paused) {
          video.playbackRate = 0;
          video.play().catch(() => {});
        }
        if (window.gsap) {
          rateGsapTween = window.gsap.to(video, {
            playbackRate: PLAYBACK_RATE_TARGET,
            duration: RAMP_UP_MS / 1000,
            ease: "power1.out",
            onComplete: () => { rateGsapTween = null; },
          });
        } else {
          video.playbackRate = PLAYBACK_RATE_TARGET;
        }
      };

      const reverseRafLoop = (ts: number) => {
        if (reverseLastTs === null) {
          reverseLastTs = ts;
          reverseRafId = requestAnimationFrame(reverseRafLoop);
          return;
        }
        const deltaTime = ts - reverseLastTs;
        reverseLastTs = ts;
        const newTime = video.currentTime - (deltaTime / 1000) * reverseRate;
        if (newTime <= 0) {
          video.currentTime = 0;
          stopReverseRaf();
          currentDirection = 0;
          return;
        }
        video.currentTime = newTime;
        reverseRafId = requestAnimationFrame(reverseRafLoop);
      };

      const startReverse = () => {
        killRateTween();
        if (!video.paused) video.pause();
        reverseRate = 0;
        if (window.gsap) {
          const proxy = { rate: 0 };
          rateGsapTween = window.gsap.to(proxy, {
            rate: PLAYBACK_RATE_TARGET,
            duration: RAMP_UP_MS / 1000,
            ease: "power1.out",
            onUpdate: () => { reverseRate = proxy.rate; },
            onComplete: () => { rateGsapTween = null; },
          });
        } else {
          reverseRate = PLAYBACK_RATE_TARGET;
        }
        stopReverseRaf();
        reverseRafId = requestAnimationFrame(reverseRafLoop);
      };

      const onVideoEnded = () => { stopPlayback(); };
      video.addEventListener("ended", onVideoEnded);

      const onWheel = (e: WheelEvent) => {
        if (Math.abs(e.deltaY) < DELTA_THRESHOLD) return;

        const st = window.ScrollTrigger?.getById?.("video-intro-trigger");
        if (st) {
          if (st.progress >= 1) return;
          if (st.progress <= 0 && e.deltaY < 0) return;
        }

        const dir: 1 | -1 = e.deltaY > 0 ? 1 : -1;

        if (stopDebounceTimer !== null) clearTimeout(stopDebounceTimer);
        stopDebounceTimer = setTimeout(stopPlayback, SCROLL_STOP_DEBOUNCE_MS);

        if (dir !== currentDirection) {
          currentDirection = dir;
          if (dir === 1) {
            if (video.currentTime >= duration - 0.04) return;
            startForward();
          } else {
            if (video.currentTime <= 0) return;
            startReverse();
          }
        }
      };

      window.addEventListener("wheel", onWheel, { passive: true });

      cleanupScrollPlay = () => {
        window.removeEventListener("wheel", onWheel);
        video.removeEventListener("ended", onVideoEnded);
        if (stopDebounceTimer !== null) clearTimeout(stopDebounceTimer);
        killRateTween();
        stopReverseRaf();
      };

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

        tl.addLabel("videoComplete", videoDuration);

        if (overlay) {
          tl.fromTo(
            overlay,
            { autoAlpha: 1, y: 0, pointerEvents: "auto" },
            {
              autoAlpha: 0,
              y: -42,
              pointerEvents: "none",
              ease: "power1.out",
              duration: videoDuration * 0.35,
            },
            videoDuration * 0.1
          );
        }

        if (overlayScrim) {
          tl.fromTo(
            overlayScrim,
            { opacity: 1 },
            {
              opacity: 0.1,
              ease: "power1.out",
              duration: videoDuration * 0.4,
            },
            videoDuration * 0.1
          );
        }

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
            tl.fromTo(
              presentsScrim,
              { autoAlpha: 0 },
              { autoAlpha: 1, ease: "power2.out", duration: logoDuration },
              `videoComplete+=${logoStart}`
            );
          }

          if (presentsGlow && presentsArc) {
            tl.fromTo(
              [presentsGlow, presentsArc],
              { autoAlpha: 0 },
              { autoAlpha: 0.85, ease: "power2.out", duration: logoDuration },
              `videoComplete+=${logoStart}`
            );
          }

          if (presentsTitleWrap) {
            tl.fromTo(
              presentsTitleWrap,
              { autoAlpha: 0, y: 70, scale: 0.94 },
              { autoAlpha: 1, y: 0, scale: 1, ease: "power2.out", duration: logoDuration },
              `videoComplete+=${logoStart}`
            );
          }

          if (presentsInner) {
            tl.to(
              presentsInner,
              { autoAlpha: 0, y: -20, scale: 1.02, ease: "power2.in", duration: exitSpan },
              `videoComplete+=${exitStart}`
            );
          }

          if (presentsBackdrop.length) {
            tl.to(
              presentsBackdrop,
              { autoAlpha: 0, ease: "power2.in", duration: exitSpan },
              `videoComplete+=${exitStart}`
            );
          }

          tl.to(
            presentsCard,
            { autoAlpha: 0, duration: Math.min(1, exitSpan * 0.1), ease: "none" },
            `videoComplete+=${exitEnd}`
          );

          // Black scrim fades in as logo exits — seamless handoff to next section
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
    };

    let triggerSetupDone = false;
    const safeSetupTrigger = () => {
      if (triggerSetupDone) return;
      const duration = video.duration || 0;
      if (duration > 0 && !isNaN(duration)) {
        triggerSetupDone = true;
        setupTrigger();
      }
    };

    if (video.readyState >= 1 && video.duration > 0 && !isNaN(video.duration)) {
      safeSetupTrigger();
    } else {
      video.addEventListener("loadedmetadata", safeSetupTrigger);
      video.addEventListener("loadeddata", safeSetupTrigger);
      video.addEventListener("canplay", safeSetupTrigger);
    }

    return () => {
      if (video) {
        video.removeEventListener("loadedmetadata", safeSetupTrigger);
        video.removeEventListener("loadeddata", safeSetupTrigger);
        video.removeEventListener("canplay", safeSetupTrigger);
      }
      if (rafId) cancelAnimationFrame(rafId);
      if (cleanupScrollPlay) cleanupScrollPlay();
      if (lenisInstance) lenisInstance.destroy();
      if (window.ScrollTrigger) {
        window.ScrollTrigger.getAll().forEach((t: any) => t.kill());
      }
    };
  }, []);

  return (
    <>
      {/* 1. Preloader Screen */}
      <div
        className={`preloader-overlay ${preloaderHidden ? "hidden" : ""}`}
        id="sitePreloader"
        aria-live="polite"
        aria-label="Loading CodeAI Epoch 1.0"
      >
        <div className="preloader-inner">
          <div className="preloader-logo">
            <svg width="44" height="44" viewBox="0 0 26 26" fill="none">
              <path
                d="M9 5L3 13L9 21"
                stroke="#3dff8a"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17 5L23 13L17 21"
                stroke="#3dff8a"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="13" cy="13" r="2.4" fill="#3dff8a" />
            </svg>
          </div>
          <div className="preloader-system-title">CODEAI // INITIALIZING EPOCH 1.0</div>
          <div className="preloader-percent" id="preloaderPercent">
            {preloaderPercent}%
          </div>
          <div className="preloader-bar-track" aria-hidden="true">
            <div
              className="preloader-bar-fill"
              id="preloaderBar"
              style={{ width: `${preloaderPercent}%` }}
            />
          </div>
          <div className="preloader-status" id="preloaderStatus">
            {preloaderStatus}
          </div>
        </div>
      </div>

      {/* 2. Fullscreen Scroll-Scrubbed Video Intro */}
      <section
        className="video-intro-section"
        id="video-intro"
        ref={sectionRef}
        aria-label="Epoch 1.0 Fullscreen Video Intro"
      >
        <div className="video-fullscreen-wrap" id="videoFullscreenWrap">
          <video
            ref={videoRef}
            id="introVideo"
            className="intro-video"
            src={CONFIG.VIDEO_INTRO.src}
            muted
            playsInline
            preload="auto"
            tabIndex={-1}
            aria-hidden="true"
          >
            <source src={CONFIG.VIDEO_INTRO.src} type="video/mp4" />
          </video>

          <div className="video-loader" id="videoLoader">
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

          {/* Cinematic Title Card Overlay */}
          <div
            className="video-presents-overlay"
            id="videoPresentsCard"
            aria-label="CodeAI Presents Epoch 1.0"
          >
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

          {/* End-of-section black scrim */}
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
