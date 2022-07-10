import { createSlice } from '@reduxjs/toolkit'
// import { trackForMutations } from '@reduxjs/toolkit/dist/immutableStateInvariantMiddleware';

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
    zoomParentNode : null,
    pathNodes: pathNodes,
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
        var pi = state.pathNodes.findIndex(n=> n.id == id);
        var pathNodes = state.pathNodes.slice(0, pi+1);
        state.pathNodes =pathNodes;
        // set zoom node to id 
        state.zoomNode = node;
        // set zoom parent node 
        var zoomParentNode = pi>0?state.pathNodes[pi-1]: null;
        state.zoomParentNode = zoomParentNode;
        
    },
    pathNodeClick:(state, pathNode) =>{
        console.log("path node clock pathNode:", pathNode);
    },
    deleteNode: (state, action) =>{
        console.log("delete node " , action);
        var nodes = [...state.nodes];
        var fnodes = nodes.filter(n => n.id !=action.payload);
        
        console.log("nodes:",nodes);
        console.log("fnodes:", fnodes);
        for(var i=0;i<fnodes.length;i++){
            var fn = fnodes[i];
            var fnchildren = fn.children;
            var fnci = fnchildren.findIndex(n=>n.id ==action.payload);
            if(fnci !=-1){
                fn.children = fnchildren.filter(n=> n.id !=action.payload);
            }
        }
        state.nodes = fnodes;

    },
    addNextSibling : (state, action) =>{
        console.log("add next sibling action:", action);
        //siblingId:node.id, parentId:parentId
        var siblingId = action.payload.siblingId;
        var parentId = action.payload.parentId;
        console.log("siblingId:", siblingId, ", parentId:", parentId);
        // duplicate state node
        var nodes = [...state.nodes];
        var pnode = nodes.find(n=> n.id == parentId);
        var snode = nodes.find(n=> n.id == siblingId);
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
        nodes.push(childNode);
        // find sibling node position parent node childrens
        var psi = pnode.children.findIndex(n=>n.id==siblingId);
        // add new child node at parent children after sibling nod
        pnode.children.splice(psi+1, 0, childNode);
        // restore nodes to state nodes
        state.nodes = nodes;

    },
    addChildAtEnd: (state, action) =>{
        console.log('add child at end for action :', action);
        // debugger;
        var pnode = action.payload;
        console.log(" pnode:", pnode);

        //duplicate nodes 
        // var nodes = [...state.nodes];
        console.log("duplicat nodes:", nodes);
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
        // state.nodes = nodes;
        // console.log("nodes:", nodes);
        console.log("state.nodes", state.nodes);
    },
    toggleNodeChildren: (state, action) => {
        console.log("toggle node children action:", action);
        // var nodes = [...state.nodes];
        var snode = state.nodes.find(n => n.id ==action.payload);
        snode.closed =! snode.closed;
        // state.nodes = nodes;
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
        // console.log("id:", id , ",text:", text);
        // var nodes = [...state.nodes];
        var ni = state.nodes.findIndex(n => n.id == id);
        // console.log("ni:", ni);
        state.nodes[ni].text =text;
        // console.log("nodes ", nodes);
        // state.nodes = nodes;
        console.log("state nodes:", state.nodes);
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
        searchFromRootNodeHelper(state.startNode, text, path, pathArray);
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
        path.push(node);
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
export const selectStartNode = (state) => state.wf.startNode;
export const selectZoomNode =(state) => state.wf.zoomNode;
export const selectPathNodes = (state) => state.wf.pathNodes;
export const selectNodeIdLast = (state) => state.wf.nodeIdLast;

export default wfSlice.reducer;
