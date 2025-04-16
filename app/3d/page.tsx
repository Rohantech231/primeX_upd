'use client';

import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

type EmotionPoint = {
  happiness: number;
  sadness: number;
  anger: number;
  timestamp: number;
};

export default function ThreeDVisualization() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [emotionData, setEmotionData] = useState<EmotionPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup with fog for depth
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.03);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.zoomSpeed = 0.5;

    // Lights
    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);
    
    const spotLight = new THREE.SpotLight(0xffffff, 1);
    spotLight.position.set(5, 10, 5);
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 0.1;
    spotLight.decay = 2;
    spotLight.distance = 200;
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 512;
    spotLight.shadow.mapSize.height = 512;
    scene.add(spotLight);

    // Ground plane
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x222222,
      metalness: 0.3,
      roughness: 0.8,
      side: THREE.DoubleSide
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Brain Visualization
    const brainGroup = new THREE.Group();
    
    // Core sphere
    const coreGeometry = new THREE.IcosahedronGeometry(1, 2);
    const coreMaterial = new THREE.MeshPhongMaterial({
      color: 0x4a90e2,
      emissive: 0x072534,
      side: THREE.DoubleSide,
      flatShading: true
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    core.castShadow = true;
    brainGroup.add(core);

    // Emotion particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 2000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const color = new THREE.Color();
    for (let i = 0; i < particleCount; i++) {
      const radius = 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      color.setHSL(Math.random(), 1.0, 0.5);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      sizes[i] = Math.random() * 0.1;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    brainGroup.add(particles);

    // Neural connections
    const connectionCount = 50;
    const curves: THREE.Line[] = [];
    
    for (let i = 0; i < connectionCount; i++) {
      const start = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      );
      const end = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      );
      const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
      mid.add(new THREE.Vector3(
        (Math.random() - 0.5),
        (Math.random() - 0.5) + 1,
        (Math.random() - 0.5)
      ));

      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const points = curve.getPoints(20);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({ 
        color: 0x4a90e2,
        transparent: true,
        opacity: 0.3
      });
      const curveObject = new THREE.Line(geometry, material);
      curves.push(curveObject);
      brainGroup.add(curveObject);
    }

    scene.add(brainGroup);

    // Camera position
    camera.position.set(4, 4, 4);
    controls.update();

    // Animation
    let frame = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      frame += 0.01;

      // Rotate brain group
      brainGroup.rotation.y += 0.001;

      // Animate particles
      const positions = particles.geometry.attributes.position.array as Float32Array;
      const colors = particles.geometry.attributes.color.array as Float32Array;
      const sizes = particles.geometry.attributes.size.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const x = positions[i3];
        const y = positions[i3 + 1];
        const z = positions[i3 + 2];

        // Oscillate particles
        positions[i3] = x * Math.cos(frame * 0.1) - z * Math.sin(frame * 0.1);
        positions[i3 + 2] = z * Math.cos(frame * 0.1) + x * Math.sin(frame * 0.1);
        
        // Pulse sizes
        sizes[i] = (Math.sin(frame + i) + 2) * 0.05;
        
        // Update colors based on emotion
        colors[i3] = Math.sin(frame) * 0.5 + 0.5; // Red (happiness)
        colors[i3 + 1] = Math.cos(frame) * 0.5 + 0.5; // Green (calmness)
        colors[i3 + 2] = Math.sin(frame * 0.5) * 0.5 + 0.5; // Blue (sadness)
      }

      particles.geometry.attributes.position.needsUpdate = true;
      particles.geometry.attributes.color.needsUpdate = true;
      particles.geometry.attributes.size.needsUpdate = true;

      // Animate neural connections
      curves.forEach((curve, i) => {
        const material = curve.material as THREE.LineBasicMaterial;
        material.opacity = (Math.sin(frame * 2 + i) + 1) * 0.2;
      });

      controls.update();
      renderer.render(scene, camera);
      
      // Remove loading state once first frame is rendered
      setIsLoading(false);
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
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (object.material instanceof THREE.Material) {
            object.material.dispose();
          }
        }
      });
      renderer.dispose();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        
        <Card className="p-4 sm:p-6">
          <h1 className="text-2xl font-bold mb-4">Neural Activity Visualization</h1>
          <p className="text-muted-foreground mb-6">
            An interactive 3D visualization of your emotional brain activity. The colors and patterns represent different emotional states:
            <br />
            • Red pulses indicate happiness levels
            <br />
            • Blue waves show calmness
            <br />
            • Neural connections represent emotional processing
          </p>
          <div 
            ref={containerRef} 
            className="w-full h-[70vh] rounded-lg overflow-hidden bg-gradient-to-b from-background to-black/30 shadow-inner"
          >
            {isLoading && (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            Tip: Use your mouse to rotate and zoom. The visualization updates in real-time with your emotional data.
          </div>
        </Card>
      </div>
    </div>
  );
}