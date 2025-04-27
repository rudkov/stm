import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth";
import talentReducer from './talents/talent';
import talentsReducer from "./talents/talents";
import eventReducer from "./events/event";
import eventsReducer from "./events/events";
import contactReducer from "./contacts/contact";
import contactsReducer from "./contacts/contacts";
import companiesReducer from "./contacts/companies";
import clientsReducer from "./clients/clients";
import usersReducer from "./users/users";

const store = configureStore({
    reducer: {
        auth: authReducer,
        talent: talentReducer,
        talents: talentsReducer,
        event: eventReducer,
        events: eventsReducer,
        contact: contactReducer,
        contacts: contactsReducer,
        companies: companiesReducer,
        clients: clientsReducer,
        users: usersReducer,
    },
});

export default store;