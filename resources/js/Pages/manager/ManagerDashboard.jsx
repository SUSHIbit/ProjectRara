import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const ManagerDashboard = () => {
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState({
        totalEmployees: 0,
        totalMembers: 0,
        pendingMembers: 0,
        dailySales: 0,
        monthlySales: 0,
    });
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch user data
                const userResponse = await axios.get("/api/user");
                setUser(userResponse.data);

                // In a real implementation, you would fetch these stats from your API
                // This is a placeholder as the API endpoints may not exist yet
                setStats({
                    totalEmployees: 8,
                    totalMembers: 157,
                    pendingMembers: 3,
                    dailySales: 2450.75,
                    monthlySales: 35780.25,
                });

                // Example recent activity data
                setRecentActivity([
                    {
                        id: 1,
                        type: "membership",
                        description: "New membership application received",
                        timestamp: new Date(Date.now() - 3600000),
                    },
                    {
                        id: 2,
                        type: "transaction",
                        description: "Daily sales exceeded target by 15%",
                        timestamp: new Date(Date.now() - 7200000),
                    },
                    {
                        id: 3,
                        type: "attendance",
                        description: "3 employees clocked in late today",
                        timestamp: new Date(Date.now() - 10800000),
                    },
                ]);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    };

    if (loading) {
        return <div className="text-center p-8">Loading dashboard...</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h1 className="text-2xl font-bold mb-4">
                    Welcome, {user?.name}
                </h1>
                <p className="text-gray-600">
                    Here's an overview of your business
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-semibold mb-4">Staff</h2>
                    <div className="flex justify-between">
                        <div>
                            <p className="text-3xl font-bold">
                                {stats.totalEmployees}
                            </p>
                            <p className="text-gray-600">Total Employees</p>
                        </div>
                        <div className="rounded-full bg-blue-100 p-3">
                            <svg
                                className="w-8 h-8 text-blue-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                ></path>
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-semibold mb-4">Members</h2>
                    <div className="flex justify-between">
                        <div>
                            <p className="text-3xl font-bold">
                                {stats.totalMembers}
                            </p>
                            <p className="text-gray-600">Total Members</p>
                        </div>
                        <div className="rounded-full bg-green-100 p-3">
                            <svg
                                className="w-8 h-8 text-green-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                ></path>
                            </svg>
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="flex items-center">
                            <div className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                {stats.pendingMembers} pending
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-semibold mb-4">Sales</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <div>
                                <p className="text-gray-600">Today</p>
                                <p className="text-xl font-bold">
                                    {formatCurrency(stats.dailySales)}
                                </p>
                            </div>
                            <div className="rounded-full bg-purple-100 p-3">
                                <svg
                                    className="w-8 h-8 text-purple-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    ></path>
                                </svg>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <div>
                                <p className="text-gray-600">This Month</p>
                                <p className="text-xl font-bold">
                                    {formatCurrency(stats.monthlySales)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-semibold mb-4">
                            Quick Actions
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Link
                                to="/manager/members"
                                className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition duration-200"
                            >
                                <div className="mr-4 bg-green-100 p-3 rounded-full">
                                    <svg
                                        className="w-6 h-6 text-green-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                                        ></path>
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-medium">
                                        Manage Members
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        View, add, or approve members
                                    </p>
                                </div>
                            </Link>

                            <Link
                                to="/manager/benefits"
                                className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition duration-200"
                            >
                                <div className="mr-4 bg-blue-100 p-3 rounded-full">
                                    <svg
                                        className="w-6 h-6 text-blue-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                                        ></path>
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-medium">
                                        Manage Benefits
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Configure member benefits
                                    </p>
                                </div>
                            </Link>

                            <Link
                                to="/manager/attendance"
                                className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition duration-200"
                            >
                                <div className="mr-4 bg-purple-100 p-3 rounded-full">
                                    <svg
                                        className="w-6 h-6 text-purple-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                        ></path>
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-medium">Attendance</h3>
                                    <p className="text-sm text-gray-500">
                                        Track employee attendance
                                    </p>
                                </div>
                            </Link>

                            <Link
                                to="/manager/sales/daily"
                                className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition duration-200"
                            >
                                <div className="mr-4 bg-amber-100 p-3 rounded-full">
                                    <svg
                                        className="w-6 h-6 text-amber-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                        ></path>
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-medium">
                                        Sales Reports
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        View daily and monthly sales
                                    </p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-semibold mb-4">
                            Recent Activity
                        </h2>
                        <div className="space-y-4">
                            {recentActivity.length > 0 ? (
                                recentActivity.map((activity) => (
                                    <div
                                        key={activity.id}
                                        className="flex items-start border-b pb-4"
                                    >
                                        <div
                                            className={`rounded-full p-2 mr-3 ${
                                                activity.type === "membership"
                                                    ? "bg-green-100 text-green-600"
                                                    : activity.type ===
                                                      "transaction"
                                                    ? "bg-blue-100 text-blue-600"
                                                    : "bg-purple-100 text-purple-600"
                                            }`}
                                        >
                                            {activity.type === "membership" && (
                                                <svg
                                                    className="w-5 h-5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                                                    ></path>
                                                </svg>
                                            )}
                                            {activity.type ===
                                                "transaction" && (
                                                <svg
                                                    className="w-5 h-5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    ></path>
                                                </svg>
                                            )}
                                            {activity.type === "attendance" && (
                                                <svg
                                                    className="w-5 h-5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    ></path>
                                                </svg>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm">
                                                {activity.description}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {activity.timestamp.toLocaleTimeString(
                                                    [],
                                                    {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    }
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">
                                    No recent activity
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManagerDashboard;
