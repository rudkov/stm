import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import dayjs from 'dayjs';

//TODO: Below is a temporary solution. We need to place date format into user settings.
//TODO: this format also appears in all date time antd controls. To double check
const dateTimeFormat = 'DD.MM.YYYY, HH:mm';

const initialState = {
    item: {},
    createResponse: {},
    updateResponse: {},
    deleteResponse: {},
};

export const fetchCompany = createAsyncThunk('company/fetch', async (args) => {
    const { id } = args;

    try {
        const response = await axios.get(`/api/v1/companies/${id}`);
        return response.data;
    } catch (err) {
        return err.message;
    }
});

export const createCompany = createAsyncThunk('company/create', async (args) => {
    const { values } = args;

    try {
        const response = await axios({
            method: 'post',
            url: '/api/v1/companies',
            data: values,
        });
        return response.data;
    } catch (err) {
        console.log(err);
        return err.message;
    }
});

export const updateCompany = createAsyncThunk('company/update', async (args) => {
    const { id, values } = args;

    try {
        const response = await axios({
            method: 'put',
            url: `/api/v1/companies/${id}`,
            data: values,
        });
        return response.data;
    } catch (err) {
        console.log(err);
        return err.message;
    }
});

export const deleteCompany = createAsyncThunk('company/delete', async (args) => {
    const { id } = args;

    try {
        const response = await axios({
            method: 'delete',
            url: `/api/v1/companies/${id}`,
        });
        return response.data;
    } catch (err) {
        console.log(err);
        return err.message;
    }
});

const prepareCompany = (state, values) => {
    let item = values;

    item.name = values.name || '';

    item.created_at = values.created_at ? dayjs(values.created_at).format(dateTimeFormat) : null;
    item.updated_at = values.updated_at ? dayjs(values.updated_at).format(dateTimeFormat) : null;

    state.item = item;
};

const companySlice = createSlice({
    name: 'company',
    initialState: initialState,
    reducers: {
        resetState() {
            return initialState;
        },
        resetResponse(state, responseName) {
            switch (responseName.payload) {
                case 'create':
                    state.createResponse.status = null;
                    break;
                case 'update':
                    state.updateResponse.status = null;
                    break;
                case 'delete':
                    state.deleteResponse.status = null;
                    break;
                default:
                    break;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCompany.fulfilled, (state, action) => {
                prepareCompany(state, action.payload);
            })

            .addCase(createCompany.pending, (state, action) => {
                state.createResponse.status = 'pending';
            })
            .addCase(createCompany.fulfilled, (state, action) => {
                state.createResponse.status = 'fulfilled';
                state.createResponse.id = action.payload.id;
            })

            .addCase(updateCompany.pending, (state, action) => {
                state.updateResponse.status = 'pending';
            })
            .addCase(updateCompany.fulfilled, (state, action) => {
                state.updateResponse.status = 'fulfilled';
                prepareCompany(state, action.payload);
            })

            .addCase(deleteCompany.pending, (state, action) => {
                state.deleteResponse.status = 'pending';
            })
            .addCase(deleteCompany.fulfilled, (state, action) => {
                state.deleteResponse.status = 'fulfilled';
            })
    }
});

export const getCompany = (state) => state.company.item;

export const getCreateResponse = (state) => state.company.createResponse;
export const getUpdateResponse = (state) => state.company.updateResponse;
export const getDeleteResponse = (state) => state.company.deleteResponse;

export const companyActions = companySlice.actions;

export default companySlice.reducer;
