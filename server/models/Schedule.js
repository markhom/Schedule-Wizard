const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const activitySchema = new Schema({
    title: {
      type: String,
      required: true,
    },
  });
  

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
    activities: [activitySchema], 
  }, { timestamps: true });


const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;

