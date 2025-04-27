import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    items: [],
};

export const fetchClients = createAsyncThunk('clients/fetchClients', async () => {
    try {
        const response = await axios({
            method: 'get',
            url: '/api/v1/clients',
        });
        return response.data;
    } catch (err) {
        return err.message;
    }
});

export const filterClients = (items, query) => {
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

const clientsSlice = createSlice({
    name: 'clients',
    initialState: initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchClients.fulfilled, (state, action) => {
                state.items = action.payload;
            })
    }
});

export const getClients = (state) => state.clients.items;

export default clientsSlice.reducer;