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
            hash
            amount
            recipient
            from
            token
            createdAt
          }
        }
      }
    }
  }
`;
