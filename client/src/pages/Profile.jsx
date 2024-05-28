import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function Profile() {
    const { username } = useParams(); // Using URL parameter to fetch profile details
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Simulated fetch function
    const fetchUserData = async (username) => {
        try {
            // Placeholder
            const data = { name: "John Doe", email: "johndoe@example.com" }; // Mock data
            setUser(data);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch user data:", err);
            setError('Failed to fetch data');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData(username);
    }, [username]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>Profile: {user.name}</h1>
            <p>Email: {user.email}</p>
            {/* More user details can be added here */}
        </div>
    );
}

export default Profile;
