import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SearchCustomer = () => {
    const navigate = useNavigate();
    const [phone, setPhone] = useState("");
    const [customer, setCustomer] = useState(null);
    const [benefits, setBenefits] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await axios.get(
                `/api/customers/search?phone=${phone}`
            );
            setCustomer(response.data.customer);
            setBenefits(response.data.benefits || []);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setError("Customer not found. Please check the phone number.");
            } else {
                setError(
                    "An error occurred while searching. Please try again."
                );
            }
            setCustomer(null);
            setBenefits([]);
        } finally {
            setLoading(false);
        }
    };

    const handleProceedToService = () => {
        // Store customer info in session storage
        sessionStorage.setItem("selectedCustomer", JSON.stringify(customer));
        sessionStorage.setItem("customerBenefits", JSON.stringify(benefits));

        // Navigate to service form
        navigate("/employee/service-form");
    };

    return (
        <div className="container mx-auto p-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold mb-6">Search Customer</h1>

                <form onSubmit={handleSearch} className="mb-6">
                    <div className="flex">
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Enter phone number"
                            className="flex-1 border rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition duration-200"
                            disabled={loading}
                        >
                            {loading ? "Searching..." : "Search"}
                        </button>
                    </div>

                    {error && <p className="text-red-500 mt-2">{error}</p>}
                </form>

                {customer && (
                    <div className="border rounded-md p-4 mb-6">
                        <h2 className="text-lg font-semibold mb-4">
                            Customer Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <p className="text-gray-600">Name:</p>
                                <p className="font-semibold">{customer.name}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Phone:</p>
                                <p className="font-semibold">
                                    {customer.phone}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-600">Email:</p>
                                <p className="font-semibold">
                                    {customer.email}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-600">
                                    Membership Status:
                                </p>
                                <p className="font-semibold">
                                    {customer.is_member ? (
                                        <span className="text-green-600">
                                            Member
                                        </span>
                                    ) : customer.membership_pending ? (
                                        <span className="text-amber-600">
                                            Pending Approval
                                        </span>
                                    ) : (
                                        <span className="text-gray-600">
                                            Non-Member
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>

                        {customer.is_member && benefits.length > 0 && (
                            <div className="mt-4">
                                <h3 className="text-md font-semibold mb-2">
                                    Member Benefits
                                </h3>

                                <ul className="list-disc list-inside">
                                    {benefits.map((benefit) => (
                                        <li key={benefit.id} className="mb-1">
                                            {benefit.type === "discount" ? (
                                                <span>
                                                    {benefit.value}% discount on
                                                    all services
                                                </span>
                                            ) : (
                                                <span>
                                                    Free visit after{" "}
                                                    {benefit.threshold} visits
                                                </span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="mt-6">
                            <button
                                onClick={handleProceedToService}
                                className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-200"
                            >
                                Proceed to Service Form
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchCustomer;
