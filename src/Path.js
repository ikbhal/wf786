
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

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
    return(
        <>
        <span>
            {node.text}
        </span>
        <span> > </span>
        </>
    );
}