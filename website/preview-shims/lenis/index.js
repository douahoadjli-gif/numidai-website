/* SANDBOX PREVIEW SHIM — NOT SHIPPED. Native scroll stands in for Lenis. */
export default class Lenis {
  constructor() { this._handlers = []; }
  on(event, fn) {
    if (event === 'scroll') {
      const h = () => fn(this);
      window.addEventListener('scroll', h, { passive: true });
      this._handlers.push(h);
    }
  }
  raf() {}
  destroy() { this._handlers.forEach((h) => window.removeEventListener('scroll', h)); }
}
