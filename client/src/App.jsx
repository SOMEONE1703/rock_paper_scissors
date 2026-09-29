import React, { useState, useEffect, useRef, useCallback } from 'react';
import io from 'socket.io-client';
import './index.css';
import Create_join from './Create_join';
import Join from './Join';
import Lobby from './Lobby';
import Found from './Found';
import Game from './Game';
import Result from './Result';
import Name from './Name';
import Toast from './Toast';
import { HandIcon } from './Hands';

const socket = io();

const NAME_KEY = 'rps:name';
const readSavedName = () => {
  try {
    return localStorage.getItem(NAME_KEY) || '';
  } catch {
    return '';
  }
};
const readRoomFromUrl = () => {
  try {
    return new URLSearchParams(window.location.search).get('room') || '';
  } catch {
    return '';
  }
};

const EMPTY_SCORE = { win: 0, lose: 0, tie: 0 };

const App = () => {
  const [view, setView] = useState('name');
  const [name, setName] = useState(readSavedName);
  const [opponent, setOpponent] = useState('');
  const [choice, setChoice] = useState(null);
  const [result, setResult] = useState(null); // 'win' | 'lose' | 'tie'
  const [p1, setP1] = useState(null);
  const [p2, setP2] = useState(null);
  const [id, setId] = useState('');
  const [score, setScore] = useState(EMPTY_SCORE);
  const [oppReady, setOppReady] = useState(false);
  const [joinError, setJoinError] = useState('');
  const [joining, setJoining] = useState(false);
  const [pendingRoom, setPendingRoom] = useState(readRoomFromUrl);
  const [toast, setToast] = useState(null);

  const opponentRef = useRef('');
  opponentRef.current = opponent;

  const notify = useCallback((message, tone = 'info') => {
    setToast({ message, tone, key: Date.now() });
  }, []);

  useEffect(() => {
    const onOutcome = (kind) => (data) => {
      setP1(data.p1);
      setP2(data.p2);
      setResult(kind);
      setScore((s) => ({ ...s, [kind]: s[kind] + 1 }));
      setOppReady(false);
      setView('result');
    };
    const onTie = onOutcome('tie');
    const onWin = onOutcome('win');
    const onLose = onOutcome('lose');

    const onCreated = (data) => {
      setId(data.id);
      setView('lobby');
    };
    const onNotFound = () => {
      setJoining(false);
      setJoinError("We couldn't find a room with that code.");
    };
    const onOpponent = (data) => {
      setOpponent(data.name);
      setId(data.identity);
      setScore(EMPTY_SCORE);
      setOppReady(false);
      setJoining(false);
      setJoinError('');
      setView('found');
    };
    const onReady = (data) => {
      if (data.name === opponentRef.current) setOppReady(true);
    };
    const onOppGone = (msg) => () => {
      notify(`${opponentRef.current || 'Your opponent'} ${msg}`, 'warn');
      setOpponent('');
      setView('create-join');
    };
    const onOppLost = onOppGone('lost connection.');
    const onOppLeft = onOppGone('left the room.');

    socket.on('create-res', onCreated);
    socket.on('not-found', onNotFound);
    socket.on('opponent', onOpponent);
    socket.on('readyy', onReady);
    socket.on('tie', onTie);
    socket.on('winner', onWin);
    socket.on('loser', onLose);
    socket.on('opp-lost', onOppLost);
    socket.on('opp-left', onOppLeft);

    return () => {
      socket.off('create-res', onCreated);
      socket.off('not-found', onNotFound);
      socket.off('opponent', onOpponent);
      socket.off('readyy', onReady);
      socket.off('tie', onTie);
      socket.off('winner', onWin);
      socket.off('loser', onLose);
      socket.off('opp-lost', onOppLost);
      socket.off('opp-left', onOppLeft);
    };
  }, [notify]);

  const saveName = (x) => {
    const clean = x.trim();
    setName(clean);
    try {
      localStorage.setItem(NAME_KEY, clean);
    } catch {
      /* storage unavailable – fine */
    }
    if (pendingRoom) {
      setView('join');
    } else {
      setView('create-join');
    }
  };

  const createRoom = () => {
    socket.emit('create', { username: name });
  };

  const joinRoom = (code) => {
    setJoinError('');
    setJoining(true);
    socket.emit('join', { username: name, id: code });
    setPendingRoom('');
    try {
      window.history.replaceState(null, '', window.location.pathname);
    } catch {
      /* ignore */
    }
  };

  const cancelLobby = () => {
    socket.emit('leave-lobby', { username: name, id });
    setView('create-join');
  };

  const playAgain = () => {
    socket.emit('play-again', { username: name, id });
    setChoice(null);
    setView('found');
  };

  const leaveRoom = () => {
    socket.emit('leave-lobby', { username: name, id });
    setOpponent('');
    setChoice(null);
    setView('create-join');
  };

  const inMatch = ['found', 'play', 'result'].includes(view) && opponent;
  const played = score.win + score.lose + score.tie;

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="brand__mark">
            <HandIcon move="rock" />
          </span>
          <span className="brand__text">
            <span>Rock Paper</span>
            <span>Scissors</span>
          </span>
        </div>
        <div className="topbar__right">
          {inMatch && played > 0 && (
            <div className="scorepill" aria-label={`Score: ${score.win} wins, ${score.lose} losses, ${score.tie} ties`}>
              <span className="w">W {score.win}</span>
              <span className="l">L {score.lose}</span>
              <span className="t">T {score.tie}</span>
            </div>
          )}
          {name && view !== 'name' && (
            <div className="chip" title={name}>
              <span className="chip__dot" aria-hidden="true" />
              <span className="chip__text">{name}</span>
            </div>
          )}
        </div>
      </header>

      <main className="stage">
        {view === 'name' && <Name initial={name} onSubmit={saveName} />}
        {view === 'create-join' && (
          <Create_join
            name={name}
            onCreate={createRoom}
            onJoin={() => {
              setJoinError('');
              setView('join');
            }}
            onRename={() => setView('name')}
          />
        )}
        {view === 'join' && (
          <Join
            initialCode={pendingRoom}
            error={joinError}
            busy={joining}
            onJoin={joinRoom}
            onBack={() => {
              setJoinError('');
              setJoining(false);
              setView('create-join');
            }}
          />
        )}
        {view === 'lobby' && <Lobby identity={id} onCancel={cancelLobby} notify={notify} />}
        {view === 'found' && (
          <Found
            name={name}
            socket={socket}
            id={id}
            opp={opponent}
            oppReady={oppReady}
            round={played + 1}
            onStart={() => setView('play')}
            onLeave={leaveRoom}
          />
        )}
        {view === 'play' && (
          <Game name={name} socket={socket} id={id} opp={opponent} set_choice={setChoice} />
        )}
        {view === 'result' && (
          <Result
            p1={p1}
            p2={p2}
            mine={choice}
            res={result}
            name={name}
            opp={opponent}
            play_again={playAgain}
            another={leaveRoom}
          />
        )}
      </main>

      {toast && <Toast key={toast.key} tone={toast.tone} onDone={() => setToast(null)}>{toast.message}</Toast>}
    </div>
  );
};

export default App;
