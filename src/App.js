import logo from './logo.svg';
import React, { useState } from 'react';
import './App.css';


let nodes = [];
let nodeIdLast = 4;
let startNode = null;
let zoomNode = null;
let newZoomNode = null;
let zoomParentNode = null;
let pathNodes = [];


let n2 = {id: 2, text: "n2", closed: true, children: []};
let n3 = {id: 3, text: "n3", closed: true, children: []};
let n4 = {id: 4, text: "n4", closed: true, children: []};
let n1 = {id: 1, text: "n1", closed: true, children: [n2, n3, n4]};
nodes.push(n1);
nodes.push(n2);
nodes.push(n3);
nodes.push(n4);

//console.log("nodes:",nodes);
startNode= n1;
//set zoom node 
zoomNode = startNode;
//add startnode to path nodes;
pathNodes.push(startNode);

//console.log("startNode: ", startNode);

function App() {
  // const [text, setText] = useState("");
  // const onChangeHandler = (e) => {
  //   console.log("inside onchange handler");
  //   e.preventDefault();
  //   setText(e.target.value);
    
  // };
  // const [getZoomNode, setZoomNode] = useState(zoomNode);
  // const [getZoomParentNode, setZoomParentNode] = useState(zoomParentNode);

  const forceUpdate = useForceUpdate();
  const [first, setFirst] = useState(true);

  const [showPath, setShowPath] = useState(true);
  const addToPath = () => {
    console.log("inside app addtoTpath");
    console.log("zoom node:", zoomNode);
    console.log("set path nodes to empy array");
    pathNodes = [];

    //toggle, toggle to reflect  -> wont work here base case, need to do at call end, need to pass
   // setShowPath(true);
    
    
  };

  return (
    <div className="App">
      <h1>Workflowy</h1>
      
      <button onClick={e => {
        console.log("show path toggle button ");
        setShowPath(!showPath);
      }}>
        {showPath? "hide path": "show path"}
      </button>

      {showPath &&
      <PathSection pathNodes={pathNodes}/>  
      }
      {/* <input type="text" value={text} onChange={onChangeHandler}/> */}
      <button onClick={e=>{
        console.log("setting zoom at the root level to new zoom node ", newZoomNode);
        // setZoomNode(newZoomNode);
        // console.log("getZoomNode ", getZoomNode);
        zoomNode=newZoomNode;
        console.log("zoom node ", zoomNode);
        }
      }
      >
          set zoom node from new zoom node
      </button>

      <button onClick={e=> {setFirst(!first);}}>{first?"Show root": "hide root"}</button>

      {first &&
        <Node node={zoomNode}
        parentNode={null}
        addToPath={addToPath}
        // setZoomNode={setZoomNode}
        // setZoomParentNode={setZoomParentNode}
      
        />
      }
    </div>
  );
}

function PathSection({pathNodes}){
  console.log("inside pathsection pathNodes:", pathNodes);

  const pathPartHandler = (node) =>{
    console.log("inside path part handler, node: ", node);
  };

  pathNodes.map( (node, index) => {
    console.log("path nodess map node:", node);
  });
  var pathNodeComps = pathNodes.map( (node, index) => 
  <PathPart 
    node={node} 
    key={index}
    onClick={e=> pathPartHandler(node)}
    >

    </PathPart>
  );
  return (
    <>
      <h2>Path Section</h2>
      <div className="path_section">
        {pathNodeComps}
      </div>
    </>
  );
}

function PathPart({node, onClick}){
  console.log("inside path part node:", node ,
  "onClick:", onClick);
  return (
    <>
    <span className="path-part">
      {node.text}  > 
    </span>
    {/* <span>|</span> */}
    </>
  );
}

function useForceUpdate(){
  const [value, setValue] = useState(0); // integer state
  return () => setValue(value => value + 1); // update state to force render
  // An function that increment 👆🏻 the previous state like here 
  // is better than directly setting `value + 1`
}

