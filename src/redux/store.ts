import { configureStore, combineReducers } from '@reduxjs/toolkit';
import profileReducer from './slices/profileSlice';
import totalSearchReducer from './slices/totalSearchSlice';
import {useDispatch} from "react-redux";

const rootReducer = combineReducers({
  profile: profileReducer,
  totalSearch: totalSearchReducer
});

const store = configureStore({
  reducer: rootReducer
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;

export default store;