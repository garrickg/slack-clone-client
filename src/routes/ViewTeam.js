import React from 'react';
import { graphql } from 'react-apollo';

import { allTeamsQuery } from '../graphql/team';

import Header from '../components/Header';
import Messages from '../components/Messages';
import SendMessage from '../components/SendMessage';
import AppLayout from '../components/AppLayout';
import Sidebar from '../containers/Sidebar';

const ViewTeam = ({ data: { loading, allTeams }, match: { params: { teamId, channelId } } }) => {
  if (loading) {
    return null;
  }

  const teamIdx = teamId ? allTeams.findIndex(t => t.id === parseInt(teamId, 10)) : 0;
  const team = allTeams[teamIdx];
  const teams = allTeams.map(t => ({
    id: t.id,
    letter: t.name.charAt(0).toUpperCase(),
  }));
  const channelIdx = channelId
    ? team.channels.findIndex(c => c.id === parseInt(channelId, 10))
    : 0;
  const channel = team.channels[channelIdx];

  return (
    <AppLayout>
      <Sidebar teams={teams} team={team} />
      <Header channelName={channel.name} />
      <Messages channelId={channel.id}>
        <ul className="message-list">
          <li />
          <li />
        </ul>
      </Messages>
      <SendMessage channelName={channel.name} />
    </AppLayout>
  );
};

export default graphql(allTeamsQuery)(ViewTeam);
