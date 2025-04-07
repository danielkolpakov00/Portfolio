/* eslint-disable react/no-unknown-property */
import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Effect } from "postprocessing";
import { setDitherRendered } from "../../hooks/useLoadingState";

// Skip EffectComposer import and implement a direct shader material approach
// This avoids compatibility issues with EffectComposer

const DitherShader = ({
  waveSpeed = 0.05,
  waveFrequency = 3,
  waveAmplitude = 0.3,
  waveColor = [0.2, 0.4, 0.8],
  colorNum = 4,
  pixelSize = 2,
  disableAnimation = false,
  enableMouseInteraction = true,
  mouseRadius = 1,
}) => {
  const meshRef = useRef();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { size, viewport, gl } = useThree();

  // Create a combined shader that implements both the wave and dither effects in one pass
  const uniforms = useRef({
    time: { value: 0 },
    resolution: { value: new THREE.Vector2(1, 1) },
    waveSpeed: { value: waveSpeed },
    waveFrequency: { value: waveFrequency },
    waveAmplitude: { value: waveAmplitude },
    waveColor: { value: new THREE.Color(...waveColor) },
    mousePos: { value: new THREE.Vector2(0, 0) },
    enableMouseInteraction: { value: enableMouseInteraction ? 1 : 0 },
    mouseRadius: { value: mouseRadius },
    colorNum: { value: colorNum },
    pixelSize: { value: pixelSize }
  });

  // Update resolution when canvas size changes
  useEffect(() => {
    const dpr = gl.getPixelRatio();
    uniforms.current.resolution.value.set(
      size.width * dpr,
      size.height * dpr
    );
  }, [gl, size]);

  // Update animation and other uniforms
  useFrame(({ clock }) => {
    if (!disableAnimation) {
      uniforms.current.time.value = clock.getElapsedTime();
    }
    uniforms.current.waveSpeed.value = waveSpeed;
    uniforms.current.waveFrequency.value = waveFrequency;
    uniforms.current.waveAmplitude.value = waveAmplitude;
    uniforms.current.waveColor.value.set(...waveColor);
    uniforms.current.mouseRadius.value = mouseRadius;
    uniforms.current.enableMouseInteraction.value = enableMouseInteraction ? 1 : 0;
    uniforms.current.colorNum.value = colorNum;
    uniforms.current.pixelSize.value = pixelSize;

    if (enableMouseInteraction) {
      uniforms.current.mousePos.value.set(mousePos.x, mousePos.y);
    }
  });

  // Handle mouse movement
  const handlePointerMove = (e) => {
    if (!enableMouseInteraction) return;
    
    const rect = gl.domElement.getBoundingClientRect();
    const dpr = gl.getPixelRatio();
    const x = (e.clientX - rect.left) * dpr;
    const y = (e.clientY - rect.top) * dpr;
    setMousePos({ x, y });
  };

  // Combined fragment shader that includes wave pattern generation and dithering
  const fragmentShader = `
    precision highp float;
    uniform vec2 resolution;
    uniform float time;
    uniform float waveSpeed;
    uniform float waveFrequency;
    uniform float waveAmplitude;
    uniform vec3 waveColor;
    uniform vec2 mousePos;
    uniform int enableMouseInteraction;
    uniform float mouseRadius;
    uniform float colorNum;
    uniform float pixelSize;
    varying vec2 vUv;
    
    // Perlin noise functions
    vec4 mod289(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    vec2 fade(vec2 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }
    
    float cnoise(vec2 P) {
      vec4 Pi = floor(P.xyxy) + vec4(0.0,0.0,1.0,1.0);
      vec4 Pf = fract(P.xyxy) - vec4(0.0,0.0,1.0,1.0);
      Pi = mod289(Pi);
      vec4 ix = Pi.xzxz;
      vec4 iy = Pi.yyww;
      vec4 fx = Pf.xzxz;
      vec4 fy = Pf.yyww;
      vec4 i = permute(permute(ix) + iy);
      vec4 gx = fract(i * (1.0/41.0)) * 2.0 - 1.0;
      vec4 gy = abs(gx) - 0.5;
      vec4 tx = floor(gx + 0.5);
      gx = gx - tx;
      vec2 g00 = vec2(gx.x, gy.x);
      vec2 g10 = vec2(gx.y, gy.y);
      vec2 g01 = vec2(gx.z, gy.z);
      vec2 g11 = vec2(gx.w, gy.w);
      vec4 norm = taylorInvSqrt(vec4(dot(g00,g00), dot(g01,g01), dot(g10,g10), dot(g11,g11)));
      g00 *= norm.x; g01 *= norm.y; g10 *= norm.z; g11 *= norm.w;
      float n00 = dot(g00, vec2(fx.x, fy.x));
      float n10 = dot(g10, vec2(fx.y, fy.y));
      float n01 = dot(g01, vec2(fx.z, fy.z));
      float n11 = dot(g11, vec2(fx.w, fy.w));
      vec2 fade_xy = fade(Pf.xy);
      vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
      return 2.3 * mix(n_x.x, n_x.y, fade_xy.y);
    }
    
    // Fractal Brownian Motion
    const int OCTAVES = 8;
    float fbm(vec2 p) {
      float value = 0.0;
      float amp = 1.0;
      float freq = waveFrequency;
      for (int i = 0; i < OCTAVES; i++) {
        value += amp * abs(cnoise(p));
        p *= freq;
        amp *= waveAmplitude;
      }
      return value;
    }
    
    // Wave pattern
    float pattern(vec2 p) {
      vec2 p2 = p - time * waveSpeed;
      return fbm(p - fbm(p + fbm(p2)));
    }
    
    // Bayer matrix for dithering
    const float bayerMatrix8x8[64] = float[64](
      0.0/64.0, 48.0/64.0, 12.0/64.0, 60.0/64.0, 3.0/64.0, 51.0/64.0, 15.0/64.0, 63.0/64.0,
      32.0/64.0, 16.0/64.0, 44.0/64.0, 28.0/64.0, 35.0/64.0, 19.0/64.0, 47.0/64.0, 31.0/64.0,
      8.0/64.0, 56.0/64.0, 4.0/64.0, 52.0/64.0, 11.0/64.0, 59.0/64.0, 7.0/64.0, 55.0/64.0,
      40.0/64.0, 24.0/64.0, 36.0/64.0, 20.0/64.0, 43.0/64.0, 27.0/64.0, 39.0/64.0, 23.0/64.0,
      2.0/64.0, 50.0/64.0, 14.0/64.0, 62.0/64.0, 1.0/64.0, 49.0/64.0, 13.0/64.0, 61.0/64.0,
      34.0/64.0, 18.0/64.0, 46.0/64.0, 30.0/64.0, 33.0/64.0, 17.0/64.0, 45.0/64.0, 29.0/64.0,
      10.0/64.0, 58.0/64.0, 6.0/64.0, 54.0/64.0, 9.0/64.0, 57.0/64.0, 5.0/64.0, 53.0/64.0,
      42.0/64.0, 26.0/64.0, 38.0/64.0, 22.0/64.0, 41.0/64.0, 25.0/64.0, 37.0/64.0, 21.0/64.0
    );
    
    // Apply dithering to a color
    vec3 applyDither(vec3 color, vec2 uv) {
      vec2 scaledCoord = floor(uv * resolution / pixelSize);
      int x = int(mod(scaledCoord.x, 8.0));
      int y = int(mod(scaledCoord.y, 8.0));
      float threshold = bayerMatrix8x8[y * 8 + x] - 0.25;
      float step = 1.0 / (colorNum - 1.0);
      color += threshold * step;
      float bias = 0.2;
      color = clamp(color - bias, 0.0, 1.0);
      return floor(color * (colorNum - 1.0) + 0.5) / (colorNum - 1.0);
    }
    
    void main() {
      // Generate normalized pixel coordinates
      vec2 uv = gl_FragCoord.xy / resolution.xy;
      
      // Pixelate the UV coordinates
      vec2 pixelUV = floor(uv * resolution / pixelSize) * pixelSize / resolution;
      
      // Compute wave pattern
      vec2 p = pixelUV - 0.5;
      p.x *= resolution.x / resolution.y;
      float f = pattern(p);
      
      // Apply mouse interaction if enabled
      if (enableMouseInteraction == 1) {
        vec2 mouseNDC = (mousePos / resolution - 0.5) * vec2(1.0, -1.0);
        mouseNDC.x *= resolution.x / resolution.y;
        float dist = length(p - mouseNDC);
        float effect = 1.0 - smoothstep(0.0, mouseRadius, dist);
        f -= 0.5 * effect;
      }
      
      // Create base color from wave pattern
      vec3 color = mix(vec3(0.0), waveColor, f);
      
      // Apply dithering
      color = applyDither(color, uv);
      
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  const vertexShader = `
    varying vec2 vUv;
    
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  return (
    <mesh 
      ref={meshRef} 
      scale={[viewport.width, viewport.height, 1]} 
      onPointerMove={handlePointerMove}
    >
      <planeGeometry args={[1, 1]} />
      <shaderMaterial 
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms.current}
        transparent={true}
      />
    </mesh>
  );
};

