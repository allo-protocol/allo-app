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

export const PROJECTS_SCHEMA = gql`
  query Projects(
    $after: String
    $before: String
    $orderBy: String
    $orderDirection: String
    $limit: Int
    $where: projectFilter
  ) {
    projects(
      after: $after
      before: $before
      orderBy: $orderBy
      orderDirection: $orderDirection
      limit: $limit
      where: $where
    ) {
      items {
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
            recipient
            from
            token
            createdAt
          }
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
        recipient
        from
        token
        createdAt
      }
      ${META}
    }
  }
`;
