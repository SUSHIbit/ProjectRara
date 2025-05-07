import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CustomerServiceForm = () => {
    const navigate = useNavigate();
    const [customer, setCustomer] = useState(null);
    const [formData, setFormData] = useState({
        service_type: "",
        notes: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Service type options
    const serviceTypes = [
        { value: "haircut", label: "Haircut", price: 35 },
        { value: "styling", label: "Styling", price: 50 },
        { value: "coloring", label: "Coloring", price: 75 },
        { value: "treatment", label: "Treatment", price: 60 },
        { value: "manicure", label: "Manicure", price: 40 },
        { value: "pedicure", label: "Pedicure", price: 45 },
    ];

    useEffect(() => {
        // Get customer from session storage
        const storedCustomer = sessionStorage.getItem("selectedCustomer");

        if (storedCustomer) {
            setCustomer(JSON.parse(storedCustomer));
        } else {
            // If no customer selected, redirect back to search
            navigate("/employee/search-customer");
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Find the selected service price
        const selectedService = serviceTypes.find(
            (service) => service.value === formData.service_type
        );
        const servicePrice = selectedService ? selectedService.price : 0;

        try {
            // Create service record
            const serviceResponse = await axios.post("/api/services", {
                user_id: customer.id,
                service_type: formData.service_type,
                notes: formData.notes,
                date: new Date().toISOString().split("T")[0],
            });

            // Store service details for billing
            sessionStorage.setItem(
                "currentService",
                JSON.stringify({
                    ...serviceResponse.data,
                    price: servicePrice,
                    serviceName: selectedService
                        ? selectedService.label
                        : formData.service_type,
                })
            );

            // Navigate to billing page
            navigate("/employee/billing");
        } catch (error) {
            console.error("Error creating service:", error);
            setError("Failed to create service record. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!customer) {
        return <div className="text-center p-8">Loading...</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold mb-6">
                    Customer Service Form
                </h1>

                <div className="border rounded-md p-4 mb-6 bg-gray-50">
                    <h2 className="text-lg font-semibold mb-2">
                        Customer Information
                    </h2>
                    <p>
                        <span className="font-medium">Name:</span>{" "}
                        {customer.name}
                    </p>
                    <p>
                        <span className="font-medium">Phone:</span>{" "}
                        {customer.phone}
                    </p>
                    <p>
                        <span className="font-medium">Membership Status:</span>
                        {customer.is_member ? (
                            <span className="text-green-600 ml-1">Member</span>
                        ) : (
                            <span className="text-gray-600 ml-1">
                                Non-Member
                            </span>
                        )}
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            className="block text-gray-700 mb-2"
                            htmlFor="service_type"
                        >
                            Service Type
                        </label>
                        <select
                            id="service_type"
                            name="service_type"
                            value={formData.service_type}
                            onChange={handleChange}
                            className="w-full border rounded-md px-3 py-2"
                            required
                        >
                            <option value="">Select a service</option>
                            {serviceTypes.map((service) => (
                                <option
                                    key={service.value}
                                    value={service.value}
                                >
                                    {service.label} (${service.price})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label
                            className="block text-gray-700 mb-2"
                            htmlFor="notes"
                        >
                            Notes (Optional)
                        </label>
                        <textarea
                            id="notes"
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            className="w-full border rounded-md px-3 py-2 h-32"
                            placeholder="Enter any additional notes about the service..."
                        ></textarea>
                    </div>

                    {error && <div className="text-red-500 mb-4">{error}</div>}

                    <div className="flex justify-between">
                        <button
                            type="button"
                            onClick={() =>
                                navigate("/employee/search-customer")
                            }
                            className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 transition duration-200"
                        >
                            Back to Search
                        </button>

                        <button
                            type="submit"
                            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
                            disabled={loading}
                        >
                            {loading ? "Processing..." : "Continue to Billing"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CustomerServiceForm;
