import './Found.css';
import React, { useState, useEffect, useRef } from 'react';
import Ready from './Ready';

const COUNT_FROM = 3;

function PlayerCard({ label, name, ready, side }) {
  return (
    <div className={`player player--${side} ${ready ? 'is-ready' : ''}`}>
      <span className="player__avatar" aria-hidden="true">
        {(name || '?').trim().charAt(0).toUpperCase()}
      </span>
      <span className="player__label">{label}</span>
      <span className="player__name" title={name}>
        {name}
      </span>
      <span className="player__status">{ready ? '✓ Ready' : 'Not ready'}</span>
    </div>
  );
}

function Found({ socket, name, id, opp, oppReady, round, onStart, onLeave }) {
  const [meReady, setMeReady] = useState(false);
  const [count, setCount] = useState(null);
  const startRef = useRef(onStart);
  startRef.current = onStart;

  useEffect(() => {
    const onStartMatch = () => setCount(COUNT_FROM);
    socket.on('start-match', onStartMatch);
    return () => socket.off('start-match', onStartMatch);
  }, [socket]);

  useEffect(() => {
    if (count === null) return undefined;
    if (count === 0) {
      const t = setTimeout(() => startRef.current(), 450);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setCount((c) => c - 1), 750);
    return () => clearTimeout(t);
  }, [count]);

  const readyUp = () => {
    if (meReady) return;
    setMeReady(true);
    socket.emit('ready', { username: name, id });
  };

  const counting = count !== null;

  return (
    <section className="card card--wide found-card">
      <div className="stack stack--lg">
        <div className="found-head">
          <span className="eyebrow">Round {round}</span>
          <h1 className="title">{round > 1 ? 'Next round — ready up' : 'Opponent found!'}</h1>
        </div>

        <div className="versus">
          <PlayerCard side="me" label="You" name={name} ready={meReady} />
          <span className="versus__badge" aria-hidden="true">
            VS
          </span>
          <PlayerCard side="opp" label="Opponent" name={opp} ready={oppReady} />
        </div>

        {counting ? (
          <div className="countdown" role="status" aria-live="assertive">
            <span key={count} className="countdown__num">
              {count === 0 ? 'Go!' : count}
            </span>
          </div>
        ) : (
          <div className="found-actions">
            <Ready ready={meReady} oppReady={oppReady} opp={opp} onReady={readyUp} />
            <button type="button" className="btn btn--ghost" onClick={onLeave}>
              Leave room
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default Found;
