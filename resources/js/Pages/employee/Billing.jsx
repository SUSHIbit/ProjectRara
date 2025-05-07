import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Billing = () => {
    const navigate = useNavigate();
    const [customer, setCustomer] = useState(null);
    const [service, setService] = useState(null);
    const [benefits, setBenefits] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState("credit_card");
    const [applyBenefits, setApplyBenefits] = useState(true);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [freeVisit, setFreeVisit] = useState(false);
    const [totalAmount, setTotalAmount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        // Get customer and service from session storage
        const storedCustomer = sessionStorage.getItem("selectedCustomer");
        const storedService = sessionStorage.getItem("currentService");
        const storedBenefits = sessionStorage.getItem("customerBenefits");

        if (!storedCustomer || !storedService) {
            // If no customer or service selected, redirect back
            navigate("/employee/search-customer");
            return;
        }

        const parsedCustomer = JSON.parse(storedCustomer);
        const parsedService = JSON.parse(storedService);
        const parsedBenefits = storedBenefits ? JSON.parse(storedBenefits) : [];

        setCustomer(parsedCustomer);
        setService(parsedService);
        setBenefits(parsedBenefits);

        // Calculate initial price and benefits
        calculatePricing(
            parsedService.price,
            parsedCustomer,
            parsedBenefits,
            true
        );
    }, [navigate]);

    const calculatePricing = (
        basePrice,
        customerData,
        benefitsData,
        shouldApply
    ) => {
        let discount = 0;
        let useFreeVisit = false;
        let finalTotal = basePrice;

        if (
            shouldApply &&
            customerData &&
            customerData.is_member &&
            benefitsData &&
            benefitsData.length > 0
        ) {
            // Check for discount benefit
            const discountBenefit = benefitsData.find(
                (benefit) => benefit.type === "discount"
            );
            if (discountBenefit) {
                discount = (basePrice * discountBenefit.value) / 100;
            }

            // Check for free visit benefit
            const loyaltyBenefit = benefitsData.find(
                (benefit) => benefit.type === "loyalty"
            );
            if (
                loyaltyBenefit &&
                customerData.login_count >= loyaltyBenefit.threshold
            ) {
                useFreeVisit = true;
            }

            // Calculate final total
            if (useFreeVisit) {
                finalTotal = 0;
            } else {
                finalTotal = basePrice - discount;
            }
        }

        setDiscountAmount(discount);
        setFreeVisit(useFreeVisit);
        setTotalAmount(finalTotal);
    };

    const handleBenefitToggle = (e) => {
        const shouldApply = e.target.checked;
        setApplyBenefits(shouldApply);

        if (service && customer) {
            calculatePricing(service.price, customer, benefits, shouldApply);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // Create transaction record
            const transactionResponse = await axios.post("/api/transactions", {
                customer_id: customer.id,
                service_id: service.id,
                total_price: totalAmount,
                discount_applied: discountAmount,
                free_visit: freeVisit,
            });

            // Store transaction ID for receipt
            sessionStorage.setItem(
                "lastTransaction",
                JSON.stringify(transactionResponse.data)
            );

            // Navigate to receipt page
            navigate("/employee/receipt");
        } catch (error) {
            console.error("Error processing payment:", error);
            setError("Failed to process payment. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!customer || !service) {
        return <div className="text-center p-8">Loading...</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold mb-6">Billing</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="border rounded-md p-4 bg-gray-50">
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
                            <span className="font-medium">
                                Membership Status:
                            </span>
                            {customer.is_member ? (
                                <span className="text-green-600 ml-1">
                                    Member
                                </span>
                            ) : (
                                <span className="text-gray-600 ml-1">
                                    Non-Member
                                </span>
                            )}
                        </p>
                    </div>

                    <div className="border rounded-md p-4 bg-gray-50">
                        <h2 className="text-lg font-semibold mb-2">
                            Service Information
                        </h2>
                        <p>
                            <span className="font-medium">Service Type:</span>{" "}
                            {service.serviceName}
                        </p>
                        <p>
                            <span className="font-medium">Base Price:</span> $
                            {service.price.toFixed(2)}
                        </p>
                        <p>
                            <span className="font-medium">Date:</span>{" "}
                            {new Date().toLocaleDateString()}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-4">
                            Payment Information
                        </h2>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">
                                Payment Method
                            </label>
                            <div className="flex flex-wrap gap-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="payment_method"
                                        value="credit_card"
                                        checked={
                                            paymentMethod === "credit_card"
                                        }
                                        onChange={() =>
                                            setPaymentMethod("credit_card")
                                        }
                                        className="mr-2"
                                    />
                                    Credit Card
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="payment_method"
                                        value="cash"
                                        checked={paymentMethod === "cash"}
                                        onChange={() =>
                                            setPaymentMethod("cash")
                                        }
                                        className="mr-2"
                                    />
                                    Cash
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="payment_method"
                                        value="mobile_payment"
                                        checked={
                                            paymentMethod === "mobile_payment"
                                        }
                                        onChange={() =>
                                            setPaymentMethod("mobile_payment")
                                        }
                                        className="mr-2"
                                    />
                                    Mobile Payment
                                </label>
                            </div>
                        </div>

                        {customer.is_member && benefits.length > 0 && (
                            <div className="mb-4">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={applyBenefits}
                                        onChange={handleBenefitToggle}
                                        className="mr-2"
                                    />
                                    <span>Apply Member Benefits</span>
                                </label>
                            </div>
                        )}
                    </div>

                    <div className="border rounded-md p-4 bg-gray-50 mb-6">
                        <h2 className="text-lg font-semibold mb-2">
                            Order Summary
                        </h2>

                        <div className="flex justify-between mb-2">
                            <span>Base Price:</span>
                            <span>${service.price.toFixed(2)}</span>
                        </div>

                        {applyBenefits && customer.is_member && (
                            <>
                                {discountAmount > 0 && (
                                    <div className="flex justify-between mb-2 text-green-600">
                                        <span>Member Discount:</span>
                                        <span>
                                            -${discountAmount.toFixed(2)}
                                        </span>
                                    </div>
                                )}

                                {freeVisit && (
                                    <div className="flex justify-between mb-2 text-green-600">
                                        <span>Free Visit Applied:</span>
                                        <span>Yes</span>
                                    </div>
                                )}
                            </>
                        )}

                        <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                            <span>Total:</span>
                            <span>${totalAmount.toFixed(2)}</span>
                        </div>
                    </div>

                    {error && <div className="text-red-500 mb-4">{error}</div>}

                    <div className="flex justify-between">
                        <button
                            type="button"
                            onClick={() => navigate("/employee/service-form")}
                            className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 transition duration-200"
                        >
                            Back to Service Form
                        </button>

                        <button
                            type="submit"
                            className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-200"
                            disabled={loading}
                        >
                            {loading ? "Processing..." : "Complete Payment"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Billing;
