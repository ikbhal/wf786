import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './CounterSlice';
import wfReducer from './WfSlice';

export default configureStore({
  reducer: {
    counter: counterReducer,
    wf: wfReducer,
  },
});
