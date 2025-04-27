import './Tmp.css';

import { Link } from "react-router";

function Tmp() {
    return (
        <div className='tmp-index'>
            <h3>Welcome to The App</h3>
            <Link to='/login'>Login</Link>
            <br />
            {/* <Link to='/register'>Register</Link> */}
        </div>
    );
}

export default Tmp;