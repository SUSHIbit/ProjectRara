import React, { useState, useEffect } from "react";
import axios from "axios";

const Attendance = () => {
    const [attendanceData, setAttendanceData] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState("all");
    const [dateRange, setDateRange] = useState("week");
    const [customStartDate, setCustomStartDate] = useState("");
    const [customEndDate, setCustomEndDate] = useState("");
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editMode, setEditMode] = useState(null);
    const [editData, setEditData] = useState({
        clock_in: "",
        clock_out: "",
    });

    useEffect(() => {
        fetchEmployees();
        fetchAttendanceData();
    }, [selectedEmployee, dateRange, customStartDate, customEndDate]);

    const fetchEmployees = async () => {
        try {
            const response = await axios.get("/api/employees");
            setEmployees(response.data);
        } catch (error) {
            console.error("Error fetching employees:", error);
        }
    };

    const fetchAttendanceData = async () => {
        setLoading(true);

        try {
            // Build query parameters
            let params = {};

            if (selectedEmployee !== "all") {
                params.employee_id = selectedEmployee;
            }

            if (dateRange === "custom" && customStartDate && customEndDate) {
                params.start_date = customStartDate;
                params.end_date = customEndDate;
            } else {
                params.range = dateRange;
            }

            const response = await axios.get("/api/attendance", { params });
            setAttendanceData(response.data.data);
            setError("");
        } catch (error) {
            console.error("Error fetching attendance data:", error);
            setError("Failed to load attendance data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleEmployeeChange = (e) => {
        setSelectedEmployee(e.target.value);
    };

    const handleDateRangeChange = (e) => {
        setDateRange(e.target.value);
    };

    const handleStartDateChange = (e) => {
        setCustomStartDate(e.target.value);
    };

    const handleEndDateChange = (e) => {
        setCustomEndDate(e.target.value);
    };

    const startEdit = (attendance) => {
        // Convert ISO date strings to local datetime-local format
        const localClockIn = attendance.clock_in
            ? new Date(attendance.clock_in).toISOString().slice(0, 16)
            : "";

        const localClockOut = attendance.clock_out
            ? new Date(attendance.clock_out).toISOString().slice(0, 16)
            : "";

        setEditMode(attendance.id);
        setEditData({
            clock_in: localClockIn,
            clock_out: localClockOut,
        });
    };

    const cancelEdit = () => {
        setEditMode(null);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditData({
            ...editData,
            [name]: value,
        });
    };

    const saveAttendance = async (id) => {
        try {
            await axios.put(`/api/attendance/${id}`, editData);

            // Refresh data
            fetchAttendanceData();
            setEditMode(null);
            setError("");
        } catch (error) {
            console.error("Error updating attendance:", error);

            if (error.response && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError("Failed to update attendance record.");
            }
        }
    };

    // Format time for display
    const formatTime = (timeString) => {
        if (!timeString) return "—";
        return new Date(timeString).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Calculate hours worked
    const calculateHours = (clockIn, clockOut) => {
        if (!clockIn || !clockOut) return "—";

        const start = new Date(clockIn);
        const end = new Date(clockOut);
        const diffMs = end - start;
        const diffHrs = diffMs / (1000 * 60 * 60);

        return diffHrs.toFixed(2);
    };

    return (
        <div className="container mx-auto p-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold mb-6">
                    Attendance Management
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div>
                        <label
                            className="block text-gray-700 mb-2"
                            htmlFor="employee"
                        >
                            Employee
                        </label>
                        <select
                            id="employee"
                            value={selectedEmployee}
                            onChange={handleEmployeeChange}
                            className="w-full border rounded-md px-3 py-2"
                        >
                            <option value="all">All Employees</option>
                            {employees.map((employee) => (
                                <option key={employee.id} value={employee.id}>
                                    {employee.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label
                            className="block text-gray-700 mb-2"
                            htmlFor="dateRange"
                        >
                            Date Range
                        </label>
                        <select
                            id="dateRange"
                            value={dateRange}
                            onChange={handleDateRangeChange}
                            className="w-full border rounded-md px-3 py-2"
                        >
                            <option value="today">Today</option>
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                            <option value="custom">Custom Range</option>
                        </select>
                    </div>

                    {dateRange === "custom" && (
                        <>
                            <div>
                                <label
                                    className="block text-gray-700 mb-2"
                                    htmlFor="startDate"
                                >
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    id="startDate"
                                    value={customStartDate}
                                    onChange={handleStartDateChange}
                                    className="w-full border rounded-md px-3 py-2"
                                />
                            </div>

                            <div>
                                <label
                                    className="block text-gray-700 mb-2"
                                    htmlFor="endDate"
                                >
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    id="endDate"
                                    value={customEndDate}
                                    onChange={handleEndDateChange}
                                    className="w-full border rounded-md px-3 py-2"
                                />
                            </div>
                        </>
                    )}
                </div>

                {error && <div className="text-red-500 mb-4">{error}</div>}

                {loading ? (
                    <div className="text-center p-6">
                        Loading attendance data...
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border-b text-left">
                                        Employee
                                    </th>
                                    <th className="py-2 px-4 border-b text-left">
                                        Date
                                    </th>
                                    <th className="py-2 px-4 border-b text-left">
                                        Clock In
                                    </th>
                                    <th className="py-2 px-4 border-b text-left">
                                        Clock Out
                                    </th>
                                    <th className="py-2 px-4 border-b text-left">
                                        Hours
                                    </th>
                                    <th className="py-2 px-4 border-b text-left">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendanceData.map((attendance) => (
                                    <tr key={attendance.id}>
                                        <td className="py-2 px-4 border-b">
                                            {attendance.user.name}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {new Date(
                                                attendance.date
                                            ).toLocaleDateString()}
                                        </td>

                                        {editMode === attendance.id ? (
                                            <>
                                                <td className="py-2 px-4 border-b">
                                                    <input
                                                        type="datetime-local"
                                                        name="clock_in"
                                                        value={
                                                            editData.clock_in
                                                        }
                                                        onChange={
                                                            handleEditChange
                                                        }
                                                        className="border rounded-md px-2 py-1 w-full"
                                                    />
                                                </td>
                                                <td className="py-2 px-4 border-b">
                                                    <input
                                                        type="datetime-local"
                                                        name="clock_out"
                                                        value={
                                                            editData.clock_out
                                                        }
                                                        onChange={
                                                            handleEditChange
                                                        }
                                                        className="border rounded-md px-2 py-1 w-full"
                                                    />
                                                </td>
                                                <td className="py-2 px-4 border-b">
                                                    —
                                                </td>
                                                <td className="py-2 px-4 border-b">
                                                    <button
                                                        onClick={() =>
                                                            saveAttendance(
                                                                attendance.id
                                                            )
                                                        }
                                                        className="bg-green-500 text-white py-1 px-3 rounded-md text-sm hover:bg-green-600 mr-2"
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={cancelEdit}
                                                        className="bg-gray-300 text-gray-800 py-1 px-3 rounded-md text-sm hover:bg-gray-400"
                                                    >
                                                        Cancel
                                                    </button>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="py-2 px-4 border-b">
                                                    {formatTime(
                                                        attendance.clock_in
                                                    )}
                                                </td>
                                                <td className="py-2 px-4 border-b">
                                                    {formatTime(
                                                        attendance.clock_out
                                                    )}
                                                </td>
                                                <td className="py-2 px-4 border-b">
                                                    {calculateHours(
                                                        attendance.clock_in,
                                                        attendance.clock_out
                                                    )}
                                                </td>
                                                <td className="py-2 px-4 border-b">
                                                    <button
                                                        onClick={() =>
                                                            startEdit(
                                                                attendance
                                                            )
                                                        }
                                                        className="text-blue-500 hover:underline"
                                                    >
                                                        Edit
                                                    </button>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}

                                {attendanceData.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="py-4 text-center text-gray-500"
                                        >
                                            No attendance records found for the
                                            selected criteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Attendance;
