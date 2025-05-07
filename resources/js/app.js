import React from "react";
import { createRoot } from "react-dom/client";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

// Auth Components
import Login from "./Pages/auth/Login";
import Register from "./Pages/auth/Register";
import ThankYou from "./Pages/auth/ThankYou";

// Employee Components
import EmployeeDashboard from "./Pages/employee/EmployeeDashboard";
import SearchCustomer from "./Pages/employee/SearchCustomer";
import CustomerServiceForm from "./Pages/employee/CustomerServiceForm";
import Billing from "./Pages/employee/Billing";
import Receipt from "./Pages/employee/Receipt";

// Manager Components
import ManagerDashboard from "./Pages/manager/ManagerDashboard";
import Attendance from "./Pages/manager/Attendance";
import SalesDaily from "./Pages/manager/SalesDaily";
import SalesMonthly from "./Pages/manager/SalesMonthly";
import MembersList from "./Pages/manager/MembersList";
import MemberDetails from "./Pages/manager/MemberDetails";
import ManageBenefits from "./Pages/manager/ManageBenefits";

// Auth protection components
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/thank-you" element={<ThankYou />} />

                {/* Employee Routes */}
                <Route
                    path="/employee"
                    element={<ProtectedRoute role="employee" />}
                >
                    <Route path="dashboard" element={<EmployeeDashboard />} />
                    <Route
                        path="search-customer"
                        element={<SearchCustomer />}
                    />
                    <Route
                        path="service-form"
                        element={<CustomerServiceForm />}
                    />
                    <Route path="billing" element={<Billing />} />
                    <Route path="receipt" element={<Receipt />} />
                    <Route
                        index
                        element={<Navigate to="/employee/dashboard" replace />}
                    />
                </Route>

                {/* Manager Routes */}
                <Route
                    path="/manager"
                    element={<ProtectedRoute role="manager" />}
                >
                    <Route path="dashboard" element={<ManagerDashboard />} />
                    <Route path="attendance" element={<Attendance />} />
                    <Route path="sales/daily" element={<SalesDaily />} />
                    <Route path="sales/monthly" element={<SalesMonthly />} />
                    <Route path="members" element={<MembersList />} />
                    <Route path="members/:id" element={<MemberDetails />} />
                    <Route path="benefits" element={<ManageBenefits />} />
                    <Route
                        index
                        element={<Navigate to="/manager/dashboard" replace />}
                    />
                </Route>

                {/* Default Route */}
                <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
}

const container = document.getElementById("app");
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}
