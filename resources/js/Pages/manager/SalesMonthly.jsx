import React, { useState, useEffect } from "react";
import axios from "axios";

const SalesMonthly = () => {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(
        new Date().getMonth() + 1
    );
    const [salesData, setSalesData] = useState(null);
    const [dailySales, setDailySales] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const months = [
        { value: 1, label: "January" },
        { value: 2, label: "February" },
        { value: 3, label: "March" },
        { value: 4, label: "April" },
        { value: 5, label: "May" },
        { value: 6, label: "June" },
        { value: 7, label: "July" },
        { value: 8, label: "August" },
        { value: 9, label: "September" },
        { value: 10, label: "October" },
        { value: 11, label: "November" },
        { value: 12, label: "December" },
    ];

    // Generate an array of years from 2020 to current year
    const currentYear = new Date().getFullYear();
    const years = Array.from(
        { length: currentYear - 2019 },
        (_, i) => 2020 + i
    );

    useEffect(() => {
        fetchMonthlySales(selectedYear, selectedMonth);
    }, [selectedYear, selectedMonth]);

    const fetchMonthlySales = async (year, month) => {
        setLoading(true);

        try {
            const response = await axios.get(
                `/api/sales/monthly?year=${year}&month=${month}`
            );

            setSalesData(response.data.summary);
            setDailySales(response.data.daily_sales);
            setError("");
        } catch (error) {
            console.error("Error fetching sales data:", error);
            setError("Failed to load sales data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleYearChange = (e) => {
        setSelectedYear(Number(e.target.value));
    };

    const handleMonthChange = (e) => {
        setSelectedMonth(Number(e.target.value));
    };

    const handleExportPdf = async () => {
        try {
            // This will download the PDF file
            window.location.href = `/api/sales/monthly/pdf?year=${selectedYear}&month=${selectedMonth}`;
        } catch (error) {
            console.error("Error exporting PDF:", error);
            setError("Failed to export sales report to PDF.");
        }
    };

    // Get days in selected month
    const getDaysInMonth = (year, month) => {
        return new Date(year, month, 0).getDate();
    };

    const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);

    return (
        <div className="container mx-auto p-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold mb-6">
                    Monthly Sales Report
                </h1>

                <div className="mb-6 flex flex-wrap items-center justify-between">
                    <div className="flex gap-4 mb-4 md:mb-0">
                        <div>
                            <label
                                className="block text-gray-700 mb-2"
                                htmlFor="month"
                            >
                                Month
                            </label>
                            <select
                                id="month"
                                value={selectedMonth}
                                onChange={handleMonthChange}
                                className="border rounded-md px-3 py-2"
                            >
                                {months.map((month) => (
                                    <option
                                        key={month.value}
                                        value={month.value}
                                    >
                                        {month.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label
                                className="block text-gray-700 mb-2"
                                htmlFor="year"
                            >
                                Year
                            </label>
                            <select
                                id="year"
                                value={selectedYear}
                                onChange={handleYearChange}
                                className="border rounded-md px-3 py-2"
                            >
                                {years.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button
                        onClick={handleExportPdf}
                        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
                        disabled={loading || !salesData}
                    >
                        Export as PDF
                    </button>
                </div>

                {loading ? (
                    <div className="text-center p-6">Loading sales data...</div>
                ) : error ? (
                    <div className="text-red-500 p-6">{error}</div>
                ) : salesData ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="border rounded-md p-4 bg-blue-50">
                                <h3 className="text-lg font-semibold mb-2">
                                    Total Sales
                                </h3>
                                <p className="text-2xl font-bold">
                                    ${salesData.total_sales.toFixed(2)}
                                </p>
                            </div>

                            <div className="border rounded-md p-4 bg-green-50">
                                <h3 className="text-lg font-semibold mb-2">
                                    Net Sales
                                </h3>
                                <p className="text-2xl font-bold">
                                    ${salesData.net_sales.toFixed(2)}
                                </p>
                            </div>

                            <div className="border rounded-md p-4 bg-purple-50">
                                <h3 className="text-lg font-semibold mb-2">
                                    Transactions
                                </h3>
                                <p className="text-2xl font-bold">
                                    {salesData.transaction_count}
                                </p>
                            </div>

                            <div className="border rounded-md p-4 bg-amber-50">
                                <h3 className="text-lg font-semibold mb-2">
                                    Total Discounts
                                </h3>
                                <p className="text-2xl font-bold">
                                    ${salesData.total_discounts.toFixed(2)}
                                </p>
                            </div>

                            <div className="border rounded-md p-4 bg-red-50">
                                <h3 className="text-lg font-semibold mb-2">
                                    Free Visits Used
                                </h3>
                                <p className="text-2xl font-bold">
                                    {salesData.free_visits}
                                </p>
                            </div>

                            <div className="border rounded-md p-4 bg-indigo-50">
                                <h3 className="text-lg font-semibold mb-2">
                                    Avg. Transaction Value
                                </h3>
                                <p className="text-2xl font-bold">
                                    $
                                    {salesData.transaction_count > 0
                                        ? (
                                              salesData.net_sales /
                                              salesData.transaction_count
                                          ).toFixed(2)
                                        : "0.00"}
                                </p>
                            </div>
                        </div>

                        <h2 className="text-xl font-semibold mb-4">
                            Daily Breakdown
                        </h2>

                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white">
                                <thead>
                                    <tr>
                                        <th className="py-2 px-4 border-b text-left">
                                            Day
                                        </th>
                                        <th className="py-2 px-4 border-b text-right">
                                            Sales
                                        </th>
                                        <th className="py-2 px-4 border-b text-right">
                                            Discounts
                                        </th>
                                        <th className="py-2 px-4 border-b text-right">
                                            Net Sales
                                        </th>
                                        <th className="py-2 px-4 border-b text-right">
                                            Transactions
                                        </th>
                                        <th className="py-2 px-4 border-b text-right">
                                            Free Visits
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.from(
                                        { length: daysInMonth },
                                        (_, i) => {
                                            const day = i + 1;
                                            const daySales = dailySales[day];

                                            return (
                                                <tr
                                                    key={day}
                                                    className={
                                                        daySales
                                                            ? ""
                                                            : "text-gray-400"
                                                    }
                                                >
                                                    <td className="py-2 px-4 border-b">
                                                        {day}
                                                    </td>
                                                    <td className="py-2 px-4 border-b text-right">
                                                        $
                                                        {daySales
                                                            ? daySales.total_sales.toFixed(
                                                                  2
                                                              )
                                                            : "0.00"}
                                                    </td>
                                                    <td className="py-2 px-4 border-b text-right">
                                                        $
                                                        {daySales
                                                            ? daySales.total_discounts.toFixed(
                                                                  2
                                                              )
                                                            : "0.00"}
                                                    </td>
                                                    <td className="py-2 px-4 border-b text-right">
                                                        $
                                                        {daySales
                                                            ? (
                                                                  daySales.total_sales -
                                                                  daySales.total_discounts
                                                              ).toFixed(2)
                                                            : "0.00"}
                                                    </td>
                                                    <td className="py-2 px-4 border-b text-right">
                                                        {daySales
                                                            ? daySales.transaction_count
                                                            : 0}
                                                    </td>
                                                    <td className="py-2 px-4 border-b text-right">
                                                        {daySales
                                                            ? daySales.free_visits
                                                            : 0}
                                                    </td>
                                                </tr>
                                            );
                                        }
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : (
                    <div className="text-center p-6 text-gray-500">
                        Please select a month and year to view sales data.
                    </div>
                )}
            </div>
        </div>
    );
};

export default SalesMonthly;
