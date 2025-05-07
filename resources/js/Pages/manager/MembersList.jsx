import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const MembersList = () => {
    const [members, setMembers] = useState([]);
    const [pendingMembers, setPendingMembers] = useState([]);
    const [activeTab, setActiveTab] = useState("all");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            const response = await axios.get("/api/members");

            // Split into active and pending members
            const active = response.data.filter(
                (member) => !member.membership_pending
            );
            const pending = response.data.filter(
                (member) => member.membership_pending
            );

            setMembers(active);
            setPendingMembers(pending);
        } catch (error) {
            console.error("Error fetching members:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            await axios.put(`/api/members/${id}/approve`);

            // Refresh the members list
            fetchMembers();
        } catch (error) {
            console.error("Error approving member:", error);
        }
    };

    const handleReject = async (id) => {
        try {
            await axios.delete(`/api/members/${id}/reject`);

            // Refresh the members list
            fetchMembers();
        } catch (error) {
            console.error("Error rejecting member:", error);
        }
    };

    if (loading) {
        return <div className="text-center p-8">Loading...</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold mb-6">
                    Membership Management
                </h1>

                <div className="mb-6">
                    <div className="flex border-b">
                        <button
                            className={`px-4 py-2 ${
                                activeTab === "all"
                                    ? "border-b-2 border-blue-500 text-blue-500"
                                    : "text-gray-500"
                            }`}
                            onClick={() => setActiveTab("all")}
                        >
                            All Members ({members.length})
                        </button>
                        <button
                            className={`px-4 py-2 ${
                                activeTab === "pending"
                                    ? "border-b-2 border-blue-500 text-blue-500"
                                    : "text-gray-500"
                            }`}
                            onClick={() => setActiveTab("pending")}
                        >
                            Pending Approval ({pendingMembers.length})
                        </button>
                    </div>
                </div>

                {activeTab === "all" && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border-b text-left">
                                        Name
                                    </th>
                                    <th className="py-2 px-4 border-b text-left">
                                        Email
                                    </th>
                                    <th className="py-2 px-4 border-b text-left">
                                        Phone
                                    </th>
                                    <th className="py-2 px-4 border-b text-left">
                                        Member Type
                                    </th>
                                    <th className="py-2 px-4 border-b text-left">
                                        Actions
                                    </th>
                                    <th className="py-2 px-4 border-b text-left">
                                        Login Count
                                    </th>
                                    <th className="py-2 px-4 border-b text-left">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {members.map((member) => (
                                    <tr key={member.id}>
                                        <td className="py-2 px-4 border-b">
                                            {member.name}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {member.email}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {member.phone}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {member.member_type || "Standard"}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {member.login_count}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            <Link
                                                to={`/manager/members/${member.id}`}
                                                className="text-blue-500 hover:underline mr-2"
                                            >
                                                View Details
                                            </Link>
                                        </td>
                                    </tr>
                                ))}

                                {members.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="py-4 text-center text-gray-500"
                                        >
                                            No members found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === "pending" && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border-b text-left">
                                        Name
                                    </th>
                                    <th className="py-2 px-4 border-b text-left">
                                        Email
                                    </th>
                                    <th className="py-2 px-4 border-b text-left">
                                        Phone
                                    </th>
                                    <th className="py-2 px-4 border-b text-left">
                                        Registration Date
                                    </th>
                                    <th className="py-2 px-4 border-b text-left">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingMembers.map((member) => (
                                    <tr key={member.id}>
                                        <td className="py-2 px-4 border-b">
                                            {member.name}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {member.email}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {member.phone}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {new Date(
                                                member.created_at
                                            ).toLocaleDateString()}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            <button
                                                onClick={() =>
                                                    handleApprove(member.id)
                                                }
                                                className="bg-green-500 text-white py-1 px-3 rounded-md text-sm hover:bg-green-600 mr-2"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleReject(member.id)
                                                }
                                                className="bg-red-500 text-white py-1 px-3 rounded-md text-sm hover:bg-red-600"
                                            >
                                                Reject
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                                {pendingMembers.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="py-4 text-center text-gray-500"
                                        >
                                            No pending membership requests.
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

export default MembersList;
