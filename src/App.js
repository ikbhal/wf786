import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectZoomNode,
  setEditNode,
  setNodeText,
  selectNodeIdLast,
  addChildAtEnd,
  toggleNodeChildren,
  deleteNode,
  addNextSibling,
  zoomIn,
  addPathToPathNodes,
  clearPathNodes
} from './WfSlice';
import './App.css';

import {PathSection} from './Path';

function App() {
  var zoomNode = useSelector(selectZoomNode);
  var zoomParentNode = useSelector(state => state.wf.zoomParentNode);
  console.log("zooom node:", zoomNode);
  var dispatch = useDispatch();
 
  return (
      <div className="App">
        <h1>Workflowy</h1>
        <PathSection/>
        <Node node={zoomNode} parentId={zoomParentNode} 
          addToPath={e=> dispatch(clearPathNodes())}/>
      </div>
  );
}

function Node({node, parentId,addToPath}) {
  const dispatch = useDispatch();

  var snode =  useSelector(state =>{ 
    var n2 = state.wf.nodes.find(n => n.id == node.id);
    return n2;
  });
  var children = useSelector(state =>{ 
    var n2 = state.wf.nodes.find(n => n.id == node.id);
    return n2.children;
  });

  const addToPathInternal = () =>{
    addToPath();
    // clearPathNodes
    dispatch(addPathToPathNodes(node.id));
  };

  var childNodes = children.map((child, index) => 
    <Node 
      key={index} 
      node={child}
      parentId={node.id}
      addToPath={addToPathInternal}
      />
  );

  var [isEdit, setEdit] = useState(false);
  var [text, setText] = useState(snode.text);
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

      <span className="add-next-sibling-node"
        onClick={e=> dispatch(addNextSibling({siblingId:node.id, parentId:parentId}))}
        >
        addsiblingnext
      </span>

      <span className="zoom-node"
        onClick={e => {
          addToPathInternal();
          // dispatch(zoomIn(node.id));
        } }>
        zoomin
      </span>

      {!isEdit &&
        <span className="node-text"
          onClick={e=> setEdit(true)}>
        {snode.text} 
        </span>
      }

      {isEdit &&
      <span className = "node-edit-text">
        <input
          type="text" 
          value={text}

          onChange={(e) => {
            setText(e.target.value);
            dispatch(setNodeText({id:node.id, text:e.target.value}));
          }}
          
          onBlur={ e => setEdit(false)}
        />
      </span>
      }

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
