import "./Name.css";
import React, { useState } from "react";

function Name({process}){
    const [val, setInputValue] = useState("");
    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };
    const take=()=>{
        if (val.trim()!==""){
            process(val);
        }
        else{
            alert("Name cannot be empty");
        }
    };
    return(
        <div id="name_bigger">
            <div id="name_holder">
                <div className="text">
                    <h id="title1">Enter name</h>
                </div>
                <span className="span2"></span>
                <input type="text" className='name' onChange={handleInputChange}></input>
                <span className="span1"></span>
                <button class="take" onClick={take}>Done</button>
            </div>
        </div>

    );
}

export default Name;