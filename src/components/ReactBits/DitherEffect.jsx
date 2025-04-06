import React, { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, extend, useThree, useFrame } from '@react-three/fiber';

// Create a custom shader material for the dither effect
class DitherShaderMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        tDiffuse: { value: null },
        resolution: { value: new THREE.Vector2(1, 1) },
        pixelSize: { value: 2.0 },
        colorLevels: { value: 4.0 },
        time: { value: 0 },
        noiseIntensity: { value: 0.1 },
        waveSpeed: { value: 0.05 },
        blueMultiplier: { value: 1.2 }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform vec2 resolution;
        uniform float pixelSize;
        uniform float colorLevels;
        uniform float time;
        uniform float noiseIntensity;
        uniform float waveSpeed;
        uniform float blueMultiplier;
        varying vec2 vUv;

        // Bayer 8x8 matrix for ordered dithering
        const float bayerMatrix[64] = float[64](
          0.0/64.0, 48.0/64.0, 12.0/64.0, 60.0/64.0, 3.0/64.0, 51.0/64.0, 15.0/64.0, 63.0/64.0,
          32.0/64.0, 16.0/64.0, 44.0/64.0, 28.0/64.0, 35.0/64.0, 19.0/64.0, 47.0/64.0, 31.0/64.0,
          8.0/64.0, 56.0/64.0, 4.0/64.0, 52.0/64.0, 11.0/64.0, 59.0/64.0, 7.0/64.0, 55.0/64.0,
          40.0/64.0, 24.0/64.0, 36.0/64.0, 20.0/64.0, 43.0/64.0, 27.0/64.0, 39.0/64.0, 23.0/64.0,
          2.0/64.0, 50.0/64.0, 14.0/64.0, 62.0/64.0, 1.0/64.0, 49.0/64.0, 13.0/64.0, 61.0/64.0,
          34.0/64.0, 18.0/64.0, 46.0/64.0, 30.0/64.0, 33.0/64.0, 17.0/64.0, 45.0/64.0, 29.0/64.0,
          10.0/64.0, 58.0/64.0, 6.0/64.0, 54.0/64.0, 9.0/64.0, 57.0/64.0, 5.0/64.0, 53.0/64.0,
          42.0/64.0, 26.0/64.0, 38.0/64.0, 22.0/64.0, 41.0/64.0, 25.0/64.0, 37.0/64.0, 21.0/64.0
        );
        
        // A simple hash function
        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
        }
        
        // Simple noise function
        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          return mix(
            mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
            mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
            f.y
          );
        }
        
        void main() {
          // Pixelate the coordinates
          vec2 pixelatedUv = floor(vUv * resolution / pixelSize) * pixelSize / resolution;
          vec4 texColor = texture2D(tDiffuse, pixelatedUv);
          
          // Add some noise that changes over time
          vec2 noiseCoord = vUv * 5.0 + time * waveSpeed;
          float noiseValue = noise(noiseCoord) * noiseIntensity;
          
          // Apply blue tint to Windows XP Bliss-style
          texColor.b *= blueMultiplier;
          
          // Get the matrix position for dithering
          int x = int(mod(gl_FragCoord.x, 8.0));
          int y = int(mod(gl_FragCoord.y, 8.0));
          float threshold = bayerMatrix[y * 8 + x];
          
          // Apply dithering to each color channel
          vec3 color = texColor.rgb;
          color += threshold / colorLevels;
          color += noiseValue;
          color = floor(color * colorLevels) / colorLevels;
          
          gl_FragColor = vec4(color, texColor.a);
        }
      `
    });
  }
}

// Extend with our custom material
extend({ DitherShaderMaterial });

// Setup render target and make it accessible to effects
function createRenderTarget(gl) {
  return new THREE.WebGLRenderTarget(
    gl.domElement.width,
    gl.domElement.height,
    {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      stencilBuffer: false
    }
  );
}

// FullScreenQuad component for post-processing
function FullScreenQuad({ material }) {
  const mesh = useRef();
  const { viewport } = useThree();

  useEffect(() => {
    if (mesh.current) {
      mesh.current.frustumCulled = false;
    }
  }, []);

  return (
    <mesh ref={mesh} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

// Screen component that renders the scene to a texture and applies shader
function DitherScreen({
  pixelSize = 2.0,
  colorLevels = 4.0,
  waveSpeed = 0.05,
  noiseIntensity = 0.1,
  blueMultiplier = 1.2
}) {
  const { gl, scene, camera, size } = useThree();
  
  // Create render targets
  const [renderTarget, material] = useMemo(() => {
    const rt = createRenderTarget(gl);
    const mat = new DitherShaderMaterial();
    return [rt, mat];
  }, [gl]);
  
  // Update uniforms on size change
  useEffect(() => {
    if (material) {
      material.uniforms.resolution.value.set(
        size.width * gl.getPixelRatio(),
        size.height * gl.getPixelRatio()
      );
    }
    
    // Update render target size
    renderTarget.setSize(
      size.width * gl.getPixelRatio(),
      size.height * gl.getPixelRatio()
    );
  }, [gl, material, renderTarget, size]);
  
  // Update effect parameters when props change
  useEffect(() => {
    if (material) {
      material.uniforms.pixelSize.value = pixelSize;
      material.uniforms.colorLevels.value = colorLevels;
      material.uniforms.waveSpeed.value = waveSpeed;
      material.uniforms.noiseIntensity.value = noiseIntensity;
      material.uniforms.blueMultiplier.value = blueMultiplier;
    }
  }, [material, pixelSize, colorLevels, waveSpeed, noiseIntensity, blueMultiplier]);
  
  // Update effect every frame
  useFrame((state, delta) => {
    // First render scene into render target
    gl.setRenderTarget(renderTarget);
    gl.render(scene, camera);
    gl.setRenderTarget(null);
    
    // Update shader uniforms
    if (material) {
      material.uniforms.tDiffuse.value = renderTarget.texture;
      material.uniforms.time.value += delta;
    }
  }, 1);
  
  return <FullScreenQuad material={material} />;
}

// Main component
const DitherEffect = ({
  children,
  pixelSize = 2,
  colorLevels = 4,
  waveSpeed = 0.05,
  noiseIntensity = 0.1,
  blueMultiplier = 1.2,
  className
}) => {
  return (
    <div className={`${className || ''} w-full h-full`}>
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        {children}
        <DitherScreen
          pixelSize={pixelSize}
          colorLevels={colorLevels}
          waveSpeed={waveSpeed}
          noiseIntensity={noiseIntensity}
          blueMultiplier={blueMultiplier}
        />
      </Canvas>
    </div>
  );
};

export default DitherEffect;