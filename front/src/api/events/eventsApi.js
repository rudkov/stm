import { apiSlice } from 'api/apiSlice';
import { formatFiltersRequest } from './requestFormatters';
import { formatEventResponse } from './responseFormatters';

export const eventsApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getEvents: builder.query({
            query: (filters = {}) => ({
                url: '/events/search',
                method: 'POST',
                body: formatFiltersRequest(filters),
            }),
            providesTags: ['Event'],
        }),
        getEvent: builder.query({
            query: ({ id }) => `/events/${id}`,
            transformResponse: (response) => formatEventResponse(response),
            providesTags: (result, error, { id }) => [{ type: 'Event', id }],
        }),
    }),
});

export const {
    useGetEventsQuery,
    useGetEventQuery,
} = eventsApi;

