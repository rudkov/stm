import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import dayjs from "dayjs";

import measurementsConverter from "../../helpers/measurements-converter";

//TODO: Below is a temporary solution. We need to place date format into user settings.
//TODO: this format also appears in all date time antd controls. To double check
const dateFormat = 'DD.MM.YYYY';
const dateTimeFormat = 'DD.MM.YYYY, HH:mm';

const initialState = {
    item: {},
    createResponse: {},
    updateResponse: {},
    deleteResponse: {},
    currentLocationResponse: {},
};

export const fetchTalentById = createAsyncThunk('talent/fetchTalentById', async (talentId) => {
    try {
        const response = await axios.get('/api/v1/talents/' + talentId);
        return response.data;
    } catch (err) {
        return err.message;
    }
});

export const createTalent = createAsyncThunk('talent/createTalent', async (args) => {
    const values = args.values;

    try {
        const response = await axios({
            method: 'post',
            url: '/api/v1/talents',
            data: values,
        });
        return response.data;
    } catch (err) {
        console.log(err);
        return err.message;
    }
});

export const updateTalentById = createAsyncThunk('talent/updateTalentById', async (args) => {
    const talentId = args.talentId;
    const values = args.values;

    try {
        const response = await axios({
            method: 'put',
            url: '/api/v1/talents/' + talentId,
            data: values,
        });
        return response.data;
    } catch (err) {
        console.log(err);
        return err.message;
    }
});

export const deleteTalentById = createAsyncThunk('talent/deleteTalentById', async (args) => {
    const talentId = args.talentId;

    try {
        const response = await axios({
            method: 'delete',
            url: '/api/v1/talents/' + talentId,
        });
        return response.data;
    } catch (err) {
        console.log(err);
        return err.message;
    }
});

export const updateCurrentLocation = createAsyncThunk('talent/updateCurrentLocation', async (args) => {
    const talentId = args[0];
    const value = args[1];

    try {
        const response = await axios.put('/api/v1/talents/' + talentId + '/locations/current', {
            current_location: value,
        });
        return response.data;
    } catch (err) {
        return err.message;
    }
});

