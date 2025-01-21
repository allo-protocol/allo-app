import gql from "graphql-tag";

const META = `
totalCount
pageInfo {
    hasNextPage
    hasPreviousPage
    startCursor
    endCursor
}
`;

export const REGISTRATIONS_SCHEMA = gql`
  query Registrations(
    $after: String
    $before: String
    $orderBy: String
    $orderDirection: String
    $limit: Int
    $where: registrationFilter
  ) {
    registrations(
      after: $after
      before: $before
      orderBy: $orderBy
      orderDirection: $orderDirection
      limit: $limit
      where: $where
    ) {
      items {
        id
        index
        address
        metadata
        review
        createdAt
        updatedAt
        isApproved    
        allocations {
          items {
            id
            amount
            to
            from
            token
            createdAt
          }
        }
        strategy {
          address
          name
        }
      }
      ${META}
    }
  }
`;

export const ALLOCATIONS_SCHEMA = gql`
  query Allocations(
    $after: String
    $before: String
    $orderBy: String
    $orderDirection: String
    $limit: Int
    $where: allocationFilter
  ) {
    allocations(
      after: $after
      before: $before
      orderBy: $orderBy
      orderDirection: $orderDirection
      limit: $limit
      where: $where
    ) {
      items {
        id
        amount
        to
        from
        token
        createdAt
        registration {
          address
          metadata
        }
      }
      ${META}
    }
  }
`;
