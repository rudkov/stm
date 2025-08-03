import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    items: [],
};

const transformFilters = (filters) => ({
    noContacts: filters.noContacts,
});

export const fetchContacts = createAsyncThunk('contacts/fetch', async (filters = {}) => {
    try {
        const response = await axios({
            method: 'post',
            url: '/api/v1/contacts/search',
            data: transformFilters(filters),
        });
        return response.data;
    } catch (err) {
        return err.message;
    }
});

export const sortContacts = (items, order) => {
    if (order.column === 'name') {
        if (order.asc) {
            items.sort((a, b) => a.name?.localeCompare(b.name));
        }
        else {
            items.sort((a, b) => b.name?.localeCompare(a.name));
        }

    }
    else if (order.column === 'company') {
        items.sort((a, b) => {
            if (a.company_name === null) {
                return order.asc ? -1 : 1;
            }

            if (b.company_name === null) {
                return order.asc ? 1 : -1;
            }

            if (a.company_name === b.company_name) {
                return 0;
            }

            return a.company_name < b.company_name ? order.asc ? -1 : 1 : order.asc ? 1 : -1;
        });
    }
    else if (order.column === 'job') {
        items.sort((a, b) => {
            if (a.job_title === null) {
                return order.asc ? -1 : 1;
            }

            if (b.job_title === null) {
                return order.asc ? 1 : -1;
            }

            if (a.job_title === b.job_title) {
                return 0;
            }

            return a.job_title < b.job_title ? order.asc ? -1 : 1 : order.asc ? 1 : -1;
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

export const filterContacts = (items, query) => {
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

const contactsSlice = createSlice({
    name: 'contacts',
    initialState: initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchContacts.fulfilled, (state, action) => {
                state.items = action.payload;
            })
    }
});

export const getContacts = (state) => state.contacts.items;

export default contactsSlice.reducer;
