import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setNodeText,
  addChildAtEnd,
  toggleNodeChildren,
  deleteNode,
  addNextSibling,
  addPathToPathNodeIds,
  clearPathNodeIds,
  selectZoomNodeId
} from './WfSlice';
import './App.css';

import {PathSection} from './Path';
import {Search} from './Search';
import {SaveWf, LoadWf} from './SaveLoad';

function App() {
  // var zoomNode = useSelector(selectZoomNode);
  var zoomNodeId = useSelector(selectZoomNodeId);
  // debugger;
  var zoomParentNodeId = useSelector(state => state.wf.zoomParentNodeId);
  console.log("zooom node id:", zoomNodeId);
  var dispatch = useDispatch();
 
  return (
      <div className="App">
        <h1>Workflowy</h1>
        <SaveWf/> <LoadWf/>
        <Search/>
        <PathSection/>
        <Node nodeId={zoomNodeId} parentId={zoomParentNodeId} 
          addToPath={
            e=> dispatch(clearPathNodeIds())
            
            }/>
      </div>
  );
}

function Node({nodeId, parentId,addToPath}) {
  const dispatch = useDispatch();

  // var snode =  useSelector(state =>{ 
  //   var n2 = state.wf.nodes.find(n => n.id == node.id);
  //   return n2;
  // });
  // var snode = useSelector(selectNodeById(nodeId));
  var snode = useSelector(state => state.wf && state.wf.nodes && state.wf.nodes.find(n=>n.id ==nodeId));
  // var children = useSelector(state =>{ 
  //   var n2 = state.wf.nodes.find(n => n.id == nodeId);
  //   return n2.children;
  // });
  // debugger;
  if(snode == null){
    console.error("snode is null at node component");
    // debugger;
    // return (
    //   <div>Error rendering Node compo</div>
      
    // );
  }
  var childrenIds = snode && snode.childrenIds? snode.childrenIds.split(","): [];

  const addToPathInternal = () =>{
    addToPath();
    // clearPathNodes
    dispatch(addPathToPathNodeIds(nodeId));
  };

  var childNodes = childrenIds.map((childId, index) => 
    <Node 
      key={index} 
      nodeId={childId}
      parentId={nodeId}
      addToPath={addToPathInternal}
      />
  );

  var [isEdit, setEdit] = useState(false);
  var [text, setText] = useState(snode?snode.text:"");
  return (
    <>
    {snode &&
    <div className="node">
      <span className="toggle-children"
        onClick ={e => dispatch(toggleNodeChildren(nodeId))}
      >
        {snode.closed?"open":"close"}
      </span>

      <span className="delete-node"
        onClick ={e => dispatch(deleteNode(nodeId))}
        >
        delete
      </span>

      <span className="add-child-node"
        onClick={e=>dispatch(addChildAtEnd(nodeId))}
      >
        addchild
      </span>

      <span className="add-next-sibling-node"
        onClick={e=> dispatch(addNextSibling({siblingId:nodeId, parentId:parentId}))}
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
            dispatch(setNodeText({id:nodeId, text:e.target.value}));
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
