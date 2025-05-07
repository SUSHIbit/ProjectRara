import React from "react";
import { Link } from "react-router-dom";

const ThankYou = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
                <svg
                    className="w-16 h-16 text-green-500 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                    ></path>
                </svg>

                <h1 className="text-2xl font-bold mb-4">
                    Registration Complete!
                </h1>

                <p className="text-gray-600 mb-6">
                    Thank you for registering with our Member Management System.
                    Your account has been created successfully.
                </p>

                {/* Different messages based on membership status */}
                <div className="mb-6 p-4 bg-blue-50 rounded-md">
                    <h2 className="font-semibold text-blue-800 mb-2">
                        What's Next?
                    </h2>
                    <p className="text-gray-700">
                        You can now login to your account. If you applied for
                        membership, your application will be reviewed by our
                        staff and you'll be notified once it's approved.
                    </p>
                </div>

                <div className="flex flex-col space-y-3">
                    <Link
                        to="/login"
                        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
                    >
                        Login to Your Account
                    </Link>

                    <Link to="/" className="text-blue-500 hover:underline">
                        Return to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ThankYou;
