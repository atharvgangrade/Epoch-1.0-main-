/*
 * TVA CASEFILE NOIR — page-level composition.
 * Keep the visual system cinematic, asymmetrical, and information-led:
 * near-black substrate, radioactive green activity traces, scarce amber interventions.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import type { ComponentType, MouseEvent as ReactMouseEvent } from "react";
import VideoHero from "../components/VideoHero";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  ArrowDown,
  ArrowRight,
  Award,
  BarChart3,
  BookOpen,
  BrainCircuit,
  CalendarDays,
  Check,
  ChevronDown,
  CircleDot,
  Clock3,
  Code2,
  Compass,
  Cpu,
  Crosshair,
  Database,
  ExternalLink,
  Eye,
  Fingerprint,
  Flame,
  Globe2,
  GraduationCap,
  Layers3,
  Leaf,
  LockKeyhole,
  Mail,
  MapPin,
  Medal,
  Menu,
  Milestone,
  Network,
  Orbit,
  Radio,
  Scale,
  ShieldCheck,
  Sparkles,
  Sprout,
  Target,
  Trophy,
  Users,
  WandSparkles,
  X,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const HERO_ART = `${import.meta.env.BASE_URL}assets/epoch-1/epoch-hero-eclipse.png`;
const TRACK_ART = `${import.meta.env.BASE_URL}assets/epoch-1/epoch-track-atmosphere-v2.png`;
const TIMELINE_ART = `${import.meta.env.BASE_URL}assets/epoch-1/epoch-timeline-dusk-v2.png`;
const FOOTER_ART = `${import.meta.env.BASE_URL}assets/epoch-1/epoch-footer-eclipse-v2.png`;
const EPOCH_MARK = `${import.meta.env.BASE_URL}assets/epoch-1/epoch-mark-v2.png`;

function useReveal(threshold = 0.16) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

function ScrollReveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  body,
  index,
  accent = "green",
  align = "left",
}: {
  eyebrow: string;
  title: string;
  body?: string;
  index: string;
  accent?: "green" | "amber";
  align?: "left" | "center" | "right";
}) {
  return (
    <div className={`section-heading section-heading--${accent} section-heading--${align}`}>
      <div className="section-heading__meta">
        <span className="section-index">{index}</span>
        <span className="section-rule" />
        <span>{eyebrow}</span>
      </div>
      <h2>{title}</h2>
      {body ? <p>{body}</p> : null}
    </div>
  );
}

function Hero() {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const onMove = (event: ReactMouseEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    setPointer({
      x: ((event.clientX - bounds.left) / bounds.width - 0.5) * 2,
      y: ((event.clientY - bounds.top) / bounds.height - 0.5) * 2,
    });
  };

  return (
    <section id="top" className="hero" onMouseMove={onMove}>
      <div className="hero__art" style={{ transform: `translate3d(${pointer.x * -8}px, ${pointer.y * -5}px, 0)` }} />
      <div className="hero__wash" />
      <div className="hero__grid" />
      <div className="hero__grain" />
      <div className="hero__scanline" />
      <div className="container hero__content">
        <div className="hero__rail">
          <span className="hero__rail-dot" />
          <span>CASE FILE / 2026—10—03</span>
        </div>
        <div className="hero__copy">
          <p className="kicker hero__kicker"><span /> CodeAI Club × K. J. Somaiya Institute of Technology</p>
          <h1>
            <span className="hero__title-line">EPOCH</span>
            <span className="hero__title-line hero__title-line--accent"><i>1</i><b>.0</b></span>
          </h1>
          <div className="hero__tagline"><span className="hero__tagline-line" /> Ideas outlive apocalypses</div>
          <p className="hero__lede">An 8-hour build mission for teams turning real-world friction into working prototypes.</p>
          <div className="hero__actions">
            <a className="button button--primary" href="#apply">Apply to compete <ArrowRight size={16} /></a>
            <a className="button button--ghost" href="#tracks">View tracks <ArrowDown size={16} /></a>
          </div>
        </div>
        <div className="hero__facts" aria-label="Event facts">
          <div><span className="fact-label">When</span><strong>03 OCT 2026</strong></div>
          <div><span className="fact-label">Where</span><strong>AYURVIHAR CAMPUS</strong></div>
          <div><span className="fact-label">At stake</span><strong className="fact-accent">₹30,000 PRIZE POOL</strong></div>
        </div>
        <div className="hero__scroll-cue"><span>Scroll to enter the file</span><ArrowDown size={14} /></div>
      </div>
    </section>
  );
}

const formatSteps = [
  {
    number: "01",
    label: "Coding round 1",
    duration: "4 hrs",
    title: "Find the signal",
    description: "Understand the problem, define the MVP, and move from question to first working system.",
    bullets: ["Read the problem", "Define the MVP", "Pick your stack", "Divide roles", "Build the core"],
  },
  {
    number: "02",
    label: "Mentorship round",
    duration: "30 min",
    title: "Pressure-test the idea",
    description: "A design review inside the sprint: present the architecture, expose the blockers, and leave with a sharper plan.",
    bullets: ["Present the concept", "Surface blockers", "Validate feasibility", "Prioritize feedback", "Choose the next move"],
  },
  {
    number: "03",
    label: "Coding round 2",
    duration: "4 hrs",
    title: "Make it survive",
    description: "Implement the highest-value changes, test the edges, and prepare a demo that can hold the room.",
    bullets: ["Implement feedback", "Complete features", "Integrate components", "Test edge cases", "Polish UX + pitch"],
  },
];

function FormatStepper() {
  const [active, setActive] = useState(0);
  return (
    <div className="format-stepper">
      <div className="format-stepper__rail" aria-hidden="true"><span style={{ height: `${((active + 1) / formatSteps.length) * 100}%` }} /></div>
      <div className="format-stepper__steps">
        {formatSteps.map((step, index) => (
          <button
            className={`format-step ${active === index ? "format-step--active" : ""}`}
            type="button"
            key={step.number}
            onClick={() => setActive(index)}
            aria-expanded={active === index}
          >
            <span className="format-step__number">{step.number}</span>
            <span className="format-step__main">
              <span className="format-step__topline"><span>{step.label}</span><em>{step.duration}</em></span>
              <strong>{step.title}</strong>
              <span className="format-step__description">{step.description}</span>
              <span className="format-step__details">
                {step.bullets.map((bullet) => <span key={bullet}><Check size={13} /> {bullet}</span>)}
              </span>
            </span>
            <ChevronDown size={17} className="format-step__chevron" />
          </button>
        ))}
      </div>
    </div>
  );
}

const tracks: Array<{ title: string; character: string; description: string; icon: LucideIcon; size: string; accent?: string }> = [
  { title: "AI & Machine Learning", character: "Miss Minutes", description: "Predictive models, generative systems, and autonomous agents for finding patterns and building useful leverage.", icon: BrainCircuit, size: "" },
  { title: "Cybersecurity & Digital Trust", character: "TVA Hunters / Minutemen", description: "Threat detection, zero-trust systems, and resilient infrastructure for a more trustworthy digital layer.", icon: ShieldCheck, size: "", accent: "amber" },
  { title: "Education & Accessibility", character: "O.B. / Ouroboros", description: "Assistive technology and adaptive learning that make participation, progress, and access feel native.", icon: GraduationCap, size: "" },
  { title: "Sustainability & Environment", character: "Sylvie Laufeydottir", description: "Climate intelligence, smarter waste systems, and renewable ideas with measurable environmental value.", icon: Leaf, size: "" },
  { title: "Finance & Business", character: "Doctor Doom", description: "Fraud prevention, algorithmic markets, decentralized commerce, and enterprise systems designed to scale.", icon: Scale, size: "", accent: "gold" },
  { title: "Agriculture & Rural Innovation", character: "Thor", description: "Irrigation, soil data, and supply-chain tools that bring useful technology closer to the ground.", icon: Sprout, size: "" },
  { title: "Blockchain & Web3", character: "The Temporal Loom", description: "Smart contracts and secure decentralised infrastructure for products that need verifiable trust.", icon: Network, size: "" },
  { title: "Open Innovation", character: "God Loki / God of Stories", description: "Bring an ambitious problem, an unusual angle, and a working prototype worth passing forward.", icon: WandSparkles, size: "", accent: "amber" },
];

function TrackCard({ track, index }: { track: typeof tracks[number]; index: number }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const Icon = track.icon;
  return (
    <article
      className={`track-card ${track.size} track-card--${track.accent ?? "green"}`}
      tabIndex={0}
      aria-label={`${track.title}: ${track.description}`}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setTilt({ x: ((event.clientY - rect.top) / rect.height - 0.5) * -5, y: ((event.clientX - rect.left) / rect.width - 0.5) * 5 });
      }}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      style={{ transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
    >
      <div className="track-card__wash" />
      <div className="track-card__topline"><span>TRACK 0{index + 1}</span><Icon size={18} /></div>
      <div className="track-card__body">
        <p className="track-card__character">{track.character}</p>
        <h3>{track.title}</h3>
      </div>
      <div className="track-card__reveal">
        <span className="track-card__reveal-label">BRIEF / 0{index + 1}</span>
        <p>{track.description}</p>
        <span className="track-card__signal">Explore brief <ArrowRight size={14} /></span>
      </div>
    </article>
  );
}

const timeline = [
  ["7:00 AM", "Participant Reporting", "Arrive, settle in, and get your team aligned before the case opens."],
  ["7:30–8:00 AM", "Registration & Check-in", "Registration desk, team confirmation, and the first briefing markers."],
  ["8:00–8:30 AM", "Inauguration & Opening Ceremony", "The official start of Epoch 1.0 and the reveal of the challenge field."],
  ["8:30 AM–12:30 PM", "Coding Round 1: Ideation & Development", "Four focused hours to understand the problem and build the first MVP."],
  ["12:30–1:00 PM", "Mentorship Round", "Teams present their progress and receive feasibility, architecture, and scope feedback."],
  ["1:00–1:30 PM", "Lunch", "A short reset before the second build window."],
  ["1:30–5:30 PM", "Coding Round 2: Development & Finalisation", "Implement the most important changes, complete the core, and prepare the demo."],
  ["5:30–7:30 PM", "Submission & Evaluation", "Lock the build, submit the abstract and demo, and make the case to the judges."],
  ["7:30–8:00 PM", "Results & Prize Distribution", "The file closes. The strongest ideas move to the next epoch."],
];

function Timeline() {
  const [active, setActive] = useState(0);
  return (
    <div className="timeline-shell">
      <div className="timeline-art" style={{ backgroundImage: `url(${TIMELINE_ART})` }} />
      <div className="timeline-line" aria-hidden="true"><span style={{ height: `${((active + 1) / timeline.length) * 100}%` }} /></div>
      <div className="timeline-list">
        {timeline.map(([time, title, details], index) => (
          <button key={time} className={`timeline-item ${index === active ? "timeline-item--active" : ""}`} onClick={() => setActive(index)} type="button" aria-expanded={index === active}>
            <span className="timeline-node">{String(index + 1).padStart(2, "0")}</span>
            <span className="timeline-copy"><span className="timeline-time">{time}</span><strong>{title}</strong><span className="timeline-details">{details}</span></span>
            <ArrowRight size={16} className="timeline-arrow" />
          </button>
        ))}
      </div>
    </div>
  );
}

const evaluation: Array<[string, number, string]> = [
  ["Technical Implementation", 25, "Does the prototype work, and does its architecture support the stated goal?"],
  ["Impact & Practicality", 20, "Could the idea meaningfully help the people or system it is designed for?"],
  ["Problem Understanding & Relevance", 15, "Is the problem clearly understood and grounded in a real-world context?"],
  ["Innovation & Creativity", 15, "Does the team bring an original point of view or a fresh mechanism?"],
  ["Presentation & Demo", 15, "Can the team make the idea legible, compelling, and easy to remember?"],
  ["UX / Product Quality", 10, "Is the experience coherent, usable, and considered at the interaction level?"],
];

function EvaluationBars() {
  const [active, setActive] = useState(0);
  return (
    <div className="evaluation">
      <div className="evaluation__bars">
        {evaluation.map(([label, weight], index) => (
          <button className={`evaluation-row ${active === index ? "evaluation-row--active" : ""}`} key={label} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)} type="button">
            <span className="evaluation-row__label"><span>{label}</span><b>{weight}%</b></span>
            <span className="evaluation-row__track"><span style={{ width: `${weight * 3.6}%` }} /></span>
          </button>
        ))}
      </div>
      <div className="evaluation__note">
        <span className="evaluation__note-index">0{active + 1}</span>
        <Eye size={18} />
        <p>{evaluation[active][2]}</p>
      </div>
    </div>
  );
}

const rules = [
  "Participants must remain within college premises unless permitted by a volunteer.",
  "Bring your own laptop, charger and required devices.",
  "Projects must align with at least one specified domain and address a real-world problem.",
  "Plagiarism, pre-written code reuse and cheating are strictly prohibited.",
  "Follow all instructions from judges, faculty and volunteers.",
  "Misconduct or disrespect may result in immediate disqualification.",
  "Judges' decisions are final.",
  "Disclose use of third-party APIs, libraries, models and open-source components.",
  "Respect software licenses, data privacy and IP requirements.",
];

const faqs: Array<[string, string]> = [
  ["Who can participate?", "Eligibility and team-size details are to be confirmed by CodeAI Club. This placeholder keeps the question visible while the organizers finalize the participant brief."],
  ["What should we bring?", "Bring a laptop, charger, any required devices, and the tools you expect to use during the build."],
  ["What is the submission format?", "Submit a project abstract of a maximum of 2 pages covering the proposed solution, implementation plan or architecture, tech stack, and feasibility or scalability."],
  ["Can we use third-party tools?", "Yes, but disclose your use of APIs, libraries, models, and open-source components. Teams remain responsible for licenses, privacy, and IP requirements."],
];

function AccordionList({ items, numbered = false, hideChevron = false }: { items: Array<string | [string, string]>; numbered?: boolean; hideChevron?: boolean }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className={`accordion-list ${numbered ? "accordion-list--numbered" : ""}`}>
      {items.map((item, index) => {
        const title = typeof item === "string" ? item : item[0];
        const details = typeof item === "string" ? undefined : item[1];
        const expanded = open === index;
        return (
          <div className={`accordion-item ${expanded ? "accordion-item--open" : ""}`} key={title}>
            <button type="button" onClick={() => details ? setOpen(expanded ? null : index) : undefined} aria-expanded={expanded} style={{ cursor: details ? "pointer" : "default" }}>
              <span className="accordion-item__number">{String(index + 1).padStart(2, "0")}</span>
              <span>{title}</span>
              {!hideChevron && details ? <ChevronDown size={17} /> : null}
            </button>
            {expanded && details ? <div className="accordion-item__details"><p>{details}</p></div> : null}
          </div>
        );
      })}
    </div>
  );
}

function useCountdown(target: string) {
  const getTime = () => Math.max(0, new Date(target).getTime() - Date.now());
  const [remaining, setRemaining] = useState(getTime);
  useEffect(() => {
    const timer = window.setInterval(() => setRemaining(getTime()), 1000);
    return () => window.clearInterval(timer);
  }, [target]);
  return {
    days: Math.floor(remaining / 86400000),
    hours: Math.floor((remaining % 86400000) / 3600000),
    minutes: Math.floor((remaining % 3600000) / 60000),
    seconds: Math.floor((remaining % 60000) / 1000),
  };
}

function CountUp({ target }: { target: number }) {
  const { ref, visible } = useReveal(0.5);
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!visible) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / 1300, 1);
      setValue(Math.round(target * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, visible]);
  return <span ref={ref as React.RefObject<HTMLSpanElement>} className="count-up">₹{value.toLocaleString("en-IN")}</span>;
}

export default function Home() {
  const countdown = useCountdown("2026-10-03T07:00:00+05:30");
  const days = useMemo(() => String(countdown.days).padStart(2, "0"), [countdown.days]);
  const hours = useMemo(() => String(countdown.hours).padStart(2, "0"), [countdown.hours]);
  const minutes = useMemo(() => String(countdown.minutes).padStart(2, "0"), [countdown.minutes]);
  const seconds = useMemo(() => String(countdown.seconds).padStart(2, "0"), [countdown.seconds]);

  return (
    <div className="site-shell">
      <Header />
      <main>
        <VideoHero />

        <section className="section section--intro" id="vision">
          <div className="container intro-layout">
            <ScrollReveal className="intro-layout__side"><span className="vertical-label">THE BRIEF / 01</span><span className="vertical-line" /></ScrollReveal>
            <ScrollReveal className="intro-layout__manifesto" delay={90}>
              <SectionHeading index="01" eyebrow="The vision" title="A build day for ideas with somewhere to go" body="Epoch 1.0 is an 8-hour hackathon by the CodeAI Club, Department of Computer Engineering, KJSIT. Teams work across eight technical domains, with expert feedback built into the sprint." />
              <div className="manifesto-points">
                {["Move from problem → prototype", "Interdisciplinary problem-solving", "Time-constrained execution + mentorship", "Prove technical ability, creativity, teamwork, and execution"].map((point, index) => <div className="manifesto-point" key={point}><span>0{index + 1}</span><Check size={15} />{point}</div>)}
              </div>
            </ScrollReveal>
          </div>
        </section>

        <section className="section section--tracks" id="tracks">
          <div className="tracks-backdrop" style={{ backgroundImage: `url(${TRACK_ART})` }} />
          <div className="container">
            <ScrollReveal><SectionHeading index="02" eyebrow="The field" title="Eight domains, one open brief" body="Choose a direction, find the real problem inside it, and take the brief somewhere the organisers did not expect." align="center" /></ScrollReveal>
            <div className="tracks-grid">
              {tracks.map((track, index) => <ScrollReveal key={track.title} delay={index * 45}><TrackCard track={track} index={index} /></ScrollReveal>)}
            </div>
          </div>
        </section>

        <section className="section section--timer" id="countdown-timer">
          <div className="container timer-layout">
            <ScrollReveal className="timer-layout__info">
              <SectionHeading
                index="03"
                eyebrow="Temporal Countdown"
                title="Countdown to the first build"
                body="Track the time remaining until the inauguration at KJSIT Ayurvihar Campus. Prepare your team before the clock starts."
              />
              <div className="timer-facts">
                <div>
                  <CalendarDays size={18} />
                  <span>
                    <b style={{ color: "var(--green)" }}>3rd October 2026</b>
                    <small style={{ color: "#ffffff", opacity: 1, fontSize: "13px" }}>Official Inauguration & Sprint Start</small>
                  </span>
                </div>
                <div>
                  <Clock3 size={18} />
                  <span>
                    <b style={{ color: "var(--green)" }}>07:00 AM IST</b>
                    <small style={{ color: "#ffffff", opacity: 1, fontSize: "13px" }}>Participant Check-in & Briefing</small>
                  </span>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal className="countdown-panel" delay={120}>
              <div className="countdown-panel__header">
                <span>TIME UNTIL OPENING</span>
                <Clock3 size={17} />
              </div>
              <div className="countdown">
                <div><strong>{days}</strong><span>days</span></div>
                <i>:</i>
                <div><strong>{hours}</strong><span>hours</span></div>
                <i>:</i>
                <div><strong>{minutes}</strong><span>mins</span></div>
                <i>:</i>
                <div><strong>{seconds}</strong><span>secs</span></div>
              </div>
              <div className="countdown-panel__footer">
                <span className="live-dot" /> Case file opens at 07:00 AM IST
              </div>
            </ScrollReveal>
          </div>
        </section>

        <section className="section section--timeline" id="timeline">
          <div className="container">
            <ScrollReveal><SectionHeading index="04" eyebrow="The full-day timeline" title="The day, minute by minute" body="Follow the build from arrival to final submission. Select a time to see what that part of the day is for." align="right" /></ScrollReveal>
            <ScrollReveal className="timeline-wrap" delay={100}><Timeline /></ScrollReveal>
          </div>
        </section>

        <section className="section section--prizes" id="prizes">
          <div className="container">
            <ScrollReveal><SectionHeading index="05" eyebrow="The outcome" title="What the strongest build earns" body="The prize pool is one measure. The more lasting reward is giving the next team somewhere useful to start." align="center" /></ScrollReveal>
            <ScrollReveal className="prize-total" delay={90}><span className="prize-total__label">Total prize pool</span><CountUp target={30000} /><span className="prize-total__line" /></ScrollReveal>
            <div className="podium">
              {/* 2nd Place */}
              <ScrollReveal delay={90}>
                <div className="podium-card podium-card--second">
                  <div className="podium-card__icon-wrapper">
                    <Medal size={24} />
                  </div>
                  <span className="podium-card__label">2ND PLACE</span>
                  <strong className="podium-card__amount">₹10,000</strong>
                  <p className="podium-card__perks">+ Trophy · Certificate · Swag Kits</p>
                </div>
              </ScrollReveal>

              {/* 1st Place */}
              <ScrollReveal delay={45}>
                <div className="podium-card podium-card--first">
                  <div className="podium-card__icon-wrapper">
                    <Trophy size={28} />
                  </div>
                  <span className="podium-card__label">1ST PLACE</span>
                  <strong className="podium-card__amount">₹15,000</strong>
                  <p className="podium-card__perks">+ Trophy · Certificate · Spotlight</p>
                </div>
              </ScrollReveal>

              {/* 3rd Place */}
              <ScrollReveal delay={135}>
                <div className="podium-card podium-card--third">
                  <div className="podium-card__icon-wrapper">
                    <Award size={24} />
                  </div>
                  <span className="podium-card__label">3RD PLACE</span>
                  <strong className="podium-card__amount">₹5,000</strong>
                  <p className="podium-card__perks">+ Trophy · Certificate</p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        <section className="section section--evaluation" id="evaluation">
          <div className="container evaluation-layout">
            <ScrollReveal><SectionHeading index="06" eyebrow="The judges' lens" title="Make the value easy to see" body="The score balances what works, what matters, and how clearly the team can make its case." align="right" /></ScrollReveal>
            <ScrollReveal className="evaluation-layout__chart" delay={120}><EvaluationBars /></ScrollReveal>
          </div>
        </section>

        <section className="section section--rules" id="rules">
          <div className="container rules-layout">
            <ScrollReveal><SectionHeading index="07" eyebrow="Rules & conduct" title="A good build respects its context" body="Credit your tools, protect the room, and keep the work inside the brief." /></ScrollReveal>
            <ScrollReveal delay={100}><AccordionList items={rules} numbered hideChevron /></ScrollReveal>
          </div>
        </section>

        <section className="section section--venue" id="venue">
          <div className="container venue-layout">
            <ScrollReveal className="venue-layout__info"><SectionHeading index="08" eyebrow="Venue & date" title="One campus, one full day" body="Arrive ready to build, collaborate, and make the most of the clock." align="right" /><div className="venue-facts"><div><CalendarDays size={18} /><span><b>3rd October 2026</b><small>Saturday / all day</small></span></div><div><MapPin size={18} /><span><b>K. J. Somaiya Institute of Technology</b><small>Ayurvihar Campus</small></span></div></div></ScrollReveal>

            {/* Real-time Google Maps Card in place of the original countdown timer */}
            <ScrollReveal className="map-panel" delay={120}>
              <a
                href="https://maps.google.com/?q=K.+J.+Somaiya+Institute+of+Technology+Ayurvihar+Sion+Mumbai"
                target="_blank"
                rel="noopener noreferrer"
                className="map-panel__link"
                aria-label="Open K. J. Somaiya Institute of Technology on Google Maps"
              >
                <div className="map-panel__header">
                  <span>LOCATION MATRIX // KJSIT</span>
                  <ExternalLink size={16} />
                </div>
                <div className="map-panel__frame">
                  <iframe
                    title="KJSIT Location Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.391696238711!2d72.86877967590892!3d19.046497152899026!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c8d76e771b95%3A0x6a0868f0a7cfeb!2sK.+J.+Somaiya+Institute+of+Technology!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
                    width="100%"
                    height="260"
                    style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) contrast(1.2) brightness(0.8)", pointerEvents: "none" }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <div className="map-panel__overlay">
                    <span>CLICK TO OPEN IN GOOGLE MAPS ↗</span>
                  </div>
                </div>
                <div className="map-panel__footer">
                  <MapPin size={15} />
                  <span>Somaiya Ayurvihar Complex, Sion East, Mumbai, Maharashtra 400022</span>
                </div>
              </a>
            </ScrollReveal>
          </div>
        </section>

        <section className="section section--faq" id="faq">
          <div className="container faq-layout">
            <ScrollReveal><SectionHeading index="09" eyebrow="Frequently asked" title="The practical details" body="A few operational answers are still being finalised by the club. Placeholder responses are marked for confirmation." /></ScrollReveal>
            <ScrollReveal delay={100}><AccordionList items={faqs} /></ScrollReveal>
          </div>
        </section>

        <section className="footer-cta" id="footer-cta">
          <div
            className="footer-cta__art"
            style={{ backgroundImage: `url(${HERO_ART})` }}
          />
          <div className="footer-cta__wash" />
          <div className="container">
            <div className="footer-cta__content">
              <span className="footer-cta__eyebrow">
                <Orbit size={14} /> FINAL TRANSMISSION
              </span>

              <div className="footer-cta__headers">
                <h2 className="footer-cta__title">
                  EPOCH <span>1.0</span>
                </h2>
                <p className="footer-cta__tagline">
                  <span className="footer-cta__tagline-line" /> Ideas outlive apocalypses
                </p>
              </div>

              <div className="footer-cta__contact-list">
                <div className="footer-contact-item">
                  <span className="footer-contact-item__label">OFFICIAL INQUIRIES // CODEAI CLUB</span>
                  <a href="mailto:code.ai@somaiya.edu" className="footer-contact-item__email">
                    code.ai@somaiya.edu
                  </a>
                </div>

                <div className="footer-contact-item">
                  <span className="footer-contact-item__label">CHAIRPERSON // SHRAVAN KADAM</span>
                  <a href="mailto:shravan.kadam@somaiya.edu" className="footer-contact-item__email">
                    shravan.kadam@somaiya.edu
                  </a>
                </div>

                <div className="footer-contact-item">
                  <span className="footer-contact-item__label">VICE CHAIRPERSON // ATHARV GANGRADE</span>
                  <a href="mailto:atharv.gangrade@somaiya.edu" className="footer-contact-item__email">
                    atharv.gangrade@somaiya.edu
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
