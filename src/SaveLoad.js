
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

export function SaveWf(){
    return (
        <button onClick={e=> console.log("save wf clicked")}>Save</button>
    );
}

export function LoadWf(){
    return (
        <button onClick={e=> console.log("load wf clicked")}>Load</button>
    );
}