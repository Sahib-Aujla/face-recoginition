import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FaceData {
    x: number;
    y: number;
    width: number;
    height: number;
    age?: number;
    genders?: string;
    expression?: string;
}
interface FacesState {
    faces: FaceData[];
    loading: boolean;
    error: string | null;
}
const initialState: FacesState = {
    faces: [],
    loading: false,
    error: null
};
const faceSlice = createSlice({
    name: "faceSlice",
    initialState,
    reducers: {
        setDetectedFaces(state, action: PayloadAction<FaceData[]>) {
            state.faces = action.payload;
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