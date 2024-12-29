import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

// NEW imports for react-three-fiber
import React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// Amplify client
const client = generateClient<Schema>();

// Example minimal "RubiksCube" component
function RubiksCube() {
  // For demonstration, render a single rotating cube, not a real Rubik’s yet
  const ref = React.useRef<THREE.Mesh>(null);

  // Simple rotation animation
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.x += 0.01;
      ref.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  useEffect(() => {
    const subscription = client.modelsa.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
    // Cleanup subscription on unmount
    return () => subscription.unsubscribe();
  }, []);

  function createTodo() {
    const content = window.prompt("Todo content");
    if (content) {
      client.models.Todo.create({ content });
    }
  }

  return (
    <main style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Existing App UI */}
      <section>
        <h1>My todos</h1>
        <button onClick={createTodo}>+ new</button>
        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>{todo.content}</li>
          ))}
        </ul>
        <div>
          🥳 App successfully hosted. Try creating a new todo.
          <br />
          <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
            Review next step of this tutorial.
          </a>
        </div>
      </section>

      {/* New 3D Scene */}
      <section style={{ width: "600px", height: "400px" }}>
        <Canvas>
          {/* Basic lighting */}
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />

          {/* Our Rubik's Cube placeholder */}
          <RubiksCube />

          {/* OrbitControls lets you rotate the camera via mouse */}
          <OrbitControls />
        </Canvas>
      </section>
    </main>
  );
}

export default App;
