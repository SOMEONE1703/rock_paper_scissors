import './Lobby.css';
import React, { useState } from 'react';
import { HandIcon, MOVES } from './Hands';

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for non-secure contexts (e.g. plain http on a LAN IP)
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}

function Lobby({ identity, onCancel, notify }) {
  const [copied, setCopied] = useState('');

  const copy = async (what) => {
    const text =
      what === 'link' ? `${window.location.origin}${window.location.pathname}?room=${identity}` : identity;
    const ok = await copyText(text);
    if (ok) {
      setCopied(what);
      notify(what === 'link' ? 'Invite link copied' : 'Room code copied', 'ok');
      setTimeout(() => setCopied(''), 1800);
    } else {
      notify('Couldn’t copy — select the code instead', 'warn');
    }
  };

  return (
    <section className="card lobby-card">
      <div className="stack stack--lg">
        <div className="lobby-wait" aria-hidden="true">
          {MOVES.map((m, i) => (
            <span key={m.id} className="lobby-wait__hand" style={{ '--i': i }}>
              <HandIcon move={m.id} />
            </span>
          ))}
        </div>

        <div className="lobby-head">
          <span className="eyebrow">Room created</span>
          <h1 className="title">Waiting for an opponent…</h1>
          <p className="lede">Share this code. The match starts as soon as they join.</p>
        </div>

        <div className="lobby-code">
          <span className="lobby-code__label">Room code</span>
          <output className="lobby-code__value" aria-live="polite">
            {identity}
          </output>
        </div>

        <div className="row">
          <button type="button" className="btn" onClick={() => copy('code')}>
            {copied === 'code' ? '✓ Copied' : 'Copy code'}
          </button>
          <button type="button" className="btn btn--primary" onClick={() => copy('link')}>
            {copied === 'link' ? '✓ Copied' : 'Copy invite link'}
          </button>
        </div>

        <button type="button" className="btn btn--ghost lobby-cancel" onClick={onCancel}>
          Cancel and go back
        </button>
      </div>
    </section>
  );
}

export default Lobby;
