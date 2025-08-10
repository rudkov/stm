import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from 'api/apiSlice';

import usersReducer from './users/users';

const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        users: usersReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            apiSlice.middleware
        ),
});

export default store;
