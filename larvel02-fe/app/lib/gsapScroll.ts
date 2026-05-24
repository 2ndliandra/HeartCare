import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger, ScrollSmoother);

const NAVBAR_OFFSET = 96;
const SCROLL_DURATION = 0.85;

function stopCurrentScroll() {
  gsap.killTweensOf(window);
}

export function createPageSmoother(wrapper: HTMLElement, content: HTMLElement) {
  const existing = ScrollSmoother.get();
  if (existing) {
    existing.kill();
  }

  return ScrollSmoother.create({
    wrapper,
    content,
    smooth: 1.35,
    smoothTouch: 0.45,
    normalizeScroll: true,
    effects: false,
  });
}

export function refreshPageSmoother() {
  ScrollTrigger.refresh();
  ScrollSmoother.refresh(true);
}

export function destroyPageSmoother() {
  ScrollSmoother.get()?.kill();
}

export function scrollToTop() {
  stopCurrentScroll();
  const smoother = ScrollSmoother.get();

  if (smoother) {
    smoother.scrollTo(0, true);
    return;
  }

  gsap.to(window, {
    duration: SCROLL_DURATION,
    ease: "power2.out",
    scrollTo: {
      y: 0,
      autoKill: true,
    },
  });
}

export function scrollToHash(hash: string) {
  const targetId = decodeURIComponent(hash.replace(/^#/, ""));
  const target = document.getElementById(targetId);

  if (!target) {
    return false;
  }

  stopCurrentScroll();
  const smoother = ScrollSmoother.get();

  if (smoother) {
    const offset = Math.max(0, smoother.offset(target, "top top") - NAVBAR_OFFSET);
    smoother.scrollTo(offset, true);
    return true;
  }

  gsap.to(window, {
    duration: SCROLL_DURATION,
    ease: "power2.out",
    scrollTo: {
      y: target,
      offsetY: NAVBAR_OFFSET,
      autoKill: true,
    },
  });

  return true;
}
