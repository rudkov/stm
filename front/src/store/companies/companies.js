import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    items: [],
};

const transformFilters = (filters) => ({
    noContacts: filters.noContacts,
});

export const fetchCompanies = createAsyncThunk('companies/fetch', async (filters = {}) => {
    try {
        const response = await axios({
            method: 'post',
            url: '/api/v1/companies/search',
            data: transformFilters(filters),
        });
        return response.data;
    } catch (err) {
        return err.message;
    }
});

export const filterCompanies = (items, query) => {
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

const companiesSlice = createSlice({
    name: 'companies',
    initialState: initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchCompanies.fulfilled, (state, action) => {
                state.items = action.payload;
            })
    }
});

export const getCompanies = (state) => state.companies.items;

export default companiesSlice.reducer;
