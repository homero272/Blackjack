import React from 'react';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';

const CardModel = ({ filename = 'facedown.png', position = [0, 10, 0] }) => {
  const texture = useLoader(TextureLoader, `/CardImages/${filename}`);

  return (
    <mesh position={position}>
      <planeGeometry args={[10, 14]} />
      <meshBasicMaterial map={texture} transparent={true} />
    </mesh>
  );
};

export default CardModel;
