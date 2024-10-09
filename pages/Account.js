import React, { useState } from 'react';
import dbConnect from '@/middleware/mongoose'; // Import your DB connection
import RegisteredBakeries from '@/models/signupmodel'; // Import your model
import { verifyToken } from '@/middleware/auth';

const Account = ({ user, error }) => {
    // Handle if there's an error fetching the user
    if (error) {
        return <div>Error: {error}</div>;
    }

    // Display loading state until user data is fetched (handled by server-side props)
    if (!user) {
        return <div>Loading...</div>;
    }

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        restrauntName: user.restrauntName,
        email: user.email,
        address: user.address,
        number: user.number,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/updateUser', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                throw new Error('Failed to update user data');
            }
            const data = await response.json();

            // Update the local user state with the new data
            setFormData(data.user); // Update formData with returned user data
            setIsEditing(false); // Exit edit mode
        } catch (err) {
            console.error(err);
            alert('Error updating user data. Please try again.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-full max-w-md mx-auto p-4 bg-white shadow-lg rounded-lg border border-gray-200">
                <h1 className="text-2xl font-bold mb-4 text-center">Account Information</h1>
                {isEditing ? (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label>Restaurant Name:</label>
                            <input
                                type="text"
                                name="restrauntName"
                                value={formData.restrauntName}
                                onChange={handleChange}
                                className="border rounded p-2 w-full"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label>Email:</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="border rounded p-2 w-full"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label>Address:</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="border rounded p-2 w-full"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label>Phone Number:</label>
                            <input
                                type="text"
                                name="number"
                                value={formData.number}
                                onChange={handleChange}
                                className="border rounded p-2 w-full"
                                required
                            />
                        </div>
                        <div className="flex justify-between mt-4">
                            <button type="submit" className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded">
                                Save
                            </button>
                            <button type="button" onClick={handleCancel} className="bg-gray-300 hover:bg-gray-500 text-black py-2 px-4 rounded">
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <>
                        <p><strong>Restaurant Name:</strong> {formData.restrauntName}</p>
                        <p><strong>Email:</strong> {formData.email}</p>
                        <p><strong>Address:</strong> {formData.address}</p>
                        <p><strong>Phone Number:</strong> {formData.number}</p>
                        <button onClick={handleEdit} className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded mt-4">
                            Edit
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

// Implement getServerSideProps to fetch user data
export async function getServerSideProps(context) {
    await dbConnect(); // Ensure the database is connected

    const user = verifyToken(context.req); // Use your verifyToken function to get user info

    if (!user) {
        return {
            redirect: {
                destination: '/Login',
                permanent: false,
            },
        };
    }

    try {
        const bakeryOwner = await RegisteredBakeries.findById(user.userId).select('-password').lean(); // Fetch the user, excluding the password
        if (!bakeryOwner) {
            return {
                notFound: true, // If no user found, show 404
            };
        }

        return {
            props: {
                user: JSON.parse(JSON.stringify(bakeryOwner)), // Pass user data as props
            },
        };
    } catch (error) {
        console.error(error);
        return {
            props: {
                error: 'Failed to fetch user data', // Handle error during fetch
            },
        };
    }
}

export default Account;
