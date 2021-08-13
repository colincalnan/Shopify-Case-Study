import {gql} from 'apollo-boost';

export const NewestProductTitleQuery = gql`
  query getNewestProductTitle {
    products(first: 1, reverse:true) {
      edges {
        node {
          title
        }
      }
    }
  }
`;