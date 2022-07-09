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

  var childNodes = node.children.map((child, index) => <Node key={index} node={child}/>);
  return (
    <div className="node">
      {node.text}
      <div className="node-children">
        {childNodes}
      </div>
    </div>
  );
}
export default App;
