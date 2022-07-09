import { createSlice } from '@reduxjs/toolkit'

let nodes = [];
let nodeIdLast = 4;
let startNode = null;
let zoomNode = null;
// let newZoomNode = null;
// let zoomParentNode = null;
let pathNodes = [];

let n2 = {id: 2, text: "n2", closed: true, editing:false, children: []};
let n3 = {id: 3, text: "n3", closed: true, editing:false, children: []};
let n4 = {id: 4, text: "n4", closed: true, editing:false, children: []};
let n1 = {id: 1, text: "n1", closed: true, editing:false, children: [n2, n3, n4]};

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


export const wfSlice = createSlice({
  name: 'wf',
  initialState: {
    startNode: startNode,
    nodes: nodes,
    zoomNode: startNode,
    pathNodes: pathNodes,
    nodeIdLast: nodeIdLast
  },
  reducers: {
    zoomIn: (state, node) => {
        console.log("zoom in reducer node:", node);
    },
    pathNodeClick:(state, pathNode) =>{
        console.log("path node clock pathNode:", pathNode);
    },
    deleteNode: (state, node) =>{
        console.log("delete node " , node);
    },
    addNextSibling : (ste, node) =>{
        console.log("add next sibling node:", node);
    },
    addChildAtEnd: (state, node) =>{
        console.log('add child at end for node :', node);
    },
    toggleNodeChildren: (state, node) => {
        console.log("toggle node children node:", node);
    },
    incrNodeIdLast: (state) => {
        console.log("increment node id last");
    },
    addNodeToNodes: (state, node) => {
        console.log("add node to nodes node:", node);
    },
    // not working yet
    setEditNode: (state, action) => {
        console.log("set edit action:", action);
        // node.editing = action.payload;
        // todo do we need to update nodes field?
        // var {node, editing} = action.payload;
        // console.log("node: ", node, " editing:", editing)
        // node.editing = editing;
        console.log("node id :", action.payload.node.id,
            " ,editing:", action.payload.editing);
        var nodeIndex = state.nodes.findIndex(n => n.id ==action.payload.node.id);
        state.nodes[nodeIndex].editing = action.payload.editing;

        console.log("state.nodes:", state.nodes);

    },
    setNodeText: (state, action) => {
        console.log("set node text action:", action);
    }
  },
});

export const { zoomIn, pathNodeClick,
     deleteNode,addNextSibling,
    addChildAtEnd,toggleNodeChildren,
    incrNodeIdLast,addNodeToNodes,
    setEditNode,setNodeText } = wfSlice.actions;

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
// export const incrementAsync = (amount) => (dispatch) => {
//   setTimeout(() => {
//     dispatch(incrementByAmount(amount))
//   }, 1000)
// }

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectNodes = (state) => state.wf.nodes;
export const selectStartNode = (state) => state.wf.startNode;
export const selectZoomNode =(state) => state.wf.zoomNode;
export const selectPathNodes = (state) => state.wf.pathNodes;
export const selectNodeIdLast = (state) => state.wf.nodeIdLast;

export default wfSlice.reducer;
