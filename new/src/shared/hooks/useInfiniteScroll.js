import { useEffect, useRef, useCallback } from "react";

/**
 * useInfiniteScroll hook
 * @param {Function} callback - Function to call when bottom is reached
 * @param {Boolean} hasMore - Whether there is more content to load
 * @param {Boolean} isLoading - Whether content is currently loading
 * @returns {Object} { lastElementRef }
 */
const useInfiniteScroll = (callback, hasMore, isLoading) => {
  const observer = useRef();

  const lastElementRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          callback();
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, callback],
  );

  return { lastElementRef };
};

export default useInfiniteScroll;
