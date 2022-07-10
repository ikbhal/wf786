
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { zoomIn } from './WfSlice';

export function PathSection() {
    const pathNodeIds = useSelector(state => state.wf.pathNodeIds);
    return (
        <div>
            <p>Path</p>
            {pathNodeIds.length>0 && 
                pathNodeIds.map((nodeId, index)=><PathPart key={index} nodeId={nodeId}/>)
            }
        </div>
    );
};

export function PathSectionWithNodes({pathNodeIds}) {
    return (
        <div>
            {pathNodeIds.length>0 && 
                pathNodeIds.map((nodeId, index)=><PathPart key={index} nodeId={nodeId}/>)
            }
        </div>
    );
}

export function PathPart({nodeId}){
    var dispatch =useDispatch();
    var node = useSelector(state => state.wf.nodes.find(n => n.id == nodeId));
    return(
        <>
            <span className="path-part"
                onClick={e=> dispatch(zoomIn(nodeId))}
                >
                {node && node.text}
            </span>
            <span> > </span>
        </>
    );
}