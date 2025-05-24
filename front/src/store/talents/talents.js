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
                skinColor: args?.body?.skinColor,
                shirtSize: args?.body?.shirtSize,
                shoeSize: args?.body?.shoeSize,
                suitCut: args?.body?.suitCut,
                preferences: args?.preferences,
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