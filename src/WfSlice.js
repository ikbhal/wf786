import { createSlice } from '@reduxjs/toolkit'
// import { trackForMutations } from '@reduxjs/toolkit/dist/immutableStateInvariantMiddleware';

let nodes = [];
let nodeIdLast = 4;
let startNode = null;
let zoomNode = null;
// let newZoomNode = null;
// let zoomParentNode = null;
// let pathNodes = [];
let pathNodeIndices = [];
pathNodeIndices.push(0);

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
// pathNodes.push(startNode);


export const wfSlice = createSlice({
  name: 'wf',
  initialState: {
    startNodeIndex: 0,
    nodes: nodes,
    zoomNodeIndex: 0,
    zoomParentNodeIndex : -1,
    pathNodeIndices: pathNodeIndices,
    nodeIdLast: nodeIdLast,
    searchText: "",
    searchResult: []
  },
  reducers: {
    zoomIn: (state, action) => {
        console.log("zoom in reducer action:", action);
        var id = action.payload;
        console.log("path part node id:", id);
        var node = state.nodes.find(n => n.id ==id);
        console.log("node:", node);
        // remove path parts after action.pyalod
        // var pi = state.pathNodes.findIndex(n=> n.id == id);
        var pi = state.pathNodeIndices.findIndex(pid => id==pid);
        var pathNodes = state.pathNodes.slice(0, pi+1);
        state.pathNodes =pathNodes;
        // set zoom node to id 
        state.zoomNodeIndex = pi;
        // set zoom parent node 
        var zoomParentNodeIndex = pi>0?state.pathNodes[pi-1]: -1;
        state.zoomParentNode = zoomParentNodeIndex;
        
    },
    pathNodeClick:(state, pathNode) =>{
        console.log("path node clock pathNode:", pathNode);
    },
    deleteNode: (state, action) =>{
        console.log("delete node " , action);
        var deleteNodeId = action.payload;
        // delete node in nodes array
        var deletedNodeIndex = state.nodes.findIndex(n=> n.id == deleteNodeId);
        var deletedNode = state.nodes[deletedNodeIndex];
        state.nodes.splice(deletedNodeIndex, 1)

        // delete node in parent nodes
        state.nodes.forEach(n => {
            var ci = n.children.findIndex(c=>c.id ==deleteNodeId);
            if(ci !=-1){
                n.children.splice(ci,1);
            }
        });
    },
    addNextSibling : (state, action) =>{
        console.log("add next sibling action:", action);
        //siblingId:node.id, parentId:parentId
        var siblingId = action.payload.siblingId;
        var parentId = action.payload.parentId;
        console.log("siblingId:", siblingId, ", parentId:", parentId);
        // duplicate state node
        var pnode = state.nodes.find(n=> n.id == parentId);
        var snode = state.nodes.find(n=> n.id == siblingId);
        // increment nodeidlast
        state.nodeIdLast++;
        var childNode = {
            id: state.nodeIdLast,
            text: "n"+state.nodeIdLast,
            closed: true, 
            editing:false, 
            children: []
        };
        //add new node to nodes
        state.nodes.push(childNode);
        // find sibling node position parent node childrens
        var psi = pnode.children.findIndex(n=>n.id==siblingId);
        // add new child node at parent children after sibling nod
        pnode.children.splice(psi+1, 0, childNode);
        // restore nodes to state nodes
        // state.nodes = nodes;

    },
    addChildAtEnd: (state, action) =>{
        console.log('add child at end for action :', action);
        // debugger;
        var pnode = action.payload;
        console.log(" pnode:", pnode);
        var node = state.nodes.find(n=>n.id ==pnode.id);
        // increament node id last
        state.nodeIdLast++;
        var newChild =  {
            id: state.nodeIdLast,
            text: "n"+state.nodeIdLast,
            editing:false, 
            children: []};
        console.log("newChild:", newChild);
        node.children.push(newChild);
        console.log("child added to parent node:", node," newChild:", newChild);
        // add child to nodes
        state.nodes.push(newChild);
        // reset node states
        console.log("state.nodes", state.nodes);
    },
    toggleNodeChildren: (state, action) => {
        console.log("toggle node children action:", action);
        var snode = state.nodes.find(n => n.id ==action.payload);
        snode.closed =! snode.closed;
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
        var nodeIndex = state.wf.nodes.findIndex(n => n.id ==action.payload.node.id);
        state.wf.nodes[nodeIndex].editing = action.payload.editing;

        console.log("state.nodes:", state.wf.nodes);

    },
    setNodeText: (state, action) =>{
        console.log("set node text action:", action);
        var id = action.payload.id;
        var text = action.payload.text;
        var ni = state.nodes.findIndex(n => n.id == id);
        state.nodes[ni].text =text;
    },
    clearPathNodes: (state) =>{
        console.log("inside clearPathNodes");
        state.pathNodes = [];
    },
    addPathToPathNodes: (state, action) => {
        console.log("inside addPathToPathNodes action:", action);
        var node = state.nodes.find(n=> n.id ==action.payload);
        state.pathNodes.push(node);
    },
    searchNodes: (state, action) =>{
        console.log("inside search action:", action);
        var text = action.payload;
        if(text == null || text==""){
            return ;
        }
        console.log("text:", text);
        // set search text
        state.searchText = text;
        // var result = searchNodesHelper(state.nodes, text);
        var pathArray = [];
        var pathPart = null;
        var path = [];
        var node = state.nodes[state.startNodeIndex];
        searchFromRootNodeHelper(node, text, path, pathArray);
        console.log("pathArray:", pathArray);
        state.searchResult = pathArray;
    }
  },
});

function searchNodesHelper(nodes, text){
    console.log("inside searchNodesHelper nodes:", nodes, ", text:", text);
    var result = nodes.filter(n => n.text.includes(text));
    return result;
}

function searchFromRootNodeHelper(node, text, path, pathArray){
    
    console.log("inside searchNodesHelper nodes:", node,
     ", text:", text, ", path:", path, ", pathArray:", pathArray);
    if (node ){
        path.push(node.id);
        if(node.text && node.text.includes(text)){
            pathArray.push([...path]);
        }
        node.children.forEach((child, index) => {
            searchFromRootNodeHelper(child, text, path, pathArray);
            path.pop();
        });
    }else {
        pathArray.push(path);
    }
}

export const { zoomIn, pathNodeClick,
    deleteNode,addNextSibling,
    addChildAtEnd,toggleNodeChildren,
    incrNodeIdLast,addNodeToNodes,
    setEditNode,setNodeText,
    clearPathNodes,addPathToPathNodes,
    searchNodes } = wfSlice.actions;

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
export const selectStartNode = (state) => {
    var node = state.wf.nodes[state.wf.startNodeIndex];
    return node;
};
export const selectZoomNode =(state) => {
    var node = state.wf.nodes[state.wf.zoomNodeIndex];
    return node;
}
export const selectPathNodes = (state) => state.wf.pathNodes;
export const selectNodeIdLast = (state) => state.wf.nodeIdLast;

export default wfSlice.reducer;
