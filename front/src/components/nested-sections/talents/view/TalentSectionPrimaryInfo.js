import '../../../../helpers/shared.css';

import NestedSection from '../../NestedSection';

function TalentSectionPrimaryInfo(props) {
    const talent = props.data;

    return (
        <NestedSection className={props.className}>
            <NestedSection.Header>Primary Info</NestedSection.Header>
            <NestedSection.Body>
                <div className='nested-section__grid'>
                    <div className='nested-section__cell-horizontal'>
                        <div className='text-light'>Legal name</div>
                        <div>{talent.legal_full_name}</div>
                    </div>
                    <div className='nested-section__cell-horizontal'>
                        <div className='text-light'>Birth date</div>
                        <div>
                            {talent.birth_date}
                            {
                                talent.birth_date
                                    ? <span className='text-light'><span className="text-separator">·</span>{talent.age} y.o.</span>
                                    : ''
                            }
                        </div>
                    </div>
                    <div className='nested-section__cell-horizontal'>
                        <div className='text-light'>Gender</div>
                        <div>{talent.gender?.name}</div>
                    </div>
                    <div className='nested-section__cell-horizontal'>
                        <div className='text-light'>Marital status</div>
                        <div>{talent.marital_status?.name}</div>
                    </div>
                    <div className='nested-section__cell-horizontal'>
                        <div className='text-light'>Lifestyle / fashion</div>
                        <div>{talent.is_lifestyle}</div>
                    </div>
                    <div className='nested-section__cell-horizontal'>
                        <div className='text-light'>Mother agency</div>
                        <div>{talent.mother_agency?.name}</div>
                    </div>
                    <div className='nested-section__cell-horizontal'>
                        <div className='text-light'>Board</div>
                        <div>{talent.board?.name}</div>
                    </div>
                    <div className='nested-section__cell-horizontal'>
                        <div className='text-light'>Manager</div>
                        <div>{talent.manager?.name}</div>
                    </div>
                </div>
            </NestedSection.Body>
        </NestedSection>
    );
}

export default TalentSectionPrimaryInfo;