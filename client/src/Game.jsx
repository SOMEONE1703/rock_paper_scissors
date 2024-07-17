import "./Game.css"
import React, { useState } from 'react';
function Game({name,socket,id,set_choice}){
    console.log(`game identity:${id}`);
    const[choice,setChoice]=useState("temp");
    const rock=()=>{
        socket.emit("play",{username:name,id:id,play:"rock"});
        set_choice("rock");
        setChoice("rock");
    }
    const paper=()=>{
        socket.emit("play",{username:name,id:id,play:"paper"});
        set_choice("paper");
        setChoice("paper");
    }
    const scissors=()=>{
        socket.emit("play",{username:name,id:id,play:"scissors"});
        set_choice("scissors");
        setChoice("scissors");
    }
    return(
        <div id="game_bigger">
            <div className="vertical">
                <div id="game_holder">
                    {choice!=="paper"&&choice!=="scissors"&&
                    <div className="images">
                        <img src="./rock.png"  id="rock" onClick={rock} className="image" alt="rock"/>
                    </div>}
                    <span className="span1"/>
                    {choice!=="rock"&&choice!=="scissors"&&
                    <div className="images">
                        <img src="./paper.png" id="paper" onClick={paper} className="image" alt="paper"/>
                    </div>}
                    <span className="span1"/>
                    {choice!=="paper"&&choice!=="rock"&&
                    <div className="images">
                        <img src="./scissors.png" id="scissors" onClick={scissors} className="image" alt="scissors"/>
                    </div>}
                </div>
            </div>
        </div>
    );
}

export default Game;