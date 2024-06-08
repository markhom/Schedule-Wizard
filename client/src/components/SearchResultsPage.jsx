import React from 'react';
import { useLocation } from 'react-router-dom';

function SearchResultsPage() {
  const location = useLocation();
  const { users, schedules } = location.state || { users: [], schedules: [] };  // Safely access state

  return (
    <div>
      <h1>Search Results</h1>
      <div>
        <h2>Users</h2>
        {users.map(user => (
          <div key={user._id}>{user.username} - {user.email}</div>
        ))}
        <h2>Schedules</h2>
        {schedules.map(schedule => (
          <div key={schedule._id}>{schedule.title}</div>
        ))}
      </div>
    </div>
  );
}

export default SearchResultsPage;
