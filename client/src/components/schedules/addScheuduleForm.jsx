import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_SCHEDULE } from './mutations';

function AddScheduleForm({ userId }) {
  const [title, setTitle] = useState('');
  const [addSchedule, { data, loading, error }] = useMutation(ADD_SCHEDULE);

  const handleAddSchedule = async () => {
    try {
      await addSchedule({
        variables: {
          title,
          owner: userId
        }
      });
      console.log('Schedule added successfully!');
      setTitle('');
    } catch (err) {
      console.error('Failed to add schedule:', err);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter schedule title"
      />
      <button onClick={handleAddSchedule} disabled={loading}>
        Add Schedule
      </button>
      {error && <p>Error: {error.message}</p>}
    </div>
  );
}

export default AddScheduleForm;
