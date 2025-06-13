import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    items: [],
    locations: [],
    managers: [],
};

const transformFilters = (filters) => ({
    board: filters.board && filters.board !== 0 ? [filters.board] : null,
    bust: filters.body?.bust,
    cupSize: filters.body?.cupSize,
    dressSize: filters.body?.dressSize,
    eyeColor: filters.body?.eyeColor,
    genders: filters.genders,
    hairColor: filters.body?.hairColor,
    hairLength: filters.body?.hairLength,
    height: filters.body?.height,
    hips: filters.body?.hips,
    managers: filters.managers,
    noContacts: filters.noContacts,
    preferences: filters.preferences,
    shirtSize: filters.body?.shirtSize,
    shoeSize: filters.body?.shoeSize,
    skinColor: filters.body?.skinColor,
    suitCut: filters.body?.suitCut,
    waist: filters.body?.waist,
    weight: filters.body?.weight,
});

export const fetchTalents = createAsyncThunk('talents/fetchTalents', async (filters = {}) => {
    try {
        const response = await axios({
            method: 'post',
            url: '/api/v1/talents/search',
            data: transformFilters(filters),
        });
        return response.data;
    } catch (err) {
        return err.message;
    }
});

export const fetchTalentsLocations = createAsyncThunk('talents/fetchTalentsLocations', async (filters = {}) => {
    try {
        const response = await axios({
            method: 'get',
            url: '/api/v1/talents/locations',
        });
        return response.data;
    } catch (err) {
        return err.message;
    }
});

export const fetchTalentsManagers = createAsyncThunk('talents/fetchTalentsManagers', async (filters = {}) => {
    try {
        const response = await axios({
            method: 'get',
            url: '/api/v1/talents/managers',
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
            .addCase(fetchTalentsLocations.fulfilled, (state, action) => {
                state.locations = action.payload;
            })
            .addCase(fetchTalentsManagers.fulfilled, (state, action) => {
                state.managers = action.payload;
            })
    }
});

export const getTalents = (state) => state.talents.items;
export const getTalentsLocations = (state) => state.talents.locations;
export const getTalentsManagers = (state) => state.talents.managers;

export default talentsSlice.reducer;