
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Background3D = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // 1. SETUP
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0f172a, 0.002);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // 2. PARTICLES (Starfield)
    const geometry = new THREE.BufferGeometry();
    const count = 1800; 
    const posArray = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count); 

    const color1 = new THREE.Color(0x6366f1); // Indigo
    const color2 = new THREE.Color(0xa855f7); // Purple
    const color3 = new THREE.Color(0xcbd5e1); // Slate White

    for(let i = 0; i < count * 3; i+=3) {
        posArray[i] = (Math.random() - 0.5) * 200; // x
        posArray[i+1] = (Math.random() - 0.5) * 200; // y
        posArray[i+2] = (Math.random() - 0.5) * 100; // z

        const rand = Math.random();
        let chosenColor = color3;
        if (rand < 0.33) chosenColor = color1;
        else if (rand < 0.66) chosenColor = color2;

        colors[i] = chosenColor.r;
        colors[i+1] = chosenColor.g;
        colors[i+2] = chosenColor.b;
        
        sizes[i/3] = Math.random() * 0.8;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const sprite = new THREE.TextureLoader().load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/sprites/disc.png');

    const material = new THREE.PointsMaterial({
        size: 0.5,
        vertexColors: true,
        map: sprite,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const particlesMesh = new THREE.Points(geometry, material);
    scene.add(particlesMesh);

    // 3. GRID LINES
    const gridHelper = new THREE.GridHelper(200, 50, 0x1e293b, 0x1e293b);
    gridHelper.position.y = -30;
    gridHelper.rotation.x = 0.2;
    scene.add(gridHelper);

    // 4. INTERACTION STATE
    let mouseX = 0;
    let mouseY = 0;
    
    // ADJUSTMENT: Much slower base speeds for "Deep Space" feel
    let targetSpeed = 0.0005; 
    const MAX_SPEED_ADD = 0.005;
    
    const handleMouseMove = (event: MouseEvent) => {
        mouseX = event.clientX / window.innerWidth - 0.5;
        mouseY = event.clientY / window.innerHeight - 0.5;
        
        // ADJUSTMENT: Reduced sensitivity calculation
        const dist = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
        targetSpeed = 0.0005 + (dist * MAX_SPEED_ADD);
    };

    document.addEventListener('mousemove', handleMouseMove);

    // 5. ANIMATION LOOP
    let frameId: number;
    let currentSpeed = 0.0005;

    const animate = () => {
        // Lerp speed for smooth transition
        currentSpeed += (targetSpeed - currentSpeed) * 0.03;

        // Rotate system (Gentle drift)
        particlesMesh.rotation.y += currentSpeed;
        particlesMesh.rotation.x = mouseY * 0.05; // Reduced vertical tilt range
        
        // Grid undulation
        const time = Date.now() * 0.0005; // Slower wave
        gridHelper.position.z = (Math.sin(time) * 2);
        gridHelper.rotation.y = -mouseX * 0.1;

        // Camera drift (Reduced amplitude)
        camera.position.x += (mouseX * 5 - camera.position.x) * 0.02;
        camera.position.y += (-mouseY * 5 - camera.position.y) * 0.02;
        
        // Dynamic FOV (Subtle warp)
        const targetFov = 75 + (currentSpeed * 100); 
        camera.fov += (targetFov - camera.fov) * 0.05;
        camera.updateProjectionMatrix();

        camera.lookAt(scene.position);

        renderer.render(scene, camera);
        frameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
        window.removeEventListener('resize', handleResize);
        document.removeEventListener('mousemove', handleMouseMove);
        cancelAnimationFrame(frameId);
        if (mountRef.current && renderer.domElement) {
             mountRef.current.removeChild(renderer.domElement);
        }
        geometry.dispose();
        material.dispose();
    };
  }, []);

  return (
    <div 
        ref={mountRef} 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ background: 'radial-gradient(circle at center, #1e1b4b 0%, #020617 100%)' }}
    />
  );
};

export default Background3D;
