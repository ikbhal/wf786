import { createSlice } from '@reduxjs/toolkit'
import store from './store'
import axios from 'axios'
import API from './api'


let nodes = [];
let nodeIdLast = 4;
let pathNodeIds = [];
pathNodeIds.push(1);

let n2 = {id: 2, text: "n2", closed: true, editing:false, children: []};
let n3 = {id: 3, text: "n3", closed: true, editing:false, children: []};
let n4 = {id: 4, text: "n4", closed: true, editing:false, children: []};
let n1 = {id: 1, text: "n1", closed: true, editing:false, children: [2, 3, 4]};

nodes.push(n1);
nodes.push(n2);
nodes.push(n3);
nodes.push(n4);

export const wfSlice = createSlice({
  name: 'wf',
  initialState: {
    startNodeId: 1,
    nodes: nodes,
    zoomNodeId: 1,
    zoomParentNodeId : -1,// -1 used here as invalid id
    pathNodeIds: pathNodeIds,
    nodeIdLast: nodeIdLast,
    searchText: "",
    searchResult: [],
    saveJson : ""
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
        var pi = state.pathNodeIds.findIndex(pid => id==pid);
        var pathNodeIds = state.pathNodeIds.slice(0, pi+1);
        state.pathNodeIds =pathNodeIds;
        // set zoom node to id 
        state.zoomNodeId = pi;
        // set zoom parent node 
        var zoomParentNodeIndex = pi>0?state.pathNodeIds[pi-1]: -1;
        state.zoomParentNodeIndex = zoomParentNodeIndex;
        
    },
    pathNodeClick:(state, pathNode) =>{
        console.log("path node clock pathNode:", pathNode);
    },
    // old : // dispatch(deleteNode(nodeId));
    // new: dispatch(deleteNode({id:nodeId, parentNodeId:parentId}));
    deleteNode: (state, action) =>{
        console.log("delete node " , action);
        // var deleteNodeId = action.payload;
        var {id, parentNodeId} = action.payload;
        // delete node in nodes array
        var deletedNodeIndex = state.nodes.findIndex(n=> n.id == id);
        // var deletedNode = state.nodes[deletedNodeIndex];
        state.nodes.splice(deletedNodeIndex, 1)

        // delete node in parent nodes
        state.nodes.forEach(n => {
            let childrenIdsArr = n.childrenIds.split(",");
            if(childrenIdsArr.indexOf(id) !==-1){
                n.childrenIds = childrenIdsArr.filter(cid2 => cid2 !=id).join(",")
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
        var childNodeId = state.nodeIdLast;
        var childNode = {
            id: childNodeId,
            text: "n"+state.nodeIdLast,
            closed: true, 
            editing:false, 
            children: []
        };
        //add new node to nodes
        state.nodes.push(childNode);
        // find sibling node position parent node childrens
        var psi = pnode.children.findIndex(nid=>nid==siblingId);
        // add new child node at parent children after sibling nod
        pnode.children.splice(psi+1, 0, childNodeId);
        // restore nodes to state nodes
        // state.nodes = nodes;

    },
    addChildAtEnd: (state, action) =>{
        console.log('add child at end for action :', action);
        var {newChildId, newChildText, parentNodeId} = action.payload;
        console.log(" parentNodeId:", parentNodeId);
        var node = state.nodes.find(n=>n.id ==parentNodeId);
        // increament node id last
        state.nodeIdLast++;
        var newChild =  {
            id: newChildId,
            text: newChildText,
            editing:false, 
            children: []
        };
        console.log("newChild:", newChild);

        console.log("child added to parent node:", node," newChild:", newChild);
        // add child to nodes
        state.nodes.push(newChild);
        // reset node states
        console.log("state.nodes", state.nodes);

        var children = node.childrenIds.split(",");
        // temp work -> need later fix at root cause
        if(children && children.length > 0 && children[0] == ''){
            children.splice(0, 1);
        }
        children.push(newChildId);
        node.childrenIds = children.join(",");
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
    clearPathNodeIds: (state) =>{
        console.log("inside clearPathNodeIds");
        state.pathNodeIds = [];
    },
    addPathToPathNodeIds: (state, action) => {
        console.log("inside addPathToPathNodeIds action:", action);
        var nodeId = action.payload;
        // var node = state.nodes.find(n=> n.id ==action.payload);
        state.pathNodeIds.push(nodeId);
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
        var node = state.nodes[state.startNodeId];
        searchFromRootNodeHelper(state.nodes, state.startNodeId, text, path, pathArray);
        console.log("pathArray:", pathArray);
        state.searchResult = pathArray;
    }
    ,save:(sate, action ) => {
        console.log("will implement");
        axios.get('http://localhost:3001').then( (response) =>{
            console.log("response from server is ", response);
        });
        // axios.post("http://localhost:3001", 
        //     {});
    },
    load:(state,action)=>{
        console.log("load from server action",action);
        var newState = action.payload;
        state.nodes= newState.nodes;
        state.startNodeId = newState.startNodeId;
        state.pathNodeIds = [state.startNodeId];
        state.nodeIdLast = newState.nodeIdLast;
        state.zoomNodeId = [state.startNodeId]
        state.zoomParentNodeId = -1 ;//invalid id
        state.searchText = "";
        state.searchResult = [];

        console.log("update state to ", state);
        
    }
  },
});

function searchNodesHelper(nodes, text){
    console.log("inside searchNodesHelper nodes:", nodes, ", text:", text);
    var result = nodes.filter(n => n.text.includes(text));
    return result;
}

function searchFromRootNodeHelper(nodes, nodeIndex, text, path, pathArray){
    var node = nodes.length>nodeIndex? nodes[nodeIndex]:null;

    console.log("inside searchNodesHelper nodeIndex:", nodeIndex,
    ",node:", node,
    ", text:", text, ", path:", path, ", pathArray:", pathArray);
    if (node !=null){
        path.push(node.id);
        if(node.text && node.text.includes(text)){
            pathArray.push([...path]);
        }
        node.children.forEach((childIndex, index) => {
            searchFromRootNodeHelper(nodes, childIndex, text, path, pathArray);
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
    clearPathNodeIds,addPathToPathNodeIds,
    searchNodes, save, load } = wfSlice.actions;

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
    var node = state.wf.nodes[state.wf.startNodeId];
    return node;
};
export const selectZoomNode =(state) => {
    var node = state.wf.nodes[state.wf.zoomNodeId];
    return node;
}

export const selectZoomNodeId =(state) => state.wf.zoomNodeId;
export const selectPathNodes = (state) => state.wf.pathNodes;
export const selectNodeIdLast = (state) => state.wf.nodeIdLast;
// export const selectNodeById = (state, nodeId) => state.wf.nodes.find(node =>node.id == nodeId);

export default wfSlice.reducer;
