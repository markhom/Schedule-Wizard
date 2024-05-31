const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scheduleSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,  // Removes padding spaces
        maxlength: 100  // Limits title length
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
}, { timestamps: true });  // Adds createdAt and updatedAt fields automatically

const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;

