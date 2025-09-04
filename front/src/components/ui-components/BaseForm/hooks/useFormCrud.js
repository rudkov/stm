import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useNotification } from 'components/notifications/NotificationProvider';
import { transformValidationErrors } from 'helpers/form-utils';

/**
 * Hook to handle CRUD operations for forms
 * @param {string} config.entityUrl - The base URL for the entity (e.g., '/app/companies').
 * @param {number|null} config.entityId - ID of the entity being edited
 * @param {Object} config.apiActions - Object containing RTK Query hooks for CRUD operations (query, create, update, delete)
 * @param {Function} config.onAfterSubmit - Callback after successful submit
 * @param {Function} config.onClose - Callback to close the form
 * @param {Function} [config.onProcessFormData] - Function that can mutate/clean the form values before they are sent.
 * @param {Function} [config.getExtraArgs] - Function returning extra arguments (e.g., linked IDs) appended to each API call
 * @param {Object} config.form - Ant Design form instance
 * @param {string|null} [config.redirectUrlAfterCreate] - Target URL after successful creation. Set to `null` to disable navigation. Omit to auto-navigate to the new entity page.
 * @param {string|null} [config.redirectUrlAfterUpdate] - Target URL after successful update. Set to `null` to disable navigation. Omit to auto-stay on the same entity page.
 * @param {string|null} [config.redirectUrlAfterDelete] - Target URL after successful deletion. Set to `null` to disable navigation. Omit to auto-navigate to the entity list page.
 * @param {string} [config.createSuccessMessage] - Optional message on successful creation.
 * @param {string} [config.updateSuccessMessage] - Optional message on successful update.
 * @param {string} [config.deleteSuccessMessage] - Optional message on successful deletion.
 */
export function useFormCrud({
    entityUrl,
    entityId,
    apiActions,
    onAfterSubmit,
    onClose,
    onProcessFormData,
    getExtraArgs = () => ({}),
    form,
    redirectUrlAfterCreate,
    redirectUrlAfterUpdate = null,
    redirectUrlAfterDelete,
    createSuccessMessage = 'Item created',
    updateSuccessMessage = 'Changes saved',
    deleteSuccessMessage = 'Item deleted',
}) {
    const navigate = useNavigate();
    const showNotification = useNotification();
    const isNew = !entityId;

    const { data: entity, isLoading: isFetching } = apiActions.query({ id: entityId }, { skip: isNew });
    const [create, { data: createData, isLoading: isCreating, isSuccess: isCreateSuccess, reset: resetCreate, error: createError }] = apiActions.create();
    const [update, { isLoading: isUpdating, isSuccess: isUpdateSuccess, reset: resetUpdate, error: updateError }] = apiActions.update();
    const [remove, { isLoading: isDeleting, isSuccess: isDeleteSuccess, reset: resetDelete, error: deleteError }] = apiActions.delete();

    const isLoading = isFetching || isCreating || isUpdating || isDeleting;
    const error = createError || updateError || deleteError;

    const clearFormErrors = useCallback(() => {
        form.setFields(
            form.getFieldsError()
                .filter(({ errors }) => errors.length > 0)
                .map(({ name }) => ({ name, errors: [] }))
        );
    }, [form]);

    const submitForm = (formValues) => {
        const values = formValues || form.getFieldsValue();

        // Apply custom data processing if provided
        const processedValues = onProcessFormData ? onProcessFormData(values) : values;

        // extra args (e.g., linked entity ids) built by callback
        const extraArgs = getExtraArgs({ values: processedValues, originalEntity: entity, isNew });

        if (isNew) {
            create({ values: processedValues, ...extraArgs });
        } else {
            update({ id: entityId, values: processedValues, ...extraArgs });
        }
    };

    const deleteEntity = () => {
        const extraArgs = getExtraArgs({ originalEntity: entity, isDelete: true });
        remove({ id: entityId, ...extraArgs });
    };

    // Handle create response
    useEffect(() => {
        if (isCreateSuccess) {
            clearFormErrors();
            showNotification({ type: 'SUCCESS', message: createSuccessMessage });
            if (onAfterSubmit) onAfterSubmit();
            const newEntityId = createData.id;
            if (redirectUrlAfterCreate !== null) {
                const target = redirectUrlAfterCreate !== undefined
                    ? redirectUrlAfterCreate
                    : newEntityId ? `${entityUrl}/${newEntityId}` : entityUrl;
                navigate(target, { replace: true });
            }
            onClose();
            resetCreate();
        }
    }, [isCreateSuccess, createData, navigate, onClose, showNotification, onAfterSubmit, entityUrl, createSuccessMessage, resetCreate, clearFormErrors, redirectUrlAfterCreate]);

    // Handle update response
    useEffect(() => {
        if (isUpdateSuccess) {
            clearFormErrors();
            showNotification({ type: 'SUCCESS', message: updateSuccessMessage });
            if (onAfterSubmit) onAfterSubmit();
            if (redirectUrlAfterUpdate !== null) {
                const target = redirectUrlAfterUpdate !== undefined
                    ? redirectUrlAfterUpdate
                    : `${entityUrl}/${entityId}`;
                navigate(target, { replace: true });
            }
            onClose();
            resetUpdate();
        }
    }, [isUpdateSuccess, onClose, showNotification, onAfterSubmit, updateSuccessMessage, resetUpdate, clearFormErrors, redirectUrlAfterUpdate, entityUrl, entityId, navigate]);

    // Handle delete response
    useEffect(() => {
        if (isDeleteSuccess) {
            showNotification({ type: 'SUCCESS', message: deleteSuccessMessage });
            if (onAfterSubmit) onAfterSubmit();
            if (redirectUrlAfterDelete !== null) {
                const target = redirectUrlAfterDelete !== undefined ? redirectUrlAfterDelete : entityUrl;
                navigate(target, { replace: true });
            }
            onClose();
            resetDelete();
        }
    }, [isDeleteSuccess, navigate, onClose, showNotification, onAfterSubmit, entityUrl, deleteSuccessMessage, resetDelete, redirectUrlAfterDelete]);

    useEffect(() => {
        if (error?.status === 422 && error?.data?.errors) {
            clearFormErrors();
            form.setFields(transformValidationErrors(error.data.errors));
        } else if (error) {
            showNotification({ type: 'ERROR', message: 'Something went wrong. Please try again.' });
        }

        if (error) {
            resetCreate();
            resetUpdate();
            resetDelete();
        }
    }, [error, form, showNotification, createError, updateError, deleteError, resetCreate, resetUpdate, resetDelete, clearFormErrors]);

    return {
        isLoading,
        entity,
        submitForm,
        deleteEntity,
    };
} 