import NestedSection from '../../NestedSection';

function TalentSectionRelatives(props) {
    const talent = props.talent;

    return (
        <NestedSection className={props.className}>
            <NestedSection.Header>Relatives</NestedSection.Header>
            <NestedSection.Body>
                <div className='nested-section__grid'>
                    {
                        talent.relatives?.map((relative) => {
                            return (
                                <div className='nested-section__cell-horizontal' key={`talent.relative.` + relative.id}>
                                    <div className='text-light'>{relative.type?.name}</div>
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
