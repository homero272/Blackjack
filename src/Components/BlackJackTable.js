import React from 'react';
import CardModel from './CardModel';

const BlackJackTable = ({
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
    flipDealerCard = false
}) => {
    return (
        <div style={{ background: 'green', padding: 32, borderRadius: 16, color: '#fff', maxWidth: 900, margin: 'auto' }}>
            <h2>Blackjack Table</h2>

            <div>
                <h3>Dealer</h3>
                    <div style={{ display: 'flex', gap: 8 }}>
                        {dealerHand.map((card, idx) => (
                            <CardModel
                                key={idx}
                                filename={idx >= 1 && !flipDealerCard? 'facedown.png' : `${card}.png`}
                            />
                        ))}
                    </div>

                <div>Score: {dealerScore}</div>
            </div>

            <hr style={{ borderColor: '#fff' }} />

            <div>
                <h3>Player</h3>
                {playerHands.map((hand, handIdx) => (
                    <div
                        key={handIdx}
                        style={{
                            marginBottom: 16,
                            padding: 8,
                            border: handIdx === activeHandIndex ? '2px solid yellow' : '1px solid #fff',
                            borderRadius: 8,
                            backgroundColor: '#003300',
                        }}
                    >
                        <strong>Hand {handIdx + 1}:</strong>
                        <div style={{ display: 'flex', gap: 8 }}>
                            {hand.map((card, idx) => 
                            (
                                <CardModel key={idx} filename={`${card}.png`} />
                                
                            ))}
                        </div>
                        <div>Score: {playerScores[handIdx]}</div>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: 24 }}>
                <button onClick={onHit} disabled={gameStatus !== 'playing'} style={{ marginRight: 8 }}>Hit</button>
                <button onClick={onStand} disabled={gameStatus !== 'playing'} style={{ marginRight: 8 }}>Stand</button>
                <button onClick={onSplit} disabled={!canSplit} style={{ marginRight: 8 }}>Split</button>
                <button onClick={onDoubleDown} disabled={gameStatus !== 'playing'}>Double Down</button>
            </div>

            {gameStatus && <div style={{ marginTop: 16, fontWeight: 'bold' }}>{gameStatus}</div>}
        </div>
    );
};

export default BlackJackTable;
