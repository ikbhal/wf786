import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectZoomNode,
  setEditNode,
  setNodeText,
  selectNodeIdLast,
  addChildAtEnd,
  toggleNodeChildren,
  deleteNode
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

  var snode =  useSelector(state =>{ 
    var n2 = state.wf.nodes.find(n => n.id == node.id);
    return n2;
  });
  var children = useSelector(state =>{ 
    var n2 = state.wf.nodes.find(n => n.id == node.id);
    return n2.children;
  });

  var childNodes = children.map((child, index) => <Node key={index} node={child}/>);
  return (
    <>
    {snode &&
    <div className="node">
      <span className="toggle-children"
        onClick ={e => dispatch(toggleNodeChildren(node.id))}
      >
        {snode.closed?"open":"close"}
      </span>

      <span className="delete-node"
        onClick ={e => dispatch(deleteNode(node.id))}
        >
        delete
      </span>

      <span className="add-child-node"
        onClick={e=>dispatch(addChildAtEnd(node))}
      >
        addchild
      </span>

      <span className="node-text">
        {node.text}
      </span>

      {!snode.closed &&
        <div className="node-children">
          {childNodes}
        </div>
      }
    </div>
    }
    </>
  );
}
export default App;
