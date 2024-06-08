import React from "react";
import { Button } from 'react-bootstrap';
import { loadStripe } from "@stripe/stripe-js";
const stripePromise = loadStripe('pk_live_51PMJWV089fmhV5vfpwNBOoCSnFL8f5bb6YsfQ45alPgeAo3mqzN73eEEiPWRM5oRDduWnz4OuU23m08OU9ZAeYCv00ChSLZ5d8');


const DonationButton = ({ itemID, ammount }) => {
  const handleClick = async (event) => {
    const stripe = await stripePromise;
    stripe
      .redirectToCheckout({
        lineItems: [{ price: itemID, quantity: 1 }],
        mode: "payment",
        successUrl: window.location.protocol + "//localhost:3000/profile",
        cancelUrl: window.location.protocol + "//localhost:3000/profile",
        submitType: "donate",
      })
      .then(function (result) {
        if (result.error) {
          console.log(result);
        }
      });
  };
  return (
    <Button class="" className="animated-button" variant="primary" onClick={handleClick}>
      Donate {ammount}$
    </Button>
  );
};

export default DonationButton;