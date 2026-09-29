import React, { useEffect, useRef } from 'react';

const ICONS = { info: 'i', warn: '!', ok: '✓' };

function Toast({ children, tone = 'info', onDone, duration = 3500 }) {
  const done = useRef(onDone);
  done.current = onDone;

  useEffect(() => {
    const t = setTimeout(() => done.current?.(), duration);
    return () => clearTimeout(t);
  }, [duration]);

  return (
    <div className={`toast toast--${tone}`} role="status" aria-live="polite">
      <span className="toast__icon" aria-hidden="true">
        {ICONS[tone] ?? ICONS.info}
      </span>
      <span>{children}</span>
    </div>
  );
}

export default Toast;
