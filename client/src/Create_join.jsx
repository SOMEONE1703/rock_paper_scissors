import "./Create_join.css"
import React from 'react';

function Create_join({name,socket,joiner}){
    const create=()=>{
        //console.log("creating");
        socket.emit("create",{username:name});
    };
    const join=()=>{
        //console.log("joining");
        joiner();
    };
    return(
        <div id="cj_bigger">
            <div className="holder">
                <div id="something">
                <button className="opts" onClick={create}>Create</button>
                <span className="span1"></span>
                <button className="opts" onClick={join}>Join</button></div>
            </div>
        </div>
    );
}

export default Create_join;