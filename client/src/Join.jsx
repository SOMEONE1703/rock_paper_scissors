import './Join.css';
import React, { useState } from 'react';

function Join({ initialCode = '', error, busy, onJoin, onBack }) {
  const [room, setRoom] = useState(initialCode);
  const [localError, setLocalError] = useState('');
  const shownError = localError || error;

  const submit = (e) => {
    e.preventDefault();
    const code = room.trim().toLowerCase();
    if (!code) {
      setLocalError('Enter the code your friend shared with you.');
      return;
    }
    onJoin(code);
  };

  return (
    <form className="card join-card" onSubmit={submit} noValidate>
      <div className="stack stack--lg">
        <button type="button" className="btn btn--ghost join-back" onClick={onBack}>
          ← Back
        </button>

        <div>
          <span className="eyebrow">Join a room</span>
          <h1 className="title">Enter the room code</h1>
          <p className="lede">It’s the 8-character code shown on your friend’s screen.</p>
        </div>

        <div className="field">
          <label className="visually-hidden" htmlFor="room-code">
            Room code
          </label>
          <input
            id="room-code"
            className="input input--code"
            type="text"
            value={room}
            maxLength={12}
            autoComplete="off"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck="false"
            autoFocus={!initialCode}
            placeholder="········"
            aria-invalid={shownError ? 'true' : undefined}
            aria-describedby={shownError ? 'room-error' : undefined}
            onChange={(e) => {
              setRoom(e.target.value);
              if (localError) setLocalError('');
            }}
          />
          {shownError && (
            <p className="field__error" id="room-error" role="alert">
              {shownError}
            </p>
          )}
        </div>

        <button type="submit" className="btn btn--primary btn--block" disabled={busy} autoFocus={!!initialCode}>
          {busy ? 'Joining…' : 'Join game →'}
        </button>
      </div>
    </form>
  );
}

export default Join;
