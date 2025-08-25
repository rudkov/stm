import { useNotification } from 'components/notifications/NotificationProvider';

const useCopyToClipboard = ({ valueToCopy, successMessage = 'Copied to clipboard' }) => {
    const showNotification = useNotification();

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(valueToCopy);
            showNotification({
                type: 'SUCCESS',
                message: successMessage
            });
            return true;
        } catch (err) {
            return false;
        }
    };

    return { copyToClipboard };
};

export default useCopyToClipboard;
