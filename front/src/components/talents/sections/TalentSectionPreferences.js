import './TalentSectionPreferences.css';

import NestedSection from '../../ui-components/NestedSection';

import { YesNoIcons } from '../../ui-components/Icons';

function TalentSectionPreferences(props) {
    const talent = props.talent;

    return (
        <NestedSection className={props.className}>
            <NestedSection.Header>Preferences</NestedSection.Header>
            <NestedSection.Body>
                <div className='talent-section-preferences__grid'>
                    <div className='nested-section__item_with_icon ellipsis'>
                        <div className='nested-section__icon'>{YesNoIcons[talent.is_faithbased_ads]}</div>
                        <div className='ellipsis'>Faithbased ads</div>
                    </div>
                    <div className='nested-section__item_with_icon ellipsis'>
                        <div className='nested-section__icon'>{YesNoIcons[talent.is_fur]}</div>
                        <div className='ellipsis'>Fur</div>
                    </div>
                    <div className='nested-section__item_with_icon ellipsis'>
                        <div className='nested-section__icon'>{YesNoIcons[talent.is_gambling_ads]}</div>
                        <div className='ellipsis'>Gambling ads</div>
                    </div>
                    <div className='nested-section__item_with_icon ellipsis'>
                        <div className='nested-section__icon'>{YesNoIcons[talent.is_lingerie]}</div>
                        <div className='ellipsis'>Lingerie</div>
                    </div>
                    <div className='nested-section__item_with_icon ellipsis'>
                        <div className='nested-section__icon'>{YesNoIcons[talent.is_liquor_ads]}</div>
                        <div className='ellipsis'>Liquor ads</div>
                    </div>
                    <div className='nested-section__item_with_icon ellipsis'>
                        <div className='nested-section__icon'>{YesNoIcons[talent.is_nude]}</div>
                        <div className='ellipsis'>Nude</div>
                    </div>
                    <div className='nested-section__item_with_icon ellipsis'>
                        <div className='nested-section__icon'>{YesNoIcons[talent.is_political_ads]}</div>
                        <div className='ellipsis'>Political ads</div>
                    </div>
                    <div className='nested-section__item_with_icon ellipsis'>
                        <div className='nested-section__icon'>{YesNoIcons[talent.is_smoking_ads]}</div>
                        <div className='ellipsis'>Smoking ads</div>
                    </div>
                    <div className='nested-section__item_with_icon ellipsis'>
                        <div className='nested-section__icon'>{YesNoIcons[talent.is_sports]}</div>
                        <div className='ellipsis'>Sports</div>
                    </div>
                    <div className='nested-section__item_with_icon ellipsis'>
                        <div className='nested-section__icon'>{YesNoIcons[talent.is_swimwear]}</div>
                        <div className='ellipsis'>Swimwear</div>
                    </div>
                    <div className='nested-section__item_with_icon ellipsis'>
                        <div className='nested-section__icon'>{YesNoIcons[talent.is_topless]}</div>
                        <div className='ellipsis'>Topless</div>
                    </div>
                </div>
            </NestedSection.Body>
        </NestedSection>
    );
}

export default TalentSectionPreferences;
