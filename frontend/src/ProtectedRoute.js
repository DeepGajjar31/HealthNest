import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from './UserContext'; // Importing useUser hook assuming you have a UserContext

function ProtectedRoute() {
  const { user } = useUser();
  // const isAuthenticated = user !== null;
  // console.log('ProtectedRoute:', { isAuthenticated, allowedRoles, userRole }); // Log props

  // if (!isAuthenticated) {
  //   return <Navigate to="/login" />;
  // }

  // if (!allowedRoles.includes(userRole)) {
  //   return <Navigate to="/home" />;
  // }

  return user ? <Outlet /> : <Navigate to="/login" />;
  // return <Outlet />;
}

export default ProtectedRoute;
