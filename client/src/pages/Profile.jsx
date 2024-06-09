import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { Container, Row, Col, Card, ListGroup, Button, Alert } from 'react-bootstrap';
import { ME } from '../graphql/queries';
import { DELETE_SCHEDULE } from '../graphql/mutations';

function Profile() {
    const { username } = useParams();
    const { loading, error, data, refetch } = useQuery(ME, { variables: { username } });
    const [deleteSchedule] = useMutation(DELETE_SCHEDULE, {
        onCompleted: (data) => {
            console.log('Deleted schedule and fetched updated user:', data);
            refetch();
        },
        onError: (error) => console.error('Error deleting schedule:', error)
    });

    useEffect(() => {
        console.log(`Profile.jsx - username from URL: ${username}`);
    }, [username]);

    if (loading) return (
        <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            Loading...
        </Container>
    );

    if (error) return (
        <Container className="mt-5">
            <Alert variant="danger">Error: {error.message}</Alert>
        </Container>
    );

    const userData = data?.me || {};

    const handleDelete = async (scheduleId) => {
        try {
            await deleteSchedule({ variables: { scheduleId, userId: userData._id } });
            alert('Schedule deleted successfully');
        } catch (error) {
            console.error('Error deleting schedule:', error);
            alert('Failed to delete schedule');
        }
    };

    return (
        <Container className="mt-5">
            <Row className="mb-4">
                <Col md={{ span: 6, offset: 3 }}>
                    <Card className="text-center bg-success text-white">
                        <Card.Header as="h5" className="bg-dark text-white">User Profile</Card.Header>
                        <Card.Body>
                            <Card.Text>
                                <strong>Email:</strong> {userData.email}
                            </Card.Text>
                            <Card.Text>
                                <strong>Username:</strong> {userData.username}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col md={{ span: 8, offset: 2 }}>
                    <h2 className="text-center mb-4 text-success">Your Schedules</h2>
                    {userData.schedules.length === 0 ? (
                        <Alert variant="info">No schedules available</Alert>
                    ) : (
                        userData.schedules.map(schedule => (
                            <Card key={schedule._id} className="mb-3">
                                <Card.Header as="h5" className="bg-success text-white d-flex justify-content-between align-items-center">
                                    <Link to={`/schedule/${schedule._id}`} className="text-white">
                                        {schedule.title}
                                    </Link>
                                    <Button variant="danger" onClick={() => handleDelete(schedule._id)}>Delete</Button>
                                </Card.Header>
                                <ListGroup variant="flush">
                                    {schedule.activities.map(activity => (
                                        <ListGroup.Item key={activity._id}>{activity.title}</ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </Card>
                        ))
                    )}
                </Col>
            </Row>
        </Container>
    );
}

export default Profile;
