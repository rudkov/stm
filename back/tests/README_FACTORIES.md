# 🏭 Factory Usage Guide for Tests

This guide demonstrates how to effectively use the newly created factories for morphable relationships in your tests.

## 📋 Available Factories

### **Morphable Relationship Factories**
- ✅ `AddressFactory` - For address records (morphable)
- ✅ `EmailFactory` - For email records (morphable)  
- ✅ `PhoneFactory` - For phone records (morphable)
- ✅ `MessengerFactory` - For messenger records (morphable)
- ✅ `SocialMediaFactory` - For social media records (morphable)

### **Supporting Factories**
- ✅ `TalentRelativeTypeFactory` - For talent relative types
- ✅ `SocialMediaTypeFactory` - For social media types

## 🎯 Basic Usage Examples

### **Creating Individual Records**

```php
// Create a standalone email
$email = Email::factory()->create([
    'emailable_id' => $talent->id,
    'emailable_type' => 'talent',
    'communication_type_id' => $communicationType->id,
]);

// Create multiple phones for a contact
$phones = Phone::factory()->count(3)->create([
    'phoneable_id' => $contact->id,
    'phoneable_type' => 'contact',
    'communication_type_id' => $phoneType->id,
]);

// Generate data without persisting (for request payloads)
$addressData = Address::factory()->make(['communication_type_id' => $addressType->id])->toArray();
```

### **Creating Complete Contact Information**

```php
public function test_talent_with_complete_contact_info()
{
    $talent = Talent::factory()->create(['team_id' => $this->team->id]);
    
    // Create all types of contact information
    $addresses = Address::factory()->count(2)->create([
        'addressable_id' => $talent->id,
        'addressable_type' => 'talent',
    ]);
    
    $emails = Email::factory()->count(3)->create([
        'emailable_id' => $talent->id,
        'emailable_type' => 'talent',
    ]);
    
    $phones = Phone::factory()->count(2)->create([
        'phoneable_id' => $talent->id,
        'phoneable_type' => 'talent',
    ]);
    
    // Test your business logic here
    $this->assertEquals(2, $talent->addresses()->count());
    $this->assertEquals(3, $talent->emails()->count());
    $this->assertEquals(2, $talent->phones()->count());
}
```

## 🚀 Advanced Usage Patterns

### **Using Factories for Request Data**

Instead of manually creating request arrays, use factories to generate realistic data:

```php
// ❌ OLD WAY - Manual data creation
$requestData = [
    'emails' => [
        [
            'communication_type_id' => $emailType->id,
            'info' => 'test@example.com'
        ]
    ],
    'phones' => [
        [
            'communication_type_id' => $phoneType->id,
            'info' => '+1234567890'
        ]
    ]
];

// ✅ NEW WAY - Using factories
$emailData = Email::factory()->make(['communication_type_id' => $emailType->id])->only(['communication_type_id', 'info']);
$phoneData = Phone::factory()->make(['communication_type_id' => $phoneType->id])->only(['communication_type_id', 'info']);

$requestData = [
    'emails' => [$emailData],
    'phones' => [$phoneData]
];
```

### **Testing Different Morphable Types**

```php
public function test_email_can_belong_to_different_models()
{
    $talent = Talent::factory()->create(['team_id' => $this->team->id]);
    $contact = Contact::factory()->create(['team_id' => $this->team->id]);
    
    // Create emails for both talent and contact
    $talentEmail = Email::factory()->create([
        'emailable_id' => $talent->id,
        'emailable_type' => 'talent',
    ]);
    
    $contactEmail = Email::factory()->create([
        'emailable_id' => $contact->id,
        'emailable_type' => 'contact',
    ]);
    
    // Test polymorphic relationships work correctly
    $this->assertEquals('talent', $talentEmail->emailable_type);
    $this->assertEquals('contact', $contactEmail->emailable_type);
    $this->assertEquals($talent->id, $talentEmail->emailable_id);
    $this->assertEquals($contact->id, $contactEmail->emailable_id);
}
```

### **Integration Testing with Multiple Models**

