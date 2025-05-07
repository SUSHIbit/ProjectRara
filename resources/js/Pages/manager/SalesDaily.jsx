import React, { useState, useEffect } from "react";
import axios from "axios";

const SalesDaily = () => {
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [salesData, setSalesData] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchDailySales(selectedDate);
    }, [selectedDate]);

    const fetchDailySales = async (date) => {
        setLoading(true);

        try {
            const response = await axios.get(`/api/sales/daily?date=${date}`);

            setSalesData(response.data.summary);
            setTransactions(response.data.transactions);
            setError("");
        } catch (error) {
            console.error("Error fetching sales data:", error);
            setError("Failed to load sales data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    const handleExportPdf = async () => {
        try {
            // This will download the PDF file
            window.location.href = `/api/sales/daily/pdf?date=${selectedDate}`;
        } catch (error) {
            console.error("Error exporting PDF:", error);
            setError("Failed to export sales report to PDF.");
        }
    };

    return (
        <div className="container mx-auto p-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold mb-6">Daily Sales Report</h1>

                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <label
                            className="block text-gray-700 mb-2"
                            htmlFor="date"
                        >
                            Select Date
                        </label>
                        <input
                            type="date"
                            id="date"
                            value={selectedDate}
                            onChange={handleDateChange}
                            className="border rounded-md px-3 py-2"
                            max={new Date().toISOString().split("T")[0]}
                        />
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
                            Transaction Details
                        </h2>

                        {transactions.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white">
                                    <thead>
                                        <tr>
                                            <th className="py-2 px-4 border-b text-left">
                                                ID
                                            </th>
                                            <th className="py-2 px-4 border-b text-left">
                                                Customer
                                            </th>
                                            <th className="py-2 px-4 border-b text-left">
                                                Service
                                            </th>
                                            <th className="py-2 px-4 border-b text-left">
                                                Employee
                                            </th>
                                            <th className="py-2 px-4 border-b text-left">
                                                Total
                                            </th>
                                            <th className="py-2 px-4 border-b text-left">
                                                Discount
                                            </th>
                                            <th className="py-2 px-4 border-b text-left">
                                                Free Visit
                                            </th>
                                            <th className="py-2 px-4 border-b text-left">
                                                Time
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions.map((transaction) => (
                                            <tr key={transaction.id}>
                                                <td className="py-2 px-4 border-b">
                                                    {transaction.id}
                                                </td>
                                                <td className="py-2 px-4 border-b">
                                                    {transaction.customer.name}
                                                </td>
                                                <td className="py-2 px-4 border-b">
                                                    {
                                                        transaction.service
                                                            .service_type
                                                    }
                                                </td>
                                                <td className="py-2 px-4 border-b">
                                                    {
                                                        transaction.service
                                                            .employee.name
                                                    }
                                                </td>
                                                <td className="py-2 px-4 border-b">
                                                    $
                                                    {transaction.total_price.toFixed(
                                                        2
                                                    )}
                                                </td>
                                                <td className="py-2 px-4 border-b">
                                                    $
                                                    {transaction.discount_applied.toFixed(
                                                        2
                                                    )}
                                                </td>
                                                <td className="py-2 px-4 border-b">
                                                    {transaction.free_visit
                                                        ? "Yes"
                                                        : "No"}
                                                </td>
                                                <td className="py-2 px-4 border-b">
                                                    {new Date(
                                                        transaction.created_at
                                                    ).toLocaleTimeString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-gray-500">
                                No transactions found for this date.
                            </p>
                        )}
                    </>
                ) : (
                    <div className="text-center p-6 text-gray-500">
                        Please select a date to view sales data.
                    </div>
                )}
            </div>
        </div>
    );
};

export default SalesDaily;
