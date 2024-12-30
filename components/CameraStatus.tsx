'use client';

import { Camera, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CameraStatusProps {
  isEnabled: boolean;
  error: string | null;
  isAnalyzing: boolean;
}

export function CameraStatus({ isEnabled, error, isAnalyzing }: CameraStatusProps) {
  if (error) {
    return (
      <Badge variant="destructive" className="flex items-center gap-1">
        <AlertCircle className="h-4 w-4" />
        Error
      </Badge>
    );
  }

  return (
    <>
      <Badge variant={isEnabled ? "success" : "destructive"} className="flex items-center gap-1">
        <Camera className="h-4 w-4" />
        {isEnabled ? 'Active' : 'Disabled'}
      </Badge>
      {isAnalyzing && (
        <Badge variant="secondary">
          Analyzing...
        </Badge>
      )}
    </>
  );
}