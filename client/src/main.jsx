import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

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
import SearchResultsPage from './components/SearchResultsPage'; 

import 'bootstrap/dist/css/bootstrap.min.css';
import Update from './pages/Update.jsx';

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
        path: '/profile',
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
      },
      {
        path: '/search',
        element: <SearchResultsPage />

      },
      {
        path: '/update/:scheduleId',
        element: <Update />
      },
      {
        path: 'profile/:username',
        element: <Profile />
      }
      //Need to add in a page for GET_ONE_SCHEDULE below
      // {
      //   path: '',
      //   element: <></>
      // },
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);