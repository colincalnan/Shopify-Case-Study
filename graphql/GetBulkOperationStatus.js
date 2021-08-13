import { gql } from "apollo-boost";

export const GetBulkOperationStatusQuery = gql `
  query getBulkOperationStatus {
    currentBulkOperation {
      id
      status
      createdAt
    }
  }
`;