import { apiSlice } from 'api/apiSlice';
import { formatFiltersRequest } from './requestFormatters';
import { formatContactResponse } from './responseFormatters';

export const contactsApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getContacts: builder.query({
            query: (filters = {}) => ({
                url: '/contacts/search',
                method: 'POST',
                body: formatFiltersRequest(filters),
            }),
            providesTags: ['Contact'],
        }),
        getContact: builder.query({
            query: ({ id }) => `/contacts/${id}`,
            transformResponse: (response) => formatContactResponse(response),
            providesTags: (result, error, { id }) => [{ type: 'Contact', id }],
        }),
        createContact: builder.mutation({
            query: ({ values }) => ({
                url: '/contacts',
                method: 'POST',
                body: values,
            }),
            invalidatesTags: (result, error, { companyIds = [] }) => [
                'Contact',
                ...companyIds.map((companyId) => ({ type: 'Company', id: companyId })),
                'Company',
            ],
        }),
        updateContact: builder.mutation({
            query: ({ id, values }) => ({
                url: `/contacts/${id}`,
                method: 'PUT',
                body: values,
            }),
            invalidatesTags: (result, error, { id, companyIds = [] }) => [
                { type: 'Contact', id },
                'Contact',
                ...companyIds.map((companyId) => ({ type: 'Company', id: companyId })),
                'Company',
            ],
        }),
        deleteContact: builder.mutation({
            query: ({ id }) => ({
                url: `/contacts/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, { companyIds = [] }) => [
                'Contact',
                ...companyIds.map((companyId) => ({ type: 'Company', id: companyId })),
                'Company',
            ],
        }),
    }),
});

export const {
    useGetContactsQuery,
    useGetContactQuery,
    useCreateContactMutation,
    useUpdateContactMutation,
    useDeleteContactMutation,
} = contactsApi;
