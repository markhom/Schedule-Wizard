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
export const ADD_SCHEDULE = gql`
  mutation AddSchedule($title: String!, $owner: ID!, $activities: [ActivityInput!]!) {
    addSchedule(title: $title, owner: $owner, activities: $activities) {
      _id
      title
      activities {
        _id
        title
      }
    }
  }
`;

// Mutation to update an existing schedule
export const UPDATE_SCHEDULE = gql`
  mutation UpdateSchedule($scheduleId: ID!, $title: String!) {
    updateSchedule(scheduleId: $scheduleId, title: $title) {
      _id
      title
      activities {
        _id
        title
      }
    }
  }
`;

// Mutation to delete a schedule
export const DELETE_SCHEDULE = gql`
  mutation DeleteSchedule($scheduleId: ID!) {
    deleteSchedule(scheduleId: $scheduleId) {
      _id
    }
  }
`;

const GET_USER = gql`
  query GetUser($username: String!) {
    user(username: $username) {
      email
      username
      schedules {
        _id
        title
        activities {
          _id
          title
        }
      }
    }
  }
`;

