import './BaseForm.css';

import { Form } from 'antd';
import { Children, cloneElement, useRef } from 'react';

import CustomDrawer from 'components/ui-components/CustomDrawer';
import ScrollableView from 'components/ui-components/ScrollableView';

import { useFormCrud } from './hooks/useFormCrud';
import { useFormLifecycle } from './hooks/useFormLifecycle';
import { useFormState } from './hooks/useFormState';

import AnchorNavigation from './components/AnchorNavigation';
import FormHeader from './components/FormHeader';
import UnsavedChangesModal from './components/UnsavedChangesModal';
import { cx } from '../../../helpers/classNames';

/**
 * Reusable form component for CRUD operations
 * @param {Object} props - Component props
 * @param {string} props.entityName - Name of the entity (talent, company, contact)
 * @param {number|null} props.entityId - ID of the entity being edited
 * @param {number} props.formWidth - Width of the form drawer
 * @param {boolean} props.enableDelete - Whether delete functionality is enabled
 * @param {boolean} props.enableAnchorNavigation - Whether to show anchor navigation
 * @param {Array} props.anchorItems - Items for anchor navigation
 * @param {Object} props.apiActions - Object containing RTK Query hooks for CRUD operations (query, create, update, delete)
 * @param {Function} props.onInitForm - Custom form initialization function
 * @param {Function} props.onProcessFormData - Custom form data processing function
 * @param {Function} props.onAfterSubmit - Callback after successful submit
 * @param {boolean} props.open - Whether the form is open
 * @param {Function} props.onClose - Callback to close the form
 * @param {Function} props.onAnchorClick - Custom anchor click handler
 * @param {ReactNode} props.children - Form content sections
 */
function BaseForm({
    entityName,
    entityUrl,
    entityId,
    apiActions,
    formWidth = 768,
    enableDelete = true,
    enableAnchorNavigation = false,
    anchorItems = [],
    crudActions,
    selectors,
    onInitForm,
    onProcessFormData,
    onAfterSubmit,
    open,
    onClose,
    onAnchorClick,
    children,
    createSuccessMessage,
    updateSuccessMessage,
    deleteSuccessMessage,
    getTitle,
    getDeleteConfirmationText,
    ...props
}) {
    const [form] = Form.useForm();
    const containerRef = useRef(null);

    // Custom hooks for form functionality
    const {
        isLoading,
        entity,
        submitForm,
        deleteEntity,
    } = useFormCrud({
        entityUrl,
        entityId,
        apiActions,
        onAfterSubmit,
        onClose,
        onProcessFormData,
        form,
        createSuccessMessage,
        updateSuccessMessage,
        deleteSuccessMessage,
        isFormOpen: open
    });

    const {
        setOriginalFormValues,
        isConfirmationModalOpen,
        setIsConfirmationModalOpen,
        checkForChanges,
        handleSave,
        handleDiscard,
        handleCancel
    } = useFormState(form, onClose, submitForm);

    const { formTitle } = useFormLifecycle({
        entity,
        entityId,
        isFormOpen: open,
        onInitForm,
        form,
        getTitle,
        setOriginalFormValues
    });

    // Handlers
    const handleDrawerSubmit = () => {
        form.submit();
    };

    const closeForm = () => {
        const hasChanged = checkForChanges();
        hasChanged ? setIsConfirmationModalOpen(true) : onClose();
    };

    const getContainer = () => containerRef.current;

    // CSS classes
    const formClass = `${entityName}-form`;
    const layoutClass = enableAnchorNavigation ? 'base-form--with-sidebar' : 'base-form--simple';
    const bodyContainerClass = cx('base-form', formClass, layoutClass);

    // Header classes - base + entity-specific
    const headerClass = cx('base-form-header', `${formClass}-header`);
    const headerTitleClass = cx('base-form-header__title', `${formClass}-header__title`);
    const headerControlsClass = cx('base-form-header__controls', `${formClass}-header__controls`);
    const headerThrobberClass = cx('base-form-header__throbber', `${formClass}-header__throbber`);

    // Body classes - base + entity-specific  
    const bodyClass = cx('base-form__body', `${formClass}__body`);
    const sidebarClass = cx('base-form__sidebar', `${formClass}__sidebar`);

    return (
        <>
            <Form
                name={entityName}
                form={form}
                preserve={true}
                colon={false}
                onFinish={submitForm}
                disabled={isLoading}
                {...props}
            >
                <CustomDrawer
                    open={open}
                    onClose={closeForm}
                    width={formWidth}
                >
                    <ScrollableView ref={containerRef}>
                        <ScrollableView.Header className={headerClass}>
                            <FormHeader
                                title={formTitle}
                                isLoading={isLoading}
                                enableDelete={enableDelete && entityId}
                                entity={entity}
                                onSubmit={handleDrawerSubmit}
                                onDelete={deleteEntity}
                                onClose={closeForm}
                                headerTitleClass={headerTitleClass}
                                headerControlsClass={headerControlsClass}
                                headerThrobberClass={headerThrobberClass}
                                getDeleteConfirmationText={getDeleteConfirmationText}
                            />
                        </ScrollableView.Header>

                        <ScrollableView.Body className={bodyContainerClass}>
                            {enableAnchorNavigation && (
                                <div className={sidebarClass}>
                                    <AnchorNavigation
                                        anchorItems={anchorItems}
                                        getContainer={getContainer}
                                        onAnchorClick={onAnchorClick}
                                    />
                                </div>
                            )}

                            <div className={bodyClass}>
                                {Children.map(children, child => cloneElement(child, { form }))}
                            </div>
                        </ScrollableView.Body>
                    </ScrollableView>
                </CustomDrawer>
            </Form>

            <UnsavedChangesModal
                open={isConfirmationModalOpen}
                onSaveChanges={handleSave}
                onDiscardChanges={handleDiscard}
                onCloseModal={handleCancel}
            />
        </>
    );
}

export default BaseForm; 
