import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

const Home = ({ data: { loading, allUsers = [] } }) =>
  allUsers.map(user => <h1 key={user.id}>{user.email}</h1>);

const allUsersQuery = gql`
  {
    allUsers {
      id
      email
    }
  }
`;

export default graphql(allUsersQuery)(Home);
