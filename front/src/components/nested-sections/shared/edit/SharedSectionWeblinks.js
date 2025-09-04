import DynamicListSection from '../../primitives/DynamicListSection';

function SharedSectionWeblinks(props) {
    return (
        <DynamicListSection
            {...props}
            title='Websites'
            fieldName='weblinks'
            inputPlaceholder='Website URL'
            inputPath={['info']}
            addButtonLabel='Add Website'
        />
    );
}

export default SharedSectionWeblinks;
