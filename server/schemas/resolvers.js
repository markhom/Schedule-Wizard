const { User, Schedule, Activity } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const resolvers = {
  Query: {
    // Existing query resolvers
    users: async () => {
      return await User.find({});
    },
    user: async (_, { username }) => {
      return await User.findOne({ username }).populate('schedules');
    },
    schedules: async () => {
      return await Schedule.find({}).populate('owner activities');
    },
    schedule: async (_, { _id }) => {
      return await Schedule.findById(_id).populate('owner activities');
    }
  },
  Mutation: {
    // Existing mutation resolvers
    addUser: async (_, { username, email, password }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, email, password: hashedPassword });
      return await newUser.save();
    },
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('No user found with this email address.');
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        throw new Error('Invalid password.');
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '24h'
      });

      return { token, user };
    },
    signUp: async (_, { username, email, password }) => {
      const userExists = await User.findOne({ email });
      if (userExists) {
        throw new Error('User already exists with this email.');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, email, password: hashedPassword });
      const savedUser = await newUser.save();

      const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, {
        expiresIn: '24h'
      });

      return { token, user: savedUser };
    },
    addSchedule: async (_, { title, owner }) => {
      const newSchedule = new Schedule({ title, owner });
      return await newSchedule.save();
    },
    updateSchedule: async (_, { id, title }) => {
      return await Schedule.findByIdAndUpdate(id, { title }, { new: true });
    },
    deleteSchedule: async (_, { id }) => {
      return await Schedule.findByIdAndDelete(id);
    },
    addActivity: async (_, { title, startTime, endTime, description, scheduleId }) => {
      const newActivity = new Activity({ title, startTime, endTime, description });
      await newActivity.save();
      await Schedule.findByIdAndUpdate(scheduleId, { $push: { activities: newActivity._id } });
      return newActivity;
    },
    updateActivity: async (_, { id, title, description, startTime, endTime }) => {
      return await Activity.findByIdAndUpdate(id, { title, description, startTime, endTime }, { new: true });
    },
    deleteActivity: async (_, { id }) => {
      return await Activity.findByIdAndDelete(id);
    }
  }
};

module.exports = resolvers;
