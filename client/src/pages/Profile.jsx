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

    // State for form inputs
    const [eventName, setEventName] = useState('');
    const [eventDay, setEventDay] = useState('Monday');
    const [eventTime, setEventTime] = useState('');

        // Handle form submission to add events to the schedule
        const handleScheduleSubmit = (e) => {
            e.preventDefault();
            setSchedule(prevSchedule => ({
                ...prevSchedule,
                [eventDay]: [...prevSchedule[eventDay], { name: eventName, time: eventTime }]
            }));
            setEventName('');
            setEventTime('');
        };
    
        if (loading) return <div>Loading...</div>;  // Show loading message while data is being fetched
        if (error) return <div>Error: {error.message}</div>;  // Show error message if fetching fails
    
        const user = data.user;  // Extract user data from query result

        return (
            <Container>
                {/* User Profile Information */}
                <Row>
                    <Col>
                        <p>Email: {user.email}</p>
                        <p>Username: {user.username}</p>
                    </Col>
                </Row>
            {/* Form to create a schedule event */}
            <Row>
                <Col>
                    <h2>Create Your Schedule</h2>
                    <Form onSubmit={handleScheduleSubmit}>
                        <Form.Group controlId="event-name">
                            <Form.Label>Event Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={eventName}
                                onChange={(e) => setEventName(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="event-day">
                            <Form.Label>Day</Form.Label>
                            <Form.Control
                                as="select"
                                value={eventDay}
                                onChange={(e) => setEventDay(e.target.value)}
                                required
                            >
                                <option value="Monday">Monday</option>
                                <option value="Tuesday">Tuesday</option>
                                <option value="Wednesday">Wednesday</option>
                                <option value="Thursday">Thursday</option>
                                <option value="Friday">Friday</option>
                                <option value="Saturday">Saturday</option>
                                <option value="Sunday">Sunday</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="event-time">
                            <Form.Label>Event Time</Form.Label>
                            <Form.Control
                                type="time"
                                value={eventTime}
                                onChange={(e) => setEventTime(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Button type="submit">Add Event</Button>
                    </Form>
                </Col>
            </Row>
            {/* Weekly Schedule Display */}
            <Row>
                <Col>
                    <h2>Weekly Schedule</h2>
                    <Row>
                        {Object.keys(schedule).map(day => (
                            <Col key={day} md={4} lg={3}>
                                <Card>
                                    <Card.Header>{day}</Card.Header>
                                    <ListGroup variant="flush">
                                        {schedule[day].length === 0 ? (
                                            <ListGroup.Item>No events</ListGroup.Item>
                                        ) : (
                                            schedule[day].map((event, index) => (
                                                <ListGroup.Item key={index}>
                                                    {event.time} - {event.name}
                                                </ListGroup.Item>
                                            ))
                                        )}
                                    </ListGroup>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}
export default Profile;

