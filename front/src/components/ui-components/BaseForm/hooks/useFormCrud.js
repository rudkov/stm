import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useNotification } from '../../../notifications/NotificationProvider';

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
    const [create, { data: createData, isLoading: isCreating, isSuccess: isCreateSuccess, reset: resetCreate }] = apiActions.create();
    const [update, { isLoading: isUpdating, isSuccess: isUpdateSuccess, reset: resetUpdate }] = apiActions.update();
    const [remove, { isLoading: isDeleting, isSuccess: isDeleteSuccess, reset: resetDelete }] = apiActions.delete();

    const isLoading = isFetching || isCreating || isUpdating || isDeleting;

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

    return {
        isLoading,
        entity,
        submitForm,
        deleteEntity,
    };
} 