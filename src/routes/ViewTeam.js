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
  mutate,
  data: { loading, me },
  match: { params: { teamId, channelId } },
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

  const channelIdInteger = parseInt(channelId, 10);
  const channelIdx = channelIdInteger
    ? team.channels.findIndex(c => c.id === channelIdInteger)
    : 0;
  const channel = channelIdx === -1 ? team.channels[0] : team.channels[channelIdx];

  return (
    <AppLayout>
      <Sidebar teams={teamInitials} team={team} username={username} />
      {channel && <Header channelName={channel.name} />}
      {channel && (
      <MessageContainer channelId={channel.id} />
      )}
      {channel && <SendMessage
        onSubmit={async (text) => {
        await mutate({ variables: { text, channelId: channel.id } });
      }}
        placeholder={`#${channel.name}`}
      />}
    </AppLayout>
  );
};

const createMessageMutation = gql`
mutation($channelId: Int!, $text: String!) {
  createMessage(channelId: $channelId, text: $text)
}
`;

export default compose(
  graphql(meQuery, { options: { fetchPolicy: 'network-only' } }),
  graphql(createMessageMutation),
)(ViewTeam);
