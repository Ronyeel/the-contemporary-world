import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import "./Earth3D.css";

// 1. Custom WebGL Shader Shaders for the Atmosphere Glow Ring
const vertexShader = `
  varying vec3 vNormal;
  varying vec3 vWorldNormal;
  varying vec3 vPosition;
  void main() {
    vNormal = normalize(normalMatrix * normal); // View-space normal (for camera Fresnel)
    vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz); // World-space normal (for sun direction)
    vPosition = position; // Local position of the vertex
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  varying vec3 vNormal;
  varying vec3 vWorldNormal;
  varying vec3 vPosition;
  uniform vec3 sunDirection;
  void main() {
    // Fresnel rim glow: wider, highly saturated rim glow based on camera view angle
    float intensity = pow(0.75 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 1.8);
    
    // Sun-facing factor: atmosphere glows only on the sunlit side in world space
    float sunFacing = dot(vWorldNormal, normalize(sunDirection));
    float sunGlow = smoothstep(-0.25, 0.45, sunFacing);
    
    // Aurora height blend: fades from cyan-blue to vibrant aurora-green at the top pole
    float heightFactor = smoothstep(0.35, 0.92, vPosition.y);
    vec3 glowColor = mix(vec3(0.0, 0.62, 1.0), vec3(0.0, 1.0, 0.5), heightFactor);
    
    // Saturation and vibrance boost (1.5x color multiplier)
    gl_FragColor = vec4(glowColor * intensity * sunGlow * 1.5, intensity * sunGlow);
  }
`;

