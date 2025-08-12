import NestedSection from '../../NestedSection';

function TalentSectionRelatives(props) {
    const talent = props.data;

    return (
        <NestedSection className={props.className}>
            <NestedSection.Header>Relatives</NestedSection.Header>
            <NestedSection.Body>
                <div className='nested-section__grid'>
                    {
                        talent.relatives?.map((relative) => {
                            return (
                                <div className='nested-section__cell' key={`talent.relative.` + relative.id}>
                                    <div>{relative.info}</div>
                                </div>
                            );
                        })
                    }
                </div>
            </NestedSection.Body>
        </NestedSection>
    );
}

export default TalentSectionRelatives;
