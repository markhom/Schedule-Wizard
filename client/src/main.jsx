import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from './utils/stripe.js'

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
      //Need to add in a page for GET_ONE_SCHEDULE below
      // {
      //   path: '',
      //   element: <></>
      // },

      
      // {
      //   path: 'checkout', // Add the route for the CheckoutForm
      //   element: (
      //     <Elements stripe={stripePromise}> 
      //       <CheckoutForm />
      //     </Elements>
      //   )
      // }
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);

