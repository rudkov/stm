import { Anchor } from 'antd';

/**
 * Anchor navigation component for forms with multiple sections
 */
function AnchorNavigation({
    anchorItems,
    getContainer,
    onAnchorClick
}) {
    if (!anchorItems || anchorItems.length === 0) {
        return null;
    }

    const handleAnchorClick = (e, link) => {
        e.preventDefault();

        const container = getContainer();
        if (container) {
            container.querySelectorAll('.nested-section').forEach(el => {
                el.classList.remove('highlighted');
            });

            if (link) {
                const targetId = link.href.replace('#', '');
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.classList.add('highlighted');
                }
            }
        }

        if (onAnchorClick) {
            onAnchorClick(e, link);
        }
    };

    return (
        <Anchor
            getContainer={getContainer}
            items={anchorItems}
            offsetTop={12}
            affix={true}
            onClick={handleAnchorClick}
        />
    );
}

export default AnchorNavigation; 