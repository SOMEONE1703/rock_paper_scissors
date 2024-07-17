import "./Result.css"
import React from 'react';
function Result({p1,p2,mine,res,play_again,another}){
    let opp="question.jpg";
    if (mine==p1){
        mine=`./${p1}.png`;
        opp=`./${p2}.png`;
    }
    else if(mine==p2){
        opp=`./${p1}.png`;
        mine=`./${p2}.png`;
    }
    else{
        console.log(`Your choice:${mine}`);
        mine=`./${mine}.png`;
    }
    const again = ()=>{
        console.log("Play again");
        play_again();
    };
    const leave=()=>{
        console.log("Leave Lobby");
        another();
    }
    return(
        <div id="uhm">
            <div id="res_bigger">
                <div className="vertical">
                    <div id="res_holder">
                        <div className="images">
                            <img src={mine} className="image" alt="Your Choice"/>
                        </div>
                        <span className="span1"/>
                        <div className="images">
                            <img src={opp} className="image" alt="Opponent's choice"/>
                        </div>
                    </div>
                    <span id="result_span2"></span>
                    <div id="announce">{res}</div>
                </div>
            </div>
            <span id="result_span3"></span>
            <div id="centra">
                <div className="hols">
                    <button onClick={again} className="agains">Play Again</button>
                    <span id="span10"></span>
                    <button onClick={leave} className="agains">Leave Lobby</button>
                </div>
            </div>
        </div>
    );
}

export default Result;