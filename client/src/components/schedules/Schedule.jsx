import React, { useState } from 'react';
import HourEntry from './HourEntry';  // Component for each hour entry
import { initialSchedule } from '../../utils/initialSchedule';

function Schedule() {
    const [schedule, setSchedule] = useState(initialSchedule);

    const updateActivity = (hour, activity) => {
        const newSchedule = schedule.map(entry =>
            entry.hour === hour ? { ...entry, activity } : entry
        );
        setSchedule(newSchedule);
    };

    return (
        <div>
            <h1>24 Hour Schedule</h1>
            {schedule.map(entry => (
                <HourEntry
                    key={entry.hour}
                    hour={entry.hour}
                    activity={entry.activity}
                    updateActivity={updateActivity}
                />
            ))}
        </div>
    );
}

export default Schedule;
