import {gql} from 'apollo-boost';

export const BulkOperationMutation = gql `
  mutation bulkOperationRun {
      bulkOperationRunQuery(
      query: """
        {
          products {
            edges {
              node {
                title
              }
            }
          }
        }
        """
      ) {
        bulkOperation {
          id
          status
          createdAt
        }
      }
    }
`;