import React, { useState } from 'react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { ADD_SCHEDULE } from '../../graphql/mutations';

function AddScheduleForm({ user }) {
  const [title, setTitle] = useState('');
  const [activities, setActivities] = useState(Array(24).fill({ title: '' }));
  const [addSchedule] = useMutation(ADD_SCHEDULE);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleActivityChange = (index, value) => {
    const newActivities = [...activities];
    newActivities[index] = { title: value || '' };
    setActivities(newActivities);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user || !user._id) {
      console.error('User is not defined or does not have an _id');
      alert('User is not defined. Please log in.');
      return;
    }

    try {
      const { data } = await addSchedule({
        variables: {
          title,
          owner: user._id,
          activities,
        },
      });
      console.log('Schedule created successfully:', data);
      alert('Schedule created successfully!');
      setTitle('');
      setActivities(Array(24).fill({ title: '' }));
    } catch (error) {
      console.error('Error creating schedule:', error);
      if (error.graphQLErrors) {
        console.error('GraphQL Errors:', JSON.stringify(error.graphQLErrors, null, 2));
      }
      if (error.networkError) {
        console.error('Network Error:', JSON.stringify(error.networkError, null, 2));
      }
      alert('Failed to create schedule');
    }
  };

  const formatHour = (hour) => {
    const isPM = hour >= 12;
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${formattedHour} ${isPM ? 'PM' : 'AM'}`;
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Schedule Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter schedule title"
            value={title}
            onChange={handleTitleChange}
            required
          />
        </Form.Group>
        {activities.map((activity, index) => (
          <Row key={index} className="mb-3">
            <Col xs={4}>
              <Form.Label>{formatHour(index)}:</Form.Label>
            </Col>
            <Col>
              <Form.Control
                type="text"
                placeholder={`Activity for ${formatHour(index)}`}
                value={activity.title}
                onChange={(e) => handleActivityChange(index, e.target.value)}
              />
            </Col>
          </Row>
        ))}
        <Button type="submit">Create Schedule</Button>
      </Form>
    </Container>
  );
}

export default AddScheduleForm;
