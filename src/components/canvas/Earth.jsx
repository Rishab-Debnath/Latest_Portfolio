import React, { Suspense, useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import { shaderMaterial, Preload } from "@react-three/drei";
import * as THREE from "three";

import CanvasLoader from "../Loader";

// ─────────────────────────────────────────────────────────────
// GLSL helpers: 3-D Simplex Noise (Ashima Arts / Ian McEwan)
// ─────────────────────────────────────────────────────────────
const SIMPLEX_GLSL = /* glsl */ `
vec3 mod289(vec3 x){ return x - floor(x*(1./289.))*289.; }
vec4 mod289(vec4 x){ return x - floor(x*(1./289.))*289.; }
vec4 permute(vec4 x){ return mod289((x*34.+1.)*x); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314*r; }

float snoise(vec3 v){
  const vec2 C = vec2(1./6., 1./3.);
  const vec4 D = vec4(0., 0.5, 1., 2.);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g  = step(x0.yzx, x0.xyz);
  vec3 l  = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
    i.z+vec4(0.,i1.z,i2.z,1.))
   +i.y+vec4(0.,i1.y,i2.y,1.))
   +i.x+vec4(0.,i1.x,i2.x,1.));
  float n_ = .142857142857;
  vec3 ns = n_*D.wyz - D.xzx;
  vec4 j  = p - 49.*floor(p*ns.z*ns.z);
  vec4 x_ = floor(j*ns.z);
  vec4 y_ = floor(j - 7.*x_);
  vec4 x  = x_*ns.x + ns.yyyy;
  vec4 y  = y_*ns.x + ns.yyyy;
  vec4 h  = 1. - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.+1.;
  vec4 s1 = floor(b1)*2.+1.;
  vec4 sh = -step(h, vec4(0.));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);
  m = m*m;
  return 42.*dot(m*m, vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
`;

// ─────────────────────────────────────────────────────────────
// Shader source
// ─────────────────────────────────────────────────────────────
const vertexShader = /* glsl */ `
${SIMPLEX_GLSL}

uniform float uTime;
uniform float uNoiseScale;
uniform float uDisplacement;

varying vec3  vNormal;
varying vec3  vViewPos;
varying float vNoise;

void main(){
  vec3 pos       = position;
  float noise    = snoise(normal * uNoiseScale + uTime * 0.35);
  pos           += normal * noise * uDisplacement;
  vNoise         = noise;
  vec4 mvPos     = modelViewMatrix * vec4(pos, 1.0);
  vViewPos       = -mvPos.xyz;
  vNormal        = normalize(normalMatrix * normal);
  gl_Position    = projectionMatrix * mvPos;
}
`;

const fragmentShader = /* glsl */ `
${SIMPLEX_GLSL}

uniform float uTime;
uniform vec3  uColorA;   // deep core  #0a0014
uniform vec3  uColorB;   // energy     #7c3aed
uniform vec3  uColorC;   // rim        #c4b5fd
uniform float uRimPower;
uniform float uGlowStrength;

varying vec3  vNormal;
varying vec3  vViewPos;
varying float vNoise;

void main(){
  // ── Fresnel / rim ──────────────────────────────────────────
  vec3  viewDir  = normalize(vViewPos);
  float fresnel  = pow(1.0 - max(dot(vNormal, viewDir), 0.0), uRimPower);

  // ── Animated noise energy ──────────────────────────────────
  float energy   = vNoise * 0.5 + 0.5;                    // remap [-1,1]→[0,1]
  float pulse    = 0.5 + 0.5 * sin(uTime * 1.8 + energy * 6.28);

  // ── Base colour mix ────────────────────────────────────────
  vec3 col       = mix(uColorA, uColorB, energy);
  col            = mix(col, uColorC, fresnel * 0.7);

  // ── Breathing glow overlay ─────────────────────────────────
  col           += uColorB * pulse * uGlowStrength;

  // ── Final alpha: core opaque, rim fades for additive blend ─
  float alpha    = 0.92 + fresnel * 0.08;

  gl_FragColor   = vec4(col, alpha);
}
`;

// ─────────────────────────────────────────────────────────────
// Register the shaderMaterial
// ─────────────────────────────────────────────────────────────
const ShadowOrbMaterial = shaderMaterial(
  {
    uTime:         0,
    uNoiseScale:   1.6,
    uDisplacement: 0.18,
    uColorA:       new THREE.Color("#0a0014"),
    uColorB:       new THREE.Color("#7c3aed"),
    uColorC:       new THREE.Color("#c4b5fd"),
    uRimPower:     3.2,
    uGlowStrength: 0.35,
  },
  vertexShader,
  fragmentShader,
  // make blending additive after creation
  (mat) => {
    if (mat) {
      mat.blending     = THREE.AdditiveBlending;
      mat.depthWrite   = false;
      mat.transparent  = true;
    }
  }
);

extend({ ShadowOrbMaterial });

// ─────────────────────────────────────────────────────────────
// Floating particles
// ─────────────────────────────────────────────────────────────
const Particles = ({ count = 150 }) => {
  const ref = useRef(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const phi   = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      const r     = 2.1 + Math.random() * 1.8;
      arr[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y  += 0.0007;
    ref.current.rotation.x  += 0.0003;
    ref.current.material.size =
      0.016 + Math.sin(state.clock.elapsedTime * 2.0) * 0.006;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.016}
        color="#a78bfa"
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// ─────────────────────────────────────────────────────────────
// Lightning ring
// ─────────────────────────────────────────────────────────────
const LightningRing = ({ radius, index }) => {
  const ref = useRef(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime + index * 1.4;
    ref.current.material.opacity = Math.abs(Math.sin(t * 1.1)) * 0.5;
    ref.current.rotation.z      += 0.007;
    ref.current.rotation.x       = Math.sin(t * 0.35) * 0.35;
  });
  return (
    <mesh ref={ref} rotation={[Math.PI / 2 + index * 0.55, 0, 0]}>
      <torusGeometry args={[radius, 0.011, 6, 90]} />
      <meshBasicMaterial
        color="#7c3aed"
        transparent
        opacity={0.4}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};

// ─────────────────────────────────────────────────────────────
// Outer glow quad (billboard-ish plane behind the orb)
// ─────────────────────────────────────────────────────────────
const GlowPlane = () => {
  const ref = useRef(null);
  useFrame((state) => {
    if (!ref.current) return;
    const pulse = 0.45 + Math.sin(state.clock.elapsedTime * 1.5) * 0.12;
    ref.current.material.opacity = pulse;
  });
  return (
    <mesh ref={ref} position={[0, 0, -0.1]}>
      <planeGeometry args={[7, 7]} />
      <meshBasicMaterial
        color="#3b0764"
        transparent
        opacity={0.45}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};

// ─────────────────────────────────────────────────────────────
// Shadow Orb scene
// ─────────────────────────────────────────────────────────────
const ShadowOrb = ({ mouse }) => {
  const matRef   = useRef(null);
  const groupRef = useRef(null);

  useFrame((state) => {
    if (matRef.current)   matRef.current.uTime = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.y +=
        (mouse.current.x * 0.5 - groupRef.current.rotation.y) * 0.04;
      groupRef.current.rotation.x +=
        (-mouse.current.y * 0.35 - groupRef.current.rotation.x) * 0.04;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Core orb with custom GLSL shader */}
      <mesh>
        <sphereGeometry args={[1.45, 128, 128]} />
        {/* @ts-ignore — custom extended material */}
        <shadowOrbMaterial ref={matRef} />
      </mesh>


      {/* Pulsing lightning rings */}
      <LightningRing radius={1.85} index={0} />
      <LightningRing radius={2.05} index={1} />
      <LightningRing radius={2.28} index={2} />

      {/* Orbiting particles */}
      <Particles count={160} />
    </group>
  );
};

// ─────────────────────────────────────────────────────────────
// Exported canvas
// ─────────────────────────────────────────────────────────────
const EarthCanvas = () => {
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e) => {
      mouse.current.x =  (e.clientX / window.innerWidth)  * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <Canvas
      frameloop="always"
      dpr={[1, 2]}
      gl={{ preserveDrawingBuffer: true, antialias: true }}
      camera={{ fov: 45, near: 0.1, far: 200, position: [0, 0, 7] }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <ambientLight intensity={0.08} />
        <pointLight position={[4, 4, 4]}   intensity={1.4} color="#7c3aed" />
        <pointLight position={[-4, -3, -3]} intensity={0.7} color="#4f46e5" />
        <pointLight position={[0, -5, 3]}  intensity={0.4} color="#1e1b4b" />

        <ShadowOrb mouse={mouse} />

        <Preload all />
      </Suspense>
    </Canvas>
  );
};

export default EarthCanvas;