// Exported component with default props
export default function Dither({
  waveSpeed = 0.01,
  waveFrequency = 1.5,
  waveAmplitude = 0.15,
  waveColor = [0.2, 0.4, 0.8],
  colorNum = 4,
  pixelSize = 2,
  disableAnimation = false,
  enableMouseInteraction = true,
  mouseRadius = 0.3,
  className = "",
  style = {}
}) {
  // Signal that the dither component has rendered
  useEffect(() => {
    // Small timeout to ensure the Canvas has fully initialized
    const timer = setTimeout(() => {
      setDitherRendered();
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`${className} w-full h-full`} style={style}>
      <Canvas
        camera={{ position: [0, 0, 1] }}
        dpr={[1, 2]} // Limit DPR for performance
        gl={{ 
          antialias: false, 
          alpha: true,
          preserveDrawingBuffer: true
        }}
      >
        <DitherShader
          waveSpeed={disableAnimation ? 0 : waveSpeed}
          waveFrequency={waveFrequency}
          waveAmplitude={waveAmplitude}
          waveColor={waveColor}
          colorNum={colorNum}
          pixelSize={pixelSize}
          disableAnimation={disableAnimation}
          enableMouseInteraction={enableMouseInteraction}
          mouseRadius={mouseRadius}
        />
      </Canvas>
    </div>
  );
}
