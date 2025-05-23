import React from 'react';

const CardModel = ({ filename }) => {
    return (
        <div style={{
            width: 70,
            height: 100,
            borderRadius: 8,
            overflow: 'hidden',
            boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
            backgroundColor: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid red',

        }}>
            <img
                src={`/CardImages/${filename}`}
                alt={filename}
                style={{
                    width: '140%',
                    height: '175%',
                    objectFit: 'cover',
                    transition: 'transform 0.6s ease',
                    transform: filename === 'facedown.png' ? 'rotateY(0deg)' : 'rotateY(360deg)',
                    backfaceVisibility: 'hidden'
                }}
            />

        </div>
    );
};

export default CardModel;
