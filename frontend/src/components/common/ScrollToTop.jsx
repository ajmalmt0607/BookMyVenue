import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

// Scrolls to top whenever navigation pushes a new route (clicking a
// link/card — including slug-to-slug navigation between two detail pages,
// since pathname still changes). Browser back/forward (POP) is
// deliberately left alone so native scroll restoration keeps working,
// matching how users expect the back button to behave.
const ScrollToTop = () => {

  const { pathname } =
    useLocation();

  const navigationType =
    useNavigationType();

  useEffect(() => {

    if (navigationType === "POP") return;

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });

  }, [pathname, navigationType]);

  return null;
};

export default ScrollToTop;
