<?php

namespace App\Helpers;

/**
 * Sanitize URL by adding https:// prefix if no valid scheme is present
 * 
 * @param string $url
 * @return string
 * 
 * Input: "example.com"              →   Output: "https://example.com"
 * Input: "localhost:3000"           →   Output: "https://localhost:3000"
 * Input: "https://example.com"      →   Output: "https://example.com"
 * Input: "ftp://example.com"        →   Output: "ftp://example.com"
 * Input: "mailto:test@example.com"  →   Output: "mailto:test@example.com"
 * 
 */
function sanitize_url_for_storage(string $url): string
{
    $url = trim($url);

    if (empty($url)) {
        return '';
    }

    // Check if URL already has a valid protocol scheme
    // Most schemes are followed by :// or are well-known single-colon schemes like mailto:, tel:
    if (
        preg_match('/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//', $url) ||
        preg_match('/^(mailto|tel|sms|data|javascript|about):/i', $url)
    ) {
        return $url; // Already has a scheme, leave it as-is
    }

    // No scheme detected, add https://
    return 'https://' . $url;
}

/**
 * Remove protocol prefix, www, and trailing slash from URL for display
 * 
 * @param string $url
 * @return string
 * 
 * Input: "http://example.com"                     →   Output: "example.com"
 * Input: "https://example.com"                    →   Output: "example.com"
 * Input: "https://example.com/"                   →   Output: "example.com"
 * Input: "https://example.com/path"               →   Output: "example.com/path"
 * Input: "https://example.com/page#section"       →   Output: "example.com/page#section"
 * Input: "https://example.com/page?param=value"   →   Output: "example.com/page?param=value"
 * Input: "https://example.com:8080/path"          →   Output: "example.com:8080/path"
 * Input: "https://www.example.com"                →   Output: "example.com"
 * Input: "https://subdomain.example.com"          →   Output: "subdomain.example.com"
 * 
 */
function sanitize_url_for_display(string $url): string
{
    $url = trim($url);

    if (empty($url)) {
        return '';
    }

    // Parse the URL
    $parsedUrl = parse_url($url);

    if (!$parsedUrl || !isset($parsedUrl['host'])) {
        return $url; // Return original if parsing fails
    }

    // Remove 'www.' from host if present
    $host = preg_replace('/^www\./', '', $parsedUrl['host']);

    // Add port if present
    if (isset($parsedUrl['port'])) {
        $host .= ':' . $parsedUrl['port'];
    }

    // Start building the display URL with the cleaned host
    $displayUrl = $host;

    // Add path if present, removing trailing slash
    if (isset($parsedUrl['path']) && $parsedUrl['path'] !== '/') {
        $displayUrl .= rtrim($parsedUrl['path'], '/');
    }

    // Add query string if present
    if (isset($parsedUrl['query'])) {
        $displayUrl .= '?' . $parsedUrl['query'];
    }

    // Add fragment if present
    if (isset($parsedUrl['fragment'])) {
        $displayUrl .= '#' . $parsedUrl['fragment'];
    }

    return $displayUrl;
}
