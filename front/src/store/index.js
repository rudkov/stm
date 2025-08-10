import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from 'api/apiSlice';

import companiesReducer from './companies/companies';
import companyReducer from './companies/company';
import contactReducer from './contacts/contact';
import contactsReducer from './contacts/contacts';
import eventReducer from './events/event';
import eventsReducer from './events/events';
import usersReducer from './users/users';

const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        companies: companiesReducer,
        company: companyReducer,
        contact: contactReducer,
        contacts: contactsReducer,
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
