// Defines the initial empty schedule for 24 hours
export const initialSchedule = Array.from({ length: 24 }, (_, index) => ({
    hour: index,  // 0 represents 12 AM, 23 represents 11 PM
    activity: "",
}));
