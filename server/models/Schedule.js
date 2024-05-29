const mongoose = require('mongoose');

const { Schema } = mongoose;

const scheduleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    activities: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Activity'
        }
    ]
});

const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;
