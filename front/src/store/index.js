import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from 'api/apiSlice';

import eventReducer from './events/event';
import eventsReducer from './events/events';
import usersReducer from './users/users';

const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        event: eventReducer,
        events: eventsReducer,
        users: usersReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            apiSlice.middleware
        ),
});

export default store;
