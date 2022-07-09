import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setNodeText } from './WfSlice';


export function Search() {

  var [text, setText] = useState('');
  return (
    <div>
        Search for {text}
        <input type="text" value={text} 
            onChange={e=> setText(e.target.value)}
            onKeyPress={e=> {
                console.log("inside key presss e:", e);
                console.log("e.key:", e.key);
                if(e.key == 'Enter'){
                    console.log("Ikbhal enter pressed");
                }
            }}/>
        
    </div>
  );
}