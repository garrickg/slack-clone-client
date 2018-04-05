import React from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { Redirect } from 'react-router-dom';

import { meQuery } from '../graphql/team';

import Header from '../components/Header';
import SendMessage from '../components/SendMessage';
import AppLayout from '../components/AppLayout';
import Sidebar from '../containers/Sidebar';
import MessageContainer from '../containers/MessageContainer';

const ViewTeam = ({
  data: { loading, me },
  match: { params: { teamId, userId } },
}) => {
  if (loading) {
    return null;
  }

  const { username, teams } = me;

  if (!teams.length) {
    return (<Redirect to="/create-team" />);
  }

  const teamIdInteger = parseInt(teamId, 10);
  const teamIdx = teamIdInteger ? teams.findIndex(t => t.id === teamIdInteger) : 0;
  const team = teamIdx === -1 ? teams[0] : teams[teamIdx];
  const teamInitials = teams.map(t => ({
    id: t.id,
    letter: t.name.charAt(0).toUpperCase(),
  }));

  return (
    <AppLayout>
      <Sidebar teams={teamInitials} team={team} username={username} />
      { /* <Header channelName={channel.name} />
  <MessageContainer channelId={channel.id} /> */}
      <SendMessage onSubmit={() => {}} placeholder={`@${userId}`} />
    </AppLayout>
  );
};

const createDirectMessageMutation = gql`
mutation($channelId: Int!, $text: String!) {
  createMessage(channelId: $channelId, text: $text)
}
`;

export default compose(
  graphql(meQuery, { options: { fetchPolicy: 'network-only' } }),
  graphql(createDirectMessageMutation),
)(ViewTeam);
