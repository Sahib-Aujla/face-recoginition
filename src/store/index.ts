import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from 'react-redux';
import webcamReducer from './webcamSlice';
import faceReducer from './faceSlice';

export const store = configureStore({
    reducer: {
        webcamReducer,
        faceReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();