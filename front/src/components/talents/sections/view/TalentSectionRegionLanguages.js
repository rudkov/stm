import NestedSection from '../../../ui-components/NestedSection';

import { Flag } from '../../../ui-components/Flag';

function TalentSectionRegionLanguages(props) {
    const talent = props.talent;

    return (
        <NestedSection className={props.className}>
            <NestedSection.Header>Region & Languages</NestedSection.Header>
            <NestedSection.Body>
                <div className='nested-section__grid'>
                    <div className='nested-section__cell'>
                        <div className='text-light'>Citizenships</div>
                        <div className='nested-section__column'>
                            {
                                talent.citizenships?.map((citizenship) => {
                                    return (
                                        <div className='nested-section__item_with_icon ellipsis' key={`talent.citizenship.` + citizenship.alpha_2}>
                                            <div className='nested-section__icon'>{<Flag country={citizenship.alpha_2} />}</div>
                                            <div className='ellipsis'>{citizenship.name}</div>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    </div>
                    <div className='nested-section__cell'>
                        <div className='text-light'>Languages</div>
                        <div className='nested-section__column'>
                            {
                                talent.languages?.map((language) => {
                                    return (
                                        <div key={`talent.language.` + language.id}>
                                            {language.name}
                                        </div>
                                    );
                                })
                            }
                        </div>
                    </div>
                    <div className='nested-section__cell'>
                        <div className='text-light'>Accent</div>
                        <div>
                            {
                                talent.is_accent === 1
                                    ? 'Yes'
                                    : talent.is_accent === 0
                                        ? 'No'
                                        : ''
                            }
                        </div>
                    </div>
                </div>
            </NestedSection.Body>
        </NestedSection>
    );
}

export default TalentSectionRegionLanguages;
