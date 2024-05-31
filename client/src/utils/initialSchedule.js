// Example initial data structure
const initialSchedules = [
    {
        id: 'schedule1',
        title: 'My Work Schedule',
        blocks: Array(12).fill().map((_, i) => ({
            startHour: i + 1,
            endHour: i + 2,
            activity: 'Free'
        }))
    }
];
