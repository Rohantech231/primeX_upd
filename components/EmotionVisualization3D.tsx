'use client';

import { useRef, useEffect, useMemo } from 'react';
import * as d3 from 'd3';
import type { EmotionData } from '@/lib/emotion-detection';

interface EmotionVisualization3DProps {
  emotions: EmotionData;
  width: number;
  height: number;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
  emotion: string;
  value: number;
  originalX: number;
  originalY: number;
  originalZ: number;
}

const ROTATION_SPEED = 0.0005;
const MIN_OPACITY = 0.3;
const RADIUS_SCALE = 20;
const BASE_RADIUS = 5;

export function EmotionVisualization3D({ emotions, width, height }: EmotionVisualization3DProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const frameRef = useRef<number>();
  const pointsRef = useRef<Point3D[]>([]);

  // Memoize initial points calculation
  const initialPoints = useMemo(() => {
    const radius = Math.min(width, height) * 0.3;
    return Object.entries(emotions)
      .filter(([key]) => key !== 'timestamp')
      .map(([emotion, value], i, arr) => {
        const angle = (i * 2 * Math.PI) / arr.length;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        return {
          x,
          y,
          z: 0,
          emotion,
          value: value as number,
          originalX: x,
          originalY: y,
          originalZ: 0
        };
      });
  }, [emotions, width, height]);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    if (!svg.node()) return;

    // Clear previous content
    svg.selectAll('*').remove();

    // Create main group for 3D visualization
    const g = svg.append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    // Define colors for each emotion
    const colorScale = d3.scaleOrdinal<string>()
      .domain(['happiness', 'sadness', 'anger', 'surprise', 'fear', 'disgust', 'neutral'])
      .range(['#22c55e', '#60a5fa', '#ef4444', '#a855f7', '#6b7280', '#16a34a', '#94a3b8']);

    // Initialize points
    pointsRef.current = initialPoints;

    // Create connections between points
    const lines = g.selectAll('line')
      .data(pointsRef.current)
      .enter()
      .append('line')
      .attr('stroke', '#4b5563')
      .attr('stroke-width', 1)
      .attr('opacity', 0.3);

    // Create emotion nodes
    const nodes = g.selectAll('g.emotion-node')
      .data(pointsRef.current)
      .enter()
      .append('g')
      .attr('class', 'emotion-node');

    // Add circles for each emotion
    nodes.append('circle')
      .attr('r', d => Math.max(BASE_RADIUS, d.value * RADIUS_SCALE))
      .attr('fill', d => colorScale(d.emotion))
      .attr('opacity', 0.7)
      .attr('stroke', '#fff')
      .attr('stroke-width', 1);

    // Add labels
    nodes.append('text')
      .attr('dy', -15)
      .attr('text-anchor', 'middle')
      .attr('fill', '#fff')
      .attr('font-size', '12px')
      .attr('class', 'emotion-label')
      .text(d => d.emotion.charAt(0).toUpperCase() + d.emotion.slice(1));

    // Add value labels
    nodes.append('text')
      .attr('dy', 20)
      .attr('text-anchor', 'middle')
      .attr('fill', '#fff')
      .attr('font-size', '10px')
      .attr('class', 'value-label')
      .text(d => `${(d.value * 100).toFixed(0)}%`);

    let startTime = performance.now();

    const rotate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const angle = elapsed * ROTATION_SPEED;

      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);

      // Update points positions with rotation matrix
      pointsRef.current.forEach((point, i) => {
        // Apply 3D rotation matrix
        point.x = point.originalX * cosA - point.originalZ * sinA;
        point.z = point.originalX * sinA + point.originalZ * cosA;
        
        // Calculate depth-based scaling
        const scale = (point.z + 200) / 400;
        const adjustedX = point.x * scale;
        const adjustedY = point.y * scale;

        // Update lines
        if (lines.size()) {
          const nextIndex = (i + 1) % pointsRef.current.length;
          const nextPoint = pointsRef.current[nextIndex];
          const nextScale = (nextPoint.z + 200) / 400;

          lines.nodes()[i].setAttribute('x1', adjustedX.toString());
          lines.nodes()[i].setAttribute('y1', adjustedY.toString());
          lines.nodes()[i].setAttribute('x2', (nextPoint.x * nextScale).toString());
          lines.nodes()[i].setAttribute('y2', (nextPoint.y * nextScale).toString());
        }

        // Update node positions and opacity
        const node = nodes.nodes()[i];
        if (node) {
          const opacity = Math.max(MIN_OPACITY, Math.min(1, scale));
          d3.select(node)
            .attr('transform', `translate(${adjustedX},${adjustedY}) scale(${scale})`)
            .attr('opacity', opacity);
        }
      });

      frameRef.current = requestAnimationFrame(rotate);
    };

    frameRef.current = requestAnimationFrame(rotate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [initialPoints, width, height]);

  return (
    <div className="relative w-full h-full bg-background rounded-lg shadow-lg overflow-hidden">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="w-full h-full"
        style={{ background: 'transparent' }}
      >
        <defs>
          <radialGradient id="emotion-glow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>
      </svg>
     </div>
  );
}
