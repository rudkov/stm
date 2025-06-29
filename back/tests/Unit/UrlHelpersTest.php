<?php

namespace Tests\Unit;

use Tests\TestCase;

use function App\Helpers\sanitize_url_for_storage;
use function App\Helpers\sanitize_url_for_display;

class UrlHelpersTest extends TestCase
{
    /**
     * Test sanitize_url_for_storage function with various inputs
     */
    public function test_sanitize_url_for_storage_adds_https_when_missing()
    {
        // URLs without scheme should get https:// added
        $this->assertEquals('https://example.com', sanitize_url_for_storage('example.com'));
        $this->assertEquals('https://www.example.com', sanitize_url_for_storage('www.example.com'));
        $this->assertEquals('https://example.com/path', sanitize_url_for_storage('example.com/path'));
        $this->assertEquals('https://subdomain.example.com', sanitize_url_for_storage('subdomain.example.com'));
        $this->assertEquals('https://localhost:3000', sanitize_url_for_storage('localhost:3000'));
        $this->assertEquals('https://example.com:8080', sanitize_url_for_storage('example.com:8080'));
        $this->assertEquals('https://example.com/path/to/page', sanitize_url_for_storage('example.com/path/to/page'));
    }

    public function test_sanitize_url_for_storage_preserves_existing_http_schemes()
    {
        // URLs with http/https should remain unchanged
        $this->assertEquals('https://example.com', sanitize_url_for_storage('https://example.com'));
        $this->assertEquals('http://example.com', sanitize_url_for_storage('http://example.com'));
        $this->assertEquals('https://www.example.com/path', sanitize_url_for_storage('https://www.example.com/path'));
        $this->assertEquals('http://localhost:3000', sanitize_url_for_storage('http://localhost:3000'));
    }

    public function test_sanitize_url_for_storage_preserves_other_protocols()
    {
        // Other protocols should remain unchanged
        $this->assertEquals('ftp://example.com', sanitize_url_for_storage('ftp://example.com'));
        $this->assertEquals('ssh://user@example.com', sanitize_url_for_storage('ssh://user@example.com'));
        $this->assertEquals('file:///path/to/file', sanitize_url_for_storage('file:///path/to/file'));
        $this->assertEquals('custom-protocol://example.com', sanitize_url_for_storage('custom-protocol://example.com'));
    }

    public function test_sanitize_url_for_storage_preserves_special_schemes()
    {
        // Special single-colon schemes should remain unchanged
        $this->assertEquals('mailto:test@example.com', sanitize_url_for_storage('mailto:test@example.com'));
        $this->assertEquals('tel:+1234567890', sanitize_url_for_storage('tel:+1234567890'));
        $this->assertEquals('sms:+1234567890', sanitize_url_for_storage('sms:+1234567890'));
        $this->assertEquals('data:text/plain;base64,SGVsbG8=', sanitize_url_for_storage('data:text/plain;base64,SGVsbG8='));
        $this->assertEquals('javascript:alert("test")', sanitize_url_for_storage('javascript:alert("test")'));
        $this->assertEquals('about:blank', sanitize_url_for_storage('about:blank'));
    }

    public function test_sanitize_url_for_storage_handles_edge_cases()
    {
        // Empty and whitespace cases
        $this->assertEquals('', sanitize_url_for_storage(''));
        $this->assertEquals('', sanitize_url_for_storage('   '));
        $this->assertEquals('', sanitize_url_for_storage("\t\n\r"));
        
        // Trimming whitespace
        $this->assertEquals('https://example.com', sanitize_url_for_storage('  example.com  '));
        $this->assertEquals('https://example.com', sanitize_url_for_storage("\t example.com \n"));
    }

    /**
     * Test sanitize_url_for_display function with various inputs
     */
    public function test_sanitize_url_for_display_removes_protocols()
    {
        // Should remove both http and https protocols
        $this->assertEquals('example.com', sanitize_url_for_display('http://example.com'));
        $this->assertEquals('example.com', sanitize_url_for_display('https://example.com'));
        $this->assertEquals('example.com', sanitize_url_for_display('https://example.com/'));
    }

    public function test_sanitize_url_for_display_removes_www()
    {
        // Should remove www prefix from hostnames
        $this->assertEquals('example.com', sanitize_url_for_display('https://www.example.com'));
        $this->assertEquals('example.com/path', sanitize_url_for_display('https://www.example.com/path'));
        $this->assertEquals('api.example.com/v1', sanitize_url_for_display('https://www.api.example.com/v1'));
    }

    public function test_sanitize_url_for_display_preserves_paths()
    {
        // Should preserve paths while removing trailing slashes
        $this->assertEquals('example.com/path', sanitize_url_for_display('https://example.com/path'));
        $this->assertEquals('example.com/path', sanitize_url_for_display('https://example.com/path/'));
        $this->assertEquals('example.com/path/to/page', sanitize_url_for_display('https://example.com/path/to/page'));
    }

    public function test_sanitize_url_for_display_preserves_query_parameters()
    {
        // Should preserve query parameters
        $this->assertEquals('example.com/page?param=value', sanitize_url_for_display('https://example.com/page?param=value'));
        $this->assertEquals('site.com/page?param1=value1&param2=value2', sanitize_url_for_display('https://www.site.com/page?param1=value1&param2=value2'));
    }

