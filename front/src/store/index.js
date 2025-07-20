import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '../api/authApi';
import { registerApi } from '../api/registerApi';
import companiesReducer from './companies/companies';
import companyReducer from './companies/company';
import contactReducer from './contacts/contact';
import contactsReducer from './contacts/contacts';
import eventReducer from './events/event';
import eventsReducer from './events/events';
import talentBoardReducer from './talents/talentBoard';
import talentBoardsReducer from './talents/talentBoards';
import talentReducer from './talents/talent';
import talentsReducer from './talents/talents';
import usersReducer from './users/users';

const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [registerApi.reducerPath]: registerApi.reducer,
        companies: companiesReducer,
        company: companyReducer,
        contact: contactReducer,
        contacts: contactsReducer,
        event: eventReducer,
        events: eventsReducer,
        talent: talentReducer,
        talentBoard: talentBoardReducer,
        talentBoards: talentBoardsReducer,
        talents: talentsReducer,
        users: usersReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            authApi.middleware,
            registerApi.middleware
        ),
});

export default store;