import { useEffect, useRef, useState } from "react";

// Used to defer mounting below-the-fold sections (Nearby, Similar, FAQ,
// Why Book, Hosted Events, Contact) until they're actually about to scroll
// into view, so the initial venue-detail render stays light.
const useInView = ({ rootMargin = "200px", once = true } = {}) => {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || (once && isInView)) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setIsInView(false);
        }
      },
      { rootMargin }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [rootMargin, once, isInView]);

  return [ref, isInView];
};

export default useInView;
