import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { CyberBackgroundProps } from '../types';

const CyberBackground: React.FC<CyberBackgroundProps> = ({ 
  intensity = 1.0,
  animated = true 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const linesRef = useRef<THREE.LineSegments | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0b1020, 10, 50);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 30;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x0b1020, 0.3);
    rendererRef.current = renderer;
    containerRef.current.appendChild(renderer.domElement);

    // Create particle system
    const particleCount = 1000 * intensity;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    // Cyberpunk color palette
    const color1 = new THREE.Color(0x00e5c4); // cyber-teal
    const color2 = new THREE.Color(0xff2d95); // cyber-magenta
    const color3 = new THREE.Color(0x8b5cf6); // cyber-purple

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Position
      positions[i3] = (Math.random() - 0.5) * 100;
      positions[i3 + 1] = (Math.random() - 0.5) * 100;
      positions[i3 + 2] = (Math.random() - 0.5) * 100;

      // Color - mix between cyber colors
      const colorChoice = Math.random();
      const selectedColor = colorChoice < 0.33 ? color1 : colorChoice < 0.66 ? color2 : color3;
      colors[i3] = selectedColor.r;
      colors[i3 + 1] = selectedColor.g;
      colors[i3 + 2] = selectedColor.b;

      // Size
      sizes[i] = Math.random() * 2;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    particlesRef.current = particles;

    // Create connecting lines (grid effect)
    const lineCount = 100;
    const linePositions = new Float32Array(lineCount * 6); // 2 points per line * 3 coords
    const lineColors = new Float32Array(lineCount * 6); // 2 points per line * 3 colors

    for (let i = 0; i < lineCount; i++) {
      const i6 = i * 6;
      
      // Line start
      linePositions[i6] = (Math.random() - 0.5) * 80;
      linePositions[i6 + 1] = (Math.random() - 0.5) * 80;
      linePositions[i6 + 2] = (Math.random() - 0.5) * 80;
      
      // Line end
      linePositions[i6 + 3] = linePositions[i6] + (Math.random() - 0.5) * 10;
      linePositions[i6 + 4] = linePositions[i6 + 1] + (Math.random() - 0.5) * 10;
      linePositions[i6 + 5] = linePositions[i6 + 2] + (Math.random() - 0.5) * 10;

      // Colors - cyber teal with fade
      const colorVar = Math.random() * 0.5 + 0.5;
      lineColors[i6] = color1.r * colorVar;
      lineColors[i6 + 1] = color1.g * colorVar;
      lineColors[i6 + 2] = color1.b * colorVar;
      lineColors[i6 + 3] = color1.r * colorVar * 0.5;
      lineColors[i6 + 4] = color1.g * colorVar * 0.5;
      lineColors[i6 + 5] = color1.b * colorVar * 0.5;
    }

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
    });

    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);
    linesRef.current = lines;

    // Animation loop
    let time = 0;
    const animate = () => {
      if (!animated) return;

      time += 0.001;

      // Rotate particle system
      if (particles) {
        particles.rotation.y = time * 0.1;
        particles.rotation.x = time * 0.05;
      }

      // Rotate lines
      if (lines) {
        lines.rotation.y = -time * 0.05;
        lines.rotation.x = time * 0.03;
      }

      // Gentle camera movement
      if (camera) {
        camera.position.x = Math.sin(time * 0.5) * 2;
        camera.position.y = Math.cos(time * 0.3) * 1;
        camera.lookAt(0, 0, 0);
      }

      renderer.render(scene, camera);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      if (!camera || !renderer) return;
      
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }

      particleGeometry.dispose();
      particleMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      renderer.dispose();
    };
  }, [intensity, animated]);

  return (
    <div 
      ref={containerRef} 
      className="three-canvas"
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  );
};

export default CyberBackground;