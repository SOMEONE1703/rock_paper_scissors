import './Name.css';
import React, { useState } from 'react';
import { HandIcon, MOVES } from './Hands';

function Name({ initial = '', onSubmit }) {
  const [val, setVal] = useState(initial);
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (val.trim() === '') {
      setError('Pick a name so your opponent knows who they’re up against.');
      return;
    }
    onSubmit(val);
  };

  return (
    <form className="card name-card" onSubmit={submit} noValidate>
      <div className="name-hero" aria-hidden="true">
        {MOVES.map((m, i) => (
          <span key={m.id} className="name-hero__tile" style={{ '--i': i }}>
            <HandIcon move={m.id} />
          </span>
        ))}
      </div>

      <div className="stack stack--lg">
        <div>
          <span className="eyebrow">Live 1 v 1</span>
          <h1 className="title">Ready to throw down?</h1>
          <p className="lede">Choose a player name, then start a room or join a friend’s.</p>
        </div>

        <div className="field">
          <label className="field__label" htmlFor="player-name">
            Your name
          </label>
          <input
            id="player-name"
            className="input"
            type="text"
            value={val}
            maxLength={16}
            autoComplete="nickname"
            autoFocus
            placeholder="e.g. Rocky"
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={error ? 'name-error' : undefined}
            onChange={(e) => {
              setVal(e.target.value);
              if (error) setError('');
            }}
          />
          {error && (
            <p className="field__error" id="name-error">
              {error}
            </p>
          )}
        </div>

        <button type="submit" className="btn btn--primary btn--block">
          Let’s play →
        </button>
      </div>
    </form>
  );
}

export default Name;
