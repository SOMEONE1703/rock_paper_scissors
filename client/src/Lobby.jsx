import "./Lobby.css"
import React from 'react';

function Lobby({socket,name,action,identity}){
    const do_create = ()=>{
        socket.emit("create",{username:name});
    };
    if (action==="create"){
        console.log("happening");
        do_create();
    }
    return(
        <div id="lobby_bigger">
            <span id="span1"></span>
            <div className="some">
                <div class="loader"></div>
            </div>
            <div><h1>Joining Code:{identity}</h1></div>
            
        </div>
    );
}

export default Lobby;