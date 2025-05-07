import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = ({ role }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get("/api/user");
                setIsAuthenticated(true);
                setUserRole(response.data.role);
            } catch (error) {
                setIsAuthenticated(false);
                setUserRole(null);
            }
        };

        checkAuth();
    }, []);

    // Still loading
    if (isAuthenticated === null) {
        return <div>Loading...</div>;
    }

    // Not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Wrong role
    if (role && userRole !== role) {
        const redirectPath =
            userRole === "manager"
                ? "/manager/dashboard"
                : "/employee/dashboard";
        return <Navigate to={redirectPath} replace />;
    }

    // Authenticated with correct role
    return <Outlet />;
};

export default ProtectedRoute;
