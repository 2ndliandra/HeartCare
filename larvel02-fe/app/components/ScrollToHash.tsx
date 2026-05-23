import * as React from "react";
import { useLocation } from "react-router-dom";
import { scrollToHash } from "../lib/gsapScroll";

const SMOOTH_SCROLL_RETRY_LIMIT = 10;

export function ScrollToHash() {
  const location = useLocation();

  React.useEffect(() => {
    if (!location.hash) {
      return;
    }

    let frameId = 0;
    let attempts = 0;

    const animateToTarget = () => {
      if (scrollToHash(location.hash)) {
        return;
      }

      if (attempts < SMOOTH_SCROLL_RETRY_LIMIT) {
        attempts += 1;
        frameId = window.requestAnimationFrame(animateToTarget);
      }
    };

    frameId = window.requestAnimationFrame(animateToTarget);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [location.hash, location.pathname]);

  return null;
}
