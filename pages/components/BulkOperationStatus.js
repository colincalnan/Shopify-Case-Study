import { React, useCallback, useState }  from 'react';
import { 
  Button,
  ButtonGroup,
  Card,
  DataTable,
  EmptyState,
  Modal,
  SkeletonDisplayText,
  TextStyle } from '@shopify/polaris';
import { BulkOperationMutation } from '../../graphql/RunBulkOperation';
import { GetBulkOperationStatusQuery } from '../../graphql/GetBulkOperationStatus';
import { useMutation, useQuery } from '@apollo/react-hooks';

const BulkOperationStatus = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [rateLimits, setRateLimits] = useState({});

  const { loading, error, data } = useQuery(GetBulkOperationStatusQuery);
  const [bulkOperationRunQuery] = useMutation(BulkOperationMutation, {
    update(cache, { data: { bulkOperationRunQuery }}) {
      cache.writeQuery({
        query: GetBulkOperationStatusQuery,
        data: { currentBulkOperation: bulkOperationRunQuery.bulkOperation },
      });
      setModalOpen(false);
    }
  });

  
  const submitHandler = useCallback(() => {
    setModalOpen(true);
    bulkOperationRunQuery()
      .then((response) => {
        setRateLimits(response.extensions.cost);
      });
  }, []);

  return (
    <>
      <Card title="Bulk Operation Status" sectioned>
        <Card.Section>
          <Modal
              open={modalOpen}
              loading={true}
          />
          {loading ? <SkeletonDisplayText size="small" />: null}
          {error ? <TextStyle variation="negative">{error}</TextStyle> : null}
          {data && data.currentBulkOperation != null ? <DataTable
                  columnContentTypes={['numeric', 'text', 'text']} 
                  headings={['ID', 'Created At', 'Status']}
                  rows={[[data.currentBulkOperation.id, data.currentBulkOperation.createdAt, data.currentBulkOperation.status]]}
                /> 
                : <EmptyState heading="No Bulk Operations Data" />
              }
        </Card.Section>
        <Card.Section>
          <ButtonGroup>
            <Button primary onClick={submitHandler} >Run Bulk Operation Mutation</Button>
          </ButtonGroup>
        </Card.Section>
      </Card>
      <Card title="Rate Limits" sectioned> 
        <Card.Section>
        {Object.keys(rateLimits).length ?
          <DataTable
            columnContentTypes={['numeric', 'numeric', 'numeric', 'numeric', 'numeric']} 
            headings={['Requested Query Cost', 'Actual Query Cost', 'Currently Available', 'Maximum Available', 'Restore Rate']}
            rows={[[rateLimits.requestedQueryCost, rateLimits.actualQueryCost, rateLimits.throttleStatus.maximumAvailable, rateLimits.throttleStatus.currentlyAvailable, rateLimits.throttleStatus.restoreRate]]}
          /> 
          : <TextStyle>Click `Run Bulk Operation Mutation` above to see Rate Limits</TextStyle>
        }
        </Card.Section>
      </Card>
    </>
  );
}

export default BulkOperationStatus;