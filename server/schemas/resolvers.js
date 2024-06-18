const { User, Schedule, Activity } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { signToken, AuthenticationError } = require('../auth/auth');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


const resolvers = {
  Query: {
    users: async () => User.find(),
    user: async (parent, { username }) => {
      return User.findOne({ username }).populate({
        path: 'schedules',
        populate: {
          path: 'activities',
        },
      });
    },
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate({
          path: 'schedules',
          populate: {
            path: 'activities',
          },
        });
      }
      throw AuthenticationError
    },
    getSchedules: async () => Schedule.find(),
    getOneSchedule: async (parent, { scheduleId }) => {
      return Schedule.findById(scheduleId).populate('activities');
    },
    searchUsers: async (_, { term }) => {
      return User.find({
        $or: [
          { username: { $regex: new RegExp(term, 'i') } },
          { email: { $regex: new RegExp(term, 'i') } },
        ],
      });
    },
    searchSchedules: async (_, { term }) => {
      return Schedule.find({
        title: { $regex: new RegExp(term, 'i') },
      }).populate('activities');
    },
  },
  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('A user with this email already exists.');
      }
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw AuthenticationError
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw AuthenticationError
      }
      const token = signToken(user);
      return { token, user };
    },
    addSchedule: async (parent, { title, activities }, context) => {
      if (!context.user) {
        console.error("Authentication error: User must be logged in to create schedules.");
        throw AuthenticationError
      }

      try {
        console.log("Creating new schedule with title:", title);
        const schedule = await Schedule.create({ title });
        console.log("Schedule created with ID:", schedule._id);

        if (activities && activities.length > 0) {
          console.log("Inserting activities:", activities);
          const activityDocs = await Activity.insertMany(
            activities.map(activity => ({
              ...activity,
              startTime: new Date(activity.startTime), // Ensure date is correctly parsed
              endTime: new Date(activity.endTime), // Ensure date is correctly parsed
              schedule: schedule._id
            }))
          );

          if (activityDocs.length) {
            const activityIds = activityDocs.map(doc => doc._id);
            console.log("Activities created with IDs:", activityIds);
            await Schedule.findByIdAndUpdate(schedule._id, { $set: { activities: activityIds } });
            console.log("Schedule updated with activity IDs:", schedule._id);
          } else {
            console.log("No activities were created, check input data and model constraints.");
          }
        } else {
          console.log("No activities provided to insert.");
        }

        console.log("Linking schedule to user:", context.user._id);
        await User.findByIdAndUpdate(
          context.user._id,
          { $push: { schedules: schedule._id } },
          { new: true }
        );

        console.log("Fetching the complete schedule to return.");
        const populatedSchedule = await Schedule.findById(schedule._id).populate('activities');
        console.log("Returning populated schedule:", populatedSchedule);

        return populatedSchedule;
      } catch (error) {
        console.error("Error creating schedule:", error);
        throw new Error("Failed to create schedule due to an error.");
      }
    },
    updateSchedule: async (parent, { scheduleId, title }, context) => {
      if (!context.user) {
        throw AuthenticationError
      }
      return Schedule.findByIdAndUpdate(
        scheduleId,
        { $set: { title: title } },
        { new: true });
    },
    deleteSchedule: async (parent, { scheduleId, userId }, context) => {
      if (!context.user) {
        throw AuthenticationError
      }
      const schedule = await Schedule.findByIdAndDelete(scheduleId);
      if (!schedule) {
        throw new Error('Schedule not found');
      }
      await User.findByIdAndUpdate(
        userId,
        { $pull: { schedules: schedule._id } },
        { new: true }
      );
      const user = await User.findById(userId).populate('schedules');
      return user;
    },

    
    addActivity: async (parent, { scheduleId, activityData }, context) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in!');
      }

      const { title, description, startTime, endTime, day } = activityData;
      const newActivity = await Activity.create({
        title,
        description,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        day,
      });

      await Schedule.findByIdAndUpdate(
        scheduleId,
        { $push: { activities: newActivity._id } },
        { new: true }
      );

      return Schedule.findById(scheduleId).populate('activities');
    },

    removeActivity: async (parent, { activityId }) => {
      const activity = await Activity.findByIdAndDelete(activityId);
      return Schedule.findOneAndUpdate(
        { activities: activityId },
        { $pull: { activities: activityId } },
        { new: true }
      ).populate('activities');
    },
    updateActivity: async (parent, { activityId, title, description, startTime, endTime, day }, context) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in!');
      }

      const updatedActivity = await Activity.findByIdAndUpdate(
        activityId,
        {
          title,
          description,
          startTime: new Date(startTime).toISOString(),
          endTime: new Date(endTime).toISOString(),
          day
        },
        { new: true, runValidators: true }
      );

      if (!updatedActivity) {
        throw new Error('Activity not found');
      }

      return updatedActivity;
    }
  }
};




module.exports = resolvers;