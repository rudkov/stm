import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    items: [],
};

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    try {
        const response = await axios({
            method: 'post',
            url: '/api/v1/users/search',
        });
        return response.data;
    } catch (err) {
        return err.message;
    }
});

export const filterUsers = (items, query) => {
    if (query.searchString !== '') {
        const searchString = query.searchString.toLowerCase();

        items = items.filter((item) => {
            let r = false;

            if (item.name?.toLowerCase().includes(searchString)) {
                r = true;
            }

            return r;
        });
    }
    
    return items;
};

const usersSlice = createSlice({
    name: 'users',
    initialState: initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.items = action.payload;
            })
    }
});

export const getUsers = (state) => state.users.items;

export default usersSlice.reducer;