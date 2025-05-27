import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    items: [],
};

export const fetchTalentBoards = createAsyncThunk('talentBoards/fetchTalentBoards', async () => {
    try {
        const response = await axios({
            method: 'get',
            url: '/api/v1/talent-boards',
        });
        return response.data;
    } catch (err) {
        return err.message;
    }
});

const talentBoardsSlice = createSlice({
    name: 'talentBoards',
    initialState: initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchTalentBoards.fulfilled, (state, action) => {
                state.items = action.payload;
            })
    }
});

export const getTalentBoards = (state) => state.talentBoards.items;

export default talentBoardsSlice.reducer;