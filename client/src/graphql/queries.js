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
query User($username: String!) {
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
      title
    }
    username
  }
}
`;

// Query to fetch all schedules
//Below is working. Again. include 'activities'
export const GET_SCHEDULES = gql`
query GetSchedules {
  getSchedules {
    _id
    title
  }
}
`;

//Below is to fetch a single schedule by id
//Below is working, but also doesn't include 'activities'
export const GET_ONE_SCHEDULE = gql`
query GetOneSchedule($id: ID!) {
  getOneSchedule(_id: $id) {
    _id
    title
  }
}
    `;