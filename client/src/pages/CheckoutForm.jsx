import React, { useState } from "react";
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [clientSecret, setClientSecret] = useState('');
    const [amount, setAmount] = useState(0);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        // Create PaymentIntent on the server
        const response = await fetch('/create-payment-intent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount }), 
        });

        const data = await response.json();
        setClientSecret(data.clientSecret);

        // Confirm payment
        const cardElement = elements.getElement(CardElement);

        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
            },
        });

        if (error) {
            console.error(error);
        } else {
            console.log('PaymentIntent:', paymentIntent);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Donation Amount:
                <input 
                    type="number" 
                    value={amount} 
                    onChange={(e) => setAmount(parseFloat(e.target.value))}
                    required 
                />
            </label>
            <CardElement />
            <button type="submit" disabled={!stripe}>
                Donate Now
            </button>
        </form>
    );
};

export default CheckoutForm;