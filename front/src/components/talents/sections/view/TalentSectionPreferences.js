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
                {[
                  ['is_faithbased_ads', 'Faithbased ads'],
                  ['is_fur', 'Fur'],
                  ['is_gambling_ads', 'Gambling ads'],
                  ['is_lingerie', 'Lingerie'],
                  ['is_liquor_ads', 'Liquor ads'],
                  ['is_nude', 'Nude'],
                  ['is_political_ads', 'Political ads'],
                  ['is_smoking_ads', 'Smoking ads'],
                  ['is_sports', 'Sports'],
                  ['is_swimwear', 'Swimwear'],
                  ['is_topless', 'Topless'],
                ].map(([key, label]) => {
                  const value = talent[key];
                  return (
                    <div key={key} className='nested-section__item_with_icon ellipsis'>
                      {value !== null ? (
                        <>
                          <div className='nested-section__icon'>{YesNoIcons[value]}</div>
                          <div className='ellipsis'>{label}</div>
                        </>
                      ) : (
                        <div className='ellipsis text-light'>{label}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </NestedSection.Body>
        </NestedSection>
    );
}

export default TalentSectionPreferences;
