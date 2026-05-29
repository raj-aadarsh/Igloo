import { useState } from 'react';
import { cn } from '@/lib/cn';

// Renders the custom logo from /public/igloo.jpeg. If that file isn't present,
// it gracefully falls back to the built-in igloo mark (favicon.svg) so the UI
// never shows a broken image.
export function Logo({ className, alt = 'Igloo' }: { className?: string; alt?: string }) {
  const [src, setSrc] = useState('./igloo.jpeg');
  return (
    <img
      src={src}
      alt={alt}
      onError={() => src !== './favicon.svg' && setSrc('./favicon.svg')}
      className={cn('object-contain', className)}
    />
  );
}
