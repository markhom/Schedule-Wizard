import React from 'react';
import  DonationButton  from './donateButton';

//set the price (on line 13) to the productID of the created test-product on the Stripe Dashboard

function Footer() {

    return (
        <footer style={{ position: 'fixed', bottom: 0, right: 0, padding: '5px' }}>
            <p className='siteText'>© 2024 ScheduleWizard. All rights reserved.</p>
            {/* <Button type="submit" className="animated-button" variant="primary" onClick={handleDonateClick}>Donate Now</Button> */}
            <div>
                <DonationButton ammount={"5.00"} itemID="price_1IUx1FJ2iOysJZvP1LD3EzTR"/>
            </div>
        </footer>
    );
}

export default Footer;