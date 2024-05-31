import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import { Container, Row, Col, Form, Button, Card, ListGroup } from 'react-bootstrap';

// Define GraphQL query to get user data
const GET_USER = gql`
    query GetUser($username: String!) {
        user(username: $username) {
            email
            username
        }
    }
`;
function Profile() {
    const { username } = useParams();  // Get the 'username' parameter from the URL
    const { loading, error, data } = useQuery(GET_USER, { variables: { username } });  // Fetch user data with Apollo Client 

        // State to manage the user's schedule
        const [schedule, setSchedule] = useState({
            Monday: [],
            Tuesday: [],
            Wednesday: [],
            Thursday: [],
            Friday: [],
            Saturday: [],
            Sunday: []
        });
    // State variables to manage user data, loading status, and any errors
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to fetch user data from an API
    const fetchUserData = async (username) => {
        try {
            // Make an API request to fetch user data
            const response = await fetch(`api/user/${username}`);
            
            // Check if the response is successful
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Parse the JSON data from the response
            const data = await response.json();

            // Update the state with the fetched user data and set loading to false
            setUser(data);
            setLoading(false);
        } catch (err) {
            // Handle any errors by logging them and updating the error state
            console.error("Failed to fetch user data:", err);
            setError('Failed to fetch data');
            setLoading(false);
        }
    };

    // useEffect hook to fetch user data when the component mounts or when 'username' changes
    useEffect(() => {
        fetchUserData(username);
    }, [username]);

    // Conditional rendering based on loading, error, and user data states
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>; 

    // Render the user's profile information
    return (
        <div>
            <p>Email: {user.email}</p>
            <p>Username: {user.username}</p>
            {/* More user details can be added here */}
        </div>
    );
}

export default Profile;

