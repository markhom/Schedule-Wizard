import React from 'react';
import { useNavigate } from 'react-router-dom';

function Footer() {
    const navigate = useNavigate();

    const handleDonateClick = () => {
        navigate('/checkout');
    };

    return (
        <footer style={{position: 'fixed', bottom: 0, left: 0, width: '100%', padding: '1px'}}>
            <p className='siteText'>© 2024 ScheduleWizard. All rights reserved.</p>
            <button onClick={handleDonateClick}>Donate Now</button>
        </footer>
    );
}

export default Footer;
