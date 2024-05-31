import React, { useState } from 'react';
import { Button, Form, Container } from 'react-bootstrap';

function AddScheduleForm({ onSave }) {
  const [title, setTitle] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({
      title,
      hours: Array(12).fill({ activity: 'Free', amPm: 'AM' })  // Initialize with 12 free hours
    });
    setTitle('');  // Clear the form
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Schedule Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>
        <Button type="submit">Create Schedule</Button>
      </Form>
    </Container>
  );
}

export default AddScheduleForm;
