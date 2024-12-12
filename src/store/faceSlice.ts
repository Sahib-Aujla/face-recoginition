import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FaceData {
    x: number;
    y: number;
    width: number;
    height: number;
    age?: number;
    gender?: string;
    expression?: string;
}
interface FacesState {
    faces: FaceData[];
    loading: boolean;
    error: string | null;
    imgUrl: string | null;
}
const initialState: FacesState = {
    faces: [],
    loading: false,
    error: null,
    imgUrl: null,
};
const faceSlice = createSlice({
    name: "faceSlice",
    initialState,
    reducers: {
        setDetectedFaces(state, action: PayloadAction<{ imgUrl: string, faceData: FaceData[] }>) {
            state.faces = action.payload.faceData;
            state.imgUrl = action.payload.imgUrl;
        },
        setFacesLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setFacesError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        }
    }

})

export const { setDetectedFaces, setFacesLoading, setFacesError } = faceSlice.actions;

export default faceSlice.reducer;