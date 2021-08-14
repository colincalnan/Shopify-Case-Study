import { Frame, Layout, Page } from "@shopify/polaris";
import NewestProductTitle from "./components/NewestProductTitle";
import BulkOperationStatus from "./components/BulkOperationStatus";
import TotalNumberOfProducts from "./components/TotalNumberOfProducts";

const Index = (props) => (
  <Frame>
    <Page>
      <Layout>
        <Layout.Section>
          <NewestProductTitle />
          <TotalNumberOfProducts {...props} />
          <BulkOperationStatus />
        </Layout.Section>
      </Layout>
    </Page>
  </Frame>
);

export default Index;