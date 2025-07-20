import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
    crudActions,
    selectors,
    entityUrl,
    entityId,
    onAfterSubmit,
    onClose,
    onProcessFormData,
    form,
    createSuccessMessage = 'Item created',
    updateSuccessMessage = 'Changes saved',
    deleteSuccessMessage = 'Item deleted',
    isFormOpen
}) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const showNotification = useNotification();
    const [isLoading, setIsLoading] = useState(false);
    const isNew = !entityId;

    const entity = useSelector(selectors.entity);
    const createResponse = useSelector(selectors.createResponse);
    const updateResponse = useSelector(selectors.updateResponse);
    const deleteResponse = useSelector(selectors.deleteResponse);

    // Fetch entity data
    const fetchEntity = useCallback((id) => {
        dispatch(crudActions.fetch({ id }));
    }, [dispatch, crudActions]);

    useEffect(() => {
        if (!isNew && entityId && isFormOpen) {
            fetchEntity(entityId);
        }
    }, [entityId, isNew, isFormOpen, fetchEntity]);

    // Submit form (create or update)
    const submitForm = (formValues) => {
        setIsLoading(true);

        const values = formValues || form.getFieldsValue();

        // Apply custom data processing if provided
        const processedValues = onProcessFormData ? onProcessFormData(values) : values;

        if (isNew) {
            dispatch(crudActions.create({ values: processedValues }));
        } else {
            dispatch(crudActions.update({ id: entityId, values: processedValues }));
        }
    };

    // Delete entity
    const deleteEntity = () => {
        setIsLoading(true);
        dispatch(crudActions.delete({ id: entityId }));
    };

    // Handle create response
    useEffect(() => {
        if (createResponse.status === 'fulfilled') {
            setIsLoading(false);
            showNotification({ type: 'SUCCESS', message: createSuccessMessage });
            onAfterSubmit();
            dispatch(crudActions.resetResponse('create'));

            // Navigate to the new entity
            const newEntityId = createResponse.id;
            if (newEntityId) {
                navigate(`${entityUrl}/${newEntityId}`);
            }
            onClose();
        }
    }, [createResponse, dispatch, navigate, onClose, showNotification, onAfterSubmit, entityUrl, createSuccessMessage, crudActions]);

    // Handle update response
    useEffect(() => {
        if (updateResponse.status === 'fulfilled') {
            setIsLoading(false);
            showNotification({ type: 'SUCCESS', message: updateSuccessMessage });
            onAfterSubmit();
            dispatch(crudActions.resetResponse('update'));
            onClose();
        }
    }, [updateResponse, dispatch, onClose, showNotification, onAfterSubmit, updateSuccessMessage, crudActions]);

    // Handle delete response
    useEffect(() => {
        if (deleteResponse.status === 'fulfilled') {
            setIsLoading(false);
            showNotification({ type: 'SUCCESS', message: deleteSuccessMessage });
            onAfterSubmit();
            dispatch(crudActions.resetResponse('delete'));
            navigate(entityUrl, { replace: true });
            onClose();
        }
    }, [deleteResponse, dispatch, navigate, onClose, showNotification, onAfterSubmit, entityUrl, deleteSuccessMessage, crudActions]);

    return {
        isLoading,
        entity,
        submitForm,
        deleteEntity,
        fetchEntity
    };
} 