import { gql } from '@apollo/client';

//Query to fetch all users
//Below is working. Note, 'activities' is excluded
export const GET_USERS = gql`
 query Users {
  users {
    _id
    email
    username
    schedules {
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
}
`;

// Query to fetch user data for a single user
//Below is working. Note, 'activities' is excluded
export const GET_USER = gql`
query User($username: String!) {
  user(username: $username) {
    _id
    email
    username
    schedules {
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
}
`;

//Query to fetch user data for the owner of the acccount
//Below is working. Note, 'activities' is currently excluded
export const ME = gql`
query Me {
  me {
    _id
    email
    username
    schedules {
      _id
      title
      activities {
        _id
        description
        endTime
        startTime
        title
        day
      }
    }
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
    activities {
      _id
      description
      endTime
      startTime
      title
      day
    }
  }
}
`;

//Below is to fetch a single schedule by id
//Below is working, but also doesn't include 'activities'
export const GET_ONE_SCHEDULE = gql`
query GetOneSchedule($scheduleId: ID!) {
  getOneSchedule(scheduleId: $scheduleId) {
    _id
    title
    activities {
      _id
      title
      startTime
      endTime
      description
      day
    }
  }
}
`;


//Query for searching users
export const SEARCH_USERS = gql`
  query SearchUsers($term: String!) {
    searchUsers(term: $term) {
      _id
      username
      email
      schedules {
        _id
        title
      }
    }
  }
`;

// Query for searching schedules
export const SEARCH_SCHEDULES = gql`
query SearchSchedules($term: String!) {
  searchSchedules(term: $term) {
    _id
    title
    activities {
      _id
      description
      startTime
      endTime
      title
      day
    }
  }
}
`;