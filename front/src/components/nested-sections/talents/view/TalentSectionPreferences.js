import './TalentSectionPreferences.css';

import { useSettings } from '../../../../context/SettingsContext';

import NestedSection from '../../NestedSection';

import { YesNoIcons } from '../../../ui-components/Icons';

function TalentSectionPreferences(props) {
    const { settings } = useSettings();
    const talent = props.talent;

    return (
        <NestedSection className={props.className}>
            <NestedSection.Header>Preferences</NestedSection.Header>
            <NestedSection.Body>
              <div className='talent-section-preferences__grid'>
                {settings.talent_preferences.map((preference) => {
                  const value = talent[preference.system_name];
                  return (
                    <div key={preference.system_name} className='nested-section__item_with_icon ellipsis'>
                      {value !== null ? (
                        <>
                          <div className='nested-section__icon'>{YesNoIcons[value]}</div>
                          <div className='ellipsis'>{preference.name}</div>
                        </>
                      ) : (
                        <div className='ellipsis text-light'>{preference.name}</div>
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
