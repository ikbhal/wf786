import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setNodeText,
  addChildAtEnd,
  toggleNodeChildren,
  deleteNode,
  addNextSibling,
  addPathToPathNodeIds,
  clearPathNodeIds,
  selectZoomNodeId,
  load
} from './WfSlice';
import API from './api'
import './App.css';

import {PathSection} from './Path';
import {Search} from './Search';
import {SaveWf, LoadWf} from './SaveLoad';
import axios from 'axios';
import { TREE_MAN_LOAD_URL } from './urls';

function App() {

  var dispatch = useDispatch();

  useEffect(() => {
    // Update the document title using the browser API
    document.title = `treeman`;

    axios.get(TREE_MAN_LOAD_URL)
    .then((response) => {
        console.log(response);
        console.log("response.data is " , response.data);
        console.log("dispatch from button handler");
        // dispatch(load(response.data));
        dispatch(load(response.data));
        }, (error) => {
        console.log(error);
        });

  },[]);
  // var zoomNode = useSelector(selectZoomNode);
  var zoomNodeId = useSelector(selectZoomNodeId);
  // debugger;
  var zoomParentNodeId = useSelector(state => state.wf.zoomParentNodeId);
  console.log("zooom node id:", zoomNodeId);
 
 
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
  var snode = useSelector(state => state.wf && state.wf.nodes && state.wf.nodes.find(n=>n.id ==nodeId));

  var parentNode = useSelector(state => state.wf.nodes.find(n=>n.id ==parentId));

  if(snode == null){
    console.error("snode is null at node component");
  }
  // var childrenIds = snode && snode.childrenIds? snode.childrenIds.split(","): [];

  const addToPathInternal = () =>{
    addToPath();
    // clearPathNodes
    dispatch(addPathToPathNodeIds(nodeId));
  };
  // debugger;
  var childNodes = snode == null ? "": snode.children.map((childId, index) => 
    <Node 
      key={index} 
      nodeId={childId}
      parentId={nodeId}
      addToPath={addToPathInternal}
      />
  );

  var addChildHandler = (childText, childIndex, parentNodeId) => {
    console.log("inside addchild handler");

    const payload  =
    {
        childText: childText,
        parentNodeId : parentNodeId, // later
        // childIndex: parentNode.childrenIds.split(",").length // if not working try with 0
        childIndex: childIndex
    }

    API.post(`nodes/child`, payload) // if it working try with await
    .then(res => {
        console.log(res);
        console.log(res.data);
        var child = res.data.child;
        dispatch(addChildAtEnd({newChildId:child.id, newChildText:childText,  parentNodeId:parentNodeId}));
    });

  }

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
        onClick ={e => {
          
            // dispatch(deleteNode(nodeId));
            var onlyParentId = parentId[0] || parentId;
            const payload = 
            {
                "nodeId": nodeId,//nodeId
                "parentId": onlyParentId,//parentId
                "deleteType": "delete" 
            };

            API.delete(`nodes`, {data:payload})
            .then(res => {
              console.log(res);
              dispatch(deleteNode({id:nodeId, parentNodeId:onlyParentId}));
            });
        
          }
        }
        >
        delete
      </span>


      <span className="add-child-node"
        
        onClick={e=> {
          //  var childIndex = parentNode.childrenIds.split(",").length;
          debugger;
          var childIndex = 0;//temp test
           var randNum = Math.trunc(Math.random() * 100 );
           var childText = "new node " + randNum;
          //  var currentNodeId = nodeId[0];// todo fix is needed at nodeId level
           var currentNodeId = nodeId;
           addChildHandler(childText, childIndex, currentNodeId);

        }}
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
          
          onBlur={ e => {
              setEdit(false);
              //call backend api 
              let onlyNodeId = nodeId[0] || nodeId;
              const payload = {
                
                  // "childrenIds": childNodeIds,
                  "id": onlyNodeId,
                  "text": text
              
              }
              API.put(`nodes/text`, payload).then(res => {
                console.log("res ",res);
                console.log("res.data ", res.data);

                dispatch(setNodeText({id:onlyNodeId, text:res.data.text}))

              })
            }
          }
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
