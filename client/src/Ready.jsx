import './Ready.css';
import React from 'react';

function Ready({ ready, oppReady, opp, onReady }) {
  let hint = 'Hit ready when you are. The round starts once you’re both ready.';
  if (ready && !oppReady) hint = `Waiting for ${opp} to ready up…`;
  if (!ready && oppReady) hint = `${opp} is ready and waiting on you!`;

  return (
    <div className="ready">
      <button
        type="button"
        className={`btn btn--block ready__btn ${ready ? 'btn--success' : 'btn--primary'} ${
          !ready && oppReady ? 'is-nudging' : ''
        }`}
        onClick={onReady}
        disabled={ready}
        autoFocus
      >
        {ready ? '✓ You’re ready' : 'I’m ready'}
      </button>
      <p className="ready__hint" aria-live="polite">
        {hint}
      </p>
    </div>
  );
}

export default Ready;
