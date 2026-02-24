import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
    user: any | null;
    isAuthenticated: boolean;
    loading: boolean;
}

const initialState: UserState = {
    user: null,
    isAuthenticated: false,
    loading: true,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<any>) => {
            state.user = action.payload;
            state.isAuthenticated = !!action.payload;
            state.loading = false;
        },
        setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
            state.isAuthenticated = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        logoutUser: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.loading = false;
        },
    },
});

export const { setUser, setIsAuthenticated, setLoading, logoutUser } = userSlice.actions;
export default userSlice.reducer;
