'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { VitalCard } from './VitalCard';
import { ResponsiveLine } from '@nivo/line';
import { 
  Activity, 
  AlertCircle, 
  AlertTriangle, 
  Brain, 
  Eye, 
  Heart, 
  LineChart, 
  User,
  Stethoscope 
} from 'lucide-react';
import { BreathingExercise } from './BreathingExercise';
import { EyeExercise } from './EyeExercise';

interface HealthMetrics {
  stressLevel: number;
  fatigueScore: number;
  blinkRate: number;
  timestamp: number;
}

interface HealthMonitorProps {
  metrics: HealthMetrics;
}

export function HealthMonitor({ metrics }: HealthMonitorProps) {
  const [metricsHistory, setMetricsHistory] = useState<HealthMetrics[]>([]);
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('day');
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [isEyeExerciseActive, setIsEyeExerciseActive] = useState(false);

  // Update metrics history
  useEffect(() => {
    setMetricsHistory(prev => {
      const newHistory = [...prev, metrics];
      // Keep last 24 hours of data
      return newHistory.filter(m => m.timestamp > Date.now() - 24 * 60 * 60 * 1000);
    });
  }, [metrics]);

  const startBreathingExercise = () => {
    setIsBreathingActive(true);
  };

  const startEyeExercise = () => {
    setIsEyeExerciseActive(true);
  };

  const getStressStatus = (level: number) => {
    if (level > 0.7) return 'alert';
    if (level > 0.5) return 'warning';
    return 'normal';
  };

  const getFatigueStatus = (level: number) => {
    if (level > 0.6) return 'alert';
    if (level > 0.4) return 'warning';
    return 'normal';
  };

  const getBlinkStatus = (rate: number) => {
    if (rate < 12) return 'alert';
    if (rate < 15) return 'warning';
    return 'normal';
  };

  return (
    <>
      <Card className="p-4">
        <div className="space-y-6">
          {/* Vital Signs Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-red-500" />
              <h3 className="font-semibold">Mental Health Vitals</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <VitalCard
                title="Stress Index"
                value={`${(metrics.stressLevel * 100).toFixed(0)}%`}
                status={getStressStatus(metrics.stressLevel)}
                icon={Activity}
                detail="Based on facial tension & expressions"
              />
              <VitalCard
                title="Mental Fatigue"
                value={`${(metrics.fatigueScore * 100).toFixed(0)}%`}
                status={getFatigueStatus(metrics.fatigueScore)}
                icon={Brain}
                detail="Based on attention & focus patterns"
              />
              <VitalCard
                title="Eye Strain"
                value={`${metrics.blinkRate.toFixed(1)} bpm`}
                status={getBlinkStatus(metrics.blinkRate)}
                icon={Eye}
                detail="Healthy range: 12-20 blinks/min"
              />
            </div>
          </div>

          {/* Health Recommendations */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Stethoscope className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Health Insights</h3>
            </div>
            <div className="space-y-3">
              {metrics.stressLevel > 0.7 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>High Stress Detected</AlertTitle>
                  <AlertDescription>
                    Consider taking a 5-minute breathing exercise break. High stress levels can impact both mental and physical health.
                  </AlertDescription>
                </Alert>
              )}
              {metrics.fatigueScore > 0.6 && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Mental Fatigue Warning</AlertTitle>
                  <AlertDescription>
                    Your cognitive load appears high. Consider the 20-20-20 rule: Every 20 minutes, look at something 20 feet away for 20 seconds.
                  </AlertDescription>
                </Alert>
              )}
              {metrics.blinkRate < 12 && (
                <Alert>
                  <Eye className="h-4 w-4" />
                  <AlertTitle>Digital Eye Strain Risk</AlertTitle>
                  <AlertDescription>
                    Low blink rate detected. Remember to blink regularly and consider using artificial tears if experiencing dry eyes.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          {/* Wellness Trends */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <LineChart className="w-5 h-5 text-blue-500" />
                <h3 className="font-semibold">Wellness Trends</h3>
              </div>
              <Select
                value={timeRange}
                onValueChange={(value: 'day' | 'week' | 'month') => setTimeRange(value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="h-48">
              <ResponsiveLine
                data={[
                  {
                    id: "Stress",
                    data: metricsHistory.map(m => ({ 
                      x: new Date(m.timestamp).toLocaleTimeString(), 
                      y: m.stressLevel 
                    }))
                  },
                  {
                    id: "Fatigue",
                    data: metricsHistory.map(m => ({ 
                      x: new Date(m.timestamp).toLocaleTimeString(), 
                      y: m.fatigueScore 
                    }))
                  }
                ]}
                margin={{ top: 10, right: 10, bottom: 30, left: 40 }}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: -45
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickValues: 5,
                }}
                enablePoints={false}
                enableGridX={false}
                curve="monotoneX"
                theme={{
                  axis: {
                    ticks: {
                      text: {
                        fontSize: 11,
                        fill: 'var(--muted-foreground)',
                      }
                    }
                  },
                  grid: {
                    line: {
                      stroke: 'var(--border)',
                      strokeDasharray: '2 2',
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Health Actions */}
          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => startBreathingExercise()}
              disabled={isBreathingActive}
            >
              <Activity className="w-4 h-4 mr-2" />
              {isBreathingActive ? 'Breathing Exercise Active...' : 'Start Breathing Exercise'}
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => startEyeExercise()}
              disabled={isEyeExerciseActive}
            >
              <Eye className="w-4 h-4 mr-2" />
              {isEyeExerciseActive ? 'Eye Exercise Active...' : 'Start Eye Exercise'}
            </Button>
          </div>

          {/* Professional Help */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Professional Support</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              If you consistently experience high stress or fatigue levels, consider speaking with a healthcare professional.
            </p>
            <Button variant="link" className="p-0 h-auto text-primary">
              Find Mental Health Resources →
            </Button>
          </div>
        </div>
      </Card>

      {/* Exercise Overlays */}
      {isBreathingActive && (
        <BreathingExercise onClose={() => setIsBreathingActive(false)} />
      )}
      {isEyeExerciseActive && (
        <EyeExercise onClose={() => setIsEyeExerciseActive(false)} />
      )}
    </>
  );
}
