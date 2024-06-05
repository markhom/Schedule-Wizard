import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
    user {
      _id
      email
      username
    }
  }
}
`;

export const ADD_USER = gql`
mutation AddUser($username: String!, $email: String!, $password: String!) {
  addUser(username: $username, email: $email, password: $password) {
    token
    user {
      _id
      email
      username
    }
  }
}
`;

// Mutation to add a new schedule
//Below is tested and finalized, although we'll need to add 'activities' when ready
export const ADD_SCHEDULE = gql`
mutation AddSchedule($title: String!) {
  addSchedule(title: $title) {
    _id
    schedules {
      _id
      title
    }
    username
  }
}
`;

// Mutation to update an existing schedule
//Below is working. Note, it excludes 'activities' for now
export const UPDATE_SCHEDULE = gql`
mutation UpdateSchedule($scheduleId: ID!, $title: String!) {
  updateSchedule(scheduleId: $scheduleId, title: $title) {
    _id
    schedules {
      _id
      title
    }
    email
    username
  }
}
`;

// Mutation to delete a schedule
//Below is tested and works. Note, it also excludes 'activities' for now
export const DELETE_SCHEDULE = gql`
mutation DeleteSchedule($scheduleId: ID!) {
  deleteSchedule(scheduleId: $scheduleId) {
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