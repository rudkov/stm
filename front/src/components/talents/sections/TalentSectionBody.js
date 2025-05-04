import NestedSection from '../../ui-components/NestedSection';

import IconColorBadge from '../../ui-components/IconColorBadge';

function TalentSectionBody(props) {
    const talent = props.talent;

    return (
        <NestedSection className={props.className}>
            <NestedSection.Header>Body</NestedSection.Header>
            <NestedSection.Body>
                <div className='nested-section__grid'>
                    <div className='nested-section__cell'>
                        <div className='text-light'>Height</div>
                        <div>
                            {talent.height_cm ? talent.height_cm + ' cm' : null}
                            <span className='text-light'><span className="text-separator">·</span>{talent.height_in ? talent.height_in : null}</span>
                        </div>
                    </div>
                    <div className='nested-section__cell'>
                        <div className='text-light'>Bust</div>
                        <div>
                            {talent.bust_cm ? talent.bust_cm + ' cm' : null}
                            <span className='text-light'><span className="text-separator">·</span>{talent.bust_in ? talent.bust_in + ' in' : null}</span>
                        </div>
                    </div>
                    <div className='nested-section__cell'>
                        <div className='text-light'>Waist</div>
                        <div>
                            {talent.waist_cm ? talent.waist_cm + ' cm' : null}
                            <span className='text-light'><span className="text-separator">·</span>{talent.waist_in ? talent.waist_in + ' in' : null}</span>
                        </div>
                    </div>
                    <div className='nested-section__cell'>
                        <div className='text-light'>Hips</div>
                        <div>
                            {talent.hips_cm ? talent.hips_cm + ' cm' : null}
                            <span className='text-light'><span className="text-separator">·</span>{talent.hips_in ? talent.hips_in + ' in' : null}</span>
                        </div>
                    </div>
                    <div className='nested-section__cell'>
                        <div className='text-light'>Weight</div>
                        <div>
                            {talent.weight_kg ? talent.weight_kg + ' kg' : null}
                            <span className='text-light'><span className="text-separator">·</span>{talent.weight_lb ? talent.weight_lb + ' lb' : null}</span>
                        </div>
                    </div>
                    <div className='nested-section__cell'>
                        <div className='text-light'>Skin color</div>
                        <div className='nested-section__item_with_icon ellipsis'>
                            <div className='nested-section__icon ellipsis'>{<IconColorBadge color={'color--skin--' + talent.skin_color?.system_name} />}</div>
                            <div className='ellipsis'>{talent.skin_color?.name}</div>
                        </div>
                    </div>
                    <div className='nested-section__cell'>
                        <div className='text-light'>Eyes</div>
                        <div className='nested-section__item_with_icon ellipsis'>
                            <div className='nested-section__icon'>{<IconColorBadge color={'color--eyes--' + talent.eye_color?.system_name} />}</div>
                            <div className='ellipsis'>{talent.eye_color?.name}</div>
                        </div>
                    </div>
                    <div className='nested-section__cell'>
                        <div className='text-light'>Hair color</div>
                        <div className='nested-section__item_with_icon ellipsis'>
                            <div className='nested-section__icon'>{<IconColorBadge color={'color--hair--' + talent.hair_color?.system_name} />}</div>
                            <div className='ellipsis'>{talent.hair_color?.name}</div>
                        </div>
                    </div>
                    <div className='nested-section__cell'>
                        <div className='text-light'>Hair length</div>
                        <div>{talent.hair_length?.name}</div>
                    </div>
                    <div className='nested-section__cell'>
                        <div className='text-light'>Cups</div>
                        <div>{talent.cup_size?.name}</div>
                    </div>
                    <div className='nested-section__cell'>
                        <div className='text-light'>Shirt</div>
                        <div>{talent.shirt_size?.name}</div>
                    </div>
                    <div className='nested-section__cell'>
                        <div className='text-light'>Suit cut</div>
                        <div>{talent.suit_cut?.name}</div>
                    </div>
                    <div className='nested-section__cell'>
                        <div className='text-light'>Dress</div>
                        <div>{talent.dress_size?.name}</div>
                    </div>
                    <div className='nested-section__cell'>
                        <div className='text-light'>Shoe</div>
                        <div>
                            {talent.shoe_size?.size_adult_uk ? talent.shoe_size?.size_adult_uk + ' UK' : null}
                            <span className='text-light'><span className="text-separator">·</span>{talent.shoe_size?.size_adult_us_men ? talent.shoe_size?.size_adult_us_men + ' US' : null}</span>
                        </div>
                    </div>
                    <div className='nested-section__cell'>
                        <div className='text-light'>Ears pierced</div>
                        <div>{talent.is_ears_pierced}</div>
                    </div>
                    <div className='nested-section__cell'>
                        <div className='text-light'>Scars</div>
                        <div>{talent.scars}</div>
                    </div>
                    <div className='nested-section__cell'>
                        <div className='text-light'>Tattoos</div>
                        <div>{talent.tattoos}</div>
                    </div>
                    <div className='nested-section__cell'>
                        <div className='text-light'>Piercings</div>
                        <div>{talent.piercings}</div>
                    </div>
                </div>
            </NestedSection.Body>
        </NestedSection >
    );
}

export default TalentSectionBody;