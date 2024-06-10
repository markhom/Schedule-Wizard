import React, { useState } from 'react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { ADD_SCHEDULE } from '../../graphql/mutations';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function AddScheduleForm({ user }) {
  const [title, setTitle] = useState('');
  const [selectedDay, setSelectedDay] = useState(null);
  const [activities, setActivities] = useState(
    Array.from({ length: 7 }, () =>
      Array(17).fill(null).map(() => ({
        title: '',
        startTime: '',
        endTime: '',
        description: '',
        day: '' // Add day field to each activity
      }))
    )
  );
  const [addSchedule] = useMutation(ADD_SCHEDULE);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user || !user._id) {
      console.error('User is not defined or does not have an _id');
      alert('User is not defined. Please log in.');
      return;
    }

    const formattedActivities = activities.flat().filter(activity => activity.title && activity.startTime && activity.endTime).map(activity => ({
      ...activity,
      startTime: parseTime(activity.startTime),
      endTime: parseTime(activity.endTime)
    }));
    
    console.log("Formatted activities being submitted:", formattedActivities);

    try {
      const { data } = await addSchedule({
        variables: {
          title,
          activities: formattedActivities,
        },
      });
      console.log('Schedule created successfully:', data);
       document.location.replace('/')
      
      // Reset activities
      setTitle('');
      setActivities(Array.from({ length: 7 }, () => Array(17).fill({ title: '', startTime: '', endTime: '', description: '', day: '' })));
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

  const parseTime = (timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const now = new Date();
    now.setHours(hours);
    now.setMinutes(minutes);
    now.setSeconds(0);
    now.setMilliseconds(0);
    console.log("Parsed time:", now); // Debug statement
    return now.toISOString();
  };

  const handleActivityChange = (dayIndex, hourIndex, field, value) => {
    const updatedActivities = activities.map((day, idx) =>
      idx === dayIndex
        ? day.map((activity, hIdx) =>
            hIdx === hourIndex ? { ...activity, [field]: value, day: daysOfWeek[dayIndex] } : activity
          )
        : day
    );
  
    setActivities(updatedActivities);
  };

  return (
    <Container fluid>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Schedule Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter schedule title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>
        {daysOfWeek.map((day, dayIndex) => (
          <Button key={day} onClick={() => setSelectedDay(dayIndex)}>
            {day}
          </Button>
        ))}
        {selectedDay !== null && (
          <div>
            {activities[selectedDay].map((activity, hourIndex) => (

              <Row key={hourIndex}>
                <Col>
                  <Form.Control
                    type="text"
                    placeholder="Activity Title"
                    value={activity.title}
                    onChange={(e) => handleActivityChange(selectedDay, hourIndex, 'title', e.target.value)}
                  />
                </Col>
                <Col>
                  <Form.Control
                    type="time"
                    value={activity.startTime}
                    onChange={(e) => handleActivityChange(selectedDay, hourIndex, 'startTime', e.target.value)}
                  />
                </Col>
                <Col>
                  <Form.Control
                    type="time"
                    value={activity.endTime}
                    onChange={(e) => handleActivityChange(selectedDay, hourIndex, 'endTime', e.target.value)}
                  />
                </Col>
                <Col>
                  <Form.Control
                    type="text"
                    placeholder="Description"
                    value={activity.description}
                    onChange={(e) => handleActivityChange(selectedDay, hourIndex, 'description', e.target.value)}
                  />
                </Col>
              </Row>
              
            ))}
          </div>
        )}
        <Button type="submit" variant="warning">Create Schedule</Button>
      </Form>
    </Container>
  );
}

export default AddScheduleForm;