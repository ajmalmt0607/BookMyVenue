import { memo } from "react";

import useInView from "../../hooks/useInView";

const LazySection = ({ children, fallback = null, minHeight = 240 }) => {
  const [ref, isInView] = useInView();

  return (
    <div ref={ref} style={isInView ? undefined : { minHeight }}>
      {isInView ? children : fallback}
    </div>
  );
};

export default memo(LazySection);
