'use client';

import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

type EmotionPoint = {
  happiness: number;
  sadness: number;
  anger: number;
  timestamp: number;
};

export default function ThreeDVisualization() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [emotionData, setEmotionData] = useState<EmotionPoint[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 10, 10);
    scene.add(directionalLight);

    // Create emotion visualization
    const emotionGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const emotionMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.8,
    });
    const emotionSphere = new THREE.Mesh(emotionGeometry, emotionMaterial);
    scene.add(emotionSphere);

    // Add axis helper
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    // Add grid helper
    const gridHelper = new THREE.GridHelper(10, 10);
    scene.add(gridHelper);

    // Add labels
    const createLabel = (text: string, position: THREE.Vector3) => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) return;

      canvas.width = 256;
      canvas.height = 64;
      context.fillStyle = '#ffffff';
      context.font = '32px Arial';
      context.fillText(text, 10, 40);

      const texture = new THREE.CanvasTexture(canvas);
      const material = new THREE.SpriteMaterial({ map: texture });
      const sprite = new THREE.Sprite(material);
      sprite.position.copy(position);
      sprite.scale.set(2, 0.5, 1);
      scene.add(sprite);
    };

    createLabel('Happiness', new THREE.Vector3(5, 0, 0));
    createLabel('Sadness', new THREE.Vector3(0, 5, 0));
    createLabel('Anger', new THREE.Vector3(0, 0, 5));

    // Particle system for emotion trails
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 1000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      sizes[i] = Math.random() * 0.1;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Camera position
    camera.position.set(5, 5, 5);
    controls.update();

    // Animation
    let frame = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      frame++;

      // Update emotion sphere
      const time = Date.now() * 0.001;
      emotionSphere.rotation.x = Math.sin(time) * 0.5;
      emotionSphere.rotation.y = Math.cos(time) * 0.5;

      // Update particles
      const positions = particles.geometry.attributes.position.array as Float32Array;
      const colors = particles.geometry.attributes.color.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3] += Math.sin(frame * 0.01 + i) * 0.01;
        positions[i3 + 1] += Math.cos(frame * 0.01 + i) * 0.01;
        positions[i3 + 2] += Math.sin(frame * 0.01 + i) * 0.01;

        // Color based on position
        colors[i3] = Math.abs(Math.sin(positions[i3])); // Red (happiness)
        colors[i3 + 1] = Math.abs(Math.cos(positions[i3 + 1])); // Green (sadness)
        colors[i3 + 2] = Math.abs(Math.sin(positions[i3 + 2])); // Blue (anger)
      }

      particles.geometry.attributes.position.needsUpdate = true;
      particles.geometry.attributes.color.needsUpdate = true;

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
      scene.remove(particles);
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      emotionGeometry.dispose();
      emotionMaterial.dispose();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Tracker
            </Button>
          </Link>
        </div>
        
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-4">3D Emotion Visualization</h1>
          <p className="text-muted-foreground mb-4">
            This visualization represents your emotional state in 3D space:
            <br />
            • X-axis (Red): Happiness
            <br />
            • Y-axis (Green): Sadness
            <br />
            • Z-axis (Blue): Anger
            <br />
            Use your mouse to rotate and zoom the visualization.
          </p>
          <div ref={containerRef} className="w-full h-[600px] rounded-lg overflow-hidden bg-black/10">
            {/* Three.js canvas will be inserted here */}
          </div>
        </Card>
      </div>
    </div>
  );
}