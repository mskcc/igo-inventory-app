import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

import appSlice from './appSlice';

const rootReducer = combineReducers({
  app: appSlice
});

export const store = configureStore({
  reducer: rootReducer
});
