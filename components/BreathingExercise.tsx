'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Activity } from 'lucide-react';

interface BreathingExerciseProps {
  onClose: () => void;
}

export function BreathingExercise({ onClose }: BreathingExerciseProps) {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
  const [timeLeft, setTimeLeft] = useState(4);
  const [cyclesLeft, setCyclesLeft] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Move to next phase
          switch (phase) {
            case 'inhale':
              setPhase('hold');
              return 7; // Hold duration
            case 'hold':
              setPhase('exhale');
              return 8; // Exhale duration
            case 'exhale':
              if (cyclesLeft <= 1) {
                clearInterval(timer);
                onClose();
                return 0;
              }
              setPhase('rest');
              return 4; // Rest duration
            case 'rest':
              setCyclesLeft(prev => prev - 1);
              setPhase('inhale');
              return 4; // Inhale duration
            default:
              return prev;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, cyclesLeft, onClose]);

  const getInstructions = () => {
    switch (phase) {
      case 'inhale':
        return 'Breathe in slowly';
      case 'hold':
        return 'Hold your breath';
      case 'exhale':
        return 'Breathe out slowly';
      case 'rest':
        return 'Rest and prepare';
      default:
        return '';
    }
  };

  const getProgressSize = () => {
    const maxTime = {
      inhale: 4,
      hold: 7,
      exhale: 8,
      rest: 4
    }[phase];

    return `${(timeLeft / maxTime) * 100}%`;
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <Card className="w-full max-w-md p-6 relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="text-center space-y-6">
          <div className="space-y-2">
            <Activity className="w-8 h-8 mx-auto text-primary animate-pulse" />
            <h2 className="text-xl font-semibold">Breathing Exercise</h2>
            <p className="text-sm text-muted-foreground">
              Cycle {6 - cyclesLeft} of 5
            </p>
          </div>

          <div className="relative h-48 w-48 mx-auto">
            {/* Breathing circle animation */}
            <div 
              className={`absolute inset-0 rounded-full border-4 border-primary transition-all duration-1000 ${
                phase === 'inhale' ? 'scale-100' : 
                phase === 'hold' ? 'scale-100' :
                'scale-75'
              }`}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">{timeLeft}</div>
                <div className="text-sm font-medium">{getInstructions()}</div>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-1000"
              style={{ width: getProgressSize() }}
            />
          </div>

          <p className="text-sm text-muted-foreground">
            Find a comfortable position and follow the breathing pattern
          </p>
        </div>
      </Card>
    </div>
  );
}
