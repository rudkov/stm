import { renderParagraphs } from 'helpers/text';

const AddressesList = ({ addresses }) => {
    return addresses?.map((address) => {
        return (
            <div className='nested-section__cell-horizontal' key={`address.` + address.id}>
                <div className='text-light'>{address.type?.name}</div>
                <div>{renderParagraphs(address.info)}</div>
            </div>
        );
    });
};

export default AddressesList;
