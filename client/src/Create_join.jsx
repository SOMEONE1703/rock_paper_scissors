import './Create_join.css';
import React from 'react';

function Create_join({ name, onCreate, onJoin, onRename }) {
  return (
    <section className="card home-card">
      <div className="stack stack--lg">
        <div>
          <span className="eyebrow">Welcome</span>
          <h1 className="title">Hey {name}, let’s play.</h1>
          <p className="lede">Start a new room and share the code, or enter a code from a friend.</p>
        </div>

        <div className="home-options">
          <button type="button" className="option" onClick={onCreate}>
            <span className="option__icon" aria-hidden="true">＋</span>
            <span className="option__body">
              <span className="option__title">Create a room</span>
              <span className="option__desc">Get a code to share with a friend</span>
            </span>
            <span className="option__arrow" aria-hidden="true">→</span>
          </button>

          <button type="button" className="option option--dark" onClick={onJoin}>
            <span className="option__icon" aria-hidden="true">#</span>
            <span className="option__body">
              <span className="option__title">Join with a code</span>
              <span className="option__desc">Got a code? Jump straight in</span>
            </span>
            <span className="option__arrow" aria-hidden="true">→</span>
          </button>
        </div>

        <button type="button" className="btn btn--ghost home-rename" onClick={onRename}>
          Not {name}? Change name
        </button>
      </div>
    </section>
  );
}

export default Create_join;
