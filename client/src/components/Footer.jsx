import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

function Footer() {
    const navigate = useNavigate();

    const handleDonateClick = () => {
        navigate('/checkout');
    };

    return (
        <footer style={{position: 'fixed', bottom: 0, right: 0, padding: '5px'}}>
            <p className='siteText'>© 2024 ScheduleWizard. All rights reserved.</p>
            <Button type="submit" className="animated-button" variant="primary" onClick={handleDonateClick}>Donate Now</Button>
        </footer>
    );
}

export default Footer;
