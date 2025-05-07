import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Receipt = () => {
    const navigate = useNavigate();
    const [transaction, setTransaction] = useState(null);
    const [customer, setCustomer] = useState(null);
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        // Get transaction from session storage
        const storedTransaction = sessionStorage.getItem("lastTransaction");

        if (storedTransaction) {
            fetchTransactionDetails(JSON.parse(storedTransaction).id);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchTransactionDetails = async (transactionId) => {
        try {
            const response = await axios.get(
                `/api/transactions/${transactionId}`
            );

            setTransaction(response.data);
            setCustomer(response.data.customer);
            setService(response.data.service);
        } catch (error) {
            console.error("Error fetching transaction details:", error);
            setError("Failed to load receipt details.");
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPdf = async () => {
        if (!transaction) return;

        try {
            // This will download the PDF file
            window.location.href = `/api/receipt/${transaction.id}`;
        } catch (error) {
            console.error("Error downloading receipt:", error);
            setError("Failed to download receipt.");
        }
    };

    const handleNewTransaction = () => {
        // Clear session storage
        sessionStorage.removeItem("lastTransaction");
        sessionStorage.removeItem("currentService");

        // Navigate to search page to start new transaction
        navigate("/employee/search-customer");
    };

    if (loading) {
        return <div className="text-center p-8">Loading receipt...</div>;
    }

    if (!transaction) {
        return (
            <div className="container mx-auto p-6">
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <h1 className="text-2xl font-bold mb-6">Receipt</h1>
                    <p className="mb-6 text-gray-500">
                        No transaction data found. Please start a new
                        transaction.
                    </p>
                    <button
                        onClick={handleNewTransaction}
                        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
                    >
                        Start New Transaction
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold">RECEIPT</h1>
                    <p className="text-gray-500">
                        Transaction #{transaction.id}
                    </p>
                    <p className="text-gray-500">
                        {new Date(transaction.created_at).toLocaleString()}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <h2 className="text-lg font-semibold mb-2">
                            Customer Information
                        </h2>
                        <p>
                            <strong>Name:</strong> {customer.name}
                        </p>
                        <p>
                            <strong>Phone:</strong> {customer.phone}
                        </p>
                        <p>
                            <strong>Email:</strong> {customer.email}
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold mb-2">
                            Service Information
                        </h2>
                        <p>
                            <strong>Service:</strong> {service.service_type}
                        </p>
                        <p>
                            <strong>Date:</strong>{" "}
                            {new Date(service.date).toLocaleDateString()}
                        </p>
                        <p>
                            <strong>Employee:</strong> {service.employee.name}
                        </p>
                    </div>
                </div>

                <div className="border-t border-b py-4 my-6">
                    <div className="flex justify-between mb-2">
                        <span>Service: {service.service_type}</span>
                        <span>
                            $
                            {(
                                transaction.total_price +
                                transaction.discount_applied
                            ).toFixed(2)}
                        </span>
                    </div>

                    {transaction.discount_applied > 0 && (
                        <div className="flex justify-between mb-2 text-green-600">
                            <span>Member Discount:</span>
                            <span>
                                -${transaction.discount_applied.toFixed(2)}
                            </span>
                        </div>
                    )}

                    {transaction.free_visit && (
                        <div className="flex justify-between mb-2 text-green-600">
                            <span>Free Visit Applied:</span>
                            <span>Yes</span>
                        </div>
                    )}
                </div>

                <div className="flex justify-between text-xl font-bold mb-6">
                    <span>Total:</span>
                    <span>${transaction.total_price.toFixed(2)}</span>
                </div>

                <div className="text-center mb-6">
                    <p className="text-gray-500">
                        Thank you for your business!
                    </p>
                </div>

                {error && (
                    <div className="text-red-500 mb-4 text-center">{error}</div>
                )}

                <div className="flex justify-between">
                    <button
                        onClick={handleNewTransaction}
                        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
                    >
                        New Transaction
                    </button>

                    <button
                        onClick={handleDownloadPdf}
                        className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-200"
                    >
                        Download PDF
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Receipt;
