import { Frame, Layout, Page } from "@shopify/polaris";
import NewestProductTitle from "./components/NewestProductTitle";
import BulkOperationStatus from "./components/BulkOperationStatus";
import TotalNumberOfProducts from "./components/TotalNumberOfProducts";
import RateLimits from "./components/OldRateLimits";

const Index = (props) => (
  <Frame>
    <Page>
      <Layout>
        <Layout.Section>
          <NewestProductTitle />
          <BulkOperationStatus />
          <TotalNumberOfProducts {...props} />
          {/* <RateLimits {...props} /> */}
        </Layout.Section>
      </Layout>
    </Page>
  </Frame>
);

export default Index;