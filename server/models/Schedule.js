const { Schema, model } = require('mongoose');


const scheduleSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  activities: [{
    type: Schema.Types.ObjectId,
    ref: 'Activity'
  }],
}, { timestamps: true });


const Schedule = model('Schedule', scheduleSchema);

module.exports = Schedule;

