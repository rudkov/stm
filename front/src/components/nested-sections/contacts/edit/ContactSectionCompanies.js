import { useGetCompaniesQuery } from 'api/companies/companiesApi';
import DynamicListSection from '../../primitives/DynamicListSection';

function ContactSectionCompanies(props) {
    const { data: fetchedCompanies = [] } = useGetCompaniesQuery();

    return (
        <DynamicListSection
            {...props}
            title='Companies'
            fieldName='companies'
            inputPlaceholder='Job title'
            selectPlaceholder='Company'
            inputPath={['job_title']}
            selectPath={['id']}
            selectAllowClear={false}
            addButtonLabel='Add Company'
            options={fetchedCompanies.map(i => ({ label: i.name, value: i.id }))}
            inputComponent='input'
            layout='vertical'
            uniqueSelect={true}
        />
    );
}

export default ContactSectionCompanies;
