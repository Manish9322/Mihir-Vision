
'use client';

import { useTracking } from '@/hooks/useTracking';

interface PageViewTrackerProps {
  pageName: string;
}

export default function PageViewTracker({ pageName }: PageViewTrackerProps) {
  useTracking(pageName);
  return null;
}