    public function test_sanitize_url_for_display_preserves_fragments()
    {
        // Should preserve URL fragments
        $this->assertEquals('example.com/page#section', sanitize_url_for_display('https://example.com/page#section'));
        $this->assertEquals('example.com/page?param=value#section', sanitize_url_for_display('https://www.example.com/page?param=value#section'));
    }

    public function test_sanitize_url_for_display_preserves_ports()
    {
        // Should preserve port numbers
        $this->assertEquals('example.com:8080/path', sanitize_url_for_display('https://example.com:8080/path'));
        $this->assertEquals('localhost:3000', sanitize_url_for_display('https://localhost:3000'));
        $this->assertEquals('api.example.com:8443/v1', sanitize_url_for_display('https://www.api.example.com:8443/v1'));
        $this->assertEquals('example.com:443', sanitize_url_for_display('https://www.example.com:443'));
    }

    public function test_sanitize_url_for_display_handles_subdomains()
    {
        // Should preserve subdomains while removing www
        $this->assertEquals('subdomain.example.com', sanitize_url_for_display('https://subdomain.example.com'));
        $this->assertEquals('api.subdomain.example.com/v1', sanitize_url_for_display('https://www.api.subdomain.example.com/v1'));
        $this->assertEquals('mail.google.com', sanitize_url_for_display('https://mail.google.com'));
    }

    public function test_sanitize_url_for_display_handles_edge_cases()
    {
        // Empty and whitespace cases
        $this->assertEquals('', sanitize_url_for_display(''));
        $this->assertEquals('', sanitize_url_for_display('   '));
        $this->assertEquals('', sanitize_url_for_display("\t\n\r"));
        
        // Malformed URLs should return original
        $this->assertEquals('not-a-url', sanitize_url_for_display('not-a-url'));
        $this->assertEquals('just-text', sanitize_url_for_display('just-text'));
        
        // URLs without hosts should return original
        $this->assertEquals('file:///path/to/file', sanitize_url_for_display('file:///path/to/file'));
    }

    /**
     * Test comprehensive real-world scenarios
     */
    public function test_comprehensive_storage_scenarios()
    {
        $testCases = [
            // User might enter these variations
            'google.com' => 'https://google.com',
            'www.google.com' => 'https://www.google.com',
            'google.com/search?q=test' => 'https://google.com/search?q=test',
            'api.github.com/users' => 'https://api.github.com/users',
            'localhost:3000/dashboard' => 'https://localhost:3000/dashboard',
            '127.0.0.1:8080' => 'https://127.0.0.1:8080',
            
            // Already properly formatted
            'https://example.com' => 'https://example.com',
            'http://legacy-site.com' => 'http://legacy-site.com',
            
            // Special protocols
            'ftp://files.example.com' => 'ftp://files.example.com',
            'mailto:contact@example.com' => 'mailto:contact@example.com',
            'tel:+1-555-123-4567' => 'tel:+1-555-123-4567',
        ];

        foreach ($testCases as $input => $expected) {
            $this->assertEquals($expected, sanitize_url_for_storage($input), "Failed for input: {$input}");
        }
    }

    public function test_comprehensive_display_scenarios()
    {
        $testCases = [
            // Basic domain cleaning
            'https://www.google.com/' => 'google.com',
            'https://www.example.com/path/' => 'example.com/path',
            'https://www.site.com/page?param=value' => 'site.com/page?param=value',
            'https://subdomain.example.com/' => 'subdomain.example.com',
            'https://www.api.example.com/v1/' => 'api.example.com/v1',
            
            // Protocol variations
            'http://example.com' => 'example.com',
            'https://example.com' => 'example.com',
            'https://example.com/' => 'example.com',
            
            // Complex scenarios
            'https://example.com/path' => 'example.com/path',
            'https://example.com/page#section' => 'example.com/page#section',
            'https://example.com/page?param=value' => 'example.com/page?param=value',
            'https://example.com:8080/path' => 'example.com:8080/path',
            'https://www.example.com' => 'example.com',
            'https://subdomain.example.com' => 'subdomain.example.com',
        ];

        foreach ($testCases as $input => $expected) {
            $this->assertEquals($expected, sanitize_url_for_display($input), "Failed for input: {$input}");
        }
    }

    /**
     * Test the functions work together (round-trip scenarios)
     */
    public function test_storage_and_display_integration()
    {
        $userInputs = [
            'example.com',
            'www.example.com/path',
            'example.com:8080',
            'subdomain.example.com/api/v1?key=test',
        ];

        foreach ($userInputs as $input) {
            // Store the URL (adds https:// if needed)
            $stored = sanitize_url_for_storage($input);
            
            // Display the URL (removes protocol and www)
            $displayed = sanitize_url_for_display($stored);
            
            // The displayed version should be clean
            $this->assertStringNotContainsString('https://', $displayed);
            $this->assertStringNotContainsString('http://', $displayed);
            
            // If original had www, displayed should not
            if (str_starts_with($input, 'www.')) {
                $this->assertStringNotContainsString('www.', $displayed);
            }
        }
    }
} 