const Earth3D = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let width = container.clientWidth || 500;
    let height = container.clientHeight || 500;

    const baseDistance = 3.6; 

    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    const initialAspect = width / height;
    camera.position.z = initialAspect < 1 ? baseDistance / initialAspect : baseDistance;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


    // Realistic space ambient: dark space is almost pitch black
    const ambientLight = new THREE.AmbientLight(0x0b1120, 0.08);
    scene.add(ambientLight);

    // Blindingly bright white daylight Sun (vacuum sunlight intensity)
    const sunLight = new THREE.DirectionalLight(0xffffff, 5.0);
    sunLight.position.set(5, 3.5, 5);
    scene.add(sunLight);

    // Very subtle electric blue back rim light to soft-silhouette the dark side
    const backRimLight = new THREE.DirectionalLight(0x0088ff, 0.35);
    backRimLight.position.set(-6, 2, -6);
    scene.add(backRimLight);

    // Subtle polar green aurora cast to blend realistically with the atmospheric aurora shader
    const auroraLight = new THREE.DirectionalLight(0x00ff66, 0.25);
    auroraLight.position.set(0, 5, 0); // Pointing straight down at the top polar region
    scene.add(auroraLight);

    // 4. Create Earth Group
    const earthGroup = new THREE.Group();
    scene.add(earthGroup);

    // 5. Load textures using LoadingManager
    const loadingManager = new THREE.LoadingManager();
    const textureLoader = new THREE.TextureLoader(loadingManager);

    const dayUrl = "/earth-blue-marble.jpg";
    const nightUrl = "/earth-night.jpg";
    const cloudsUrl = "/earth-clouds.png";

    let dayTexture, nightTexture, cloudsTexture;
    
    let earthGeometry;
    let earthMaterial;
    let earthMesh;
    
    let cloudsGeometry;
    let cloudsMaterial;
    let cloudsMesh;

    let atmosphereGeometry;
    let atmosphereMaterial;
    let atmosphereMesh;

    let animationFrameId;

    loadingManager.onLoad = () => {
      // Configure loaded textures
      dayTexture.colorSpace = THREE.SRGBColorSpace;
      nightTexture.colorSpace = THREE.SRGBColorSpace;
      cloudsTexture.colorSpace = THREE.SRGBColorSpace;

      // Primary Earth Mesh (Day map + Emissive night map with specular glossiness)
      earthGeometry = new THREE.SphereGeometry(1.0, 64, 64);
      earthMaterial = new THREE.MeshStandardMaterial({
        map: dayTexture,
        emissiveMap: nightTexture,
        emissive: new THREE.Color("#ff9933"), // Warm golden-orange emissive for city lights
        emissiveIntensity: 2.8, // Golden glowing city lights on shadow side
        roughness: 0.38, // Lower roughness for a high-specularity, glossy finish on oceans
        metalness: 0.18 // Subtle metallic boost to make land/water interaction pop
      });
      earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
      earthGroup.add(earthMesh);

      // Secondary Volumetric Clouds Mesh (Rotates at different speed for parallax)
      cloudsGeometry = new THREE.SphereGeometry(1.006, 64, 64);
      cloudsMaterial = new THREE.MeshStandardMaterial({
        alphaMap: cloudsTexture,
        map: cloudsTexture,
        transparent: true,
        opacity: 0.38,
        blending: THREE.NormalBlending
      });
      cloudsMesh = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
      earthGroup.add(cloudsMesh);

      // Custom atmosphere ring (Fresnel rim + sun-facing + aurora top gradient)
      atmosphereGeometry = new THREE.SphereGeometry(1.015, 64, 64);
      atmosphereMaterial = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: {
          sunDirection: { value: new THREE.Vector3(5, 3.5, 5).normalize() }
        },
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide
      });
      atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
      earthGroup.add(atmosphereMesh);

      // Finish loading state
      setLoading(false);
    };

    loadingManager.onError = (url) => {
      console.error("Error loading WebGL asset: ", url);
      setError(true);
      setLoading(false);
    };

    // Trigger texture loads
    dayTexture = textureLoader.load(dayUrl);
    nightTexture = textureLoader.load(nightUrl);
    cloudsTexture = textureLoader.load(cloudsUrl);

    // Rotation angles and drag physics
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let targetRotationX = 0.12; // Downward tilt matching your image
    let targetRotationY = 0;
    
    const autoSpinSpeed = 0.0008;

    // 6. Interactive Drag Controls with Momentum Easing
    const handleMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = {
        x: e.clientX,
        y: e.clientY
      };
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;

      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      targetRotationY += deltaX * 0.0045;
      targetRotationX += deltaY * 0.0045;

      // Cap vertical angle limit
      targetRotationX = Math.max(-Math.PI / 2.3, Math.min(Math.PI / 2.3, targetRotationX));

      previousMousePosition = {
        x: e.clientX,
        y: e.clientY
      };
    };

    const handleMouseUpOrLeave = () => {
      isDragging = false;
    };

    // Mobile touch controls
    const handleTouchStart = (e) => {
      if (e.touches.length !== 1) return;
      isDragging = true;
      previousMousePosition = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
    };

    const handleTouchMove = (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      
      const deltaX = e.touches[0].clientX - previousMousePosition.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.y;

      targetRotationY += deltaX * 0.0055;
      targetRotationX += deltaY * 0.0055;
      
      targetRotationX = Math.max(-Math.PI / 2.3, Math.min(Math.PI / 2.3, targetRotationX));

      previousMousePosition = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
    };

    // Attach listeners
    canvas.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUpOrLeave);
    canvas.addEventListener("mouseleave", handleMouseUpOrLeave);
    
    canvas.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleMouseUpOrLeave);

    // 7. Render Animation Loop (Easing rotation + separate cloud parallax)
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Auto rotation spins target when idle
      if (!isDragging) {
        targetRotationY += autoSpinSpeed;
      }

      // Smoothly interpolate current mesh rotation to target rotation (easing inertia)
      earthGroup.rotation.y += (targetRotationY - earthGroup.rotation.y) * 0.08;
      earthGroup.rotation.x += (targetRotationX - earthGroup.rotation.x) * 0.08;

      // Parallax effect: Clouds rotate slightly faster than the continents!
      if (cloudsMesh) {
        cloudsMesh.rotation.y += 0.0005;
      }

      renderer.render(scene, camera);
    };
    
    animate();

    // 8. Responsive Resize
    const handleResize = () => {
      if (!container || !canvas) return;
      width = container.clientWidth;
      height = container.clientHeight;

      const aspect = width / height;
      camera.aspect = aspect;
      camera.position.z = aspect < 1 ? baseDistance / aspect : baseDistance;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    // 9. CRITICAL unmount resource disposal (prevents memory leaks and WebGL context loss)
    return () => {
      resizeObserver.disconnect();
      
      canvas.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUpOrLeave);
      canvas.removeEventListener("mouseleave", handleMouseUpOrLeave);
      
      canvas.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUpOrLeave);

      cancelAnimationFrame(animationFrameId);

      // Dispose three.js nodes
      if (earthGeometry) earthGeometry.dispose();
      if (earthMaterial) earthMaterial.dispose();
      if (cloudsGeometry) cloudsGeometry.dispose();
      if (cloudsMaterial) cloudsMaterial.dispose();
      if (atmosphereGeometry) atmosphereGeometry.dispose();
      if (atmosphereMaterial) atmosphereMaterial.dispose();
      
      if (dayTexture) dayTexture.dispose();
      if (nightTexture) nightTexture.dispose();
      if (cloudsTexture) cloudsTexture.dispose();
      
      renderer.dispose();
    };
  }, []);

  return (
    <div className="earth-canvas-container" ref={containerRef}>
      {loading && (
        <div className="earth-loading">
          <div className="spinner"></div>
          <span>Aligning WebGL Orbit...</span>
        </div>
      )}
      {error && (
        <div className="earth-error">
          <span>WebGL assets loading failed.</span>
        </div>
      )}
      <canvas className="earth-canvas" ref={canvasRef} />
    </div>
  );
};

export default Earth3D;
