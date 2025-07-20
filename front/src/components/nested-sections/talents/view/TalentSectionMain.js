import './TalentSectionMain.css';

import { Avatar, Button } from "antd";

import TalentSectionLocation from './TalentSectionLocation';

function TalentSectionMain(props) {
    const talent = props.data;

    return (
        <div className='talent-section-main'>
            <div className='talent-section-main__header'>
                <div>
                    <Avatar size={60}>{talent.full_name?.charAt(0)}</Avatar>
                </div>
                <div className='talent-section-main__header-content'>
                    <div className='talent-section-main__talent_name'>{talent.full_name}</div>
                    <div><TalentSectionLocation talent={talent} /></div>
                </div>
            </div>
            <div className='talent-section-main__controls'>
                <Button onClick={() => props.editAction(talent.id)}>Edit</Button>
            </div>
        </div>
    );
}

export default TalentSectionMain;
