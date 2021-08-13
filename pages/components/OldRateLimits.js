import { React, useState, useEffect } from 'react';
// import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { Card, TextStyle } from '@shopify/polaris';
import { useAppBridge } from "@shopify/app-bridge-react";
import { getSessionToken } from "@shopify/app-bridge-utils"

import { GraphQLClient, gql } from 'graphql-request';

const RateLimits = async (props) => {
  // const app = useAppBridge();
  // const sessionToken = getSessionToken(app);
  // console.log('sessionToken', sessionToken);

  // const endpoint = `https://colin-calnan.myshopify.com/admin/api/2021-07/graphql.json`
  // const graphQLClient = new GraphQLClient(endpoint, {
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'X-Shopify-Access-Token': sessionToken, 
  //   }
  // });

  const [limits, setLimits] = useState(null);
  const loggedInFetch = props.fetch;
  
  const getLimits = async () => {
    try {
      await loggedInFetch('/api/rate-limits')
        .then(response => {
          for (var pair of response.headers.entries()) {
            console.log(pair[0]+ ': '+ pair[1]);
          }
          // response.headers.entries().forEach(function(val, key) { console.log(key + ' -> ' + val); });
          return response.json()
        })
        .then(data => {
          setLimits(data.body.count);
        });
    } catch(err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getLimits();
  }, []);

  // const getCount = () => {
  //   try {
  //    loggedInFetch('/api/rate-limits')
  //       .then(response => {
  //         response.headers.entries.forEach(function(val, key) { console.log(key + ' -> ' + val); });
  //         return response.json()
  //       })
  //       .then(data => {
  //         setCount(data.body.count);
  //       });
  //   } catch(err) {
  //     console.log(err);
  //   }
  // }

  // console.log(graphQLClient);
  
  // const query = gql`
  //   {
  //     products(first: 1, reverse:true) {
  //       edges {
  //         node {
  //           title
  //         }
  //       }
  //     }
  //   }
  // `;

  // const count =  getCount();
  // const {errors, data, extensions, headers, status} = await graphQLClient.rawRequest(query);
  // console.log('extensions', extensions);

      // <Mutation mutation={BULK_OPERATIONS}>
    //   {(bulkOperations, { data, loading, error }) => (
    //   <Card title="Call Rate Limit Status" sectioned>
    //     <form onSubmit={e => {
    //       e.preventDefault();
    //       bulkOperations();
    //     }} >
    //       <button type="submit">Get Rate Limits</button>
    //       {loading &&
    //         <div>loading…</div>
    //       }
    //       { data &&
    //         <div>{ console.log(data) }</div>
    //       }
    //       { error &&
    //         <div>Error…</div>
    //       }
    //     </form>
    //   </Card>
    // GraphQL query to retrieve products and their prices
    // )}
    // </Mutation>
  
  return (
    <p>
      hello
    </p>
  );
}

export default RateLimits;