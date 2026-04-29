import { cn } from '@/lib/utils';

export function FoxbitWordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'font-mono font-bold tracking-wider text-[#00C896] select-none',
        className
      )}
      aria-label="Foxbit"
    >
      FOXBIT
    </span>
  );
}
