
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { zoomIn } from './WfSlice';

export function PathSection() {
    const pathNodes = useSelector(state => state.wf.pathNodes);
    return (
        <div>
            <p>Path</p>
            {pathNodes.length>0 && 
                pathNodes.map((node, index)=><PathPart key={index} node={node}/>)
            }
        </div>
    );
};

export function PathPart({node}){
    var dispatch =useDispatch();
    return(
        <>
        <span className="path-part"
            onClick={e=> dispatch(zoomIn(node.id))}
            >
            {node.text}
        </span>
        <span> > </span>
        </>
    );
}