import React from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { Redirect } from 'react-router-dom';

import { meQuery } from '../graphql/team';

import Header from '../components/Header';
import SendMessage from '../components/SendMessage';
import AppLayout from '../components/AppLayout';
import Sidebar from '../containers/Sidebar';
import DirectMessageContainer from '../containers/DirectMessageContainer';

const ViewTeam = ({
  mutate,
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
      <Header channelName={"Someone's Username"} />
      <DirectMessageContainer teamId={teamId} userId={userId} />
      <SendMessage
        onSubmit={async (text) => {
        const response = await mutate({
          variables: {
            text,
            receiverId: userId,
            teamId,
          },
        });
        console.log(response);
      }}
        placeholder={`@${userId}`}
      />
    </AppLayout>
  );
};

const createDirectMessageMutation = gql`
  mutation ($receiverId: Int!, $text: String!, $teamId: Int!) {
    createDirectMessage(receiverId: $receiverId, text: $text, teamId: $teamId)
  }
`;

export default compose(
  graphql(meQuery, { options: { fetchPolicy: 'network-only' } }),
  graphql(createDirectMessageMutation),
)(ViewTeam);
