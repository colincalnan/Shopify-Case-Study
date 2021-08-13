import React, { useEffect, useState } from 'react';
import { Card, TextStyle } from '@shopify/polaris';

const RateLimits = (props) => {
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
          console.log(data);
          // setLimits(data.body);
        });
    } catch(err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getLimits();
  }, []);

  return (
    <Card title="Number Of Products" sectioned>
      { limits &&
        <TextStyle>{ limits }</TextStyle> 
      }
    </Card>
  );
}

export default RateLimits;