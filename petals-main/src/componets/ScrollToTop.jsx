import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();
  const action = useNavigationType();

  useEffect(() => {
    // Only scroll to top if the user navigated via clicking a link (PUSH)
    // If they clicked the Back/Forward button (POP), let the browser handle scroll restoration
    if (action !== 'POP') {
      window.scrollTo(0, 0);
    }
  }, [pathname, action]);

  return null;
}
