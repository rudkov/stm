import './TalentSectionPreferences.css';

import NestedSection from '../../../ui-components/NestedSection';

import { YesNoIcons } from '../../../ui-components/Icons';

function TalentSectionPreferences(props) {
    const talent = props.talent;

    return (
        <NestedSection className={props.className}>
            <NestedSection.Header>Preferences</NestedSection.Header>
            <NestedSection.Body>
                <div className='talent-section-preferences__grid'>
                    <div className='nested-section__item_with_icon ellipsis'>
                        {
                            talent.is_faithbased_ads !== null
                                ? <>
                                    <div className='nested-section__icon'>{YesNoIcons[talent.is_faithbased_ads]}</div>
                                    <div className='ellipsis'>Faithbased ads</div>
                                </>
                                : <div className='ellipsis text-light'>Faithbased ads</div>
                        }

                    </div>
                    <div className='nested-section__item_with_icon ellipsis'>
                        {
                            talent.is_fur !== null
                                ? <>
                                    <div className='nested-section__icon'>{YesNoIcons[talent.is_fur]}</div>
                                    <div className='ellipsis'>Fur</div>
                                </>
                                : <div className='ellipsis text-light'>Fur</div>
                        }

                    </div>
                    <div className='nested-section__item_with_icon ellipsis'>
                        {
                            talent.is_gambling_ads !== null
                                ? <>
                                    <div className='nested-section__icon'>{YesNoIcons[talent.is_gambling_ads]}</div>
                                    <div className='ellipsis'>Gambling ads</div>
                                </>
                                : <div className='ellipsis text-light'>Gambling ads</div>
                        }
                    </div>
                    <div className='nested-section__item_with_icon ellipsis'>
                        {
                            talent.is_lingerie !== null
                                ? <>
                                    <div className='nested-section__icon'>{YesNoIcons[talent.is_lingerie]}</div>
                                    <div className='ellipsis'>Lingerie</div>
                                </>
                                : <div className='ellipsis text-light'>Lingerie</div>
                        }
                    </div>
                    <div className='nested-section__item_with_icon ellipsis'>
                        {
                            talent.is_liquor_ads !== null
                                ? <>
                                    <div className='nested-section__icon'>{YesNoIcons[talent.is_liquor_ads]}</div>
                                    <div className='ellipsis'>Liquor ads</div>
                                </>
                                : <div className='ellipsis text-light'>Liquor ads</div>
                        }
                    </div>
                    <div className='nested-section__item_with_icon ellipsis'>
                        {
                            talent.is_nude !== null
                                ? <>
                                    <div className='nested-section__icon'>{YesNoIcons[talent.is_nude]}</div>
                                    <div className='ellipsis'>Nude</div>
                                </>
                                : <div className='ellipsis text-light'>Nude</div>
                        }
                    </div>
                    <div className='nested-section__item_with_icon ellipsis'>
                        {
                            talent.is_political_ads !== null
                                ? <>
                                    <div className='nested-section__icon'>{YesNoIcons[talent.is_political_ads]}</div>
                                    <div className='ellipsis'>Political ads</div>
                                </>
                                : <div className='ellipsis text-light'>Political ads</div>
                        }
                    </div>
                    <div className='nested-section__item_with_icon ellipsis'>
                        {
                            talent.is_smoking_ads !== null
                                ? <>
                                    <div className='nested-section__icon'>{YesNoIcons[talent.is_smoking_ads]}</div>
                                    <div className='ellipsis'>Smoking ads</div>
                                </>
                                : <div className='ellipsis text-light'>Smoking ads</div>
                        }
                    </div>
                    <div className='nested-section__item_with_icon ellipsis'>
                        {
                            talent.is_sports !== null
                                ? <>
                                    <div className='nested-section__icon'>{YesNoIcons[talent.is_sports]}</div>
                                    <div className='ellipsis'>Sports</div>
                                </>
                                : <div className='ellipsis text-light'>Sports</div>
                        }
                    </div>
                    <div className='nested-section__item_with_icon ellipsis'>
                        {
                            talent.is_swimwear !== null
                            ? <>
                            <div className='nested-section__icon'>{YesNoIcons[talent.is_swimwear]}</div>
                            <div className='ellipsis'>Swimwear</div>
                            </>
                            : <div className='ellipsis text-light'>Swimwear</div>
                        }
                    </div>
                    <div className='nested-section__item_with_icon ellipsis'>
                        {
                            talent.is_topless !== null
                            ? <>
                            <div className='nested-section__icon'>{YesNoIcons[talent.is_topless]}</div>
                            <div className='ellipsis'>Topless</div>
                            </>
                            : <div className='ellipsis text-light'>Topless</div>
                        }
                    </div>
                </div>
            </NestedSection.Body>
        </NestedSection>
    );
}

export default TalentSectionPreferences;
