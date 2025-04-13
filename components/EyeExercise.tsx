'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Eye } from 'lucide-react';

interface EyeExerciseProps {
  onClose: () => void;
}

export function EyeExercise({ onClose }: EyeExerciseProps) {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);

  const exercises = [
    {
      name: 'Focus Far',
      description: 'Look at something at least 20 feet away',
      duration: 20,
      icon: '👀'
    },
    {
      name: 'Focus Near',
      description: 'Focus on your thumb held at arm\'s length',
      duration: 10,
      icon: '👍'
    },
    {
      name: 'Circular Movement',
      description: 'Roll your eyes in a circular motion',
      duration: 10,
      icon: '🔄'
    },
    {
      name: 'Blink Break',
      description: 'Rapidly blink your eyes for a few seconds',
      duration: 5,
      icon: '😌'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (currentExercise >= exercises.length - 1) {
            clearInterval(timer);
            onClose();
            return 0;
          }
          setCurrentExercise(prev => prev + 1);
          return exercises[currentExercise + 1].duration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentExercise, exercises.length, onClose]);

  const exercise = exercises[currentExercise];
  const progress = (timeLeft / exercise.duration) * 100;

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
            <Eye className="w-8 h-8 mx-auto text-primary" />
            <h2 className="text-xl font-semibold">Eye Exercise</h2>
            <p className="text-sm text-muted-foreground">
              Exercise {currentExercise + 1} of {exercises.length}
            </p>
          </div>

          <div className="py-8">
            <div className="text-4xl mb-4">{exercise.icon}</div>
            <h3 className="text-lg font-medium mb-2">{exercise.name}</h3>
            <p className="text-sm text-muted-foreground">{exercise.description}</p>
          </div>

          <div className="space-y-4">
            {/* Timer */}
            <div className="text-3xl font-bold">{timeLeft}s</div>

            {/* Progress bar */}
            <div className="h-1 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-1000"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {exercises.map((ex, index) => (
              <div
                key={index}
                className={`h-1 rounded-full ${
                  index === currentExercise ? 'bg-primary' :
                  index < currentExercise ? 'bg-primary/30' :
                  'bg-muted'
                }`}
              />
            ))}
          </div>

          <p className="text-sm text-muted-foreground">
            Remember to blink regularly during these exercises
          </p>
        </div>
      </Card>
    </div>
  );
}
