import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    item: {},
    createResponse: {},
    updateResponse: {},
    deleteResponse: {},
};

export const fetchTalentBoardById = createAsyncThunk('talentBoard/fetchTalentBoardById', async (talentBoardId) => {
    try {
        const response = await axios.get('/api/v1/talent-boards/' + talentBoardId);
        return response.data;
    } catch (err) {
        console.log(err);
        return err.message;
    }
});

export const createTalentBoard = createAsyncThunk('talentBoard/createTalentBoard', async (args) => {
    const values = args.values;

    try {
        const response = await axios({
            method: 'post',
            url: '/api/v1/talent-boards',
            data: values,
        });
        return response.data;
    } catch (err) {
        console.log(err);
        return err.message;
    }
});

export const updateTalentBoardById = createAsyncThunk('talentBoard/updateTalentBoardById', async (args) => {
    const talentBoardId = args.talentBoardId;
    const values = args.values;

    try {
        const response = await axios({
            method: 'put',
            url: '/api/v1/talent-boards/' + talentBoardId,
            data: values,
        });
        return response.data;
    } catch (err) {
        console.log(err);
        return err.message;
    }
});

export const deleteTalentBoardById = createAsyncThunk('talentBoard/deleteTalentBoardById', async (args) => {
    const talentBoardId = args.talentBoardId;

    try {
        const response = await axios({
            method: 'delete',
            url: '/api/v1/talent-boards/' + talentBoardId,
        });
        return response.data;
    } catch (err) {
        console.log(err);
        return err.message;
    }
});

const talentBoardSlice = createSlice({
    name: 'talentBoard',
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
            .addCase(fetchTalentBoardById.fulfilled, (state, action) => {
                state.item = action.payload;
            })

            .addCase(createTalentBoard.pending, (state, action) => {
                state.createResponse.status = 'pending';
            })
            .addCase(createTalentBoard.fulfilled, (state, action) => {
                state.createResponse.status = 'fulfilled';
                state.createResponse.item = action.payload;
            })

            .addCase(updateTalentBoardById.pending, (state, action) => {
                state.updateResponse.status = 'pending';
            })
            .addCase(updateTalentBoardById.fulfilled, (state, action) => {
                state.updateResponse.status = 'fulfilled';
                state.item = action.payload;
            })

            .addCase(deleteTalentBoardById.pending, (state, action) => {
                state.deleteResponse.status = 'pending';
            })
            .addCase(deleteTalentBoardById.fulfilled, (state, action) => {
                state.deleteResponse.status = 'fulfilled';
            })
    }
});

export const getTalentBoard = (state) => state.talentBoard.item;

export const getCreateResponse = (state) => state.talentBoard.createResponse;
export const getUpdateResponse = (state) => state.talentBoard.updateResponse;
export const getDeleteResponse = (state) => state.talentBoard.deleteResponse;

export const talentBoardActions = talentBoardSlice.actions;

export default talentBoardSlice.reducer;