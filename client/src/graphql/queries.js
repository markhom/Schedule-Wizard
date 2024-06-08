import { gql } from '@apollo/client';

//Query to fetch all users

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
      }
    }
  }
}
`;

// Query to fetch all schedules

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
    }
  }
}
`;

//Below is to fetch a single schedule by id

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
    }
  }
}
`;