function Node({node, parentNode, addToPath}) {
  // console.log("inside node  data ...", node);
  // var {id, text, closed, children} = node; 
  // console.log("inside node id:", id, ", text:",
  //  text , ", closed: ", closed, ", children: ", children);

  // console.log("Node funciton, nodes:", nodes);

  const [isClosed, setClosed] = useState(node.closed);
  const [getChildren, setChildren] = useState(node.children);
  const [getNodeText, setNodeText] = useState(node.text);
  const [isNodeTextEdit, setNodeTextEdit] = useState(false);

  const toggleChildren = () => {
    setClosed(!isClosed);
    console.log("inside toggleChildren");
  };

  const addChildNode = (node,setChildren) => {
    console.log("inside add child node", node);
    nodeIdLast++;
    let child = {id: nodeIdLast, 
      text: "n"+nodeIdLast, 
      closed: true, 
      children: []};
    nodes.push(child);
    console.log("child:", child, " nodes:", nodes);
    node.children.push(child);
    forceUpdate();
  };
  
  const deleteChildNode = (node) => {
    console.log("delete node ", node);
    let id = node.id ;
    //delete node at index id-1
    nodes.splice(id-1,1);
    console.log("after delete nodes: ", nodes);
    forceUpdate();
  };

  const nodeTextChangeHandler = (e) => {
    console.log("inside node text change");
    e.preventDefault();
    setNodeText(e.target.value);
  };

  const addNextSiblingNode = (node, parentNode) => {
    console.log("inside addNextSiblingNode  node:",
      node , ", parentNode:", parentNode);
    if(parentNode != null){
      let  parentNodeChildren = parentNode.children;
      if(parentNodeChildren != null){
        let nodeIndex = parentNodeChildren.indexOf(node);
        // create empty node
        // increment node id  last counter
        nodeIdLast++;
        let newChildNode = {
          id: nodeIdLast, 
          text: "n"+nodeIdLast,
          closed: true, 
          children: []
        };
        // insert new child node at  next postion of current node at parent node children array
        parentNodeChildren.splice(nodeIndex+1, 0, newChildNode);
        // rerender trigger -> not working
        //forceUpdate();
      }
    }
  };

  const setZoomNodeHandler = (node) =>{
    console.log("inside zoom node: ", node);
    if(startNode != node){
      newZoomNode = node;
      console.log("newZooomNode is ", newZoomNode);
      // setZoomNode(zoomNode);
      //add current node to path Nodes;
      // need to improve find all nodes from this node to all ancester by rendering  - add to path nodes
      // pathNodes.push(zoomNode);
      // forceUpdate();
      // appForceUpdate();

      nodeAddToPath();
    }
  };

  const nodeAddToPath = () =>{
    console.log("inside node component addToPath node:", node);
    console.log("call parent addToapth ");
    addToPath();
    console.log("adding current node:", node , " to path Nodes");
    pathNodes.push(node);
    console.log("path Nodes:", pathNodes);
  };

  const forceUpdate = useForceUpdate();

  var childNodes = null;
  if(!isClosed){
    childNodes = getChildren.map((child, index) => 
      <Node 
        key={index} 
        node={child} 
        parentNode={node}
        addToPath={nodeAddToPath}
       
         />
    );
  }
  return (
    <div className="node">
    {/* {zoomNodeText2} */}
     <span className="toggle-children" 
      onClick={e => toggleChildren(node)} >
        {isClosed?"open": "close"}
     </span>
     <span className="add-child-node" 
      onClick={e=>addChildNode(node, setChildren)} >
        add child
     </span>
     {parentNode !=null && 
     <span className="delete-node" 
      onClick={e=>deleteChildNode(node)} >
        delete
     </span>
     }
     {parentNode !=null && 
     <span className="add-next-sibling-node"
      onClick={e=>addNextSiblingNode(node, parentNode)}
     >
      add next sibling
     </span>
     }
     {startNode !=node && 
     <span className="zoom-node"
      onClick={e=>setZoomNodeHandler(node)}
     >
      zoom in
     </span>
     }

     {!isNodeTextEdit && 
      <span className="node-text"
        onClick={e=>setNodeTextEdit(true)}>
        {getNodeText}
      </span>
     }

     {isNodeTextEdit &&
      <span className="node-text-edit">
        <input type="text" 
        value={getNodeText}
        onChange={nodeTextChangeHandler}
        onBlur={e=>setNodeTextEdit(false)}/>    
      </span>
     }
     <div className="node-children">
      {/* closed: {isClosed? 'true': 'false'} <br/> */}
      {/* childrenId: {children.join(",")} */}
      {childNodes}
     </div>
    </div>
  );
}
export default App;
