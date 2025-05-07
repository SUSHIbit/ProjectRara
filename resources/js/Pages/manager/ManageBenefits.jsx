import React, { useState, useEffect } from "react";
import axios from "axios";

const ManageBenefits = () => {
    const [members, setMembers] = useState([]);
    const [selectedMember, setSelectedMember] = useState("");
    const [benefits, setBenefits] = useState([]);
    const [formData, setFormData] = useState({
        type: "discount",
        value: "",
        threshold: "",
        is_active: true,
    });
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            const response = await axios.get("/api/members");
            // Filter out only active members
            const activeMembers = response.data.filter(
                (member) => member.is_member
            );
            setMembers(activeMembers);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching members:", error);
            setError("Failed to load members.");
            setLoading(false);
        }
    };

    const fetchMemberBenefits = async (memberId) => {
        if (!memberId) return;

        try {
            setLoading(true);
            const response = await axios.get(
                `/api/members/${memberId}/benefits`
            );
            setBenefits(response.data);
            setSelectedMember(memberId);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching benefits:", error);
            setError("Failed to load member benefits.");
            setLoading(false);
        }
    };

    const handleMemberChange = (e) => {
        const memberId = e.target.value;
        setSelectedMember(memberId);
        fetchMemberBenefits(memberId);
        resetForm();
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const resetForm = () => {
        setFormData({
            type: "discount",
            value: "",
            threshold: "",
            is_active: true,
        });
        setEditingId(null);
        setError("");
        setSuccess("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            if (editingId) {
                // Update existing benefit
                await axios.put(`/api/benefits/${editingId}`, formData);
                setSuccess("Benefit updated successfully.");
            } else {
                // Create new benefit
                await axios.post("/api/benefits", {
                    user_id: selectedMember,
                    ...formData,
                });
                setSuccess("Benefit added successfully.");
            }

            // Refresh benefits list
            fetchMemberBenefits(selectedMember);
            resetForm();
        } catch (error) {
            console.error("Error saving benefit:", error);

            if (error.response && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError("Failed to save benefit. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (benefit) => {
        setFormData({
            type: benefit.type,
            value: benefit.value,
            threshold: benefit.threshold,
            is_active: benefit.is_active,
        });
        setEditingId(benefit.id);
        setError("");
        setSuccess("");
    };

    const handleDelete = async (benefitId) => {
        if (!window.confirm("Are you sure you want to delete this benefit?")) {
            return;
        }

        setLoading(true);

        try {
            await axios.delete(`/api/benefits/${benefitId}`);
            setSuccess("Benefit deleted successfully.");

            // Refresh benefits list
            fetchMemberBenefits(selectedMember);
        } catch (error) {
            console.error("Error deleting benefit:", error);
            setError("Failed to delete benefit.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold mb-6">
                    Manage Member Benefits
                </h1>

                <div className="mb-6">
                    <label
                        className="block text-gray-700 mb-2"
                        htmlFor="member"
                    >
                        Select Member
                    </label>
                    <select
                        id="member"
                        value={selectedMember}
                        onChange={handleMemberChange}
                        className="w-full border rounded-md px-3 py-2"
                    >
                        <option value="">Select a member</option>
                        {members.map((member) => (
                            <option key={member.id} value={member.id}>
                                {member.name} ({member.phone})
                            </option>
                        ))}
                    </select>
                </div>

                {selectedMember && (
                    <>
                        <div className="border-t pt-6 mb-6">
                            <h2 className="text-xl font-semibold mb-4">
                                {editingId ? "Edit Benefit" : "Add New Benefit"}
                            </h2>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-2">
                                        Benefit Type
                                    </label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="type"
                                                value="discount"
                                                checked={
                                                    formData.type === "discount"
                                                }
                                                onChange={handleInputChange}
                                                className="mr-2"
                                            />
                                            Discount
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="type"
                                                value="loyalty"
                                                checked={
                                                    formData.type === "loyalty"
                                                }
                                                onChange={handleInputChange}
                                                className="mr-2"
                                            />
                                            Loyalty (Free Visit)
                                        </label>
                                    </div>
                                </div>

                                {formData.type === "discount" ? (
                                    <div className="mb-4">
                                        <label
                                            className="block text-gray-700 mb-2"
                                            htmlFor="value"
                                        >
                                            Discount Percentage (%)
                                        </label>
                                        <input
                                            type="number"
                                            id="value"
                                            name="value"
                                            value={formData.value}
                                            onChange={handleInputChange}
                                            className="w-full border rounded-md px-3 py-2"
                                            min="0"
                                            max="100"
                                            required
                                        />
                                        <p className="text-sm text-gray-500 mt-1">
                                            Enter a percentage from 0-100
                                        </p>
                                    </div>
                                ) : (
                                    <div className="mb-4">
                                        <label
                                            className="block text-gray-700 mb-2"
                                            htmlFor="threshold"
                                        >
                                            Visit Threshold
                                        </label>
                                        <input
                                            type="number"
                                            id="threshold"
                                            name="threshold"
                                            value={formData.threshold}
                                            onChange={handleInputChange}
                                            className="w-full border rounded-md px-3 py-2"
                                            min="1"
                                            required
                                        />
                                        <p className="text-sm text-gray-500 mt-1">
                                            Number of visits needed before free
                                            visit is earned
                                        </p>
                                    </div>
                                )}

                                <div className="mb-4">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            name="is_active"
                                            checked={formData.is_active}
                                            onChange={handleInputChange}
                                            className="mr-2"
                                        />
                                        <span>Benefit is Active</span>
                                    </label>
                                </div>

                                {error && (
                                    <div className="text-red-500 mb-4">
                                        {error}
                                    </div>
                                )}

                                {success && (
                                    <div className="text-green-500 mb-4">
                                        {success}
                                    </div>
                                )}

                                <div className="flex gap-2">
                                    <button
                                        type="submit"
                                        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
                                        disabled={loading}
                                    >
                                        {loading
                                            ? "Saving..."
                                            : editingId
                                            ? "Update Benefit"
                                            : "Add Benefit"}
                                    </button>

                                    {editingId && (
                                        <button
                                            type="button"
                                            onClick={resetForm}
                                            className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 transition duration-200"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        <div className="border-t pt-6">
                            <h2 className="text-xl font-semibold mb-4">
                                Current Benefits
                            </h2>

                            {benefits.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full bg-white">
                                        <thead>
                                            <tr>
                                                <th className="py-2 px-4 border-b text-left">
                                                    Type
                                                </th>
                                                <th className="py-2 px-4 border-b text-left">
                                                    Value/Threshold
                                                </th>
                                                <th className="py-2 px-4 border-b text-left">
                                                    Status
                                                </th>
                                                <th className="py-2 px-4 border-b text-left">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {benefits.map((benefit) => (
                                                <tr key={benefit.id}>
                                                    <td className="py-2 px-4 border-b">
                                                        {benefit.type ===
                                                        "discount"
                                                            ? "Discount"
                                                            : "Loyalty (Free Visit)"}
                                                    </td>
                                                    <td className="py-2 px-4 border-b">
                                                        {benefit.type ===
                                                        "discount"
                                                            ? `${benefit.value}% off`
                                                            : `Free visit after ${benefit.threshold} visits`}
                                                    </td>
                                                    <td className="py-2 px-4 border-b">
                                                        {benefit.is_active ? (
                                                            <span className="text-green-600">
                                                                Active
                                                            </span>
                                                        ) : (
                                                            <span className="text-red-600">
                                                                Inactive
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="py-2 px-4 border-b">
                                                        <button
                                                            onClick={() =>
                                                                handleEdit(
                                                                    benefit
                                                                )
                                                            }
                                                            className="text-blue-500 hover:underline mr-2"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    benefit.id
                                                                )
                                                            }
                                                            className="text-red-500 hover:underline"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-gray-500">
                                    No benefits have been added for this member
                                    yet.
                                </p>
                            )}
                        </div>
                    </>
                )}

                {!selectedMember && (
                    <div className="text-center p-6 text-gray-500">
                        Please select a member to manage their benefits.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageBenefits;
