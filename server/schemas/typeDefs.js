const typeDefs = `
  type User {
    _id: ID
    username: String
    email: String
    password: String
    schedules: [Schedule]
  }

  type Schedule {
    _id: ID
    title: String
    owner: User
    activities: [Activity]
  }

  type Activity {
    _id: ID
    title: String
    startTime: String
    endTime: String
    description: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    users: [User]
    user(username: String!): User
    schedules: [Schedule]
    schedule(_id: ID!): Schedule
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): User
    addSchedule(title: String!, owner: ID!): Schedule
    addActivity(title: String!, startTime: String!, endTime: String!, description: String, scheduleId: ID!): Activity
    login(email: String!, password: String!): Auth
    signUp(username: String!, email: String!, password: String!): Auth
  }
`;

module.exports = typeDefs;

