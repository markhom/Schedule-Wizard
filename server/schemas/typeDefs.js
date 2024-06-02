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
    owner: User
    activities: [Activity]
    createdAt: String
    updatedAt: String
  }

  type Activity {
    _id: ID
    title: String
  }

  input ActivityInput {
    title: String
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
    userSchedules(userId: ID!): [Schedule]
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    addSchedule(title: String!, owner: ID!, activities: [ActivityInput]!): Schedule
    updateSchedule(id: ID!, title: String!): Schedule  
    deleteSchedule(id: ID!): Schedule  
  }
`;

module.exports = typeDefs;



