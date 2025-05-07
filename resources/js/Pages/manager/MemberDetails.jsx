import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const MemberDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [member, setMember] = useState(null);
    const [benefits, setBenefits] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("benefits");

    useEffect(() => {
        const fetchMemberDetails = async () => {
            try {
                const response = await axios.get(`/api/members/${id}`);
                setMember(response.data.member);
                setBenefits(response.data.benefits);
                setTransactions(response.data.transactions);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching member details:", error);
                setError("Failed to load member details. Please try again.");
                setLoading(false);
            }
        };

        fetchMemberDetails();
    }, [id]);

    if (loading) {
        return <div className="text-center p-8">Loading member details...</div>;
    }

    if (error) {
        return (
            <div className="container mx-auto p-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="text-red-500 p-4">{error}</div>
                    <button
                        onClick={() => navigate("/manager/members")}
                        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
                    >
                        Back to Members List
                    </button>
                </div>
            </div>
        );
    }

    if (!member) {
        return (
            <div className="container mx-auto p-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="text-center p-4">
                        Member not found or has been removed.
                    </div>
                    <button
                        onClick={() => navigate("/manager/members")}
                        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
                    >
                        Back to Members List
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Member Details</h1>
                    <button
                        onClick={() => navigate("/manager/members")}
                        className="bg-gray-100 text-gray-600 py-2 px-4 rounded-md hover:bg-gray-200 transition duration-200"
                    >
                        Back to Members
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="md:col-span-1">
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-center mb-4">
                                <div className="bg-blue-100 text-blue-600 rounded-full p-5">
                                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                </div>
                            </div>
                            <h2 className="text-xl font-semibold text-center mb-2">
                                {member.name}
                            </h2>
                            <div className="flex justify-center mb-4">
                                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                    Member since {new Date(member.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-gray-600">Email:</span>
                                    <span className="font-medium">{member.email}</span>
                                </div>
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-gray-600">Phone:</span>
                                    <span className="font-medium">{member.phone}</span>
                                </div>
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-gray-600">Member Status:</span>
                                    <span className="font-medium text-green-600">
                                        {member.is_member ? "Active" : "Inactive"}
                                    </span>
                                </div>
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-gray-600">Login Count:</span>
                                    <span className="font-medium">{member.login_count}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Last Login:</span>
                                    <span className="font-medium">
                                        {member.last_login ? new Date(member.last_login).toLocaleDateString() : "Never"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <div className="border-b mb-4">
                            <ul className="flex flex-wrap -mb-px">
                                <li className="mr-2">
                                    <button
                                        className={`inline-block p-4 ${
                                            activeTab === "benefits"
                                                ? "text-blue-600 border-b-2 border-blue-600"
                                                : "text-gray-500 hover:text-gray-600"
                                        }`}
                                        onClick={() => setActiveTab("benefits")}
                                    >
                                        Benefits
                                    </button>
                                </li>
                                <li className="mr-2">
                                    <button
                                        className={`inline-block p-4 ${
                                            activeTab === "transactions"
                                                ? "text-blue-600 border-b-2 border-blue-600"
                                                : "text-gray-500 hover:text-gray-600"
                                        }`}
                                        onClick={() => setActiveTab("transactions")}
                                    >
                                        Transactions
                                    </button>
                                </li>
                            </ul>
                        </div>

                        {activeTab === "benefits" && (
                            <div>
                                <h3 className="text-lg font-semibold mb-3">Member Benefits</h3>
                                {benefits.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    >
                                                        Type
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    >
                                                        Details
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    >
                                                        Status
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {benefits.map((benefit) => (
                                                    <tr key={benefit.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span
                                                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                                    benefit.type === "discount"
                                                                        ? "bg-green-100 text-green-800"
                                                                        : "bg-blue-100 text-blue-800"
                                                                }`}
                                                            >
                                                                {benefit.type === "discount"
                                                                    ? "Discount"
                                                                    : "Loyalty"}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {benefit.type === "discount"
                                                                ? `${benefit.value}% off all services`
                                                                : `Free visit after ${benefit.threshold} visits`}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span
                                                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                                    benefit.is_active
                                                                        ? "bg-green-100 text-green-800"
                                                                        : "bg-red-100 text-red-800"
                                                                }`}
                                                            >
                                                                {benefit.is_active
                                                                    ? "Active"
                                                                    : "Inactive"}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-4 text-gray-500">
                                        No benefits have been added for this member.
                                    </div>
                                )}
                                <div className="mt-4">
                                    <button
                                        onClick={() => navigate("/manager/benefits")}
                                        className="bg-blue-500 text-white py-1 px-3 rounded-md text-sm hover:bg-blue-600"
                                    >
                                        Manage Benefits
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === "transactions" && (
                            <div>
                                <h3 className="text-lg font-semibold mb-3">Recent Transactions</h3>
                                {transactions.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Date
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Service
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Employee
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Amount
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Discount
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {transactions.map((transaction) => (
                                                    <tr key={transaction.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {new Date(transaction.created_at).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {transaction.service.service_type}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {transaction.service.employee?.name || "N/A"}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            ${transaction.total_price.toFixed(2)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {transaction.discount_applied > 0 ? (
                                                                <span className="text-green-600">
                                                                    ${transaction.discount_applied.toFixed(2)}
                                                                </span>
                                                            ) : transaction.free_visit ? (
                                                                <span className="text-blue-600">Free Visit</span>
                                                            ) : (
                                                                <span className="text-gray-400">None</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-4 text-gray-500">
                                        No transactions found for this member.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t flex justify-between">
                    <button
                        onClick={() => navigate("/manager/members")}
                        className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition duration-200"
                    >
                        Back to Members List
                    </button>
                    
                    <a
                        href={`mailto:${member.email}`}
                        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
                    >
                        Contact Member
                    </a>
                </div>
            </div>
        </div>
    );
};

export default MemberDetails;