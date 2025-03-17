
import { cn } from '@/lib/utils';
import { ReceiptText } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  className?: string;
  icon?: React.ReactNode;
}

export function EmptyState({ 
  title, 
  description, 
  className,
  icon = <ReceiptText className="h-10 w-10 text-primary/40" />
}: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center p-4 animate-in fade-in",
      className
    )}>
      <div className="rounded-full p-3 bg-primary/10 mb-3 animate-in scale-in delay-150">
        {icon}
      </div>
      <h3 className="text-base font-medium mb-1 animate-in slide-up delay-100">{title}</h3>
      <p className="text-xs text-muted-foreground max-w-[250px] animate-in slide-up delay-200">
        {description}
      </p>
    </div>
  );
}
