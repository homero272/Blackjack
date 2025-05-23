// components/Blackjack3DTable.js
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import CardModel from './CardModel';

const TableModel = () => {
  const gltf = useGLTF('/BlackjackTable/blackjack_table.glb');
  return <primitive object={gltf.scene} scale={1} />;
};

const Blackjack3DTable = ({
  dealerHand = [],
  playerHands = [[]],
  dealerScore = 0,
  playerScores = [],
  activeHandIndex = 0,
  onHit,
  onStand,
  onSplit,
  onDoubleDown,
  canSplit = false,
  gameStatus = '',
  flipDealerCard = false,
}) => {
  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [2.67, 160.53, -328.69], fov: 75}}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[0, 100, 100]} intensity={1} />
        <Suspense fallback={null}>
          <TableModel />


{/* Dealer Cards */}
{dealerHand.map((card, index) => (
    <CardModel
        key={`dealer-${index}`}
        position={[-20 + index * 12, 0.1, -20]} // Y=0.1 to sit just above table, Z=-20 for dealer area
        rotation={[-Math.PI / 2, 0, 0]} // Rotate 90 degrees around X-axis to lay flat
        filename={index >= 1 && !flipDealerCard ? 'facedown.png' : `${card}.png`}
    />
))}

{/* Player Cards */}
{playerHands.map((hand, handIndex) =>
    hand.map((card, cardIndex) => (
        <CardModel
            key={`player-${handIndex}-${cardIndex}`}
            position={[-20 + cardIndex * 12, 0.1, 20]} // Y=0.1 to sit just above table, Z=20 for player area
            rotation={[-Math.PI / 2, 0, 0]} // Rotate 90 degrees around X-axis to lay flat
            filename={`${card}.png`}
        />
    ))
)}

        </Suspense>
        <OrbitControls />
      </Canvas>

      {/* UI Overlay */}
      <div style={{
        position: 'absolute',
        top: 16,
        left: 16,
        color: 'white',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        padding: 16,
        borderRadius: 8,
        maxWidth: 400,
        zIndex: 10
      }}>
        <h2>Dealer Score: {dealerScore}</h2>
        <h3>Player Scores: {playerScores.join(', ')}</h3>
        <div style={{ marginTop: 8 }}>
          <button onClick={onHit} disabled={gameStatus !== 'playing'}>Hit</button>
          <button onClick={onStand} disabled={gameStatus !== 'playing'}>Stand</button>
          <button onClick={onSplit} disabled={!canSplit}>Split</button>
          <button onClick={onDoubleDown} disabled={gameStatus !== 'playing'}>Double Down</button>
        </div>
        {gameStatus && <div style={{ marginTop: 8, fontWeight: 'bold' }}>{gameStatus}</div>}
      </div>
    </div>
  );
};

export default Blackjack3DTable;
