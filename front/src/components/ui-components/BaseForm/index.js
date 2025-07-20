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