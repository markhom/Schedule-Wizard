const { User, Schedule, Activity } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { signToken, AuthenticationError } = require('../auth/auth');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// const resolvers = {
//   Query: {
//     // Existing query resolvers
//     users: async () => {
//       return await User.find({});
//     },
//     user: async (_, { username }) => {
//       return await User.findOne({ username }).populate('schedules');
//     },
//     schedules: async () => {
//       return await Schedule.find({}).populate('owner activities');
//     },
//     schedule: async (_, { _id }) => {
//       return await Schedule.findById(_id).populate('owner activities');
//     }
//   },
//   Mutation: {
//     // Existing mutation resolvers
//     addUser: async (_, { username, email, password }) => {
//       const hashedPassword = await bcrypt.hash(password, 10);
//       const newUser = new User({ username, email, password: hashedPassword });
//       return await newUser.save();
//     },
//     login: async (_, { email, password }) => {
//       const user = await User.findOne({ email });
//       if (!user) {
//         throw new Error('No user found with this email address.');
//       }

//       const isValid = await bcrypt.compare(password, user.password);
//       if (!isValid) {
//         throw new Error('Invalid password.');
//       }

//       const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//         expiresIn: '24h'
//       });

//       return { token, user };
//     },
//     signUp: async (_, { username, email, password }) => {
//       const userExists = await User.findOne({ email });
//       if (userExists) {
//         throw new Error('User already exists with this email.');
//       }

//       const hashedPassword = await bcrypt.hash(password, 10);
//       const newUser = new User({ username, email, password: hashedPassword });
//       const savedUser = await newUser.save();

//       const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, {
//         expiresIn: '24h'
//       });

//       return { token, user: savedUser };
//     },
//     addSchedule: async (_, { title, owner }) => {
//       const newSchedule = new Schedule({ title, owner });
//       return await newSchedule.save();
//     },
//     updateSchedule: async (_, { id, title }) => {
//       return await Schedule.findByIdAndUpdate(id, { title }, { new: true });
//     },
//     deleteSchedule: async (_, { id }) => {
//       return await Schedule.findByIdAndDelete(id);
//     },
//     addActivity: async (_, { title, startTime, endTime, description, scheduleId }) => {
//       const newActivity = new Activity({ title, startTime, endTime, description });
//       await newActivity.save();
//       await Schedule.findByIdAndUpdate(scheduleId, { $push: { activities: newActivity._id } });
//       return newActivity;
//     },
//     updateActivity: async (_, { id, title, description, startTime, endTime }) => {
//       return await Activity.findByIdAndUpdate(id, { title, description, startTime, endTime }, { new: true });
//     },
//     deleteActivity: async (_, { id }) => {
//       return await Activity.findByIdAndDelete(id);
//     }
//   }
// };

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
      throw new AuthenticationError('Not authenticated');
    },
    getSchedules: async () => Schedule.find().populate('activities'),
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
        throw new AuthenticationError('No user found with this email address');
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }
      const token = signToken(user);
      return { token, user };
    },
    addSchedule: async (parent, { title, activities }, context) => {
      if (!context.user) {
        console.error("Authentication error: User must be logged in to create schedules.");
        throw new AuthenticationError("User must be authenticated to create schedules.");
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
        throw new AuthenticationError('Not authenticated');
      }
      return Schedule.findByIdAndUpdate(scheduleId, { title }, { new: true }).populate('activities');
    },
    deleteSchedule: async (parent, { scheduleId }, context) => {
      if (!context.user) {
        throw new AuthenticationError('Not authenticated');
      }
      const schedule = await Schedule.findByIdAndDelete(scheduleId);
      await User.findByIdAndUpdate(
        context.user._id,
        { $pull: { schedules: schedule._id } },
        { new: true }
      );
      return schedule;
    },
    addActivity: async (parent, { scheduleId, activityData }) => {
      const activity = await Activity.create(activityData);
      return Schedule.findByIdAndUpdate(
        scheduleId,
        { $push: { activities: activity._id } },
        { new: true }
      ).populate('activities');
    },
    removeActivity: async (parent, { activityId }) => {
      const activity = await Activity.findByIdAndDelete(activityId);
      return Schedule.findOneAndUpdate(
        { activities: activityId },
        { $pull: { activities: activityId } },
        { new: true }
      ).populate('activities');
    },
    updateActivity: async (parent, { activityId, startTime, endTime }) => {
      return Activity.findByIdAndUpdate(activityId, { startTime, endTime }, { new: true });
    },
  },
};

module.exports = resolvers;