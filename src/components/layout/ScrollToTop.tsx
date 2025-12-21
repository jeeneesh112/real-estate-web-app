import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop({ behavior = 'auto' }: { behavior?: ScrollBehavior }) {
  const { pathname } = useLocation();

  useEffect(() => {
    // Ensure scroll resets on route change
    window.scrollTo({ top: 0, left: 0, behavior });
  }, [pathname, behavior]);

  return null;
}
