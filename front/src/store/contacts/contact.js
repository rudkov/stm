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

export const fetchContact = createAsyncThunk('contact/fetch', async (args) => {
    const { id } = args;

    try {
        const response = await axios.get(`/api/v1/contacts/${id}`);
        return response.data;
    } catch (err) {
        return err.message;
    }
});

export const createContact = createAsyncThunk('contact/create', async (args) => {
    const { values } = args;

    try {
        const response = await axios({
            method: 'post',
            url: '/api/v1/contacts',
            data: values,
        });
        return response.data;
    } catch (err) {
        console.log(err);
        return err.message;
    }
});

export const updateContact = createAsyncThunk('contact/update', async (args) => {
    const { id, values } = args;

    try {
        const response = await axios({
            method: 'put',
            url: `/api/v1/contacts/${id}`,
            data: values,
        });
        return response.data;
    } catch (err) {
        console.log(err);
        return err.message;
    }
});

export const deleteContact = createAsyncThunk('contact/delete', async (args) => {
    const { id } = args;

    try {
        const response = await axios({
            method: 'delete',
            url: `/api/v1/contacts/${id}`,
        });
        return response.data;
    } catch (err) {
        console.log(err);
        return err.message;
    }
});

const prepareContact = (state, values) => {
    let item = values;

    item.full_name = values.first_name.concat(' ', values.last_name);

    item.created_at = values.created_at ? dayjs(values.created_at).format(dateTimeFormat) : null;
    item.updated_at = values.updated_at ? dayjs(values.updated_at).format(dateTimeFormat) : null;

    state.item = item;
};

const contactSlice = createSlice({
    name: 'contact',
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
            .addCase(fetchContact.fulfilled, (state, action) => {
                prepareContact(state, action.payload);
            })

            .addCase(createContact.pending, (state, action) => {
                state.createResponse.status = 'pending';
            })
            .addCase(createContact.fulfilled, (state, action) => {
                state.createResponse.status = 'fulfilled';
                state.createResponse.id = action.payload.id;
            })

            .addCase(updateContact.pending, (state, action) => {
                state.updateResponse.status = 'pending';
            })
            .addCase(updateContact.fulfilled, (state, action) => {
                state.updateResponse.status = 'fulfilled';
                prepareContact(state, action.payload);
            })

            .addCase(deleteContact.pending, (state, action) => {
                state.deleteResponse.status = 'pending';
            })
            .addCase(deleteContact.fulfilled, (state, action) => {
                state.deleteResponse.status = 'fulfilled';
            })
    }
});

export const getContact = (state) => state.contact.item;

export const getCreateResponse = (state) => state.contact.createResponse;
export const getUpdateResponse = (state) => state.contact.updateResponse;
export const getDeleteResponse = (state) => state.contact.deleteResponse;

export const contactActions = contactSlice.actions;

export default contactSlice.reducer;
