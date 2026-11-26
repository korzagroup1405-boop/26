'use client';

import { useRef, useState, type ReactNode } from 'react';

/** Wraps a control so it drifts gently toward the cursor. */
export default function Magnetic({
  children,
  className,
  strength = 7,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  return (
    <span
      ref={ref}
      className={className}
      style={{
        display: 'inline-block',
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        transition: 'transform 400ms cubic-bezier(0.16,1,0.3,1)',
      }}
      onMouseMove={(event) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * strength * 2;
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * strength * 2;
        setOffset({ x, y });
      }}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
    >
      {children}
    </span>
  );
}
