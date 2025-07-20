import { useEffect, useState, useCallback } from 'react';

/**
 * Hook to handle form lifecycle including initialization and title management
 * @param {Object} config - Configuration object
 * @param {Object} config.entity - The full entity object, fetched from Redux. This can be null initially.
 * @param {number|null} config.entityId - The stable ID of the entity being edited. This is the "command" to the hook.
 * @param {boolean} config.isFormOpen - Whether the form is open
 * @param {Function} config.onInitForm - Callback to initialize form with values
 * @param {Object} config.form - Ant Design form instance
 * @param {Function} config.getTitle - A function that returns the form title string.
 * @param {Function} config.fetchEntity - The action to fetch the entity.
 * @param {Function} config.setOriginalFormValues - Function to set the original form values for change detection.
 */
export function useFormLifecycle({
    entity,
    entityId,
    isFormOpen,
    onInitForm,
    form,
    getTitle,
    fetchEntity,
    setOriginalFormValues
}) {
    const [formTitle, setFormTitle] = useState();
    const isNew = !entityId;

    const initForm = useCallback((values) => {
        if (onInitForm) {
            onInitForm(values, form);
        } else {
            // Default initialization logic
            form.setFieldsValue(values);
        }

        // Set original values for change detection
        if (setOriginalFormValues) {
            setOriginalFormValues(form.getFieldsValue(true));
        }
    }, [form, onInitForm, setOriginalFormValues]);

    // Fetch entity when form opens (for existing entities)
    useEffect(() => {
        if (!isNew && entityId && isFormOpen) {
            if (fetchEntity) {
                fetchEntity(entityId);
            }
        }
    }, [isNew, entityId, isFormOpen, fetchEntity]);

    useEffect(() => {
        if (getTitle) {
            const title = getTitle(entity, isNew);
            setFormTitle(title);
        }

        if (isNew) {
            initForm({});
        } else if (entity?.id) {
            initForm(entity);
        }
    }, [isNew, entity, getTitle, initForm]);

    return {
        formTitle,
        initForm
    };
} 