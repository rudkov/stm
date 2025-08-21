import CheckboxFilter from '../CheckboxFilter';

function ManagersFilter({ data, ...props }) {
    return (
        <CheckboxFilter
            title='Manager'
            uniqueName={props.uniqueName}
            selectedItems={props.selectedItems}
            setFiltered={props.setFiltered}
            data={data}
        />
    );
}

export default ManagersFilter;
