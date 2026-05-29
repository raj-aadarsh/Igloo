import { useState } from 'react';
import { cn } from '@/lib/cn';

// Renders your custom logo from /public/logo.png. If that file isn't there yet,
// it gracefully falls back to the built-in igloo mark (favicon.svg) so the UI
// never shows a broken image. Drop your logo at: public/logo.png
export function Logo({ className, alt = 'Igloo' }: { className?: string; alt?: string }) {
  const [src, setSrc] = useState('./logo.png');
  return (
    <img
      src={src}
      alt={alt}
      onError={() => src !== './favicon.svg' && setSrc('./favicon.svg')}
      className={cn('object-contain', className)}
    />
  );
}
