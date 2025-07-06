import React from 'react';

/**
 * Sanitizes a weblink for backend storage by adding protocol if missing
 */
export const sanitizeWeblinkForStorage = (url) => {
    // Handle empty or invalid input
    if (!url || typeof url !== 'string') {
        return url;
    }

    // Trim whitespace
    const trimmedUrl = url.trim();

    // Return empty string if still empty after trimming
    if (trimmedUrl === '') {
        return trimmedUrl;
    }

    // Check if URL already has any protocol
    if (trimmedUrl.includes('://')) {
        return trimmedUrl;
    }
    return 'https://' + trimmedUrl;
};

/**
 * Formats a weblink for display by removing protocol and www subdomain
 */
const formatWeblinkForDisplay = (url) => {
    // Handle empty or invalid input
    if (!url || typeof url !== 'string') {
        return url;
    }

    // Trim whitespace
    const trimmedUrl = url.trim();

    // Return empty string if still empty after trimming
    if (trimmedUrl === '') {
        return trimmedUrl;
    }

    let result = trimmedUrl;

    // Remove http:// or https:// protocols
    if (result.startsWith('https://')) {
        result = result.substring(8); // Remove 'https://'
    } else if (result.startsWith('http://')) {
        result = result.substring(7); // Remove 'http://'
    }

    // Remove www. subdomain if present
    if (result.startsWith('www.')) {
        result = result.substring(4); // Remove 'www.'
    }

    return result;
};

const Weblink = ({ url, className, target = '_blank', rel = 'noreferrer', ...props }) => {
    if (!url) {
        return null;
    }

    const displayText = formatWeblinkForDisplay(url);

    return (
        <a
            href={url}
            target={target}
            rel={rel}
            className={className}
            {...props}
        >
            {displayText}
        </a>
    );
};

export default Weblink;
