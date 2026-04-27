import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
}

export default function Card({ children, className, hover = true, glass = false }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl p-6 shadow-sm',
        glass
          ? 'bg-white/60 backdrop-blur-xl border border-white/20'
          : 'bg-white border border-border',
        hover &&
          'transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary-200',
        className
      )}
    >
      {children}
    </div>
  );
}
