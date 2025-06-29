<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Weblink;

class WeblinkTest extends TestCase
{
    /**
     * Test Weblink model mutator automatically sanitizes URLs
     */
    public function test_info_mutator_sanitizes_urls_automatically()
    {
        $testCases = [
            'example.com' => 'https://example.com',
            'www.github.com/user/repo' => 'https://www.github.com/user/repo',
            'localhost:3000' => 'https://localhost:3000',
            'api.example.com:8080/v1' => 'https://api.example.com:8080/v1',
            'example.com/path/to/page?param=value#section' => 'https://example.com/path/to/page?param=value#section',
            'https://already-complete.com' => 'https://already-complete.com',
            'http://legacy-site.com' => 'http://legacy-site.com',
            'ftp://files.example.com' => 'ftp://files.example.com',
            'mailto:test@example.com' => 'mailto:test@example.com',
            'tel:+1234567890' => 'tel:+1234567890',
        ];

        foreach ($testCases as $input => $expected) {
            $weblink = new Weblink();
            $weblink->info = $input;

            $this->assertEquals($expected, $weblink->info, "Failed for input: {$input}");
        }
    }

    /**
     * Test mutator works with mass assignment
     */
    public function test_info_mutator_works_with_mass_assignment()
    {
        $weblink = new Weblink([
            'info' => 'example.com/path',
            'weblinkable_id' => '123',
            'weblinkable_type' => 'contact',
        ]);

        $this->assertEquals('https://example.com/path', $weblink->info);
    }

    /**
     * Test fillable attributes
     */
    public function test_fillable_attributes()
    {
        $weblink = new Weblink();

        $expectedFillable = [
            'info',
            'weblinkable_id',
            'weblinkable_type',
        ];

        $this->assertEquals($expectedFillable, $weblink->getFillable());
    }

    /**
     * Test model doesn't have timestamps
     */
    public function test_model_has_no_timestamps()
    {
        $weblink = new Weblink();

        $this->assertFalse($weblink->timestamps);
    }

    /**
     * Test mutator handles edge cases properly
     */
    public function test_info_mutator_handles_edge_cases()
    {
        $weblink = new Weblink();

        // Test empty string (should remain empty)
        $weblink->info = '';
        $this->assertEquals('', $weblink->info);

        // Test whitespace (should be trimmed and remain empty)
        $weblink->info = '   ';
        $this->assertEquals('', $weblink->info);

        // Test trimming whitespace around valid URL
        $weblink->info = '  example.com  ';
        $this->assertEquals('https://example.com', $weblink->info);
    }

    /**
     * Test mutator works with various protocols
     */
    public function test_info_mutator_preserves_existing_protocols()
    {
        $protocolTests = [
            'https://secure.com' => 'https://secure.com',
            'http://legacy.com' => 'http://legacy.com',
            'ftp://files.server.com' => 'ftp://files.server.com',
            'ssh://git@github.com' => 'ssh://git@github.com',
            'mailto:hello@world.com' => 'mailto:hello@world.com',
            'tel:+1234567890' => 'tel:+1234567890',
            'sms:+0987654321' => 'sms:+0987654321',
        ];

        foreach ($protocolTests as $input => $expected) {
            $weblink = new Weblink();
            $weblink->info = $input;

            $this->assertEquals($expected, $weblink->info, "Failed to preserve protocol for: {$input}");
        }
    }

    /**
     * Test mutator works when creating model instance
     */
    public function test_info_mutator_works_with_model_instantiation()
    {
        // Test different ways of setting the info attribute
        $weblink1 = new Weblink();
        $weblink1->info = 'example.com';

        $weblink2 = new Weblink(['info' => 'github.com/user']);

        $weblink3 = new Weblink();
        $weblink3->setAttribute('info', 'api.service.com:8080');

        $this->assertEquals('https://example.com', $weblink1->info);
        $this->assertEquals('https://github.com/user', $weblink2->info);
        $this->assertEquals('https://api.service.com:8080', $weblink3->info);
    }

    /**
     * Test mutator behavior is consistent
     */
    public function test_info_mutator_consistency()
    {
        $weblink = new Weblink();

        // Set the same value multiple times
        $weblink->info = 'example.com';
        $result1 = $weblink->info;

        $weblink->info = 'example.com';
        $result2 = $weblink->info;

        $this->assertEquals($result1, $result2);
        $this->assertEquals('https://example.com', $result1);
        $this->assertEquals('https://example.com', $result2);
    }
}
