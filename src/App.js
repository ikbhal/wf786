import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectZoomNode,
  setEditNode,
  setNodeText
} from './WfSlice';
import './App.css';

function App() {
  var zoomNode = useSelector(selectZoomNode);
  console.log("zooom node:", zoomNode);

  return (
      <div className="App">
        <h1>Workflowy</h1>
        <Node node={zoomNode} />
      </div>
  );
}

function Node({node}) {
  const dispatch = useDispatch();

  const nodeTextChangeHandler = (e) => {
    console.log("inside node text change");
    e.preventDefault();
    setNodeText(e.target.value);
  };

  return (
    <div className="node">
      {!node.editing && 
      <span className="node-text"
        onClick={e=>dispatch(setEditNode(node, true))}>
        {node.text}
      </span>
     }

     {node.editing &&
      <span className="node-text-edit">
        <input type="text" 
        value={node.text}
        onChange={nodeTextChangeHandler}
        onBlur={e=>setEditNode(node, false)}/>    
      </span>
     }
    </div>
  );
}
export default App;
