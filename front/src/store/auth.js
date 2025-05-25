import { createSlice } from '@reduxjs/toolkit';

const initialAuthState = {
    isAuthenticated: false,
    isLoading: true,
    activeTeam: null,
    user_id: null,
};

const authSlice = createSlice({
    name: 'authentication',
    initialState: initialAuthState,
    reducers: {
        login(state, action) {
            if (action.payload.data !== false) {
                if (action.payload.data.team_id) {
                    state.activeTeam = action.payload.data.team_id;
                }
                state.user_id = action.payload.data.id;
                state.isAuthenticated = true;
            }
        },
        logout(state) {
            state.activeTeam = null;
            state.isAuthenticated = false;
            state.isLoading = true;
        },
        stopLoading(state) {
            state.isLoading = false;
        },
    },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;