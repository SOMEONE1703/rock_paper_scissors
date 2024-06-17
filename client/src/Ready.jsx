import './Ready.css';
import React,{useState} from 'react';

function Ready({socket,name,id}){
    let i_am_ready=false;
    const[ready,setReady] = useState("Ready Up");
    //console.log(`identity: ${id}`);
    const proc=()=>{
        if (ready==="Ready"){
            return;
        }
        i_am_ready=!i_am_ready;
        setReady("Ready");
        socket.emit("ready",{username:name,id:id});
    };

    return (
        <button id="butts" onClick={proc}>
            {ready}
        </button>
    );
}

export default Ready;