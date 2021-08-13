require('isomorphic-fetch');
const Koa = require('koa');
const next = require('next');
const { default: createShopifyAuth, verifyRequest } = require('@shopify/koa-shopify-auth');
const { default: Shopify, ApiVersion } = require('@shopify/shopify-api');
const Router = require('koa-router');

// Loads config into process.env
const dotenv = require('dotenv');
dotenv.config();

// Setting up necessary variables
const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production';

// Creating app with next
const app = next({ dev });
const handle = app.getRequestHandler();

// Initializing the Shopify library
Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: process.env.SCOPES.split(","),
  HOST_NAME: process.env.HOST.replace(/https:\/\//, ""),
  API_VERSION: ApiVersion.October20,
  IS_EMBEDDED_APP: true,
  SESSION_STORAGE: new Shopify.Session.MemorySessionStorage(),
});

// ACTIVE_SHOPIFY_SHOPS tracks shops that complete OAuth
// This will decided whether a new shop need to perform OAuth to install it
const ACTIVE_SHOPIFY_SHOPS = {};

// Set up our nextjs App, prepare the code to use Koa
app.prepare().then(() => {
  const server = new Koa();
  const router = new Router();
  server.keys = [Shopify.Context.API_SECRET_KEY];

  // Set up Shopify Auth middleware to trigger the authentication screen
  server.use(
    createShopifyAuth({
      // After authentication what do we do?
      async afterAuth(ctx) {
        // Access token and shop available in ctx.state.shopify
        const { shop, scope } = ctx.state.shopify;
        const host = ctx.query.host;
        ACTIVE_SHOPIFY_SHOPS[shop] = scope;
        console.log('We did it!', scope);

        // Redirect to app with shop parameter upon auth
        ctx.redirect(`/?shop=${shop}&host=${host}`);
      },
    }),
  );

  const handleRequest = async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  };

  // Set up routes
  router.get("(/_next/static/.*)", handleRequest); // Static content is clear
  router.get("/_next/webpack-hmr", handleRequest); // Webpack content is clear
  // // Handle the REST API requests
  router.get(
    "/api/products/:path", 
    verifyRequest({ returnHeader: true }),
    async (ctx) => {
      // Load the current session to get the `accessToken`.
      const session = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);

      // Create a new client for the specified shop.
      const client = new Shopify.Clients.Rest(session.shop, session.accessToken);

      // Use `client.get` to request the specified Shopify REST API endpoint, e.g. `products`.
      ctx.body = await client.get({
        path: `products/${ctx.params.path}`,
        extraHeaders: ''
      });
      ctx.status = 200;
      }
  );

  router.get('/api/rate-limits', async (ctx) => {
    // Load the current session to get the `accessToken`.
    const session = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
    console.log('ctx', session.accessToken);
    try {
      const results = await fetch("https://colin-calnan.myshopify.com/admin/api/2021-07/graphql.json", {
        method: 'POST',
        headers: {
          "X-Shopify-Access-Token": ctx.cookies.get('accessToken'),
        },
      })
      .then(response => response.json())
      .then(json => {
        console.log('json', json);
        return json;
      });
      ctx.body = {
        status: 'success',
        data: results
      };
    } catch (err) {
      console.log(err)
    }
  });

  router.get("(.*)", async (ctx) => {
    const shop = ctx.query.shop;
    // This shop hasn't been seen yet, go through OAuth to create a session
    if (ACTIVE_SHOPIFY_SHOPS[shop] === undefined) {
      ctx.redirect(`/auth?shop=${shop}`);
    } else {
      await handleRequest(ctx);
    }
  });

  // Handle the graphql queries in React/Apollo using the graphqlProxy
  router.post(
    "/graphql",
    verifyRequest({ returnHeader: true }),
    async (ctx, next) => {
      await Shopify.Utils.graphqlProxy(ctx.req, ctx.res);
    }
  );

  // Set up the server
  server.use(router.allowedMethods());
  server.use(router.routes());
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});