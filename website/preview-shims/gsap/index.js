/* ============================================================================
   SANDBOX PREVIEW SHIM — NOT SHIPPED TO PRODUCTION
   Minimal stand-in for gsap + ScrollTrigger implementing only the API surface
   used by src/motion.js, so the site can be verified in an offline sandbox.
   In production, `npm install` provides the real gsap and this file is unused
   (aliases only exist in the esbuild preview command, not in vite.config.js).
   ============================================================================ */

const triggers = [];
const tickerFns = [];
let rafRunning = false;

function startTicker() {
  if (rafRunning) return;
  rafRunning = true;
  const loop = (now) => {
    for (const fn of tickerFns) fn(now / 1000);
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

const eases = {
  none: (t) => t,
  linear: (t) => t,
  'power2.out': (t) => 1 - Math.pow(1 - t, 3)
};
const getEase = (name) => eases[name] || eases['power2.out'];

function resolveTargets(t) {
  if (typeof t === 'string') return Array.from(document.querySelectorAll(t));
  if (t instanceof Element) return [t];
  return [t]; // plain object (counter tween)
}

function setElProps(el, { y, autoAlpha }) {
  if (y !== undefined) el.style.transform = `translateY(${y}px)`;
  if (autoAlpha !== undefined) {
    el.style.opacity = String(autoAlpha);
    el.style.visibility = autoAlpha === 0 ? 'hidden' : 'visible';
  }
}

/* Parse "top 82%" style start strings into a viewport fraction */
function startFraction(start) {
  const m = /top\s+(\d+)%/.exec(start || '');
  return m ? parseInt(m[1], 10) / 100 : 0.85;
}

function docScrollMax() {
  return Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
}

/* Y positions (document space) for trigger boundaries like 'top top' / 'bottom top' */
function boundaryY(el, expr) {
  const rect = el.getBoundingClientRect();
  const topDoc = rect.top + window.scrollY;
  const [elEdge, vpEdge] = (expr || 'top top').split(/\s+/);
  const elY = elEdge === 'bottom' ? topDoc + rect.height : topDoc;
  const vpOff = vpEdge === 'bottom' ? window.innerHeight : 0;
  return elY - vpOff;
}

function timeTween(target, vars, onDone) {
  const dur = (vars.duration || 1) * 1000;
  const delay = (vars.delay || 0) * 1000;
  const ease = getEase(vars.ease);
  const targets = resolveTargets(target);
  const isObj = !(targets[0] instanceof Element);
  const startVals = {};
  if (isObj) for (const k of Object.keys(vars)) if (typeof targets[0][k] === 'number') startVals[k] = targets[0][k];

  const begin = performance.now() + delay;
  const step = (now) => {
    const p = Math.min(1, Math.max(0, (now - begin) / dur));
    const e = ease(p);
    if (isObj) {
      const obj = targets[0];
      for (const k of Object.keys(startVals)) obj[k] = startVals[k] + (vars[k] - startVals[k]) * e;
      if (vars.onUpdate) vars.onUpdate();
    } else {
      for (const el of targets) {
        const cur = {};
        if (vars.y !== undefined) cur.y = (el.__fromY ?? 0) + (vars.y - (el.__fromY ?? 0)) * e;
        if (vars.autoAlpha !== undefined)
          cur.autoAlpha = (el.__fromA ?? 0) + (vars.autoAlpha - (el.__fromA ?? 0)) * e;
        setElProps(el, cur);
      }
    }
    if (p < 1) requestAnimationFrame(step);
    else if (onDone) onDone();
  };
  requestAnimationFrame(step);
}

function scrubTween(target, vars) {
  const st = vars.scrollTrigger;
  const trigEl = st.trigger instanceof Element ? st.trigger : document.querySelector(st.trigger);
  const targets = resolveTargets(target);
  let startY = 0;
  let endY = 1;
  const measure = () => {
    startY = boundaryY(trigEl, st.start);
    endY = boundaryY(trigEl, st.end);
    if (endY <= startY) endY = startY + 1;
  };
  measure();
  const onScroll = () => {
    const p = Math.min(1, Math.max(0, (window.scrollY - startY) / (endY - startY)));
    for (const el of targets) {
      const cur = {};
      if (vars.y !== undefined) cur.y = vars.y * p;
      if (vars.autoAlpha !== undefined) cur.autoAlpha = 1 + (vars.autoAlpha - 1) * p;
      setElProps(el, cur);
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', measure);
  onScroll();
  const handle = {
    kill() {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', measure);
    },
    __measure: measure
  };
  triggers.push(handle);
  return handle;
}

function observedTween(target, fromVars, toVars) {
  const st = toVars.scrollTrigger;
  const trigEl = st.trigger instanceof Element ? st.trigger : document.querySelector(st.trigger);
  const targets = resolveTargets(target);
  const isObj = !(targets[0] instanceof Element);

  if (!isObj && fromVars) {
    for (const el of targets) {
      el.__fromY = fromVars.y ?? 0;
      el.__fromA = fromVars.autoAlpha ?? 0;
      setElProps(el, fromVars);
    }
  }
  const frac = startFraction(st.start);
  const marginBottom = -Math.round((1 - frac) * 100);
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          timeTween(target, toVars);
          if (st.once !== false) io.disconnect();
        }
      }
    },
    { rootMargin: `0px 0px ${marginBottom}% 0px`, threshold: 0 }
  );
  io.observe(trigEl);
  const handle = { kill: () => io.disconnect() };
  triggers.push(handle);
  return handle;
}

export const gsap = {
  registerPlugin() {},
  ticker: {
    add(fn) {
      tickerFns.push(fn);
      startTicker();
    },
    lagSmoothing() {}
  },
  fromTo(target, fromVars, toVars) {
    if (toVars.scrollTrigger) return observedTween(target, fromVars, toVars);
    return timeTween(target, toVars);
  },
  to(target, vars) {
    if (vars.scrollTrigger && vars.scrollTrigger.scrub) return scrubTween(target, vars);
    if (vars.scrollTrigger) return observedTween(target, null, vars);
    return timeTween(target, vars);
  }
};

export const ScrollTrigger = {
  create(cfg) {
    if (cfg.pin) {
      // Approximate GSAP pin with CSS sticky for preview purposes
      cfg.pin.style.position = 'sticky';
      cfg.pin.style.top = '0px';
      const handle = { kill() {} };
      triggers.push(handle);
      return handle;
    }
    const trigEl = cfg.trigger instanceof Element ? cfg.trigger : document.querySelector(cfg.trigger);
    let startY = 0;
    let endY = 1;
    const measure = () => {
      if (trigEl === document.body) {
        startY = 0;
        endY = docScrollMax();
      } else {
        startY = boundaryY(trigEl, cfg.start);
        endY = boundaryY(trigEl, cfg.end);
        if (endY <= startY) endY = startY + 1;
      }
    };
    measure();
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const progress = Math.min(1, Math.max(0, (window.scrollY - startY) / (endY - startY)));
        if (cfg.onUpdate) cfg.onUpdate({ progress });
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure);
    onScroll();
    const handle = {
      kill() {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', measure);
      }
    };
    triggers.push(handle);
    return handle;
  },
  update() {},
  refresh() {
    for (const t of triggers) if (t.__measure) t.__measure();
    window.dispatchEvent(new Event('scroll'));
  },
  getAll() {
    return triggers.slice();
  }
};

export default gsap;
