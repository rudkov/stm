import { Form } from 'antd';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useNotification } from 'components/notifications/NotificationProvider';
import { transformValidationErrors } from 'helpers/form-utils';

export function BaseForm({ result, children, navigateOnSuccess, successNotification, ...formProps }) {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const showNotification = useNotification();

    if (result === undefined || result === null) {
        throw new Error('BaseForm: "result" prop is required and must be provided');
    }

    useEffect(() => {
        if (result?.error?.status === 422 && result?.error?.data?.errors) {
            // Handle 422 validation errors
            form.setFields(transformValidationErrors(result.error.data.errors));
        } else if (result?.error) {
            showNotification({ type: 'ERROR', message: 'Something went wrong. Please try again.' });
        }
    }, [result?.error, form, showNotification]);

    useEffect(() => {
        if (result?.isSuccess) {
            // Show success notification if provided
            if (successNotification) {
                showNotification({ 
                    type: 'SUCCESS', 
                    message: successNotification
                });
            }
            
            // Navigate if specified
            if (navigateOnSuccess) {
                // Handle array format: [path, options?]
                if (Array.isArray(navigateOnSuccess)) {
                    const [to, options] = navigateOnSuccess;
                    navigate(to, options);
                } else {
                    // Fallback for string format for backward compatibility
                    navigate(navigateOnSuccess);
                }
            }
        }
    }, [result?.isSuccess, navigateOnSuccess, navigate, successNotification, showNotification]);

    const finalFormProps = {
        requiredMark: false,
        validateTrigger: 'onBlur',
        ...formProps
    };

    return (
        <Form form={form} {...finalFormProps}>
            {children}
        </Form>
    );
}

export default BaseForm;
