import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51PMJWV089fmhV5vflCuJiWiauGJnVrkW1wfUa80vitABav8jZgcSKzPb7fQi0Rr2JMLvId64OFP1kZGsSEtZBa0000yJsrWQgw');

export { stripePromise };