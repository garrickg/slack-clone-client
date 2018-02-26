import React from 'react';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';
import { render } from 'react-dom';

import registerServiceWorker from './registerServiceWorker';
import Routes from './routes';

const client = new ApolloClient({
  link: createHttpLink({ uri: 'http://localhost:8080/graphql' }),
  cache: new InMemoryCache()
});

const App = (
  <ApolloProvider client={client}>
    <Routes />
  </ApolloProvider>
);

render(App, document.getElementById('root'));
registerServiceWorker();