const prepareTalent = (state, values) => {
    let item = values;

    item.full_name = values.first_name.concat(' ', values.last_name);
    item.birth_date = values.birth_date ? dayjs(values.birth_date).format(dateFormat) : null;
    item.age = values.birth_date ? dayjs().diff(dayjs(values.birth_date, dateFormat), 'years') : null;
    item.is_lifestyle = (values.is_lifestyle === 1) ? "Lifestyle" : (values.is_lifestyle === 0) ? "Fashion" : null;
    item.gender_id = values.gender_id || '';

    item.hair_color_id = values.hair_color_id || '';
    item.hair_length_id = values.hair_length_id || '';
    item.eye_color_id = values.eye_color_id || '';
    item.cup_size_id = values.cup_size_id || '';
    item.shoe_size_id = values.shoe_size_id || '';
    item.shirt_size_id = values.shirt_size_id || '';
    item.suit_cut_id = values.suit_cut_id || '';
    item.dress_size_id = values.dress_size_id || '';
    item.skin_color_id = values.skin_color_id || '';
    item.is_ears_pierced = (values.is_ears_pierced === 1) ? "Yes" : (values.is_ears_pierced === 0) ? "No" : null;
    item.height_cm = values.height_cm || '';
    item.height_in = measurementsConverter(values.height_cm, 'ft in');
    item.bust_cm = values.bust_cm || '';
    item.bust_in = measurementsConverter(values.bust_cm, 'in', true);
    item.waist_cm = values.waist_cm || '';
    item.waist_in = measurementsConverter(values.waist_cm, 'in', true);
    item.hips_cm = values.hips_cm || '';
    item.hips_in = measurementsConverter(values.hips_cm, 'in', true);
    item.weight_kg = values.weight_kg || '';
    item.weight_lb = measurementsConverter(values.weight_kg, 'lb', true);
    item.scars = values.scars || '';
    item.tattoos = values.tattoos || '';
    item.piercings = values.piercings || '';

    item.is_vegetarian = (values.is_vegetarian === 1) ? "Yes" : (values.is_vegetarian === 0) ? "No" : null;

    item.is_accent = (values.is_accent === 1) ? "Yes" : (values.is_accent === 0) ? "No" : null;

    item.is_lingerie = (values.is_lingerie === 1) ? "Yes" : (values.is_lingerie === 0) ? "No" : null;
    item.is_nude = (values.is_nude === 1) ? "Yes" : (values.is_nude === 0) ? "No" : null;
    item.is_fur = (values.is_fur === 1) ? "Yes" : (values.is_fur === 0) ? "No" : null;
    item.is_liquor_ads = (values.is_liquor_ads === 1) ? "Yes" : (values.is_liquor_ads === 0) ? "No" : null;
    item.is_smoking_ads = (values.is_smoking_ads === 1) ? "Yes" : (values.is_smoking_ads === 0) ? "No" : null;
    item.is_gambling_ads = (values.is_gambling_ads === 1) ? "Yes" : (values.is_gambling_ads === 0) ? "No" : null;
    item.is_faithbased_ads = (values.is_faithbased_ads === 1) ? "Yes" : (values.is_faithbased_ads === 0) ? "No" : null;
    item.is_political_ads = (values.is_political_ads === 1) ? "Yes" : (values.is_political_ads === 0) ? "No" : null;
    item.is_topless = (values.is_topless === 1) ? "Yes" : (values.is_topless === 0) ? "No" : null;
    item.is_swimwear = (values.is_swimwear === 1) ? "Yes" : (values.is_swimwear === 0) ? "No" : null;
    item.is_sports = (values.is_sports === 1) ? "Yes" : (values.is_sports === 0) ? "No" : null;

    item.achievements = values.achievements || '';
    item.performance_skills = values.performance_skills || '';
    item.biography = values.biography || '';

    item.relatives = values.relatives.sort(
        (a, b) => {
            if (a.type && b.type) {
                if (a.type.name > b.type.name) {
                    return 1;
                } else if (b.type.name > a.type.name) {
                    return -1;
                } else {
                    return 0;
                }
            }
            else
                return -999999; //this hack is for sorting values without type (null values) at the bottom of the list
        });

    item.addresses = values.addresses.sort(
        (a, b) => {
            if (a.type && b.type) {
                return a.type.weight - b.type.weight
            }
            else
                return -999999; //this hack is for sorting values without type (null values) at the bottom of the list
        });

    item.phones = values.phones.sort(
        (a, b) => {
            if (a.type && b.type) {
                return a.type.weight - b.type.weight
            }
            else
                return -999999; //this hack is for sorting values without type (null values) at the bottom of the list
        });

    item.emails = values.emails.sort(
        (a, b) => {
            if (a.type && b.type) {
                return a.type.weight - b.type.weight
            }
            else
                return -999999; //this hack is for sorting values without type (null values) at the bottom of the list
        });

    item.social_medias = values.social_medias.sort(
        (a, b) => {
            if (a.type && b.type) {
                if (a.type.name > b.type.name) {
                    return 1;
                } else if (b.type.name > a.type.name) {
                    return -1;
                } else {
                    return 0;
                }
            }
            else
                return -999999; //this hack is for sorting values without type (null values) at the bottom of the list
        });

    item.messengers = values.messengers.sort(
        (a, b) => {
            if (a.type && b.type) {
                if (a.type.name > b.type.name) {
                    return 1;
                } else if (b.type.name > a.type.name) {
                    return -1;
                } else {
                    return 0;
                }
            }
            else
                return -999999; //this hack is for sorting values without type (null values) at the bottom of the list
        });

    item.created_at = values.created_at ? dayjs(values.created_at).format(dateTimeFormat) : null;
    item.updated_at = values.updated_at ? dayjs(values.updated_at).format(dateTimeFormat) : null;

    state.item = item;
};

const talentSlice = createSlice({
    name: 'talent',
    initialState: initialState,
    reducers: {
        resetState() {
            return initialState;
        },
        resetResponse(state, responseName) {
            if (responseName.payload === 'delete') {
                state.deleteResponse.status = '';
            }
            else if (responseName.payload === 'create') {
                state.createResponse.status = '';
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTalentById.fulfilled, (state, action) => {
                prepareTalent(state, action.payload);
            })

            .addCase(updateCurrentLocation.pending, (state, action) => {
                state.currentLocationResponse.status = 'pending';
            })
            .addCase(updateCurrentLocation.fulfilled, (state, action) => {
                state.currentLocationResponse.status = 'fulfilled';
                prepareTalent(state, action.payload);
            })

            .addCase(updateTalentById.pending, (state, action) => {
                state.updateResponse.status = 'pending';
            })
            .addCase(updateTalentById.fulfilled, (state, action) => {
                state.updateResponse.status = 'fulfilled';
                prepareTalent(state, action.payload);
            })

            .addCase(createTalent.pending, (state, action) => {
                state.createResponse.status = 'pending';
            })
            .addCase(createTalent.fulfilled, (state, action) => {
                state.createResponse.status = 'fulfilled';
                state.createResponse.talentId = action.payload.id;
            })

            .addCase(deleteTalentById.pending, (state, action) => {
                state.deleteResponse.status = 'pending';
            })
            .addCase(deleteTalentById.fulfilled, (state, action) => {
                state.deleteResponse.status = 'fulfilled';
            })
    }
});

export const getTalent = (state) => state.talent.item;

export const getCreateResponse = (state) => state.talent.createResponse;
export const getUpdateResponse = (state) => state.talent.updateResponse;
export const getDeleteResponse = (state) => state.talent.deleteResponse;

export const getCurrentLocationResponse = (state) => state.talent.currentLocationResponse;

export const talentActions = talentSlice.actions;

export default talentSlice.reducer;