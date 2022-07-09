import { combineReducers } from 'redux'

import counterSlice from './CounterSlice'
// import filtersReducer from './features/filters/filtersSlice'

const rootReducer = combineReducers({
  // Define a top-level state field named `todos`, handled by `todosReducer`
  counter: counterSlice,
//   filters: filtersReducer,
})

export default rootReducer
