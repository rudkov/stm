import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    items: [],
};

export const fetchTalents = createAsyncThunk('talents/fetchTalents', async () => {
    try {
        const response = await axios({
            method: 'get',
            url: '/api/v1/talents',
        });
        return response.data;
    } catch (err) {
        return err.message;
    }
});

export const sortTalents = (items, order) => {
    if (order.column === 'name') {
        if (order.asc) {
            items.sort((a, b) => a.name?.localeCompare(b.name));
        }
        else {
            items.sort((a, b) => b.name?.localeCompare(a.name));
        }
    }
    else if (order.column === 'location') {
        items.sort((a, b) => {
            if (a.location === null) {
                return order.asc ? -1 : 1;
            }

            if (b.location === null) {
                return order.asc ? 1 : -1;
            }

            if (a.location === b.location) {
                return 0;
            }

            return a.location < b.location ? order.asc ? -1 : 1 : order.asc ? 1 : -1;
        });
    }
    else if (order.column === 'email') {
        items.sort((a, b) => {
            if (!a?.email || a.email === null) {
                return order.asc ? 1 : -1;
            }

            if (!b?.email || b.email === null) {
                return order.asc ? -1 : 1;
            }

            if (a.email === b.email) {
                return 0;
            }

            return a.email < b.email ? order.asc ? -1 : 1 : order.asc ? 1 : -1;
        });
    }
    else if (order.column === 'phone') {
        items.sort((a, b) => {
            if (!a?.phone || a.phone === null) {
                return order.asc ? 1 : -1;
            }

            if (!b?.phone || b.phone === null) {
                return order.asc ? -1 : 1;
            }

            if (a.phone === b.phone) {
                return 0;
            }

            return a.phone < b.phone ? order.asc ? -1 : 1 : order.asc ? 1 : -1;
        });
    }

    return items;
};

export const filterTalents = (items, query) => {
    if (query.inTownOnly) {
        items = items.filter((item) => {
            return !item.location;
        });
    }

    if (query.searchString !== '') {
        const searchString = query.searchString.toLowerCase();

        items = items.filter((item) => {
            let r = false;

            if (item.name?.toLowerCase().includes(searchString)) {
                r = true;
            }
            else if (item.location?.toLowerCase().includes(searchString)) {
                r = true;
            }
            else if (item.email?.toLowerCase().includes(searchString)) {
                r = true;
            }
            else if (item.phone?.toLowerCase().includes(searchString)) {
                r = true;
            }
            return r;
        });
    }

    return items;
};

const talentsSlice = createSlice({
    name: 'talents',
    initialState: initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchTalents.fulfilled, (state, action) => {
                state.items = action.payload;
            })
    }
});

export const getTalents = (state) => state.talents.items;

export default talentsSlice.reducer;