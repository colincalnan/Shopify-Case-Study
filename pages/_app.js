import React from "react";
import App from "next/app";
import Head from "next/head";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { AppProvider } from "@shopify/polaris";
import "@shopify/polaris/dist/styles.css";
import translations from "@shopify/polaris/locales/en.json";
import { Provider, useAppBridge } from "@shopify/app-bridge-react";
import { authenticatedFetch } from "@shopify/app-bridge-utils";

function userLoggedInFetch(app) {
  const fetchFunction = authenticatedFetch(app);

  return async (uri, options) => {
    const response = await fetchFunction(uri, options);
    
    if (
      response.headers.get("X-Shopify-API-Request-Failure-Reauthorize") === "1"
    ) {
      const authUrlHeader = response.headers.get(
        "X-Shopify-API-Request-Failure-Reauthorize-Url"
      );

      const redirect = Redirect.create(app);
      redirect.dispatch(Redirect.Action.APP, authUrlHeader || `/auth`);
      return null;
    }

    return response;
  };
}

function MyProvider(props) {
  const app = useAppBridge();

  const fetchFunction = userLoggedInFetch(app);

  const client = new ApolloClient({
    fetch: fetchFunction,
    fetchOptions: {
      credentials: 'include',
    }
  });
  const Component = props.Component;

  return (
    <ApolloProvider client={client}>
      <Component {...props} fetch={fetchFunction} />
    </ApolloProvider>
  );
}

class MyApp extends App {
  render() {
    const { Component, pageProps, host } = this.props;
    return (
      <React.Fragment>
        <Head>
          <title>Case Study App</title>
          <meta charSet="utf-8" />
        </Head>
          <AppProvider i18n={translations}>
            <Provider
              config={{
                apiKey: API_KEY,
                host: host,
                forceRedirect: true,
              }}
            >
              <MyProvider Component={Component} shop={SHOP_URL} {...pageProps} />
            </Provider>
          </AppProvider>
      </React.Fragment>
    );
  }
}

MyApp.getInitialProps = async ({ ctx }) => {
  // console.log('ctx', ctx);
  return {
    host: ctx.query.host,
  };
};

export default MyApp;