import { React } from 'react';
import { Card, SkeletonDisplayText, TextStyle} from '@shopify/polaris';
import { useQuery}  from '@apollo/react-hooks';
import { NewestProductTitleQuery } from '../../graphql/GetNewestProductTitle';

const NewestProductTitle = () => {

  const { loading, error, data } = useQuery(NewestProductTitleQuery);

  return (
    <Card title="Newest Product Title" sectioned>
      <Card.Section>
        {data ? <TextStyle>{ data.products.edges[0].node.title }</TextStyle> : null}
        {loading ? <SkeletonDisplayText size="small" />: null}
        {error ? <TextStyle variation="negative">{error}</TextStyle> : null}
      </Card.Section>
    </Card>
  );
}

export default NewestProductTitle;