import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth";
import companiesReducer from "./contacts/companies";
import contactReducer from "./contacts/contact";
import contactsReducer from "./contacts/contacts";
import eventReducer from "./events/event";
import eventsReducer from "./events/events";
import talentBoardReducer from "./talents/talentBoard";
import talentBoardsReducer from "./talents/talentBoards";
import talentReducer from './talents/talent';
import talentsReducer from "./talents/talents";
import usersReducer from "./users/users";

const store = configureStore({
    reducer: {
        auth: authReducer,
        companies: companiesReducer,
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
});

export default store;