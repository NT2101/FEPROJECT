/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// Simulated authentication function
const isAuthenticated = () => {
    // Here you would check if the user is authenticated
    // For example, check if a user token exists in local storage or context
    return localStorage.getItem("User") ? true : false;
};

const ProtectedRoute = ({ children }) => {
    const location = useLocation();

    if (!isAuthenticated()) {
        // Redirect them to the login page, but save the current location they were trying to go to
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;