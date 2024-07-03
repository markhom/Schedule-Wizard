import './Profile.css';
import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Container, Row, Col, Card, ListGroup, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ME } from '../graphql/queries';
import { DELETE_SCHEDULE, REMOVE_ACTIVITY, UPDATE_ACTIVITY } from '../graphql/mutations';
import AddActivityButton from '../components/schedules/AddActivityButton';
import UpdateActivityButton from '../components/schedules/UpdateActivityButton';
import RemoveActivityButton from '../components/schedules/RemoveActivityButton';


function Profile() {
    const { loading, error, data, refetch } = useQuery(ME);
    const [deleteSchedule] = useMutation(DELETE_SCHEDULE, {
        onCompleted: () => refetch(),
        onError: (error) => console.error('Error deleting schedule:', error)
    });
    const [removeActivity] = useMutation(REMOVE_ACTIVITY, {
        onCompleted: () => refetch(), // Optionally refetch queries or update the cache
        onError: (error) => console.error('Error removing activity:', error)
    });
    const [updateActivity] = useMutation(UPDATE_ACTIVITY, {
        onCompleted: () => refetch(), // Optionally refetch queries or update the cache
        onError: (error) => console.error('Error updating activity:', error)
    });

    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');

    if (loading) return <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>Loading...</Container>;
    if (error) return <Container className="mt-5"><Alert variant="danger">Error: {error.message}</Alert></Container>;

    const userData = data?.me || {};

    const handleDeleteSchedule = async (scheduleId) => {
        await deleteSchedule({ variables: { scheduleId, userId: userData._id } });
    };

    const handleDeleteActivity = async (activityId) => {
        await removeActivity({ variables: { activityId } });
    };

    const handleUpdateActivity = async (activityId, title, description) => {
        await updateActivity({ variables: { activityId, title, description } });
    };

    return (
        <Container className="mt-5">
            {showNotification && (
                <Alert variant="success" className="fixed-alert" onClose={() => setShowNotification(false)} dismissible>
                    {notificationMessage}
                </Alert>
            )}
            <Row className="mb-4">
                {/* User card code */}
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
                                    <div>
                                        <Button variant="info" onClick={() => { document.location.replace(`/update/${schedule._id}`) }}>Update</Button>
                                        <Button variant="danger" onClick={() => handleDeleteSchedule(schedule._id)}>Delete</Button>
                                    </div>
                                </Card.Header>
                                <ListGroup variant="flush">
                                    {schedule.activities.map(activity => (
                                        <ListGroup.Item key={activity._id} className="d-flex justify-content-between align-items-center">
                                            {activity.title}
                                            <div>
                                                <UpdateActivityButton activity={activity} onActivityUpdate={handleUpdateActivity} />
                                                <RemoveActivityButton activityId={activity._id} onActivityDelete={handleDeleteActivity} />
                                            </div>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                                <Card.Footer>
                                    <AddActivityButton scheduleId={schedule._id} />
                                </Card.Footer>
                            </Card>
                        ))
                    )}
                </Col>
            </Row>
        </Container>
    );
}

export default Profile;
