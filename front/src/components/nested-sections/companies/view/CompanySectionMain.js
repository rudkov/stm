import './CompanySectionMain.css';

import { Button } from 'antd';

function CompanySectionMain(props) {
    const company = props.data;

    return (
        <div className='company-section-main'>
            <div className='company-section-main__header'>
                <div className='company-section-main__company_name'>{company.name}</div>
                <div className='company-section-main__company_categories'>Category 1, Category 2, Category 3</div>
            </div>
            {props.editAction && (
                <div className='company-section-main__controls'>
                    <Button onClick={props.editAction}>Edit</Button>
                </div>
            )}
        </div>
    );
}

export default CompanySectionMain;
