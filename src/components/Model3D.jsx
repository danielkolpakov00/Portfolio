import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import modelUrl from '../assets/models/GradDude.glb';

export function Model3D() {
  const gltf = useLoader(GLTFLoader, modelUrl);
  return <primitive object={gltf.scene} />;
}
