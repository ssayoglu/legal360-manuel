import { useEffect } from 'react';

export function usePageTitle(title, description) {
  useEffect(() => {
    if (title) {
      document.title = title;
    }
    if (typeof description === 'string') {
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute('content', description);
    }
  }, [title, description]);
}

export default usePageTitle;


