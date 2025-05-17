import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    items: [],
};

export const fetchTalents = createAsyncThunk('talents/fetchTalents', async (args = {}) => {
    try {
        const response = await axios({
            method: 'post',
            url: '/api/v1/talents/search',
            data: {
                bust: args?.bust,
                eyeColors: args?.eyeColors,
                genders: args?.genders,
                hairColors: args?.hairColors,
                heights: args?.heights,
                hips: args?.hips,
                managers: args?.managers,
                skinColors: args?.skinColors,
                waists: args?.waists,
                weights: args?.weights,
            },
        });
        return response.data;
    } catch (err) {
        return err.message;
    }
});

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
            return r;
        });
    }

    if (query.locations && Object.keys(query.locations).length > 0) {
        const locations = query.locations;
        items = items.filter((item) => {
            if (locations.includes(null) && item.location === null) {
                return true;
            }
            return item.location !== null && locations.includes(item.location);
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