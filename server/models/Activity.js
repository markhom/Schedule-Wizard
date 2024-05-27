const mongoose = require('mongoose');

const { Schema } = mongoose;

const activitySchema = new Schema({
    title: {
        type: String,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    description: {
        type: String
    }
});

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
