
// import React, { createContext, useContext, useState, useEffect } from 'react';
// import AuthService from './auth';

// const AuthContext = createContext();

// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const token = AuthService.getToken();
//     if (token) {
//       const decoded = AuthService.getProfile();
//       setUser(decoded.data);
//       setIsAuthenticated(true);
//     }
//   }, []);

//   const logout = () => {
//     AuthService.logout();
//     setUser(null);
//     setIsAuthenticated(false);
//   };

//   return (
//     <AuthContext.Provider value={{ isAuthenticated, user, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
