import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// When you refresh the page, it goes to the top

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default ScrollToTop;
