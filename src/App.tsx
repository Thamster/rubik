// src/App.tsx

import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

/**
 * Generate an array of positions for the 26 outer cubies of a Rubik's cube:
 *  - 8 corners: all of x,y,z ∈ {±1}
 *  - 12 edges: exactly two of x,y,z ∈ {±1}, the other is 0
 *  - 6 centers: exactly one of x,y,z ∈ {±1}, the other two are 0
 * Internal piece at (0,0,0) is skipped.
 */
function generateVisibleCubies(): Array<[number, number, number]> {
  const positions: Array<[number, number, number]> = [];

  for (let x of [-1, 0, 1]) {
    for (let y of [-1, 0, 1]) {
      for (let z of [-1, 0, 1]) {
        // Skip the internal piece
        if (x === 0 && y === 0 && z === 0) continue;
        // If at least one is ±1, it's on the outside
        if (Math.abs(x) === 1 || Math.abs(y) === 1 || Math.abs(z) === 1) {
          positions.push([x, y, z]);
        }
      }
    }
  }

  return positions;
}

/**
 * For each sub-cube (x,y,z), return an array of 6 colors for the 6 faces.
 * Face indices for boxGeometry are typically:
 *   0: +x, 1: -x, 2: +y, 3: -y, 4: +z, 5: -z
 */
function getCubieFaceColors(x: number, y: number, z: number): string[] {
  // Start all faces as "black"
  const colors = Array(6).fill("black");

  // +x face => Red
  if (x === 1) {
    colors[0] = "red";
  }
  // -x face => Orange
  if (x === -1) {
    colors[1] = "orange";
  }
  // +y face => White
  if (y === 1) {
    colors[2] = "white";
  }
  // -y face => Yellow
  if (y === -1) {
    colors[3] = "yellow";
  }
  // +z face => Green
  if (z === 1) {
    colors[4] = "green";
  }
  // -z face => Blue
  if (z === -1) {
    colors[5] = "blue";
  }

  return colors;
}

/**
 * Renders the 26 cubies, each with correctly colored faces for
 * corners, edges, or centers.
 */
function RubiksCubeOuterPieces() {
  const cubiePositions = React.useMemo(() => generateVisibleCubies(), []);

  return (
    <>
      {cubiePositions.map(([x, y, z], index) => {
        const faceColors = getCubieFaceColors(x, y, z);

        return (
          <mesh key={index} position={[x, y, z]}>
            {/* Slightly smaller than 1×1×1 so there is a gap between pieces */}
            <boxGeometry args={[0.95, 0.95, 0.95]} />

            {/* 
              Multi-material approach: attach each face via attach="material-<index>".
              faceColors[0] => +x, faceColors[1] => -x, etc.
            */}
            {faceColors.map((color, faceIndex) => (
              <meshStandardMaterial
                key={faceIndex}
                attach={`material-${faceIndex}`}
                color={color}
              />
            ))}
          </mesh>
        );
      })}
    </>
  );
}

export default function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas
        camera={{ position: [5, 5, 5], fov: 50 }}
        style={{ background: "#222" }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />

        {/* Our 26 visible cubies */}
        <RubiksCubeOuterPieces />

        <OrbitControls />
      </Canvas>
    </div>
  );
}
