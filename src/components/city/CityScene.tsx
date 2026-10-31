import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { gsap } from 'gsap';
import { districts } from './model';

type Part = {
  size: [number, number, number];
  at: [number, number, number];
  color: string;
  turn?: number;
};
const stone = '#d6d9dc',
  trim = '#edf0ef',
  glass = '#354951',
  wood = '#bba17d';
const box = (
  size: Part['size'],
  at: Part['at'],
  color = stone,
  turn = 0,
): Part => ({ size, at, color, turn });
function Blocks({
  parts,
  luminous = false,
}: {
  parts: Part[];
  luminous?: boolean;
}) {
  const geometry = useMemo(() => {
    const pieces = parts.map((part) => {
      const geometry = new THREE.BoxGeometry(...part.size).toNonIndexed();
      geometry.rotateY(part.turn || 0);
      geometry.translate(...part.at);
      const color = new THREE.Color(part.color);
      const colors = new Float32Array(geometry.attributes.position.count * 3);
      for (let i = 0; i < colors.length; i += 3) {
        colors[i] = color.r;
        colors[i + 1] = color.g;
        colors[i + 2] = color.b;
      }
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      return geometry;
    });
    const merged = mergeGeometries(pieces);
    pieces.forEach((piece) => piece.dispose());
    return merged;
  }, [parts]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial
        vertexColors
        roughness={0.66}
        metalness={0.16}
        emissive={luminous ? '#ffffff' : '#000000'}
        emissiveIntensity={luminous ? 0.45 : 0}
      />
    </mesh>
  );
}
function Cylinder({
  at,
  radius,
  height,
  color = stone,
  top = radius,
  segments = 48,
}: {
  at: [number, number, number];
  radius: number;
  height: number;
  color?: string;
  top?: number;
  segments?: number;
}) {
  return (
    <mesh position={at} castShadow receiveShadow>
      <cylinderGeometry args={[top, radius, height, segments]} />
      <meshStandardMaterial color={color} roughness={0.5} metalness={0.2} />
    </mesh>
  );
}
function Ring({
  at,
  radius,
  tube = 0.04,
  color = '#bcd7e5',
  tilt = 0,
}: {
  at: [number, number, number];
  radius: number;
  tube?: number;
  color?: string;
  tilt?: number;
}) {
  return (
    <mesh position={at} rotation={[Math.PI / 2, tilt, 0]}>
      <torusGeometry args={[radius, tube, 8, 64]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        roughness={0.3}
      />
    </mesh>
  );
}
function Library({ expanded, moving }: { expanded: boolean; moving: boolean }) {
  const floors = useRef<THREE.Group>(null);
  const { gl, invalidate } = useThree();
  const structure = useMemo(() => {
    const parts: Part[] = [
      box([4.3, 0.18, 3.1], [0, 0.1, 0], trim),
      box([3.6, 2.05, 2.45], [0, 1.15, 0], glass),
    ];
    for (let i = 0; i < 12; i++) {
      const x = -1.7 + i * 0.31;
      parts.push(
        box([0.06, 2.1, 0.09], [x, 1.2, 1.26], wood),
        box([0.06, 2.1, 0.09], [x, 1.2, -1.26], wood),
      );
    }
    for (let i = 0; i < 4; i++)
      parts.push(
        box([4.1 - i * 0.12, 0.12, 2.9], [0, 0.3 + i * 0.55, 0], trim),
      );
    for (let i = 0; i < 3; i++)
      parts.push(
        box(
          [1.8 - i * 0.16, 0.08, 0.25],
          [0, 0.06 + i * 0.07, 1.65 + i * 0.2],
          stone,
        ),
      );
    return parts;
  }, []);
  const roof = useMemo(
    () => [
      box([4.15, 0.18, 2.95], [0, 0, 0], trim),
      box([1.7, 0.28, 1.1], [-0.5, 0.2, 0], glass),
      box([1.8, 0.06, 1.2], [-0.5, 0.36, 0], stone),
    ],
    [],
  );
  useEffect(() => {
    if (!floors.current) return;
    const tween = gsap.to(floors.current.position, {
      y: expanded ? 4.0 : 2.65,
      onUpdate: () => {
        gl.shadowMap.needsUpdate = true;
        invalidate();
      },
      duration: moving ? 1.1 : 0,
      ease: 'power3.inOut',
    });
    return () => {
      tween.kill();
    };
  }, [expanded, moving, gl, invalidate]);
  return (
    <>
      <Blocks parts={structure} />
      <group ref={floors} position={[0, 2.65, 0]}>
        <Blocks parts={roof} />
      </group>
      <Ring at={[0, 0.22, 0]} radius={2.7} color="#ceb993" />
    </>
  );
}
function Exchange() {
  const parts = useMemo(() => {
    const p: Part[] = [
      box([4.4, 0.25, 3.5], [0, 0.16, 0], stone),
      box([3.8, 0.7, 2.9], [0, 0.6, 0], glass),
      box([4.3, 0.12, 3.3], [0, 1, 0], trim),
    ];
    [
      [-1.25, 0.7, 4.4],
      [0, 0, 5.9],
      [1.25, -0.7, 5],
    ].forEach(([x, z, h]) => {
      p.push(
        box([0.95, h, 1.1], [x, 1 + h / 2, z], glass),
        box([1.1, 0.17, 1.25], [x, h + 1, z], trim),
        box([0.72, 0.18, 0.8], [x, h + 1.17, z], stone),
      );
      for (let floor = 0; floor < h / 0.35; floor++)
        p.push(box([1.04, 0.05, 1.18], [x, 1.2 + floor * 0.35, z], stone));
      for (const edge of [-0.47, 0.47])
        p.push(box([0.05, h, 0.06], [x + edge, 1 + h / 2, z + 0.57], trim));
    });
    return p;
  }, []);
  return (
    <>
      <Blocks parts={parts} />
      <Ring at={[0, 0.32, 0]} radius={2.6} />
    </>
  );
}
function Academy() {
  const parts = useMemo(() => {
    const p: Part[] = [
      box([4.1, 0.2, 3.2], [0, 0.15, 0], trim),
      box([1.1, 1.6, 2.6], [-1.25, 1, 0], glass),
      box([1.1, 2.2, 2.6], [1.25, 1.3, 0], glass),
      box([3.5, 1.35, 0.8], [0, 0.9, -1], wood),
    ];
    for (let f = 0; f < 4; f++) {
      p.push(
        box([1.4, 0.1, 2.9], [-1.25, 0.3 + f * 0.5, 0], trim),
        box([1.4, 0.1, 2.9], [1.25, 0.3 + f * 0.7, 0], trim),
      );
    }
    for (let i = 0; i < 7; i++)
      p.push(
        box([0.06, 1.5, 0.08], [-1.85, 0.95, -1.1 + i * 0.36], wood),
        box([0.06, 2.1, 0.08], [1.85, 1.25, -1.1 + i * 0.36], wood),
      );
    p.push(
      box([2.4, 0.1, 0.5], [0, 1.65, 0.9], trim),
      box([1.4, 0.07, 1.3], [0, 0.28, 0.2], '#819b8e'),
    );
    return p;
  }, []);
  return <Blocks parts={parts} />;
}
function Observatory() {
  return (
    <>
      <Cylinder at={[0, 0.15, 0]} radius={2.05} height={0.2} />
      <Cylinder at={[0, 0.75, 0]} radius={1.75} height={1.1} color={glass} />
      <Cylinder at={[0, 1.32, 0]} radius={1.9} height={0.14} color={trim} />
      <Cylinder at={[0, 1.55, 0]} radius={1.25} height={0.4} />
      <mesh position={[0, 1.74, 0]}>
        <sphereGeometry args={[1.1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#a9b7c9"
          metalness={0.65}
          roughness={0.3}
        />
      </mesh>
      <Ring at={[0, 2, 0]} radius={1.7} tilt={0.45} color="#c0badf" />
      <Ring at={[0, 0.36, 0]} radius={2.15} color="#c0badf" />
    </>
  );
}
function Archive() {
  const parts = useMemo(() => {
    const p: Part[] = [];
    for (let i = 0; i < 5; i++) {
      p.push(
        box([3.1, 0.16, 2.65], [0, 0.3 + i * 0.52, 0], stone),
        box([2.8, 0.36, 2.3], [0, 0.55 + i * 0.52, 0], glass),
      );
    }
    p.push(
      box([3.3, 0.14, 2.8], [0, 2.9, 0], trim),
      box([0.6, 3, 0.6], [0, 1.7, 0], '#c5badb'),
    );
    for (let i = 0; i < 9; i++)
      p.push(box([0.07, 2.4, 0.07], [-1.3 + i * 0.32, 1.5, 1.21], wood));
    return p;
  }, []);
  return <Blocks parts={parts} />;
}
function Landscape() {
  const paths = useMemo(() => {
    const p: Part[] = [
      box([23, 0.35, 17], [0, -0.25, 0], '#25383e'),
      box([23.4, 0.14, 17.4], [0, -0.48, 0], '#34464d'),
    ];
    for (const x of [-9, -2.4, 2.35, 9])
      p.push(
        box([0.7, 0.015, 16], [x, -0.05, 0], '#51636a'),
        box([0.025, 0.02, 16], [x + 0.4, -0.03, 0], '#9caeae'),
      );
    for (const z of [-7, 0, 6.6])
      p.push(
        box([22, 0.02, 0.65], [0, -0.035, z], '#51636a'),
        box([22, 0.025, 0.025], [0, -0.02, z + 0.38], '#9caeae'),
      );
    for (let i = 0; i < 7; i++)
      p.push(
        box(
          [2.4 - i * 0.13, 0.06, 1.1],
          [0, 0.02 + i * 0.04, 3.5 + i * 0.42],
          '#758589',
        ),
      );
    p.push(
      box([3.2, 0.03, 2.6], [0, 0.0, 1.95], '#182e37'),
      box([3.4, 0.08, 0.15], [0, 0.03, 0.6], stone),
      box([3.4, 0.08, 0.15], [0, 0.03, 3.3], stone),
    );
    return p;
  }, []);
  const trees = useMemo(() => {
    const p: Part[] = [];
    for (let i = 0; i < 32; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      const x = side * (9.6 + (i % 3) * 0.32);
      const z = -6.8 + Math.floor(i / 2) * 0.9;
      p.push(
        box([0.08, 0.6, 0.08], [x, 0.3, z], wood),
        box(
          [0.5, 0.7, 0.5],
          [x, 0.9, z],
          i % 3 ? '#527366' : '#6b8572',
          i * 0.4,
        ),
      );
    }
    for (const x of [-3.1, 3.1])
      for (let i = 0; i < 5; i++)
        p.push(
          box([0.07, 0.4, 0.07], [x, 0.2, 2 + i * 0.8], wood),
          box([0.4, 0.6, 0.4], [x, 0.7, 2 + i * 0.8], '#637f70', i * 0.3),
        );
    return p;
  }, []);
  const lightPaths = useMemo(
    () =>
      [-2.4, 2.35]
        .map((x) => box([0.045, 0.025, 13], [x, 0.01, -0.3], '#8abecb'))
        .concat(
          [-0.35, 6.2].map((z) =>
            box([18, 0.025, 0.04], [0, 0.01, z], '#8abecb'),
          ),
        ),
    [],
  );
  return (
    <>
      <Blocks parts={paths} />
      <Blocks parts={trees} />
      <Blocks parts={lightPaths} luminous />
      <Ring at={[0, 0.025, 1.9]} radius={1.1} color="#91b8c1" />
    </>
  );
}
function Label({ index }: { index: number }) {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#17282e';
    ctx.beginPath();
    ctx.arc(64, 64, 49, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#9aafb6';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#f1f3f1';
    ctx.font = '500 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`0${index + 1}`, 64, 65);
    return new THREE.CanvasTexture(canvas);
  }, [index]);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <sprite position={[0, 0.65, 2.1]} scale={[0.75, 0.75, 0.75]}>
      <spriteMaterial map={texture} depthTest={false} />
    </sprite>
  );
}
function CameraRig({
  selected,
  moving,
}: {
  selected: number | null;
  moving: boolean;
}) {
  const { camera, size, invalidate } = useThree();
  const target = useRef(new THREE.Vector3(0, 1.3, 0));
  useEffect(() => {
    const d = selected === null ? null : districts[selected];
    const mobile = size.width < 700;
    const focus = new THREE.Vector3(d?.x ?? 0, d ? 1.1 : 1.2, d?.z ?? 0);
    const position = d
      ? new THREE.Vector3(focus.x + 9, 10, focus.z + 13)
      : new THREE.Vector3(21, 20, 26);
    const zoom = d
      ? Math.min(size.width / (mobile ? 15 : 16), size.height / 13)
      : Math.min(size.width / (mobile ? 28 : 31), size.height / 19);
    const timeline = gsap.timeline({ onUpdate: invalidate });
    timeline.to(
      camera.position,
      {
        x: position.x,
        y: position.y,
        z: position.z,
        duration: moving ? 1.3 : 0,
        ease: 'power3.inOut',
      },
      0,
    );
    timeline.to(
      target.current,
      {
        x: focus.x,
        y: focus.y,
        z: focus.z,
        duration: moving ? 1.3 : 0,
        ease: 'power3.inOut',
      },
      0,
    );
    timeline.to(
      camera,
      {
        zoom,
        duration: moving ? 1.3 : 0,
        ease: 'power3.inOut',
        onUpdate: () => camera.updateProjectionMatrix(),
      },
      0,
    );
    invalidate();
    return () => {
      timeline.kill();
    };
  }, [selected, size.width, size.height, moving, camera, invalidate]);
  useFrame(() => {
    camera.lookAt(target.current);
    camera.updateMatrixWorld();
  });
  return null;
}
function Signals({ moving, active }: { moving: boolean; active: boolean }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const { invalidate, gl } = useThree();
  const time = useRef(0);
  const slow = useRef(0);
  const matrix = useMemo(() => new THREE.Matrix4(), []);
  useFrame((_, delta) => {
    if (!moving || !active) return;
    time.current += Math.min(delta, 0.05);
    if (ref.current) {
      for (let i = 0; i < 16; i++) {
        const phase = (time.current * 0.65 + i * 0.9) % 13;
        matrix.makeTranslation(i % 2 === 0 ? -2.4 : 2.35, 0.09, phase - 6.8);
        ref.current.setMatrixAt(i, matrix);
      }
      ref.current.instanceMatrix.needsUpdate = true;
    }
    if (delta > 0.045) slow.current++;
    else slow.current = Math.max(0, slow.current - 1);
    if (slow.current > 45 && gl.getPixelRatio() > 1) {
      gl.setPixelRatio(1);
      slow.current = 0;
    }
    invalidate();
  });
  useEffect(() => {
    invalidate();
  }, [moving, active, invalidate]);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, 16]} visible={moving}>
      <sphereGeometry args={[0.065, 8, 6]} />
      <meshBasicMaterial color="#c4f0ff" />
    </instancedMesh>
  );
}
function World({ selected, expanded, moving, active, onSelect }: SceneProps) {
  const [hover, setHover] = useState<number | null>(null);
  const { invalidate } = useThree();
  useEffect(() => {
    invalidate();
  }, [expanded, invalidate]);
  return (
    <>
      <color attach="background" args={['#101e25']} />
      <fog attach="fog" args={['#101e25', 38, 80]} />
      <ambientLight intensity={0.5} />
      <hemisphereLight args={['#c7def5', '#5d645a', 1.2]} />
      <directionalLight
        position={[-12, 20, 8]}
        intensity={2.5}
        color="#ffe4c1"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-18}
        shadow-camera-right={18}
        shadow-camera-top={18}
        shadow-camera-bottom={-18}
        shadow-normalBias={0.04}
      />
      <directionalLight
        position={[12, 10, -12]}
        intensity={2}
        color="#8cb3d4"
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.65, 0]}>
        <planeGeometry args={[180, 180]} />
        <meshStandardMaterial color="#14262e" roughness={0.65} />
      </mesh>
      <Landscape />
      {districts.map((d, i) => (
        <group
          key={d.id}
          position={[d.x, 0, d.z]}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(i);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHover(i);
          }}
          onPointerOut={() => setHover(null)}
        >
          <mesh position={[0, 0.02, 0]}>
            <boxGeometry args={[i === 2 ? 5.2 : 4.8, 0.08, 3.9]} />
            <meshStandardMaterial
              color={selected === i || hover === i ? '#62777d' : '#3c5158'}
              roughness={0.75}
            />
          </mesh>
          {i === 0 ? (
            <Library expanded={expanded && selected === 0} moving={moving} />
          ) : i === 1 ? (
            <Academy />
          ) : i === 2 ? (
            <Exchange />
          ) : i === 3 ? (
            <Observatory />
          ) : (
            <Archive />
          )}
          <Label index={i} />
          {(selected === i || hover === i) && (
            <Ring at={[0, 0.1, 0]} radius={2.9} tube={0.025} color={d.color} />
          )}
        </group>
      ))}
      <Signals moving={moving} active={active} />
      <CameraRig selected={selected} moving={moving} />
    </>
  );
}
type SceneProps = {
  selected: number | null;
  expanded: boolean;
  moving: boolean;
  active: boolean;
  onSelect: (index: number) => void;
};
export default function CityScene(
  props: SceneProps & { onReady: () => void; onFailure: () => void },
) {
  const [supported, setSupported] = useState(false);
  useEffect(() => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('webgl2');
    if (!context) {
      props.onFailure();
      return;
    }
    context.getExtension('WEBGL_lose_context')?.loseContext();
    setSupported(true);
    // Probe once; callbacks report status without owning renderer resources.
  }, []);
  if (!supported) return null;
  return (
    <Canvas
      shadows={{ type: THREE.PCFShadowMap }}
      orthographic
      camera={{ position: [21, 20, 26], zoom: 35, near: 0.1, far: 180 }}
      dpr={[1, 1.5]}
      frameloop={props.active ? 'demand' : 'never'}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      }}
      onCreated={({ gl }) => {
        gl.shadowMap.autoUpdate = false;
        gl.shadowMap.needsUpdate = true;
        gl.domElement.addEventListener('webglcontextlost', props.onFailure, {
          once: true,
        });
        props.onReady();
      }}
    >
      <World {...props} />
    </Canvas>
  );
}
