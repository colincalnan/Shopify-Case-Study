import React, { useEffect, useState } from 'react';
import { Card, SkeletonDisplayText, TextStyle } from '@shopify/polaris';

const TotalNumberOfProducts = ({fetch}) => {
  const [count, setCount] = useState(null);
  const [error, setError] = useState('');

  const getCount = async () => {
    try {
      await fetch('/api/products/count')
        .then(response => {
          // response.headers.entries().forEach(function(val, key) { console.log(key + ' -> ' + val); });
          return response.json()
        })
        .then(data => {
          setCount(data.body.count);
        });
    } catch(err) {
      console.log(err);
      setError(err)
    }
  }

  useEffect(() => {
    getCount();
  }, []);

  return (
    <Card title="Number Of Products" sectioned>
      <Card.Section>
      {count ?
        <TextStyle>{ count }</TextStyle> 
        : <SkeletonDisplayText size="small" />
      }
      { error ? <TextStyle variation="negative">{ error }</TextStyle> : null }
      </Card.Section>
    </Card>
  );
}

export default TotalNumberOfProducts;