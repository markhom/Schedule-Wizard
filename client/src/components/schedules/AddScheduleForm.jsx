import React, { useState } from 'react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { ADD_SCHEDULE } from '../../graphql/mutations';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function AddScheduleForm({ user }) {
  const [title, setTitle] = useState('');
  const [selectedDay, setSelectedDay] = useState(null);
  const [activities, setActivities] = useState(
    Array.from({ length: 7 }, () => Array(17).fill(''))
  );
  const [addSchedule] = useMutation(ADD_SCHEDULE);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
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
      setActivities(Array.from({ length: 7 }, () => Array(17).fill('')));
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

  const handleDayClick = (dayIndex) => {
    setSelectedDay(selectedDay === dayIndex ? null : dayIndex);
  };

  const handleActivityChange = (dayIndex, hourIndex, value) => {
    const newActivities = [...activities];
    newActivities[dayIndex][hourIndex] = value;
    setActivities(newActivities);
  };

  return (
    <Container fluid>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label className="h4">Schedule Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter schedule title"
            value={title}
            onChange={handleTitleChange}
            required
            style={{ fontSize: '14px' }}
          />
        </Form.Group>
        <Row className="mb-3">
          {daysOfWeek.map((day, dayIndex) => (
            <Col key={dayIndex} xs={6} sm={4} md={2} lg={1} className="text-center mb-2">
              <Button
                variant={selectedDay === dayIndex ? 'primary' : 'secondary'}
                onClick={() => handleDayClick(dayIndex)}
                block
                style={{ minWidth: '100px' }}
              >
                {day}
              </Button>
              {selectedDay === dayIndex && (
                <div className="mt-2">
                  {Array.from({ length: 17 }).map((_, hourIndex) => (
                    <Row key={hourIndex}>
                      <Col xs={4} className="text-end">
                        <span>{formatHour(hourIndex + 6)}</span>
                      </Col>
                      <Col xs={8}>
                        <Form.Control
                          type="text"
                          placeholder=""
                          value={activities[dayIndex][hourIndex]}
                          onChange={(e) => handleActivityChange(dayIndex, hourIndex, e.target.value)}
                          style={{ fontSize: '12px', marginBottom: '8px', minWidth: '300px' }}
                        />
                      </Col>
                    </Row>
                  ))}
                </div>
              )}
            </Col>
          ))}
        </Row>
        <Button type="submit" className="mt-3" variant="primary">Create Schedule</Button>
      </Form>
    </Container>
  );
}

export default AddScheduleForm;

