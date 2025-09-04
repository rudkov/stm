import Weblink from 'components/ui-components/Weblink';

const WeblinksList = ({ weblinks }) => {
    return weblinks?.map((weblink) => {
        return (
            <div className='nested-section__cell-horizontal' key={`weblink.` + weblink.id}>
                <div className='text-light'>Website</div>
                <div className='ellipsis'><Weblink url={weblink.info} /></div>
            </div>
        );
    });
};

export default WeblinksList;
