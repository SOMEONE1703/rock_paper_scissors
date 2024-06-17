import './Join.css';
import React, { useState } from "react";

function Join({socket,name}){
    const [room, setRoom] = useState('');
    const attempt_join = () => {
        console.log('Joining room:',room);
        if(socket&&room){
            socket.emit("join",{username:name,id:room});
        }
        else{
            console.log("Room number cannot be empty");
        }
    };
    const handleInputChange = (e) => {
        setRoom(e.target.value);
    };
    return( 
        <div className='Join'>
            <div id="holder">
                <span id='span1'></span>
                <div className="inners">
                    <h2 id="enter">Enter Joining Code</h2>
                </div>
                <span id='span2'></span>
                <div className="inners">
                    <input type="text" autocomplete="off" id="room_number" onChange={handleInputChange}/>
                </div>
                <span id='span3'></span>
                <div className="inners">
                    <button id="join" onClick={attempt_join}>
                        <h2 id="join_text">Join Game!</h2>
                    </button>
                </div>
            </div>

        </div>
    );
}

export default Join;