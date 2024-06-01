const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    scheduleCount: Int
    schedules: [Schedule]!
  }

  type Schedule {
    scheduleId: ID
    title: String  
    activities: [Activity]!
  }

  type Activity {
    activityId: ID
    title: String
    description: String
  }

  type Auth {
    token: ID!
    user: User
  }

  input scheduleContent {
    scheduleId: String
    title: String
    activities: [String]
  }

  input activityContent {
    activityId: String
    title: String
    description: String
  }

  type Query {
    users: [User]
    user(userId: ID!): User
    me: User
    schedules: [Schedule]
    schedule: Schedule
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    addSchedule(title: String!, owner: ID!): User
    updateSchedule(id: ID!, title: String!): Schedule  
    deleteSchedule(id: ID!): Schedule  
    addActivity(title: String!, startTime: String!, endTime: String!, description: String, scheduleId: ID!): Activity
    updateActivity(id: ID!, title: String!, description: String!, startTime: String!, endTime: String!): Activity  
    deleteActivity(activityId: ID!): Schedule 
  }
`;

module.exports = typeDefs;

