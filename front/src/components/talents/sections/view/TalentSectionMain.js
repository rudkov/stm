import './TalentSectionMain.css';

import { Avatar, Button } from "antd";

import TalentSectionCurrentLocation from './TalentSectionCurrentLocation';

function TalentSectionMain(props) {
    const talent = props.talent;

    return (
        <div className='talent-section-main'>
            <div className='talent-section-main__header'>
                <div>
                    <Avatar size={60}>{talent.full_name?.charAt(0)}</Avatar>
                </div>
                <div className='talent-section-main__header-content'>
                    <div className='talent-section-main__talent_name'>{talent.full_name}</div>
                    <div><TalentSectionCurrentLocation talent={talent} /></div>
                </div>
            </div>
            <div className='talent-section-main__controls'>
                <Button onClick={props.editAction}>Edit</Button>
            </div>
        </div>
    );
}

export default TalentSectionMain;
