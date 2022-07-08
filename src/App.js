import logo from './logo.svg';
import React, { useState } from 'react';
import './App.css';


let nodes = [];
let nodeIdLast = 4;
let startNode = null;


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
//console.log("startNode: ", startNode);

function App() {
  // const [text, setText] = useState("");
  // const onChangeHandler = (e) => {
  //   console.log("inside onchange handler");
  //   e.preventDefault();
  //   setText(e.target.value);
    
  // };
  return (
    <div className="App">
      <h1>Workflowy</h1>
      {/* <input type="text" value={text} onChange={onChangeHandler}/> */}
     <Node node={startNode}/>
    </div>
  );
}

function useForceUpdate(){
  const [value, setValue] = useState(0); // integer state
  return () => setValue(value => value + 1); // update state to force render
  // An function that increment 👆🏻 the previous state like here 
  // is better than directly setting `value + 1`
}

function Node({node}) {
  // console.log("inside node  data ...", node);
  var {id, text, closed, children} = node; 
  // console.log("inside node id:", id, ", text:",
  //  text , ", closed: ", closed, ", children: ", children);

  // console.log("Node funciton, nodes:", nodes);

  const [isClosed, setClosed] = useState(closed);
  const [getChildren, setChildren] = useState(children);
  const [getNodeText, setNodeText] = useState(text);
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

  const forceUpdate = useForceUpdate();

  var childNodes = null;
  if(!isClosed){
    childNodes = getChildren.map((child, index) => <Node key={index} node={child}/>);
  }
  return (
    <div className="node">
     <span className="toggle-children" 
      onClick={e => toggleChildren(node)} >
        {isClosed?"open": "close"}
     </span>
     <span className="add-child-node" 
      onClick={e=>addChildNode(node, setChildren)} >
        +c
     </span>
     <span className="delete-node" 
      onClick={e=>deleteChildNode(node)} >
        x
     </span>

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
