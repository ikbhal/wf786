
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {save, load} from './WfSlice';
import axios from 'axios'

export function SaveWf(){
    var dispatch = useDispatch();

    var state = useSelector(state => state.wf);
    // var jsonState = JSON.stringify(state);
    // console.log("json state", jsonState);
    // console.log("state retrieved", state);

    return (
        // <button onClick={ e=> dispatch(save())}>Save</button>
        <button onClick={
            //  e=> dispatch(save())
            e => {
                console.log("save button clicked");
                // var state = useSelector(state => state.wf);
                var jsonState = JSON.stringify(state);
                console.log(" click handler json state", jsonState);
                // console.log("state retrieved", state);

                //call axios post save call

                var customConfig = {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };
                axios.post('http://localhost:3001/save', 
                    jsonState,
                    customConfig)
                .then((response) => {
                    console.log(response);
                    }, (error) => {
                    console.log(error);
                    });
            }
            
        }>Save</button>
    );
}

export function LoadWf(){

    // clear state
    // set state 
    // call store dispatch 
    var dispatch = useDispatch();
    return (
        <button onClick={e=> {
            console.log("load wf clicked");
            axios.get('http://localhost:3001/load')
            .then((response) => {
                console.log(response);
                console.log("response.data is " , response.data);
                console.log("dispatch from button handler");
                dispatch(load(response.data));
                }, (error) => {
                console.log(error);
                });
        }}>Load</button>
    );
}