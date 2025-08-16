import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useNotification } from 'components/notifications/NotificationProvider';
import { transformValidationErrors } from 'helpers/form-utils';

/**
 * Hook to handle CRUD operations for forms
 * @param {Object} config - Configuration object
 * @param {Object} config.crudActions - CRUD action creators
 * @param {Object} config.selectors - Redux selectors
 * @param {string} config.entityUrl - The base URL for the entity (e.g., '/app/companies').
 * @param {number|null} config.entityId - ID of the entity being edited
 * @param {Function} config.onAfterSubmit - Callback after successful submit
 * @param {Function} config.onClose - Callback to close the form
 * @param {Object} config.form - Ant Design form instance
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
    form,
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

    const clearFormErrors = () => {
        form.setFields(
            form.getFieldsError()
                .filter(({ errors }) => errors.length > 0)
                .map(({ name }) => ({ name, errors: [] }))
        );
    };

    const submitForm = (formValues) => {
        const values = formValues || form.getFieldsValue();

        // Apply custom data processing if provided
        const processedValues = onProcessFormData ? onProcessFormData(values) : values;

        if (isNew) {
            create({ values: processedValues });
        } else {
            update({ id: entityId, values: processedValues });
        }
    };

    const deleteEntity = () => {
        remove({ id: entityId });
    };

    // Handle create response
    useEffect(() => {
        if (isCreateSuccess) {
            clearFormErrors();
            showNotification({ type: 'SUCCESS', message: createSuccessMessage });
            if (onAfterSubmit) onAfterSubmit();
            const newEntityId = createData.id;
            if (newEntityId) {
                navigate(`${entityUrl}/${newEntityId}`);
            }
            onClose();
            resetCreate();
        }
    }, [isCreateSuccess, createData, navigate, onClose, showNotification, onAfterSubmit, entityUrl, createSuccessMessage, resetCreate]);

    // Handle update response
    useEffect(() => {
        if (isUpdateSuccess) {
            clearFormErrors();
            showNotification({ type: 'SUCCESS', message: updateSuccessMessage });
            if (onAfterSubmit) onAfterSubmit();
            onClose();
            resetUpdate();
        }
    }, [isUpdateSuccess, onClose, showNotification, onAfterSubmit, updateSuccessMessage, resetUpdate]);

    // Handle delete response
    useEffect(() => {
        if (isDeleteSuccess) {
            showNotification({ type: 'SUCCESS', message: deleteSuccessMessage });
            if (onAfterSubmit) onAfterSubmit();
            navigate(entityUrl, { replace: true });
            onClose();
            resetDelete();
        }
    }, [isDeleteSuccess, navigate, onClose, showNotification, onAfterSubmit, entityUrl, deleteSuccessMessage, resetDelete]);

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
    }, [error, form, showNotification, createError, updateError, deleteError, resetCreate, resetUpdate, resetDelete]);

    return {
        isLoading,
        entity,
        submitForm,
        deleteEntity,
    };
} 