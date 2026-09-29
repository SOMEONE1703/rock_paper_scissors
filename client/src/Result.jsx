import './Result.css';
import React, { useState, useEffect, useRef } from 'react';
import { HandIcon } from './Hands';

const VERDICT = {
  win: { title: 'You win!', sub: (me, opp) => `${cap(me)} beats ${opp}.` },
  lose: { title: 'You lose', sub: (me, opp) => `${cap(opp)} beats ${me}.` },
  tie: { title: 'It’s a tie', sub: (me) => `You both threw ${me}.` },
};

const cap = (s = '') => s.charAt(0).toUpperCase() + s.slice(1);

const prefersReducedMotion = () => {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
};

// Card flip sequence: face-down spin → spin down and land face-up → done.
const SPIN = 'spinning';
const LAND = 'landing';
const DONE = 'done';

function Hand({ label, name, move, phase, state, reverse, onFlipEnd }) {
  const faceUp = phase !== SPIN;
  return (
    <div className={`hand hand--${state}`}>
      <span className="hand__label">{label}</span>
      <span className="hand__name" title={name}>
        {name}
      </span>
      <div className="flip">
        <div
          className={`flip__inner flip__inner--${phase}`}
          style={{ '--dir': reverse ? -1 : 1 }}
          onAnimationEnd={onFlipEnd}
        >
          <div className="flip__face flip__face--back" aria-hidden="true">
            <span>?</span>
          </div>
          <div className="flip__face flip__face--front">
            {faceUp && <HandIcon move={move} className="hand__icon" title={move} />}
          </div>
        </div>
      </div>
      <span className="hand__move">{phase === DONE ? cap(move) : '…'}</span>
    </div>
  );
}

function Result({ p1, p2, mine, res, name, opp, play_again, another }) {
  const [phase, setPhase] = useState(() => (prefersReducedMotion() ? DONE : SPIN));
  const revealed = phase === DONE;

  // Whichever of p1/p2 isn't my move is the opponent's (a tie means both match).
  const myMove = mine || p1;
  const oppMove = myMove === p1 ? p2 : p1;
  const verdict = VERDICT[res] ?? VERDICT.tie;

  // Advance the flip when my card's animation finishes (both cards run in sync).
  const onFlipEnd = (e) => {
    if (e.target !== e.currentTarget) return;
    setPhase((p) => (p === SPIN ? LAND : DONE));
  };

  // Safety net: if animation events never fire (e.g. background tab), reveal anyway.
  useEffect(() => {
    const t = setTimeout(() => setPhase(DONE), 3000);
    return () => clearTimeout(t);
  }, []);

  const againRef = useRef(null);
  useEffect(() => {
    if (revealed) againRef.current?.focus({ preventScroll: true });
  }, [revealed]);

  const meState = !revealed ? 'pending' : res === 'win' ? 'winner' : res === 'lose' ? 'loser' : 'even';
  const oppState = !revealed ? 'pending' : res === 'lose' ? 'winner' : res === 'win' ? 'loser' : 'even';

  return (
    <section className={`card card--wide result-card ${revealed ? `result--${res}` : ''}`}>
      <div className="stack stack--lg">
        <div className="hands">
          <Hand label="You" name={name} move={myMove} phase={phase} state={meState} onFlipEnd={onFlipEnd} />
          <span className="hands__vs" aria-hidden="true">
            VS
          </span>
          <Hand label="Opponent" name={opp} move={oppMove} phase={phase} state={oppState} reverse />
        </div>

        <div className="verdict" aria-live="polite">
          {revealed ? (
            <>
              <h1 className="verdict__title">{verdict.title}</h1>
              <p className="verdict__sub">{verdict.sub(myMove, oppMove)}</p>
            </>
          ) : (
            <p className="verdict__shoot">{phase === SPIN ? 'Rock… paper… scissors…' : 'Shoot!'}</p>
          )}
        </div>

        <div className={`result-actions ${revealed ? '' : 'is-hidden'}`}>
          <button type="button" className="btn btn--primary" onClick={play_again} disabled={!revealed} ref={againRef}>
            Play again
          </button>
          <button type="button" className="btn" onClick={another} disabled={!revealed}>
            Leave room
          </button>
        </div>
      </div>
    </section>
  );
}

export default Result;
