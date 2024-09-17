import React, { createContext, useState, useContext, useMemo } from 'react';

const UserContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
}); // Default values for better autocompletion and error handling

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  });

  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  // useMemo to ensure the value object identity stays consistent across renders if values haven't changed
  const contextValue = useMemo(
    () => ({
      user,
      login,
      logout,
    }),
    [user]
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

export default UserContext; // Optional: export if you need direct access to the context
