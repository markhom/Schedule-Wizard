import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_SCHEDULES } from '../../graphql/queries';
import { Link } from 'react-router-dom';


function AllSchedules() {
    const { loading, error, data } = useQuery(GET_SCHEDULES);
  
    if (loading) return <p>Loading schedules...</p>;
    if (error) return <p>Error loading schedules: {error.message}</p>;
  
    return (
      <div>
        <h2>All Schedules</h2>
        <ul>
          {data.getSchedules.map(schedule => (
            <li key={schedule._id}>
            <Link to={`/schedule/${schedule._id}`}>{schedule.title}</Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  

export default AllSchedules;
