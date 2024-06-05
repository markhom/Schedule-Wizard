import { gql } from '@apollo/client';

//Query to fetch all users
//Below is working. Note, 'activities' is excluded
export const GET_USERS = gql`
 query Users {
  users {
    _id
    email
    schedules {
      _id
      title
    }
    username
  }
}
`;

// Query to fetch user data for a single user
//Below is working. Note, 'activities' is excluded
export const GET_USER = gql`
query Users($username: String!) {
  user(username: $username) {
    _id
    email
    schedules {
      _id
      title
    }
    username
  }
}
`;

//Query to fetch user data for the owner of the acccount
//Below is working. Note, 'activities' is currently excluded
export const ME = gql`
query Query {
  me {
    _id
    email
    schedules {
      _id
      username
      email
    }
  }
`;

export const GET_USER_SCHEDULES = gql`
  query getUserSchedules($userId: ID!) {
    userSchedules(userId: $userId) {
      _id
      title
      activities {
        title
      }
      createdAt
      updatedAt
    }
  }
`;