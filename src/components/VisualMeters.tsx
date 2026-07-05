'use client';

import { cn } from '@/lib/utils';
import type { ProductMetrics } from '@/src/types';

interface MeterRowProps {
  label: string;
  value: number;
}

const metricLabels: Record<keyof ProductMetrics, string> = {
  stickiness: 'Độ dẻo',
  fluffiness: 'Độ nở',
  softness: 'Độ mềm',
  fragrance: 'Độ thơm',
};

export function VisualMeters({
  metrics,
  variant = 'bar',
  className,
}: {
  metrics: ProductMetrics;
  variant?: 'bar' | 'compact';
  className?: string;
}) {
  const entries = Object.entries(metrics) as [keyof ProductMetrics, number][];
  return (
    <div className={cn('space-y-3', className)}>
      {entries.map(([key, value]) => (
        <MeterRow
          key={key}
          label={metricLabels[key]}
          value={value}
          variant={variant}
        />
      ))}
    </div>
  );
}

function MeterRow({ label, value, variant }: MeterRowProps & { variant: string }) {
  if (variant === 'compact') {
    return (
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className={cn(
                'h-1.5 w-4 rounded-full transition-colors',
                i < value ? 'bg-gold-500' : 'bg-muted'
              )}
            />
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground/80">{label}</span>
        <span className="text-xs font-semibold text-brand-700">
          {value}/5
        </span>
      </div>
      <div className="flex gap-1.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-2 flex-1 rounded-full transition-all duration-500',
              i < value
                ? 'bg-gradient-to-r from-brand-500 to-gold-500'
                : 'bg-muted'
            )}
            style={{ transitionDelay: `${i * 60}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
