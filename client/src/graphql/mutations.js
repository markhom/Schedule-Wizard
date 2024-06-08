import { gql } from '@apollo/client';

//mutation to login a user
//Below is tested and working.
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

//mutation for signing up a new user
//Below is tested and working.
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
mutation AddSchedule($title: String!, $activities: [ActivityInput]) {
  addSchedule(title: $title, activities: $activities) {
    _id
    title
    activities {
      _id
      title
      description
      startTime
      endTime
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
      description
      endTime
      startTime
      title
    }
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

//Tested and working
export const ADD_ACTIVITY = gql`
mutation AddActivity($scheduleId: ID, $activityData: ActivityInput) {
  addActivity(scheduleId: $scheduleId, activityData: $activityData) {
    _id
    activities {
      _id
      description
      endTime
      startTime
      title
    }
    title
  }
}
`;

//Tested and working
export const REMOVE_ACTIVITY = gql`
mutation RemoveActivity($activityId: ID) {
  removeActivity(activityId: $activityId) {
    _id
    title
    activities {
      _id
      description
      endTime
      startTime
      title
    }
  }
}
`;