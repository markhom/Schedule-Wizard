
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  console.log('Navbar - User:', user);

  return (
    <nav>
      <h1>My App</h1>
      <ul>
        {isAuthenticated && user ? (
          <>
            <li><Link to={`/profile/${user.username}`}>Profile</Link></li>
            <li><Link to="/create-schedule">Create Schedule</Link></li>
            <li><Link to="/" onClick={handleLogout}>Logout</Link></li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Sign Up</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
