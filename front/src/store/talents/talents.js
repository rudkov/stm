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
                board: args?.board && args?.board !== 0 ? [args?.board] : null,
                bust: args?.body?.bust,
                cupSize: args?.body?.cupSize,
                dressSize: args?.body?.dressSize,
                eyeColor: args?.body?.eyeColor,
                genders: args?.genders,
                hairColor: args?.body?.hairColor,
                hairLength: args?.body?.hairLength,
                height: args?.body?.height,
                hips: args?.body?.hips,
                managers: args?.managers,
                noContacts: args?.noContacts,
                preferences: args?.preferences,
                shirtSize: args?.body?.shirtSize,
                shoeSize: args?.body?.shoeSize,
                skinColor: args?.body?.skinColor,
                suitCut: args?.body?.suitCut,
                waist: args?.body?.waist,
                weight: args?.body?.weight,
            },
        });
        return response.data;
    } catch (err) {
        return err.message;
    }
});

export const filterTalents = (items, query) => {
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

    if (query.managers && Object.keys(query.managers).length > 0) {
        const managers = query.managers;
        items = items.filter((item) => {
            return item.manager_id && managers.includes(item.manager_id);
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