```php
public function test_complex_relationship_scenario()
{
    // Use the helper class for complex scenarios
    $scenario = FactoryTestHelper::createIntegrationTestScenario($this->team, $this->user->id);
    
    $this->assertCount(3, $scenario['talents']);
    $this->assertCount(2, $scenario['contacts']);
    $this->assertGreaterThan(0, $scenario['total_emails']);
    $this->assertGreaterThan(0, $scenario['total_phones']);
    
    // Test complex business logic across multiple models
}
```

## 📝 Best Practices

### **1. Use Factories for Realistic Data**
```php
// ✅ GOOD - Realistic data from factories
$phone = Phone::factory()->create([
    'phoneable_id' => $contact->id,
    'phoneable_type' => 'contact',
]);
// Phone will have realistic phone number from Faker

// ❌ AVOID - Hardcoded unrealistic data
$phone = Phone::create([
    'phoneable_id' => $contact->id,
    'phoneable_type' => 'contact',
    'info' => '+1234567890' // Always the same
]);
```

### **2. Combine Factories with Specific Overrides**
```php
// Create realistic base data, override specific fields for testing
$email = Email::factory()->create([
    'emailable_id' => $talent->id,
    'emailable_type' => 'talent',
    'communication_type_id' => $specificType->id, // Override for test
    // 'info' will be realistic email from factory
]);
```

### **3. Use `make()` for Request Data**
```php
// Generate data without persisting to database
$requestData = [
    'emails' => [
        Email::factory()->make(['communication_type_id' => $emailType->id])->only(['communication_type_id', 'info'])
    ],
    'phones' => [
        Phone::factory()->make(['communication_type_id' => $phoneType->id])->only(['communication_type_id', 'info'])
    ]
];
```

### **4. Leverage the Helper Class**
```php
// Use the helper for common scenarios
use Tests\Helpers\FactoryTestHelper;

public function test_something_complex()
{
    $talent = FactoryTestHelper::createTalentWithCompleteContactInfo($this->team, $this->user->id);
    
    // Talent now has realistic addresses, emails, phones, messengers, and social media
    $this->assertGreaterThan(0, $talent->emails()->count());
}
```

## 🔄 Migration from Old Tests

### **Before (Manual Creation)**
```php
// Old way - lots of boilerplate
$contact->emails()->create([
    'communication_type_id' => $emailType->id,
    'info' => 'test@example.com'
]);

$contact->phones()->create([
    'communication_type_id' => $phoneType->id,
    'info' => '+1234567890'
]);
```

### **After (Using Factories)**
```php
// New way - cleaner and more realistic
Email::factory()->create([
    'emailable_id' => $contact->id,
    'emailable_type' => 'contact',
    'communication_type_id' => $emailType->id,
]);

Phone::factory()->create([
    'phoneable_id' => $contact->id,
    'phoneable_type' => 'contact',
    'communication_type_id' => $phoneType->id,
]);
```

## 🎯 Relationship Mapping Reference

| Model | Morphable Field | Polymorphic Type | Used In |
|-------|----------------|------------------|---------|
| Address | `addressable_*` | `addressable_type` | Talents |
| Email | `emailable_*` | `emailable_type` | Talents, Contacts |
| Phone | `phoneable_*` | `phoneable_type` | Talents, Contacts |
| Messenger | `messengerable_*` | `messengerable_type` | Talents, Contacts |
| SocialMedia | `social_mediaable_*` | `social_mediaable_type` | Talents |

## 🧪 Helper Methods Available

The `FactoryTestHelper` class provides:

- `createTalentWithCompleteContactInfo()` - Creates talent with all relationship types
- `createContactWithContactInfo()` - Creates contact with relevant relationships  
- `generateTalentRequestData()` - Generates request data for talent creation
- `generateContactRequestData()` - Generates request data for contact creation
- `createIntegrationTestScenario()` - Creates complex multi-model scenarios

## ✅ Benefits of Using These Factories

1. **Consistency** - Same realistic data patterns across all tests
2. **Maintainability** - Change factory once, affects all tests
3. **Realism** - Faker generates realistic test data
4. **Speed** - Less boilerplate code in tests
5. **Flexibility** - Easy to override specific fields when needed
6. **Relationships** - Proper polymorphic relationship testing

Start using these factories in your tests for cleaner, more maintainable, and more realistic test scenarios! 