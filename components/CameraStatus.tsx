'use client';

import { Camera, CheckCircle2, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CameraStatusProps {
  isEnabled: boolean;
  error: string | null;
}

export function CameraStatus({ isEnabled, error }: CameraStatusProps) {
  if (error) {
    return (
      <Badge variant="destructive" className="gap-1">
        <XCircle className="h-4 w-4" />
        Camera Error
      </Badge>
    );
  }

  return (
    <Badge variant={isEnabled ? "success" : "secondary"} className="gap-1">
      <Camera className="h-4 w-4" />
      {isEnabled ? (
        <>
          <CheckCircle2 className="h-4 w-4" />
          Active
        </>
      ) : (
        'Disabled'
      )}
    </Badge>
  );
}