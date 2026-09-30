"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const HEADLINE = "WELCOME ITZFIZZ";

const HEADLINE = "WELCOME ITZFIZZ";

/* ─────────────────────────────────────────────
   Component
───────────────────────────────────────────── */
export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const roadRef = useRef<HTMLDivElement>(null);
  const carRef = useRef<HTMLImageElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  /* refs for in-road value letters */
  const roadLettersRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    /* Register ScrollTrigger once on client */
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      /* ── 1. LOAD ANIMATION ─────────────────────────
         Staggered reveal for the headline letters       */
      const heroLetters = gsap.utils.toArray<HTMLElement>(".hero-letter");

      gsap.to(heroLetters, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.045,
        ease: "power3.out",
        delay: 0.2,
      });

      /* ── 2. SCROLL ANIMATION ───────────────────────
         Pin the track and drive the car from left → right
         as the user scrolls through the 200vh section.  */
      const road = roadRef.current;
      const car = carRef.current;
      const trail = trailRef.current;

      if (!road || !car || !trail) return;

      const roadWidth = road.offsetWidth;
      const carWidth = car.offsetWidth;
      const endX = roadWidth - carWidth;

      /* Collect in-road value letters */
      const roadLetters = roadLettersRef.current;
      /* Pre-compute left offsets relative to the road div */
      const roadRect = road.getBoundingClientRect();
      const letterLefts = roadLetters.map((el) => {
        const r = el.getBoundingClientRect();
        return r.left - roadRect.left;
      });

      gsap.to(car, {
        x: endX,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,           // 1 = 1s lag for smoothness
          pin: trackRef.current,
          anticipatePin: 1,
          onUpdate: (self) => {
            /* Progress 0 → 1 */
            const progress = self.progress;
            const currentCarX = progress * endX + carWidth / 2;

            /* Drive the trail to follow the car's front */
            gsap.set(trail, { width: currentCarX });

            /* Reveal road letters as car passes over them */
            roadLetters.forEach((letter, i) => {
              if (currentCarX >= letterLefts[i]) {
                letter.style.opacity = "1";
              } else {
                letter.style.opacity = "0";
              }
            });
          },
        },
      });

      /* ── 3. STAT BOXES — scroll-driven reveal ──────
         Each box fades in at a different scroll offset  */
      const statBoxes = gsap.utils.toArray<HTMLElement>(".stat-box");

      statBoxes.forEach((box, i) => {
        const startOffset = 300 + i * 220;
        const endOffset = startOffset + 180;

        gsap.to(box, {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: `top+=${startOffset} top`,
            end: `top+=${endOffset} top`,
            scrub: true,
          },
        });
      });
    });

    /* Cleanup on unmount */
    return () => ctx.revert();
  }, []);

  /* Store ref to each road-letter span */
  const setRoadLetterRef = (el: HTMLSpanElement | null, i: number) => {
    if (el) roadLettersRef.current[i] = el;
  };

  /* Road letters (same text, rendered inside the road strip) */
  const roadLetterSpans = HEADLINE.split("").map((char, i) =>
    char === " " ? (
      <span
        key={i}
        ref={(el) => setRoadLetterRef(el, i)}
        className="value-letter inline-block w-4"
      />
    ) : (
      <span
        key={i}
        ref={(el) => setRoadLetterRef(el, i)}
        className="value-letter inline-block"
      >
        {char}
      </span>
    )
  );

  return (
    <>
      {/* ── SCROLL SECTION (200vh gives scroll room) ── */}
      <div ref={sectionRef} className="relative" style={{ height: "200vh" }}>
        {/* ── STICKY TRACK ── */}
        <div
          ref={trackRef}
          className="road-track flex flex-col items-center justify-center bg-[#121212]"
        >
          {/* ── TOP: Headline only ── */}
          <div className="w-full px-6 md:px-16 pt-12 pb-4 flex flex-col items-center gap-6 z-10">
            {/* Headline */}
            <div
              ref={headlineRef}
              className="flex flex-wrap justify-center gap-x-1 gap-y-0"
              aria-label={HEADLINE}
            >
              {HEADLINE.split("").map((char, i) =>
                char === " " ? (
                  <span
                    key={i}
                    className="hero-letter inline-block w-5 md:w-7"
                    style={{ opacity: 0, transform: "translateY(40px)" }}
                    aria-hidden="true"
                  />
                ) : (
                  <span
                    key={i}
                    className="hero-letter inline-block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-widest text-white"
                    style={{ opacity: 0, transform: "translateY(40px)" }}
                    aria-hidden="true"
                  >
                    {char}
                  </span>
                )
              )}
            </div>
          </div>

          {/* ── ROAD STRIP ── */}
          <div className="w-full relative mt-auto" style={{ flex: "0 0 auto" }}>
            {/* Stat boxes that appear mid-scroll (positioned over the road area) */}
            <div className="absolute inset-0 pointer-events-none z-20">
              {/* Box positions mimic the original: top-right and bottom-right quadrants */}
              <div
                className="stat-box absolute top-[-160px] right-[28%] bg-[#def54f] text-[#111] rounded-xl px-6 py-4 pointer-events-none"
                style={{ opacity: 0, transform: "translateY(10px)" }}
              >
                <span className="block text-5xl font-bold">58%</span>
                <span className="block text-sm font-medium mt-1 max-w-[130px]">
                  Increase in pick up point use
                </span>
              </div>
              <div
                className="stat-box absolute bottom-[-10px] right-[33%] bg-[#6ac9ff] text-[#111] rounded-xl px-6 py-4 pointer-events-none"
                style={{ opacity: 0, transform: "translateY(10px)" }}
              >
                <span className="block text-5xl font-bold">23%</span>
                <span className="block text-sm font-medium mt-1 max-w-[130px]">
                  Decreased in customer phone calls
                </span>
              </div>
              <div
                className="stat-box absolute top-[-160px] right-[8%] bg-[#333] text-white rounded-xl px-6 py-4 pointer-events-none"
                style={{ opacity: 0, transform: "translateY(10px)" }}
              >
                <span className="block text-5xl font-bold">27%</span>
                <span className="block text-sm font-medium mt-1 max-w-[130px]">
                  Increase in pick up point use
                </span>
              </div>
              <div
                className="stat-box absolute bottom-[-10px] right-[10%] bg-[#fa7328] text-[#111] rounded-xl px-6 py-4 pointer-events-none"
                style={{ opacity: 0, transform: "translateY(10px)" }}
              >
                <span className="block text-5xl font-bold">40%</span>
                <span className="block text-sm font-medium mt-1 max-w-[130px]">
                  Decreased in customer phone calls
                </span>
              </div>
            </div>

            {/* The actual road */}
            <div
              ref={roadRef}
              className="relative w-full overflow-hidden bg-[#1e1e1e]"
              style={{ height: "180px" }}
            >
              {/* Trail bar */}
              <div
                ref={trailRef}
                className="trail-bar absolute top-0 left-0 h-full"
                style={{
                  width: 0,
                  background: "linear-gradient(90deg, #45db7d, #def54f)",
                  zIndex: 1,
                  borderRadius: "0 4px 4px 0",
                  opacity: 0.35,
                }}
              />

              {/* Road dashes */}
              <div
                className="absolute inset-x-0 pointer-events-none"
                style={{ top: "50%", transform: "translateY(-50%)", zIndex: 2 }}
              >
                <div
                  className="w-full border-t-2 border-dashed"
                  style={{ borderColor: "rgba(255,255,255,0.08)" }}
                />
              </div>

              {/* In-road headline text */}
              <div
                className="absolute flex items-center gap-1 z-10 select-none"
                style={{
                  top: "28%",
                  left: "4%",
                  fontSize: "clamp(2rem, 5vw, 5rem)",
                  fontWeight: 900,
                  color: "#111",
                  letterSpacing: "0.25em",
                  lineHeight: 1,
                }}
              >
                {roadLetterSpans}
              </div>

              {/* Car image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={carRef}
                src="/car.png"
                alt="ItzFizz car"
                className="car-element"
                style={{
                  height: "160px",
                  width: "auto",
                  position: "absolute",
                  top: "50%",
                  left: 0,
                  transform: "translateY(-50%)",
                  zIndex: 10,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── CONTENT BELOW HERO (gives scroll context) ── */}
      <section className="min-h-screen bg-[#0d0d0d] flex items-center justify-center px-8">
        <div className="text-center">
          <p className="text-[#555] text-sm uppercase tracking-widest mb-4">
            Scroll up to replay
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white">
            More content below
          </h2>
          <p className="text-[#888] mt-4 max-w-lg mx-auto">
            The hero animation above is fully tied to scroll progress — no
            autoplay. Scroll back up to see it reset.
          </p>
        </div>
      </section>
    </>
  );
}
