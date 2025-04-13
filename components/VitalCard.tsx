'use client';

import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VitalCardProps {
  title: string;
  value: string;
  status: 'normal' | 'warning' | 'alert';
  icon: LucideIcon;
  detail: string;
}

export function VitalCard({ title, value, status, icon: Icon, detail }: VitalCardProps) {
  return (
    <div className={cn(
      "p-3 rounded-lg",
      status === 'normal' && "bg-muted/50",
      status === 'warning' && "bg-yellow-500/10",
      status === 'alert' && "bg-red-500/10"
    )}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={cn(
          "w-4 h-4",
          status === 'normal' && "text-muted-foreground",
          status === 'warning' && "text-yellow-500",
          status === 'alert' && "text-red-500"
        )} />
        <h4 className="font-medium text-sm">{title}</h4>
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <p className="text-xs text-muted-foreground">{detail}</p>
    </div>
  );
}
