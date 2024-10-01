import { configureStore } from '@reduxjs/toolkit';
import profileReducer from './slices/profileSlice';
import {useDispatch} from "react-redux";

const store = configureStore({
    reducer: {
        profile: profileReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;

export default store;
