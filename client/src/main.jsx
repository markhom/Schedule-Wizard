import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Elements } from '@stripe/react-stripe-js';
// import { stripePromise } from './utils/stripe.js'
import { loadStripe } from '@stripe/stripe-js';

import App from './App.jsx';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Profile from './pages/Profile';
import ErrorPage from './pages/ErrorPage';
import CheckoutForm from './pages/CheckoutForm';
import Schedule from './components/schedules/Schedule.jsx';
import ScheduleCreationPage from './components/schedules/ScheduleCreationPage.jsx';
import ScheduleDetail from './components/schedules/ScheduleDetail.jsx';

import 'bootstrap/dist/css/bootstrap.min.css';

//Public Stripe Key
const stripePromise = loadStripe('pk_live_51PMJWV089fmhV5vfpwNBOoCSnFL8f5bb6YsfQ45alPgeAo3mqzN73eEEiPWRM5oRDduWnz4OuU23m08OU9ZAeYCv00ChSLZ5d8');

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />
      }, {
        path: '/login',
        element: <Login />
      }, {
        path: '/signup',
        element: <Signup />
      }, {
        path: '/profile/:username',
        element: <Profile />
      }, {
        path: 'schedule',
        element: <Schedule />
      },
      {
        path: 'create-schedule',
        element: <ScheduleCreationPage />
      },
      {
        path: 'schedule/:scheduleId',
        element: <ScheduleDetail />
      }
      //Need to add in a page for GET_ONE_SCHEDULE below
      // {
      //   path: '',
      //   element: <></>
      // },

      
      {
        path: 'checkout',
        element: (
          <Elements stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
        )
      }
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);

