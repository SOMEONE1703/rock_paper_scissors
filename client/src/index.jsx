import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import io from 'socket.io-client';
import Create_join from './Create_join';
import Join from './Join';
import Lobby from './Lobby';
import Found from './Found';
import Game from './Game';
import Ready from './Ready';
import Result from './Result';
import Name from './Name';


var name="something";
var opponent="something";
var choice="question";
var re="Uhm I don't know";
var p1="question";
var p2="question";
console.log("as weird as it it, it's me");
const socket=io();
let id="temp";

socket.on("create-res",(data)=>{
  console.log(data);
  id=data.id;
  handle("lobby");
});
socket.on("identity",(data)=>{
  console.log(data);
});

socket.on("not-found",()=>{
  alert("Invalid Joining Code");
});

socket.on("opponent",(data)=>{
  console.log("Opponent found");
  //console.log(data);
  opponent=data.name;
  id=data.identity;
  handle("found");
});

socket.on("enable-start",()=>{
  console.log("Enable Start");
});

socket.on("start-match",()=>{
  console.log("Start Game");
  setTimeout(()=>{
    console.log("press start");
    press_start();
  },3000);
});

socket.on("tie",(data)=>{
  console.log("tie");
  //console.log(data);
  p1=data.p1;
  p2=data.p2;
  re="Tie";
  handle("result");
});

socket.on("winner",(data)=>{
  console.log("You Win!!");
  //console.log(data);
  p1=data.p1;
  p2=data.p2;
  re="You Win!!";
  handle("result");
});

socket.on("loser",(data)=>{
  console.log("You Lose!!");
  //console.log(data);
  p1=data.p1;
  p2=data.p2;
  re="You Lose!!";
  handle("result");
});

socket.on("opp-lost",(data)=>{
  console.log("Opponent Lost!!");
  console.log(data);
  alert("Opponent Lost!!");
  handle("create-join");
});


function playAgain(){
  handle("create-join");
}

function set_name(x){
  name=x;
  handle("create-join");
}
function do_join(){
  handle("join");
}

function press_start(){
  handle("play")
}

function setChoice(data){
  choice=data;
}

function handle(data){
  const root = ReactDOM.createRoot(document.getElementById('root'));
  //console.log(data);
  if (data==="name"){
    root.render(
      <React.StrictMode>
        <div className="App">
          <Name process={set_name}/>
        </div>
      </React.StrictMode>
    );
  }
  else if (data==="create-join"){
    root.render(
      <React.StrictMode>
        <div className="App">
          <Create_join name={name} socket={socket} joiner={do_join}/>
        </div>
      </React.StrictMode>
    );
  }
  else if (data==="join"){
    root.render(
      <React.StrictMode>
        <div className="App">
          <Join name={name} socket={socket}/>
        </div>
      </React.StrictMode>
    );
  }
  else if (data==="lobby"){
    root.render(
      <React.StrictMode>
        <div className="App">
          <Lobby name={name} socket={socket} identity={id}/>
        </div>
      </React.StrictMode>
    );
  }
  
  else if (data==="found"){
    root.render(
      <React.StrictMode>
        <div className="App">
          <Found name={name} socket={socket} id={id} opp={opponent}/>
        </div>
      </React.StrictMode>
    );
  }
  else if (data==="play"){
    root.render(
      <React.StrictMode>
        <div className="App">
          <Game name={name} socket={socket} id={id} set_choice={setChoice}/>
        </div>
      </React.StrictMode>
    );
  }
  else if (data==="result"){
    root.render(
      <React.StrictMode>
        <div className="App">
          <Result p1={p1} p2={p2} mine={choice} res={re} play_again={playAgain}/>
        </div>
      </React.StrictMode>
    );
  }
  else{
    root.render(
      <React.StrictMode>
        <h1>Looks like you are lost, Try Refreshing</h1>
      </React.StrictMode>
    );
  }
}

handle("name");


