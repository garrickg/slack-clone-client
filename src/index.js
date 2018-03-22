import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { render } from 'react-dom';

import registerServiceWorker from './registerServiceWorker';
import Routes from './routes';
import client from './apollo';

const App = (
  <ApolloProvider client={client}>
    <Routes />
  </ApolloProvider>
);

render(App, document.getElementById('root'));
registerServiceWorker();
