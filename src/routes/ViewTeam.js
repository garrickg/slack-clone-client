import React from 'react';
import { graphql } from 'react-apollo';
import { Redirect } from 'react-router-dom';

import { allTeamsQuery } from '../graphql/team';

import Header from '../components/Header';
import SendMessage from '../components/SendMessage';
import AppLayout from '../components/AppLayout';
import Sidebar from '../containers/Sidebar';
import MessageContainer from '../containers/MessageContainer';

const ViewTeam = ({ data: { loading, allTeams, inviteTeams }, match: { params: { teamId, channelId } } }) => {
  if (loading) {
    return null;
  }

  if (!allTeams.length && !inviteTeams.length) {
    return (<Redirect to="/create-team" />);
  }

  const teams = [...allTeams, ...inviteTeams];

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
      <Sidebar teams={teamInitials} team={team} />
      {channel && <Header channelName={channel.name} />}
      {channel && (
      <MessageContainer channelId={channel.id} />
      )}
      {channel && <SendMessage channelName={channel.name} channelId={channel.id} />}
    </AppLayout>
  );
};

export default graphql(allTeamsQuery)(ViewTeam);
