import React, { useState } from 'react';

function HourEntry({ hour, activity, updateActivity }) {
    const [isEditing, setIsEditing] = useState(false);
    const [tempActivity, setTempActivity] = useState(activity);

    const toggleEdit = () => {
        if (isEditing && tempActivity !== activity) {
            updateActivity(hour, tempActivity);
        }
        setIsEditing(!isEditing);
    };

    const handleChange = (e) => {
        setTempActivity(e.target.value);
    };

    return (
        <div>
            <label>{hour}:00 - {hour + 1}:00</label>
            {isEditing ? (
                <>
                    <input type="text" value={tempActivity} onChange={handleChange} />
                    <button onClick={toggleEdit}>Save</button>
                </>
            ) : (
                <>
                    <span>{activity || "No Activity Planned"}</span>
                    <button onClick={toggleEdit}>Edit</button>
                </>
            )}
        </div>
    );
}

export default HourEntry;
