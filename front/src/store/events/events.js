import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    dates: {},
    talents: [],
    items: [],
};

export const fetchEvents = createAsyncThunk('events/fetchEvents', async (args) => {
    try {
        const response = await axios({
            method: 'post',
            url: '/api/v1/events/search',
            data: {
                year: args.year,
                month: args.month,
                day: args.day,
                clients: args.clients,
                eventTypes: args.eventTypes,
                talents: args.talents,
            },
        });
        return response.data;
    } catch (err) {
        return err.message;
    }
});

const eventsSlice = createSlice({
    name: 'events',
    initialState: initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchEvents.fulfilled, (state, action) => {
                state.items = action.payload;
            })
    }
});

export const getEvents = (state) => state.events.items;

export const eventsActions = eventsSlice.actions;

export default eventsSlice.reducer;