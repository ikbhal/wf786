
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { zoomIn } from './WfSlice';

export function PathSection() {
    const pathNodeIndices = useSelector(state => state.wf.pathNodeIndices);
    return (
        <div>
            <p>Path</p>
            {pathNodeIndices.length>0 && 
                pathNodeIndices.map((nodeId, index)=><PathPart key={index} nodeId={nodeId}/>)
            }
        </div>
    );
};

export function PathSectionWithNodes({pathNodeIndices}) {
    return (
        <div>
            {pathNodeIndices.length>0 && 
                pathNodeIndices.map((nodeId, index)=><PathPart key={index} nodeId={nodeId}/>)
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