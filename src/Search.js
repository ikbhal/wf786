import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setNodeText, searchNodes, zoomIn } from './WfSlice';


export function Search() {

  var [text, setText] = useState('');
  var dispatch = useDispatch();

  return (
    <div>
        Search for {text}
        <input type="text" value={text} 
            onChange={e=> setText(e.target.value)}
            onKeyPress={e=> {
                console.log("inside key presss e:", e);
               // console.log("e.key:", e.key);
                if(e.key == 'Enter'){
                    console.log("Ikbhal enter pressed");
                   dispatch(searchNodes(text));
                }
            }}/>

        <SearchResult />
        
    </div>
  );
}

export function SearchResult() {
    console.log("inside search result component");
    // retrieve search text
    var searchText = useSelector( state => state.wf.searchText);
    console.log('ikb search text:', searchText);
    // var dispatch = useDispatch();
    // dispatch search node request
    // dispatch(searchNodes(searchText));
    var searchResult = useSelector(state => state.wf.searchResult)
    console.log('search result: ', searchResult);

    return (
        <div className="search-result">
            Search Result;
            {searchResult.length > 0 && 
                searchResult.map((node, index) =>
                    <SearchResultItem key={index} node={node}/>
                )
            }
        </div>
    );
}

export function SearchResultItem({node}){
    var dispatch = useDispatch();
    return (
        <div className="search-result-item"
            onClick ={e=> dispatch(zoomIn(node.id))}
        >
            {node.text}
        </div>
    );
}