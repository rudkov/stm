# BaseForm Reusable Component - Implementation Plan

## Problem Analysis

After analyzing `TalentForm.js` and `CompanyForm.js`, significant code duplication was identified:

### Common Patterns Found:
- Form state management (loading, original values, change detection)
- CRUD operations with Redux (create, update, delete, fetch)
- Unsaved changes confirmation modal
- Form header with title, controls, and loading indicator
- Notification handling after operations
- Navigation patterns after successful operations
- Data processing patterns (type.id structures, collection cleaning)

### Duplication Stats:
- ~70% of code is duplicated between forms
- Similar useEffect patterns for handling responses
- Identical modal confirmation logic
- Common form submission and validation patterns

## Implementation Plan

### 1. Core Reusable Component: `BaseForm`

**Location:** `front/src/components/ui-components/BaseForm/`

**Key Features:**
- Generic CRUD operations (create, read, update, delete)
- Form state management (loading, original values, change detection)
- Unsaved changes confirmation modal
- Common header with title, controls, and loading indicator
- Notification handling
- Navigation after operations

**Props Interface:**
```javascript
{
  // Entity configuration
  entityName: 'talent' | 'company' | 'contact',
  entityId: number | null,
  isNew: boolean,
  
  // Form configuration
  title: string,
  formWidth: number,
  enableDelete: boolean,
  enableAnchorNavigation: boolean,
  anchorItems: Array,
  
  // CRUD operations
  crudActions: {
    fetch: (id) => action,
    create: (values) => action,
    update: (id, values) => action,
    delete: (id) => action,
    resetResponse: (type) => action
  },
  
  // Redux selectors
  selectors: {
    entity: selector,
    createResponse: selector,
    updateResponse: selector,
    deleteResponse: selector
  },
  
  // Form lifecycle
  onInitForm: (values, form) => void,
  onProcessFormData: (values) => processedValues,
  onAfterSubmit: () => void,
  
  // UI props
  open: boolean,
  onClose: () => void,
  
  // Content
  children: ReactNode
}
```

### 2. Component Structure

The `BaseForm.js` component will be responsible for rendering the form layout and passing props to its children. A critical detail is that it must inject the Ant Design `form` instance into its children so that nested sections can interact with the form's state.

This will be accomplished using `React.Children.map` and `React.cloneElement`.

```javascript
// Inside BaseForm.js render method
{Children.map(children, child =>
  cloneElement(child, { form: form })
)}
```

```
front/src/components/ui-components/BaseForm/
├── BaseForm.js (main component)
├── BaseForm.css
├── hooks/
│   ├── useFormCrud.js
│   ├── useFormState.js
│   └── useFormLifecycle.js
├── components/
│   ├── FormHeader.js
│   ├── FormBody.js
│   ├── UnsavedChangesModal.js
│   └── AnchorNavigation.js
└── index.js
```

### 3. Index.js Content

```javascript
// front/src/components/ui-components/BaseForm/index.js

// Main component export (default)
export { default } from './BaseForm';

// Named exports for hooks (in case other components need them)
export { useFormCrud } from './hooks/useFormCrud';
export { useFormState } from './hooks/useFormState';
export { useFormLifecycle } from './hooks/useFormLifecycle';

// Named exports for sub-components (in case someone needs them standalone)
export { default as FormHeader } from './components/FormHeader';
export { default as UnsavedChangesModal } from './components/UnsavedChangesModal';
export { default as AnchorNavigation } from './components/AnchorNavigation';
```

### 4. Supporting Hooks

**`useFormCrud`** - Handle CRUD operations:
- All CRUD actions (`create`, `update`, `delete`) dispatched from this hook will use a standardized payload structure.
- For operations on existing entities, the ID will always be passed as `id`.
- Example Payloads:
  - `create({ values: { ... } })`
  - `update({ id: 123, values: { ... } })`
  - `delete({ id: 123 })`
- Manage loading states
- Handle API responses
- Trigger notifications
- Navigate after operations

**`useFormState`** - Manage form state:
- Track original vs current values
- Handle change detection
- Manage confirmation modal

**`useFormLifecycle`** - Handle form initialization:
- Fetch data when needed
- Initialize form fields
- Set form title

### 5. Migration Strategy

**Phase 1:** Create base components without breaking existing forms

**Phase 1.5:** Refactor Redux Stores
- **Goal:** Standardize Redux action payloads to use a consistent `id` key for entity identifiers.
- **`company.js` store:**
  - Modify `updateCompanyById` to expect `{ id, values }` instead of `{ companyId, values }`.
  - Modify `deleteCompanyById` to expect `{ id }` instead of `{ companyId }`.
- **`talent.js` store:**
  - Modify `updateTalentById` to expect `{ id, values }` instead of `{ talentId, values }`.
  - Modify `deleteTalentById` to expect `{ id }` instead of `{ talentId }`.
- **Note:** This is a one-time refactoring cost that enables a much simpler and more consistent `BaseForm` component.

**Phase 2:** Migrate `CompanyForm` to use `BaseForm`
**Phase 3:** Migrate `TalentForm` to use `BaseForm`
**Phase 4:** Create `ContactForm` using `BaseForm`

