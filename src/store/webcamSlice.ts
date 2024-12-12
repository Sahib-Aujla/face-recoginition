import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WebCam {
    isOn: boolean;
    error: string | null;
}

const initialState: WebCam = {
    isOn: false,
    error: null
}
const webcamSlice = createSlice({
    name: 'webcam',
    initialState,
    reducers: {
        startWebCam: (state) => {
            state.isOn = true;
            state.error = null;
        },
        stopWebCam: (state) => {
            state.isOn = false;
        },
        setWebCamError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
        }

    }

})

export const { startWebCam, stopWebCam, setWebCamError } = webcamSlice.actions;
export default webcamSlice.reducer;