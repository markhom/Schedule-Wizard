import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from './App.jsx';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Profile from './pages/Profile';
import ErrorPage from './pages/ErrorPage';
import Schedule from './components/schedules/Schedule.jsx';
import ScheduleCreationPage from './components/schedules/ScheduleCreationPage.jsx';
import ScheduleDetail from './components/schedules/ScheduleDetail.jsx';

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
        path: '/schedules/:scheduleId',
        element: <ScheduleDetail />
      }
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);

