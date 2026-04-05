import { useEffect } from "react";

// Global counter to manage multiple overlapping popups/modals
let lockCount = 0;

/**
 * A global hook to freeze background scrolling.
 * It handles multiple concurrent popups gracefully.
 *
 * @param {boolean} isLocked - Whether the scroll should be locked
 */
const useScrollLock = (isLocked) => {
  useEffect(() => {
    if (!isLocked) return;

    lockCount++;

    // Lock scroll if it's the first overlay opening
    if (lockCount === 1) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    }

    return () => {
      lockCount--;
      // Unlock scroll only if all overlays are closed
      if (lockCount === 0) {
        document.body.style.overflow = "unset";
        document.documentElement.style.overflow = "unset";
      }
    };
  }, [isLocked]);
};

export default useScrollLock;
