import React from 'react';

// Line-art icons for each move. They inherit colour from `currentColor`,
// so they look right on any background.
const paths = {
  rock: (
    <>
      <polygon points="24,32 50,18 74,28 86,52 79,77 55,87 28,82 13,58" />
      <polyline points="50,18 58,40 86,52" />
      <polyline points="58,40 54,64 79,77" />
      <polyline points="54,64 36,82" />
    </>
  ),
  paper: (
    <>
      <path d="M26 12 H62 L78 28 V88 H26 Z" />
      <polyline points="62,12 62,28 78,28" />
      <line x1="38" y1="46" x2="66" y2="46" />
      <line x1="38" y1="58" x2="66" y2="58" />
      <line x1="38" y1="70" x2="56" y2="70" />
    </>
  ),
  scissors: (
    <>
      <line x1="38" y1="64" x2="70" y2="12" />
      <line x1="62" y1="64" x2="30" y2="12" />
      <circle cx="32" cy="76" r="11" />
      <circle cx="68" cy="76" r="11" />
      <circle cx="50" cy="35" r="2.5" fill="currentColor" />
    </>
  ),
};

export const MOVES = [
  { id: 'rock', label: 'Rock', key: 'R' },
  { id: 'paper', label: 'Paper', key: 'P' },
  { id: 'scissors', label: 'Scissors', key: 'S' },
];

export function HandIcon({ move, className = '', title }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title && <title>{title}</title>}
      {paths[move] ?? paths.rock}
    </svg>
  );
}

export default HandIcon;
