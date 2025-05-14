import NestedSection from '../../../ui-components/NestedSection';

function TalentSectionFoodAllergies(props) {
    const talent = props.talent;

    return (
        <NestedSection className={props.className}>
            <NestedSection.Header>Food & Allergies</NestedSection.Header>
            <NestedSection.Body>
                <div className='nested-section__grid'>
                    <div className='nested-section__cell'>
                        <div className='text-light'>Vegetarian</div>
                        <div>
                            {
                                talent.is_vegetarian === 1
                                    ? 'Yes'
                                    : talent.is_vegetarian === 0
                                        ? 'No'
                                        : ''
                            }
                        </div>
                    </div>
                    <div className='nested-section__cell'>
                        <div className='text-light'>Allergies</div>
                        <div>{talent.allergies}</div>
                    </div>
                </div>
            </NestedSection.Body>
        </NestedSection>
    );
}

export default TalentSectionFoodAllergies;