### 6. Configuration Objects

Create configuration objects for each entity type:

**`talentFormConfig.js`:**
```javascript
import {
  fetchTalentById, getTalent,
  createTalent, getCreateResponse,
  updateTalentById, getUpdateResponse,
  deleteTalentById, getDeleteResponse,
  talentActions
} from '../../store/talents/talent';

import {
    cleanCollection,
    initContactSection,
    initSocialMediaSection,
    processContactSection,
    processSocialMediaSection
} from '../../helpers/form-utils';
import { sanitizeWeblinkForStorage } from '../ui-components/Weblink';

export const talentFormConfig = {
  entityName: 'talent',
  enableDelete: true,
  enableAnchorNavigation: true,
  formWidth: 768,
  
  anchorItems: [
    { key: 'notes', href: '#notes', title: 'Notes' },
    { key: 'primary-info', href: '#primary-info', title: 'Primary Info' },
    { key: 'food-allergies', href: '#food-allergies', title: 'Food & Allergies' },
    { key: 'body', href: '#body', title: 'Body' },
    { key: 'contacts', href: '#contacts', title: 'Contacts' },
    { key: 'region-languages', href: '#region-languages', title: 'Region & Languages' },
    { key: 'preferences', href: '#preferences', title: 'Preferences' },
    { key: 'social-media', href: '#social-media', title: 'Social Media' },
    { key: 'addresses', href: '#addresses', title: 'Addresses' },
    { key: 'relatives', href: '#relatives', title: 'Relatives' },
    { key: 'biography', href: '#biography', title: 'Biography' },
    { key: 'achievements', href: '#achievements', title: 'Achievements' },
    { key: 'performance-skills', href: '#performance-skills', title: 'Performance Skills' },
  ],
  
  crudActions: {
    fetch: fetchTalentById,
    create: createTalent,
    update: updateTalentById,
    delete: deleteTalentById,
    resetResponse: talentActions.resetResponse
  },
  
  selectors: {
    entity: getTalent,
    createResponse: getCreateResponse,
    updateResponse: getUpdateResponse,
    deleteResponse: getDeleteResponse
  },
  
  onInitForm: (values, form) => {
    form.setFieldsValue({
        name: values.name || '',
        notes: values.notes || '',
        addresses: (values.addresses && values.addresses.length > 0)
            ? values.addresses
            : [{ type: { id: null }, info: '' }],
        ...initContactSection(values),
        ...initSocialMediaSection(values),
    });
  },
  
  onProcessFormData: (values) => {
    // Talent-specific data processing
    values.birth_date = values.birth_date ? values.birth_date.format('YYYY-MM-DD') : null;
    values.marital_status_id = values.marital_status_id ?? null;
    values.gender_id = values.gender_id ?? null;
    values.is_lifestyle = (values.is_lifestyle === 'Lifestyle') ? 1 : (values.is_lifestyle === 'Fashion') ? 0 : null;
    // ... other talent-specific transformations
    return values;
  }
};
```

**`companyFormConfig.js`:**
```javascript
import {
  fetchCompanyById, getCompany,
  createCompany, getCreateResponse,
  updateCompanyById, getUpdateResponse,
  deleteCompanyById, getDeleteResponse,
  companyActions
} from '../../store/companies/company';

import {
    cleanCollection,
    initContactSection,
    initSocialMediaSection,
    processContactSection,
    processSocialMediaSection
} from '../../helpers/form-utils';
import { sanitizeWeblinkForStorage } from '../ui-components/Weblink';

export const companyFormConfig = {
  entityName: 'company',
  enableDelete: true,
  enableAnchorNavigation: false,
  formWidth: 768,
  
  crudActions: {
    fetch: fetchCompanyById,
    create: createCompany,
    update: updateCompanyById,
    delete: deleteCompanyById,
    resetResponse: companyActions.resetResponse
  },
  
  selectors: {
    entity: getCompany,
    createResponse: getCreateResponse,
    updateResponse: getUpdateResponse,
    deleteResponse: getDeleteResponse
  },

  onInitForm: (values, form) => {
    form.setFieldsValue({
        name: values.name || '',
        notes: values.notes || '',
        addresses: (values.addresses && values.addresses.length > 0)
            ? values.addresses
            : [{ type: { id: null }, info: '' }],
        ...initContactSection(values),
        ...initSocialMediaSection(values),
    });
  },
  
  onProcessFormData: (values) => {
    // Company-specific data processing.
    // Use helpers from form-utils.js to keep this section clean.
    if (values.addresses) {
        values.addresses = values.addresses.map(address => ({
            ...address,
            type: { id: address.type.id ?? null }
        }));
    }

    if (values.weblinks) {
        values.weblinks = values.weblinks.map(weblink => ({
            ...weblink,
            info: sanitizeWeblinkForStorage(weblink.info)
        }));
    }

    values.addresses = cleanCollection(values.addresses, { requiredAny: ['info'] });
    values.weblinks = cleanCollection(values.weblinks, { requiredAny: ['info'] });

    return {
        ...values,
        ...processContactSection(values),
        ...processSocialMediaSection(values)
    };
  }
};
```

