import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const EmployeeDashboard = () => {
    const [user, setUser] = useState(null);
    const [clockedIn, setClockedIn] = useState(false);
    const [attendanceId, setAttendanceId] = useState(null);
    const [clockInTime, setClockInTime] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get("/api/user");
                setUser(response.data);

                // Check current clock status
                const attendanceResponse = await axios.get(
                    "/api/attendance/current"
                );
                if (attendanceResponse.data.clocked_in) {
                    setClockedIn(true);
                    setAttendanceId(attendanceResponse.data.id);
                    setClockInTime(new Date(attendanceResponse.data.clock_in));
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleClockIn = async () => {
        try {
            const response = await axios.post("/api/clock-in");
            setClockedIn(true);
            setAttendanceId(response.data.id);
            setClockInTime(new Date(response.data.clock_in));
        } catch (error) {
            console.error("Error clocking in:", error);
        }
    };

    const handleClockOut = async () => {
        try {
            await axios.post("/api/clock-out", { attendance_id: attendanceId });
            setClockedIn(false);
            setAttendanceId(null);
            setClockInTime(null);
        } catch (error) {
            console.error("Error clocking out:", error);
        }
    };

    if (loading) {
        return <div className="text-center p-8">Loading...</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h1 className="text-2xl font-bold mb-4">
                    Welcome, {user?.name}
                </h1>

                <div className="mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600">Current Status:</p>
                            <p className="text-lg font-semibold">
                                {clockedIn ? (
                                    <span className="text-green-600">
                                        Clocked In
                                    </span>
                                ) : (
                                    <span className="text-red-600">
                                        Clocked Out
                                    </span>
                                )}
                            </p>
                            {clockedIn && clockInTime && (
                                <p className="text-sm text-gray-500">
                                    Since: {clockInTime.toLocaleTimeString()}
                                </p>
                            )}
                        </div>

                        <div>
                            {clockedIn ? (
                                <button
                                    onClick={handleClockOut}
                                    className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-200"
                                >
                                    Clock Out
                                </button>
                            ) : (
                                <button
                                    onClick={handleClockIn}
                                    className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-200"
                                >
                                    Clock In
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <hr className="my-6" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link
                        to="/employee/search-customer"
                        className="bg-blue-100 hover:bg-blue-200 p-4 rounded-lg transition duration-200"
                    >
                        <h3 className="text-lg font-semibold mb-2">
                            Search Customer
                        </h3>
                        <p className="text-gray-600">
                            Find customer information by phone number
                        </p>
                    </Link>

                    <Link
                        to="/employee/service-form"
                        className="bg-purple-100 hover:bg-purple-200 p-4 rounded-lg transition duration-200"
                    >
                        <h3 className="text-lg font-semibold mb-2">
                            Customer Service
                        </h3>
                        <p className="text-gray-600">
                            Create new service record for a customer
                        </p>
                    </Link>

                    <Link
                        to="/employee/billing"
                        className="bg-green-100 hover:bg-green-200 p-4 rounded-lg transition duration-200"
                    >
                        <h3 className="text-lg font-semibold mb-2">Billing</h3>
                        <p className="text-gray-600">
                            Process payments and apply discounts
                        </p>
                    </Link>

                    <Link
                        to="/employee/receipt"
                        className="bg-yellow-100 hover:bg-yellow-200 p-4 rounded-lg transition duration-200"
                    >
                        <h3 className="text-lg font-semibold mb-2">Receipts</h3>
                        <p className="text-gray-600">
                            View and download customer receipts
                        </p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDashboard;
