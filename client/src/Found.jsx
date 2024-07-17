import "./Found.css"
import React,{useState,useEffect} from 'react';
import Ready from "./Ready";
function Found({socket,name,id,opp,count}){
    //console.log("one");
    //need name,opp,socket,id
    const [me_ready,mee]=useState("red");
    const [opp_ready,oppset]=useState("red");
    socket.on("readyy",(data)=>{
        //console.log(`${data.name} ready`);
        if (data.name==opp){
            oppset("green")
        }
        else{
            mee("green");
        }
    });
    const readify=()=>{
        //remove ready button
    }
    const [me,setMe]=useState();
    const [opps,setOpp]=useState();
    useEffect(()=>{
        setMe(name);
        setOpp(opp);
    }, [name, opp]);
    return(
        <div>
            <div id="found_bigger">
                <span id="span1"></span>
                <div className="tot">
                    <div className="players">
                        <div id="me" style={{color:me_ready}}><h1>{me}</h1></div>
                        <div class="vs"><h1>VS</h1></div>
                        <div id="opp" style={{color:opp_ready}}><h1>{opps}</h1></div>
                    </div>
                </div>    
            </div>
            <span id="span2"></span>
            <div id="centra">
                <div className="hol"><Ready name={name} socket={socket} id={id} press={count}/></div>
            </div>
        </div>
    );
}

export default Found;