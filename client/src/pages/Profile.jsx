// import { useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { useQuery, gql } from '@apollo/client';
// import { Container, Row, Col, Form, Button, Card, ListGroup, Spinner } from 'react-bootstrap';

// // Define GraphQL query to get user data
// const GET_USER = gql`
//     query GetUser($username: String!) {
//         user(username: $username) {
//             _id
//             email
//             username
//         }
//     }
// `;

// // Define GraphQL query to get user schedules
// const GET_USER_SCHEDULES = gql`
//     query getUserSchedules($userId: ID!) {
//         userSchedules(userId: $userId) {
//             _id
//             title
//             activities {
//                 title
//             }
//             createdAt
//             updatedAt
//         }
//     }
// `;

// function Profile() {
//     const { username } = useParams();  // Get the 'username' parameter from the URL
//     const { loading: userLoading, error: userError, data: userData } = useQuery(GET_USER, { variables: { username } });  // Fetch user data with Apollo Client 

//     const userId = userData?.user?._id;
//     const { loading: schedulesLoading, error: schedulesError, data: schedulesData } = useQuery(GET_USER_SCHEDULES, { variables: { userId }, skip: !userId });  // Fetch user schedules

//     // State to manage the user's schedule (this is for the local state management)
//     const [schedule, setSchedule] = useState({
//         Monday: [],
//         Tuesday: [],
//         Wednesday: [],
//         Thursday: [],
//         Friday: [],
//         Saturday: [],
//         Sunday: []
//     });

//     // State for form inputs
//     const [eventName, setEventName] = useState('');
//     const [eventDay, setEventDay] = useState('Monday');
//     const [eventTime, setEventTime] = useState('');

//     // Handle form submission to add events to the schedule (local state management)
//     const handleScheduleSubmit = (e) => {
//         e.preventDefault();
//         setSchedule(prevSchedule => ({
//             ...prevSchedule,
//             [eventDay]: [...prevSchedule[eventDay], { name: eventName, time: eventTime }]
//         }));
//         setEventName('');
//         setEventTime('');
//     };

//     if (userLoading || schedulesLoading) return <Spinner animation="border" />;
//     if (userError) return <div>Error: {userError.message}</div>;
//     if (schedulesError) return <div>Error: {schedulesError.message}</div>;

//     const user = userData.user;  // Extract user data from query result

//     return (
//         <Container>
//             {/* User Profile Information */}
//             <Row>
//                 <Col>
//                     <p>Email: {user.email}</p>
//                     <p>Username: {user.username}</p>
//                 </Col>
//             </Row>

//             {/* Form to create a schedule event (local state management) */}
//             <Row>
//                 <Col>
//                     <h2>Create Your Schedule</h2>
//                     <Form onSubmit={handleScheduleSubmit}>
//                         <Form.Group controlId="event-name">
//                             <Form.Label>Event Name</Form.Label>
//                             <Form.Control
//                                 type="text"
//                                 value={eventName}
//                                 onChange={(e) => setEventName(e.target.value)}
//                                 required
//                             />
//                         </Form.Group>
//                         <Form.Group controlId="event-day">
//                             <Form.Label>Day</Form.Label>
//                             <Form.Control
//                                 as="select"
//                                 value={eventDay}
//                                 onChange={(e) => setEventDay(e.target.value)}
//                                 required
//                             >
//                                 <option value="Monday">Monday</option>
//                                 <option value="Tuesday">Tuesday</option>
//                                 <option value="Wednesday">Wednesday</option>
//                                 <option value="Thursday">Thursday</option>
//                                 <option value="Friday">Friday</option>
//                                 <option value="Saturday">Saturday</option>
//                                 <option value="Sunday">Sunday</option>
//                             </Form.Control>
//                         </Form.Group>
//                         <Form.Group controlId="event-time">
//                             <Form.Label>Event Time</Form.Label>
//                             <Form.Control
//                                 type="time"
//                                 value={eventTime}
//                                 onChange={(e) => setEventTime(e.target.value)}
//                                 required
//                             />
//                         </Form.Group>
//                         <Button type="submit">Add Event</Button>
//                     </Form>
//                 </Col>
//             </Row>

//             {/* Weekly Schedule Display (local state management) */}
//             <Row>
//                 <Col>
//                     <h2>Weekly Schedule</h2>
//                     <Row>
//                         {Object.keys(schedule).map(day => (
//                             <Col key={day} md={4} lg={3}>
//                                 <Card>
//                                     <Card.Header>{day}</Card.Header>
//                                     <ListGroup variant="flush">
//                                         {schedule[day].length === 0 ? (
//                                             <ListGroup.Item>No events</ListGroup.Item>
//                                         ) : (
//                                             schedule[day].map((event, index) => (
//                                                 <ListGroup.Item key={index}>
//                                                     {event.time} - {event.name}
//                                                 </ListGroup.Item>
//                                             ))
//                                         )}
//                                     </ListGroup>
//                                 </Card>
//                             </Col>
//                         ))}
//                     </Row>
//                 </Col>
//             </Row>

//             {/* User Schedules from GraphQL */}
//             <Row>
//                 <Col>
//                     <h2>User Schedules</h2>
//                     <ListGroup>
//                         {schedulesData.userSchedules.map((schedule) => (
//                             <ListGroup.Item key={schedule._id}>
//                                 <h3>{schedule.title}</h3>
//                                 <ul>
//                                     {schedule.activities.map((activity, index) => (
//                                         <li key={index}>{activity.title}</li>
//                                     ))}
//                                 </ul>
//                                 <p>Created At: {new Date(schedule.createdAt).toLocaleString()}</p>
//                                 <p>Updated At: {new Date(schedule.updatedAt).toLocaleString()}</p>
//                             </ListGroup.Item>
//                         ))}
//                     </ListGroup>
//                 </Col>
//             </Row>
//         </Container>
//     );
// }


import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import { Container, Row, Col, Card, ListGroup } from 'react-bootstrap';

const GET_USER = gql`
  query GetUser($username: String!) {
    user(username: $username) {
      email
      username
      schedules {
        _id
        title
        activities {
          _id
          title
        }
      }
    }
  }
`;

function Profile() {
    const { username } = useParams();  // Get the 'username' parameter from the URL
    const { loading, error, data, refetch } = useQuery(GET_USER, { variables: { username } });  // Fetch user data with Apollo Client 

    useEffect(() => {
        console.log(`Profile.jsx - username from URL: ${username}`);
    }, [username]);

    if (loading) return <div>Loading...</div>;  // Show loading message while data is being fetched
    if (error) return <div>Error: {error.message}</div>;  // Show error message if fetching fails

    const user = data.user;  // Extract user data from query result

    return (
        <Container>
            {/* User Profile Information */}
            <Row>
                <Col>
                    <p class='siteText'>Email: {user.email}</p>
                    <p class ='siteText'>Username: {user.username}</p>
                </Col>
            </Row>
            {/* Display user's schedules */}
            <Row>
                <Col>
                    <h2>Your Schedules</h2>
                    {user.schedules.length === 0 ? (
                        <p class='siteText'>No schedules available</p>
                    ) : (
                        user.schedules.map(schedule => (
                            <Card key={schedule._id}>
                                <Card.Header>
                                    <Link to={`/schedules/${schedule._id}`}>{schedule.title}</Link>
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