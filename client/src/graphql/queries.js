import { gql } from '@apollo/client';


// Query to fetch user data
export const GET_USER = gql`
  query GetUser($userId: ID!) {
    user(id: $userId) {
      id
      username
      email
      schedules {
        id
        title
      }
    }
  }
`;

// Query to fetch schedules
export const GET_SCHEDULES = gql`
  query GetSchedules {
    schedules {
      id
      title
      owner {
        id
        username
      }
    }
  }
`;
