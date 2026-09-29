import './Game.css';
import React, { useState, useEffect, useCallback } from 'react';
import { HandIcon, MOVES } from './Hands';

const KEYMAP = { r: 'rock', p: 'paper', s: 'scissors', 1: 'rock', 2: 'paper', 3: 'scissors' };

function Game({ name, socket, id, opp, set_choice }) {
  const [choice, setChoice] = useState(null);

  const play = useCallback(
    (move) => {
      if (choice) return;
      socket.emit('play', { username: name, id, play: move });
      set_choice(move);
      setChoice(move);
    },
    [choice, socket, name, id, set_choice],
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const move = KEYMAP[e.key.toLowerCase()];
      if (move) play(move);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [play]);

  return (
    <section className="card card--wide game-card">
      <div className="stack stack--lg">
        <div className="game-head">
          <span className="eyebrow">{choice ? 'Locked in' : 'Your move'}</span>
          <h1 className="title">{choice ? `Waiting for ${opp}…` : 'Rock, paper or scissors?'}</h1>
        </div>

        <div className="moves" role="group" aria-label="Choose your move">
          {MOVES.map((m) => {
            const picked = choice === m.id;
            const faded = choice && !picked;
            return (
              <button
                key={m.id}
                type="button"
                className={`move ${picked ? 'is-picked' : ''} ${faded ? 'is-faded' : ''}`}
                onClick={() => play(m.id)}
                disabled={!!choice}
                aria-pressed={picked}
              >
                <HandIcon move={m.id} className="move__icon" />
                <span className="move__label">{m.label}</span>
                <kbd className="move__key" aria-hidden="true">
                  {m.key}
                </kbd>
              </button>
            );
          })}
        </div>

        <p className="game-hint">
          {choice ? (
            <span className="game-hint__waiting">
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
              <span className="visually-hidden">Waiting for your opponent</span>
            </span>
          ) : (
            <>
              Tap a card<span className="game-hint__keys">&nbsp;or press <kbd>R</kbd> <kbd>P</kbd> <kbd>S</kbd></span>
            </>
          )}
        </p>
      </div>
    </section>
  );
}

export default Game;
