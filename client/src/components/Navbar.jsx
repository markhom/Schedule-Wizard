import React from 'react';

const Navbar = ({ isAuthenticated }) => {
  return (
    <nav>
      <h1>My App</h1>
      <ul>
        {isAuthenticated ? (
          <>
            <li><a href="/profile">Profile</a></li>
            <li><a href="/logout">Logout</a></li>
          </>
        ) : (
          <>
            <li><a href="/login">Login</a></li>
            <li><a href="/signup">Sign Up</a></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;