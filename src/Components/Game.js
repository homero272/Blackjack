import React, { useState, useEffect } from 'react';
import BlackJackTable from './BlackJackTable';
import Blackjack3DTable from './Blackjack3DTable';
const { Deck } = require('../DeckLogic/Deck');

const getCardString = (card) => `${card.value}${card.suit}`;

const calculateScore = (hand) => {
    let score = 0;
    let aces = 0;
    hand.forEach(card => {
        if (['J', 'Q', 'K', 'T'].includes(card.value)) score += 10;
        else if (card.value === 'A') {
            score += 11;
            aces += 1;
        } else score += parseInt(card.value, 10);
    });
    while (score > 21 && aces > 0) {
        score -= 10;
        aces -= 1;
    }
    return score;
};

const Game = () => {
    const [deck, setDeck] = useState(null);
    const [dealerHand, setDealerHand] = useState([]);
    const [playerHands, setPlayerHands] = useState([[]]);
    const [activeHandIndex, setActiveHandIndex] = useState(0);
    const [gameStatus, setGameStatus] = useState('playing');
    const [hasDoubled, setHasDoubled] = useState(false);
    const [flipDealerCard, setFlipDealerCard] = useState(false);

    
    useEffect(() => {
        startNewGame();
    }, []);

    const startNewGame = () => {
        const newDeck = new Deck();
        newDeck.shuffle();
        const player = [newDeck.deal(), newDeck.deal()];
        const dealer = [newDeck.deal(), newDeck.deal()];
        setDeck(newDeck);
        setDealerHand(dealer);
        setPlayerHands([player]);
        setActiveHandIndex(0);
        setGameStatus('playing');
        setHasDoubled(false);
        setFlipDealerCard(false);

    };

    const canSplit = () => {
        const currentHand = playerHands[activeHandIndex];
        return (
            gameStatus === 'playing' &&
            currentHand.length === 2 &&
            currentHand[0].value === currentHand[1].value
        );
    };

    const onSplit = () => {
        if (!canSplit()) return;
        const currentHand = playerHands[activeHandIndex];
        const hand1 = [currentHand[0], deck.deal()];
        const hand2 = [currentHand[1], deck.deal()];
        const updatedHands = [
            ...playerHands.slice(0, activeHandIndex),
            hand1,
            hand2,
            ...playerHands.slice(activeHandIndex + 1),
        ];
        setPlayerHands(updatedHands);
    };

    const onDoubleDown = () => {
        const currentHand = playerHands[activeHandIndex];
        if (currentHand.length !== 2 || hasDoubled || gameStatus !== 'playing') return;

        const newCard = deck.deal();
        const updatedHand = [...currentHand, newCard];
        const updatedHands = [...playerHands];
        updatedHands[activeHandIndex] = updatedHand;
        setPlayerHands(updatedHands);
        setHasDoubled(true);

        // Automatically stand after doubling down
        endTurn(updatedHand);
    };

    const onHit = () => {
        if (!deck || gameStatus !== 'playing') return;
        const currentHand = playerHands[activeHandIndex];
        const newCard = deck.deal();
        const updatedHand = [...currentHand, newCard];
        const updatedHands = [...playerHands];
        updatedHands[activeHandIndex] = updatedHand;
        setPlayerHands(updatedHands);

        const score = calculateScore(updatedHand);
        if (score > 21) {
            endTurn(updatedHand); // Bust
        }
    };

    const onStand = () => {
        const currentHand = playerHands[activeHandIndex];
        endTurn(currentHand);
    };

    const endTurn = (hand) => {
        const score = calculateScore(hand);
        if (score > 21) {
            setGameStatus(`Hand ${activeHandIndex + 1} Busts!`);
        }
        moveToNextHand();
    };

    const moveToNextHand = () => {
        if (activeHandIndex + 1 < playerHands.length) {
            setActiveHandIndex(activeHandIndex + 1);
            setHasDoubled(false);
        } else {
            setFlipDealerCard(true); // 👈 reveal dealer card
            dealerPlay();
        }

    };

    const dealerPlay = () => {
        let dealer = [...dealerHand];
        let dScore = calculateScore(dealer);
        while (dScore < 17) {
            dealer.push(deck.deal());
            dScore = calculateScore(dealer);
        }
        setDealerHand(dealer);

        const results = playerHands.map((hand, i) => {
            const pScore = calculateScore(hand);
            if (pScore > 21) return `Hand ${i + 1}: Bust`;
            if (dScore > 21) return `Hand ${i + 1}: Dealer Busts! You Win!`;
            if (pScore === dScore) return `Hand ${i + 1}: Push`;
            if (pScore > dScore) return `Hand ${i + 1}: You Win!`;
            return `Hand ${i + 1}: Dealer Wins`;
        });

        setGameStatus(results.join(' | '));
    };

    const dealerScore = flipDealerCard
    ? calculateScore(dealerHand)
    : dealerHand.length > 0
        ? calculateScore([dealerHand[0]]) // Only show 1st visible card's score
        : 0;

    const playerScores = playerHands.map(calculateScore);

    return (
        <div>
            <BlackJackTable
                dealerHand={dealerHand.map(getCardString)}
                dealerScore={dealerScore}
                playerHands={playerHands.map(hand => hand.map(getCardString))}
                playerScores={playerScores}
                activeHandIndex={activeHandIndex}
                onHit={onHit}
                onStand={onStand}
                onSplit={onSplit}
                onDoubleDown={onDoubleDown}
                canSplit={canSplit()}
                gameStatus={gameStatus}
                flipDealerCard={flipDealerCard}
            />


            <button onClick={startNewGame} style={{ marginTop: 16 }}>Restart Game</button>
        </div>
    );
};

export default Game;
