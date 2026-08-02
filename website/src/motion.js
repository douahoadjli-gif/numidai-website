import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

let lenis = null;
let bgVideo = null;
let mainScrub = null;
const cleanupFns = [];

/* --------------------------------------------------------------------------
   Fallback policy — the ONLY place that decides video vs fallback image.
   Fallback is used strictly when:
     (a) the user prefers reduced motion, OR
     (b) the device is a real mobile/touch device: coarse pointer AND small screen.
   A desktop is NEVER forced to the fallback — not for narrow windows (docked
   DevTools), not for touchscreen laptops (a fine pointer is present).
   The decision is applied as a `scrub-on` class on <html>; CSS obeys the class.
   -------------------------------------------------------------------------- */
const mq = (q) =>
  typeof window !== 'undefined' && window.matchMedia && window.matchMedia(q).matches;

const prefersReducedMotion = mq('(prefers-reduced-motion: reduce)');

function shouldSkipVideoScrub() {
  if (prefersReducedMotion) return true;
  const coarseOnly = mq('(pointer: coarse)') && !mq('(any-pointer: fine)');
  const smallScreen = Math.min(window.innerWidth, window.innerHeight) < 768;
  return coarseOnly && smallScreen; // = real phone/tablet, never a desktop
}

const skipVideoScrub = shouldSkipVideoScrub();

function applyScrubClass(on) {
  document.documentElement.classList.toggle('scrub-on', on);
}

function initLenis() {
  if (prefersReducedMotion) return null;
  lenis = new Lenis({
    duration: 1.15,
    smoothWheel: true,
    wheelMultiplier: 0.9,
    lerp: 0.09
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

function initVideoScrub() {
  if (skipVideoScrub) {
    applyScrubClass(false);
    return null;
  }
  bgVideo = document.querySelector('#bgv');
  if (!bgVideo) return null;

  // Video mode ON: CSS shows #bgv and hides .bg-fallback via html.scrub-on
  applyScrubClass(true);

  // If the source 404s or can't decode, degrade gracefully to the fallback
  // image instead of leaving a black layer, and say why in the console.
  const onErr = () => {
    const err = bgVideo.error;
    // eslint-disable-next-line no-console
    console.warn(
      '[NumidAI] bg.mp4 failed to load (MediaError code ' +
        (err ? err.code : '?') +
        ') — falling back to hero image. Check that bg.mp4 is served with HTTP Range support.'
    );
    applyScrubClass(false);
    if (mainScrub) mainScrub.kill();
  };
  bgVideo.addEventListener('error', onErr);
  cleanupFns.push(() => bgVideo.removeEventListener('error', onErr));

  // Rewind and pause — scroll drives currentTime, not playback.
  try {
    bgVideo.pause();
    bgVideo.currentTime = 0;
  } catch (_) {
    /* ignore */
  }

  let lastT = -1;

  const update = (progress) => {
    const dur = bgVideo.duration;
    if (!Number.isFinite(dur) || dur <= 0) return;
    const t = Math.max(0, Math.min(dur - 0.05, progress * (dur - 0.05)));
    if (Math.abs(t - lastT) > 0.008) {
      try {
        bgVideo.currentTime = t;
        lastT = t;
      } catch (_) {
        /* ignore seek errors */
      }
    }
  };

  mainScrub = ScrollTrigger.create({
    trigger: document.body,
    start: 'top top',
    end: 'bottom bottom',
    scrub: true,
    onUpdate: (self) => update(self.progress)
  });

  const onMeta = () => update(0);
  bgVideo.addEventListener('loadedmetadata', onMeta);
  cleanupFns.push(() => bgVideo.removeEventListener('loadedmetadata', onMeta));

  return mainScrub;
}

function initReveals() {
  const items = document.querySelectorAll('[data-reveal]');
  items.forEach((el) => {
    const delay = parseFloat(el.dataset.revealDelay || '0');
    gsap.fromTo(
      el,
      { y: 24, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.9,
        delay,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 82%',
          once: true
        }
      }
    );
  });
}

function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  counters.forEach((el) => {
    const target = parseFloat(el.dataset.counter);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const obj = { v: 0 };
    gsap.to(obj, {
      v: target,
      duration: 1.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true
      },
      onUpdate: () => {
        el.textContent = `${prefix}${obj.v.toFixed(decimals)}${suffix}`;
      }
    });
  });
}

function initHeroPin() {
  // Pin the hero eyebrow/title stack for the first viewport so the video scrub reads
  // as a controlled cinematic reveal before content starts flowing.
  const hero = document.querySelector('#home');
  const heroInner = hero && hero.querySelector('.hero__inner');
  if (!hero || !heroInner || skipVideoScrub) return;

  ScrollTrigger.create({
    trigger: hero,
    start: 'top top',
    end: 'bottom top',
    pin: heroInner,
    pinSpacing: false
  });

  gsap.to('.hero__inner', {
    autoAlpha: 0,
    y: -30,
    ease: 'none',
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });
}

export function setupMotion() {
  initLenis();
  initVideoScrub();
  initHeroPin();
  initReveals();
  initCounters();

  if (import.meta.env.DEV) {
    window.__lenis = lenis;
    window.__ST = ScrollTrigger;
    window.__bgv = bgVideo;
  }

  // Recompute after fonts and images have settled.
  requestAnimationFrame(() => ScrollTrigger.refresh());
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

export function teardownMotion() {
  cleanupFns.forEach((fn) => fn());
  cleanupFns.length = 0;
  if (mainScrub) mainScrub.kill();
  ScrollTrigger.getAll().forEach((st) => st.kill());
  if (lenis) {
    lenis.destroy();
    lenis = null;
  }
}
