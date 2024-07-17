import './Ready.css';
import React,{useState} from 'react';

function Ready({socket,name,id,press}){
    //console.log("react rerenders so expect multiple");
    let b=false;
    socket.on("start-match",()=>{
        if (!b){
            b=!b;
        }
        console.log("Start Game");
        socket.off("start-match");
        countdown(5);
        
    });
    let i_am_ready=false;
    const[ready,setReady] = useState("Ready Up");
    //console.log(`identity: ${id}`);
    const proc=()=>{
        if (ready!="Ready Up"){
            return;
        }
        i_am_ready=!i_am_ready;
        //setReady(`Starting in ${count}`);
        socket.emit("ready",{username:name,id:id});
        setReady("Waiting...");
    };
    
    const countdown=(n)=>{
        //setCount(n);
        setReady(`Starting in ${n}`);
        setTimeout(()=>{
            if(n<=0){
                press();
            }
            else{
                countdown(n-1);
            }
        },1000);
    }

    return (
        <button id="butts" onClick={proc}>
            {ready}
        </button>
    );
}

export default Ready;