const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    schedules: [Schedule]
  }

  type Schedule {
    _id: ID
    title: String
    activities: [Activity]
  }

  type Activity {
    _id: ID
    title: String
    startTime: String
    endTime:String
    description: String
  }

  input ActivityInput {
    title: String
    startTime: String
    endTime:String
    description: String
  }

  type Auth {
    token: ID!
    user: User
  }
  type Query {
    users: [User]
    user(username: String!): User 
    me: User
    schedules: [Schedule]
    schedule(_id: ID!): Schedule
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    addSchedule(title: String!): User
    updateSchedule(scheduleId: ID!, title: String!): User
    deleteSchedule(scheduleId: ID!): User  
    addActivity(activityData: ActivityInput): Schedule
    removeActivity(activityId: ID): Schedule
    updateActivity(activityId: ID, startTime: String, endTime: String ): Activity
  }
`;

module.exports = typeDefs;



