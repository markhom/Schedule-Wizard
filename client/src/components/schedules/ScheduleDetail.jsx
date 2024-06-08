import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_ONE_SCHEDULE } from '../../graphql/queries';

function ScheduleDetail() {
    const { scheduleId } = useParams();
    const { loading, error, data } = useQuery(GET_ONE_SCHEDULE, {
        variables: { scheduleId }
    });

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading schedule details: {error.message}</div>;
    if (!data || !data.getOneSchedule) return <div>No schedule found.</div>;

    const scheduleData = data.getOneSchedule;
    const activities = scheduleData.activities || [];

    const formatTime = (timestamp) => {
        const date = new Date(parseInt(timestamp) * 1000);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div>
            <h1>Schedule Details</h1>
            <h2>{scheduleData.title}</h2>
            <ul>
                {activities.map(activity => (
                    <li key={activity._id}>
                        <strong>{activity.title}</strong>: From {formatTime(activity.startTime)} to {formatTime(activity.endTime)}
                        <p>{activity.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ScheduleDetail;
