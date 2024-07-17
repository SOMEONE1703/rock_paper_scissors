// App.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './index.css';
import Create_join from './Create_join';
import Join from './Join';
import Lobby from './Lobby';
import Found from './Found';
import Game from './Game';
import Ready from './Ready';
import Result from './Result';
import Name from './Name';

const socket = io();

const App = () => {
  const [view, setView] = useState("name");
  const [name, setName] = useState("something");
  const [opponent, setOpponent] = useState("something");
  const [choice, setChoice] = useState("question");
  const [result, setResult] = useState("Uhm I don't know");
  const [p1, setP1] = useState("question");
  const [p2, setP2] = useState("question");
  const [id, setId] = useState("temp");

  useEffect(() => {
    socket.on("create-res", (data) => {
      console.log(data);
      setId(data.id);
      setView("lobby");
    });

    socket.on("identity", (data) => {
      console.log(data);
    });

    socket.on("not-found", () => {
      alert("Invalid Joining Code");
    });

    socket.on("opponent", (data) => {
      console.log("Opponent found");
      setOpponent(data.name);
      setId(data.identity);
      setView("found");
    });

    socket.on("enable-start", () => {
      console.log("Enable Start");
    });

    socket.on("tie", (data) => {
      console.log("tie");
      setP1(data.p1);
      setP2(data.p2);
      setResult("Tie");
      setView("result");
    });

    socket.on("winner", (data) => {
      console.log("You Win!!");
      setP1(data.p1);
      setP2(data.p2);
      setResult("You Win!!");
      setView("result");
    });

    socket.on("loser", (data) => {
      console.log("You Lose!!");
      setP1(data.p1);
      setP2(data.p2);
      setResult("You Lose!!");
      setView("result");
    });

    socket.on("opp-lost", (data) => {
      console.log("Opponent Lost!!");
      console.log(data);
      alert("Opponent Lost!!");
      setView("create-join");
    });

    socket.on("opp-left", (data) => {
      console.log("Opponent Left!!");
      console.log(data);
      alert("Opponent Left!!");
      setView("create-join");
    });

    return () => {
      socket.off("create-res");
      socket.off("identity");
      socket.off("not-found");
      socket.off("opponent");
      socket.off("enable-start");
      socket.off("tie");
      socket.off("winner");
      socket.off("loser");
      socket.off("opp-lost");
      socket.off("opp-left");
    };
  }, []);

  const playAgain = () => {
    socket.emit("play-again", { username: name, id: id });
    setView("found");
  };

  const leaveLobby = () => {
    socket.emit("leave-lobby", { username: name, id: id });
    setView("create-join");
  };

  const setNameAndJoin = (x) => {
    setName(x);
    setView("create-join");
  };

  const doJoin = () => {
    setView("join");
  };

  const pressStart = () => {
    setView("play");
  };

  return (
    <div className="App">
      {view === "name" && <Name process={setNameAndJoin} />}
      {view === "create-join" && <Create_join name={name} socket={socket} joiner={doJoin} />}
      {view === "join" && <Join name={name} socket={socket} />}
      {view === "lobby" && <Lobby name={name} socket={socket} identity={id} />}
      {view === "found" && <Found name={name} socket={socket} id={id} opp={opponent} count={pressStart} />}
      {view === "play" && <Game name={name} socket={socket} id={id} set_choice={setChoice} />}
      {view === "result" && <Result p1={p1} p2={p2} mine={choice} res={result} play_again={playAgain} another={leaveLobby} />}
      {view !== "name" && view !== "create-join" && view !== "join" && view !== "lobby" && view !== "found" && view !== "play" && view !== "result" && (
        <h1>Looks like you are lost, Try Refreshing</h1>
      )}
    </div>
  );
};

export default App;
