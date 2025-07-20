import { useState } from 'react';

/**
 * Hook to manage form state including change detection and modals
 * @param {Object} form - Ant Design form instance
 * @param {Function} onClose - Function to close the form
 * @param {Function} submitForm - Function to submit the form
 */
export function useFormState(form, onClose, submitForm) {
    const [originalFormValues, setOriginalFormValues] = useState();
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

    const checkForChanges = () => {
        const currentFormValues = form.getFieldsValue(true);
        return JSON.stringify(currentFormValues) !== JSON.stringify(originalFormValues);
    };

    const resetToOriginalValues = () => {
        form.setFieldsValue(originalFormValues);
    };

    // Modal handlers
    const handleSave = () => {
        if (submitForm) {
            submitForm();
        } else {
            form.submit();
        }
        setIsConfirmationModalOpen(false);
    };

    const handleDiscard = () => {
        setIsConfirmationModalOpen(false);
        onClose();
        if (originalFormValues) {
            form.setFieldsValue(originalFormValues);
        }
    };

    const handleCancel = () => {
        setIsConfirmationModalOpen(false);
    };

    return {
        originalFormValues,
        setOriginalFormValues,
        isConfirmationModalOpen,
        setIsConfirmationModalOpen,
        checkForChanges,
        resetToOriginalValues,
        handleSave,
        handleDiscard,
        handleCancel
    };
} 