### 7. Key Abstractions

**Generic Data Processing:**
- Create a plugin system for entity-specific data transformations
- Handle common patterns like `type.id` structures and collection cleaning
- Support custom field processors

**Flexible Layout:**
- Support both simple form layout (CompanyForm style) and complex layout with sidebar (TalentForm style)
- Use `React.cloneElement` to pass props to children, avoiding render props for simplicity.

**CRUD Configuration:**
- Abstract Redux actions and selectors through configuration
- Standardize response handling patterns
- Support different navigation patterns after operations

### 8. Usage Examples After Implementation

**TalentForm.js:**
```javascript
import BaseForm from '../ui-components/BaseForm';
import { talentFormConfig } from './talentFormConfig';

function TalentForm(props) {
  const { isNewTalent, open: isFormOpen, closeForm: onClose, onAfterSubmit } = props;

  return (
    <BaseForm
      {...talentFormConfig}
      isNew={isNewTalent}
      open={isFormOpen}
      onClose={onClose}
      onAfterSubmit={onAfterSubmit}
    >
      <SharedSectionNotes id='notes' />
      <TalentSectionPrimaryInfo id='primary-info' />
      <TalentSectionFoodAllergies id='food-allergies' />
      <TalentSectionBody id='body' />
      <SharedSectionContacts id='contacts' />
      <TalentSectionRegionLanguages id='region-languages' />
      <TalentSectionPreferences id='preferences' />
      <SharedSectionSocialMedia id='social-media' />
      <SharedSectionAddresses id='addresses' />
      <TalentSectionRelatives id='relatives' />
      <TalentSectionBiography id='biography' />
      <TalentSectionAchievements id='achievements' />
      <TalentSectionPerformanceSkills id='performance-skills' />
    </BaseForm>
  );
}
```

**CompanyForm.js:**
```javascript
import BaseForm from '../ui-components/BaseForm';
import { companyFormConfig } from './companyFormConfig';

function CompanyForm(props) {
  const { isNewCompany, open: isFormOpen, closeForm: onClose, onAfterSubmit } = props;

  return (
    <BaseForm
      {...companyFormConfig}
      isNew={isNewCompany}
      open={isFormOpen}
      onClose={onClose}
      onAfterSubmit={onAfterSubmit}
    >
      <SharedSectionNotes id='notes' />
      <SharedSectionContacts id='contacts' />
      <SharedSectionSocialMedia id='social-media' />
      <SharedSectionAddresses id='addresses' />
    </BaseForm>
  );
}
```

### 9. Benefits of This Approach

1. **DRY Principle:** Eliminate ~70% of duplicated code
2. **Consistency:** Ensure all forms behave similarly
3. **Maintainability:** Bug fixes and improvements apply to all forms
4. **Scalability:** Easy to create new forms (ContactForm, EventForm, etc.)
5. **Type Safety:** Centralized TypeScript interfaces (if/when TypeScript is added)
6. **Testing:** Test common functionality once
7. **Code Organization:** Follows existing codebase patterns with ui-components directory

### 10. Implementation Checklist

#### Phase 1: Create Base Components
- [ ] Create `BaseForm` directory structure
- [ ] Implement `useFormCrud` hook
- [ ] Implement `useFormState` hook  
- [ ] Implement `useFormLifecycle` hook
- [ ] Create `FormHeader` component
- [ ] Create `UnsavedChangesModal` component
- [ ] Create `AnchorNavigation` component
- [ ] Implement main `BaseForm` component
- [ ] Create `index.js` with proper exports

#### Phase 2: Configuration Setup
- [ ] Create `companyFormConfig.js`
- [ ] Create `talentFormConfig.js`
- [ ] Test configurations work with BaseForm

#### Phase 3: Migration
- [ ] Migrate `CompanyForm` to use `BaseForm`
- [ ] Test CompanyForm functionality
- [ ] Migrate `TalentForm` to use `BaseForm`
- [ ] Test TalentForm functionality
- [ ] Remove old form code

#### Phase 4: New Forms
- [ ] Create `ContactForm` using `BaseForm`
- [ ] Create `contactFormConfig.js`
- [ ] Test ContactForm functionality

#### Phase 5: Polish
- [ ] Add comprehensive tests for BaseForm
- [ ] Update documentation
- [ ] Code review and optimization

## 11. Code Style and Best Practices

- **Conditional Class Names:** Use a simple `classnames` utility function to keep the JSX clean when constructing conditional CSS classes.

  ```javascript
  // e.g. in BaseForm.js
  const cx = (...args) => args.filter(Boolean).join(' ');
  const headerClass = cx('base-form-header', `${formClass}-header`);
  ```

- **Data Transformations:** Encapsulate complex data transformation logic within helper functions in `front/src/helpers/form-utils.js`. The `onInitForm` and `onProcessFormData` functions in the configuration objects should primarily compose these helpers.

## Notes

- This artifact serves as the complete implementation reference
- Each phase should be completed and tested before moving to the next
- The configuration approach allows for maximum flexibility while maintaining consistency
- The ui-components location follows existing codebase patterns 