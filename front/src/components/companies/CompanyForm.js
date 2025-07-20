import './CompanyForm.css';

import BaseForm from '../ui-components/BaseForm';
import { companyFormConfig } from '../../store/companies/companyFormConfig';

import SharedSectionAddresses from '../nested-sections/shared/edit/SharedSectionAddresses';
import SharedSectionContacts from '../nested-sections/shared/edit/SharedSectionContacts';
import SharedSectionNotes from '../nested-sections/shared/edit/SharedSectionNotes';
import SharedSectionSocialMedia from '../nested-sections/shared/edit/SharedSectionSocialMedia';

function CompanyForm(props) {
    const { isNewCompany, open: isFormOpen, closeForm: onClose, onAfterSubmit, companyId } = props;

    return (
        <BaseForm
            {...companyFormConfig}
            entityId={isNewCompany ? null : companyId}
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

export default CompanyForm;
