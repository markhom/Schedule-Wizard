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
      throw AuthenticationError;
    },
    //Note: don't need below because calling users will return schedules
    // userSchedules: async (parent, { userId }) => {
    //   return Schedule.find({ owner: userId });
    // },

    getSchedules: async () => Schedule.find(),

    getOneSchedule: async (parent, { scheduleId }) => {
      return Schedule.findOne({ _id: scheduleId });
    }

  },

  // thought: async (parent, { thoughtId }) => {
  //   return Thought.findOne({ _id: thoughtId });
  // },
  //Below are the mutations
  Mutation: {
    addUser: async (parent, { username, email, password }) => {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error('A user with this email already exists.');
        }
      
        try {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
        } catch (error) {
            // Log the complete error object and specific details to help diagnose the problem
            console.error('Error creating user:', error.message);
            console.error('Error stack:', error.stack); // Provides a stack trace

            // Optionally, log the input data to understand context (be careful with sensitive data like passwords)
            console.error('Attempted user creation with email:', email);
            // Do not log passwords in production environments, it's shown here for debugging purposes only
            console.error('Attempted user creation with password:', password);

            throw new Error('Failed to create user. Please check the provided data.');
        }
    },

    //Below, note to self: putting 'new' in front of AuthenticationError caused
    //an error in another spot. Test and see if it needs to be taken out here too
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

    addSchedule: async (parent, { title }, context) => {
      if (context.user) {
        const schedule = await Schedule.create({
          title: title,
          //Will Activities need to go here?
        })
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $push: { schedules: schedule._id } },
          { new: true }
        );
        return updatedUser
      }
      throw AuthenticationError;
    },

    updateSchedule: async (parent, { scheduleId, title }, context ) => {
      const schedule = Schedule.findOneAndUpdate(
        { _id: context.schedule._id},
        { $push: { schedules: schedule._id } },
        { new: true },
      )
      if (!schedule) {
        throw AuthenticationError;
      }
    },

    deleteSchedule: async (parent, { scheduleId }, context ) => {
      if (context.user) {
        const schedule = await Schedule.findByIdAndRemove({ //should this be findOneAndDelete?
          _id: scheduleId,
          //Anything else here?
        });
        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { schedules: schedule._id } }
        );

        return schedule;
      }
      throw AuthenticationError;
    } 
  },
};

module.exports = resolvers;
