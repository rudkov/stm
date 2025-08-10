import { apiSlice } from 'api/apiSlice';
import { formatFiltersRequest } from './requestFormatters';
import { formatCompanyResponse } from './responseFormatters';

export const companiesApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getCompanies: builder.query({
            query: (filters = {}) => ({
                url: '/companies/search',
                method: 'POST',
                body: formatFiltersRequest(filters),
            }),
            providesTags: ['Company'],
        }),
        getCompany: builder.query({
            query: ({ id }) => `/companies/${id}`,
            transformResponse: (response) => formatCompanyResponse(response),
            providesTags: (result, error, { id }) => [{ type: 'Company', id }],
        }),
        createCompany: builder.mutation({
            query: ({ values }) => ({
                url: '/companies',
                method: 'POST',
                body: values,
            }),
            invalidatesTags: ['Company'],
        }),
        updateCompany: builder.mutation({
            query: ({ id, values }) => ({
                url: `/companies/${id}`,
                method: 'PUT',
                body: values,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Company', id }],
        }),
        deleteCompany: builder.mutation({
            query: ({ id }) => ({
                url: `/companies/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Company'],
        }),
    }),
});

export const {
    useGetCompaniesQuery,
    useGetCompanyQuery,
    useCreateCompanyMutation,
    useUpdateCompanyMutation,
    useDeleteCompanyMutation,
} = companiesApi;
