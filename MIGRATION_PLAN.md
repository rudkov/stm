# Redux Thunks to RTK Query Migration Plan

This document outlines the plan for migrating the application from Redux Thunks to RTK Query.

## Phase 0: Foundation

This phase includes shared groundwork that is applied once.

1.  **Centralize API Slice**:
    *   Create a single `apiSlice.js` file.
    *   This slice will be created using `createApi`.
    *   It will include a superset of `tagTypes` used by every domain: `Talent`, `TalentBoard`, `TalentLocation`, `TalentManager`, `Company`, `Contact`, `Event`, `User`.

2.  **Reuse and Enhance `baseQuery.js`**:
    *   Keep and reuse the existing `baseQuery.js` for headers, CSRF, and error handling.
    *   Add global 401/419 error handling to automatically log out the user on authentication failures. This can be achieved by wrapping the `baseQuery` and checking for specific status codes.

3.  **Update Store Configuration**:
    *   Integrate the `apiSlice` into the main Redux store in `store/index.js`.
    *   Add the `apiSlice.middleware` to the store's middleware.

## Phase 1: Talents Store Migration

This phase focuses on migrating the `talents` slice, which is the most complex.

1.  **Migrate `talents.js`**:
    *   Create a new `talentsApi.js` file.
    *   Define endpoints for fetching a list of talents (`getTalents`) and a single talent (`getTalent`).
    *   Use the `query` function from RTK Query to make the API requests.
    *   Provide the `Talent` tag to these queries for caching purposes.
    *   Define an endpoint for fetching all talent locations (`getTalentsLocations`). Provide a new `TalentLocation` tag.
    *   Define an endpoint for fetching all talent managers (`getTalentManagers`). Provide a new `TalentManager` tag.
    *   Replace the existing thunks in `talents.js` with the new RTK Query hooks (e.g., `useGetTalentsQuery`, `useGetTalentQuery`, `useGetTalentManagersQuery`).
    *   Refactor the components that use these thunks to use the new hooks.

2.  **Migrate `talent.js`**:
    *   Add endpoints to `talentsApi.js` for creating (`createTalent`), updating (`updateTalent`), deleting (`deleteTalent`), and updating location (`updateTalentLocation`) for talents.
    *   Use the `mutation` function for these endpoints.
    *   Invalidate the `Talent` tag on successful mutations to trigger re-fetching of the talent list. The `updateTalentLocation` mutation should also invalidate the `TalentLocation` tag.
    *   Refactor the corresponding components to use the new mutation hooks (e.g., `useCreateTalentMutation`, `useUpdateTalentLocationMutation`).

3.  **Migrate `talentBoards.js`**:
    *   Create a `talentBoardsApi.js` file.
    *   Define an endpoint for fetching all talent boards (`getTalentBoards`).
    *   Provide the `TalentBoard` tag.
    *   Refactor the components to use the `useGetTalentBoardsQuery` hook.

4.  **Migrate `talentBoard.js`**:
    *   Add endpoints to `talentBoardsApi.js` for creating (`createTalentBoard`), updating (`updateTalentBoard`), and deleting (`deleteTalentBoard`) talent boards.
    *   Invalidate the `TalentBoard` tag on mutations.
    *   Refactor components to use the new mutation hooks.

5.  **Clean up**:
    *   Remove the old store files: `talents.js`, `talent.js`, `talentBoards.js`, and `talentBoard.js`.
    *   Remove the corresponding reducers from `store/index.js`.

## Phase 2: Companies Store Migration

1.  **Migrate `companies.js` and `company.js`**:
    *   Create a `companiesApi.js` file.
    *   Define endpoints for `getCompanies`, `getCompany`, `createCompany`, `updateCompany`, and `deleteCompany`.
    *   Use the `Company` tag for caching.
    *   Refactor components to use the new RTK Query hooks.

2.  **Clean up**:
    *   Remove the old store files: `companies.js` and `company.js`.
    *   Remove the corresponding reducers from `store/index.js`.

## Phase 3: Contacts Store Migration

1.  **Migrate `contacts.js` and `contact.js`**:
    *   Create a `contactsApi.js` file.
    *   Define endpoints for `getContacts`, `getContact`, `createContact`, `updateContact`, and `deleteContact`.
    *   Use the `Contact` tag.
    *   Refactor components.

2.  **Clean up**:
    *   Remove the old store files: `contacts.js` and `contact.js`.
    *   Remove the corresponding reducers from `store/index.js`.

## Phase 4: Events Store Migration

1.  **Migrate `events.js` and `event.js`**:
    *   Create an `eventsApi.js` file.
    *   Define endpoints for `getEvents`, `getEvent`, `createEvent`, `updateEvent`, and `deleteEvent`.
    *   Use the `Event` tag.
    *   Refactor components.

2.  **Clean up**:
    *   Remove the old store files: `events.js` and `event.js`.
    *   Remove the corresponding reducers from `store/index.js`.

## Phase 5: Users Store Migration

1.  **Migrate `users.js`**:
    *   Create a `usersApi.js` file.
    *   Define an endpoint for fetching user data (`getUsers`).
    *   Use the `User` tag.
    *   Refactor components.

2.  **Clean up**:
    *   Remove the old store file: `users.js`.
    *   Remove the corresponding reducer from `store/index.js`.
