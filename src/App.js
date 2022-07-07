import React, { useState } from "react";
import "./App.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export default function App() {

  //const defaultList = ["A", "B", "C", "D", "E"];
  var idLast = 4;
  const defaultList = [{"text": "A"},
   {id: "1", text: "B", children: []},
    {id: "2", text: "C", children:[]}, 
    {id: "3",text: "D", children:[]}, 
    {id: "4", text: "E", children:[]}
  ];
  // React state to track order of items
  const [itemList, setItemList] = useState(defaultList);

  // Function to update list on drop
  const handleDrop = (droppedItem) => {
    // Ignore drop outside droppable container
    if (!droppedItem.destination) return;
    var updatedList = [...itemList];
    // Remove dragged item
    const [reorderedItem] = updatedList.splice(droppedItem.source.index, 1);
    // Add dropped item
    updatedList.splice(droppedItem.destination.index, 0, reorderedItem);
    // Update State
    setItemList(updatedList);
  };

  const addSiblingNext = index => {
    console.log("add sibling next div click");
    console.log("index: " + index);

    var updatedList = [...itemList];
    // Add dropped item
    idLast = idLast+1;
    var newItem = {text:"added dummy item", id: idLast}
    updatedList.splice(index+1, 0, newItem);
     // Update State
     setItemList(updatedList);
  };

  const deleteItem = index => {
    console.log("delete item index:" + index);

    var updatedList = [...itemList];
    // Remove dragged item
    updatedList.splice(index, 1);
     // Update State
    setItemList(updatedList);
  };

  const saveItemText = (index, newItemText) => {
    console.log("inside save item text");
    var updatedList = [...itemList];
    updatedList[index].text = newItemText;
    setItemList(updatedList);
  };

  return (
    <div className="App">
      <DragDropContext onDragEnd={handleDrop}>
        <Droppable droppableId="list-container">
          {(provided) => (
            <div
              className="list-container"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {itemList.map((item, index) => (
                <Draggable key={item.text} draggableId={item.text} index={index}>
                  {(provided) => (
                    <div
                      className="item-container"
                      ref={provided.innerRef}
                      {...provided.dragHandleProps}
                      {...provided.draggableProps}
                    >
                      {item.text}
                      <div className="edit-item">
                        {/* <input type="text" value={item.text}/> */}

                        <input
                        type="text" 
                        value={item.text}
                        onChange={(e) => saveItemText(index, e.target.value)}
                        />
                      </div>
                      <div  className="add-sibling-next" 
                        onClick={e => addSiblingNext(index)}
                      >
                      Add sibling next
                      </div>
                      <div  className="delete-item" 
                        onClick={e => deleteItem(index)}
                      >
                      deleteItem
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}