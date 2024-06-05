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

    return (
        <div>
            <h1>Schedule Details</h1>
            {data && (
                <div>
                    <h2>{data.schedule.title}</h2>
                    <ul>
                        {data.schedule.activities.map(activity => (
                            <li key={activity._id}>
                                <h3>{activity.title}</h3>
                                <p>{activity.startTime} - {activity.endTime}</p>
                                <p>{activity.description}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}


export default ScheduleDetail;