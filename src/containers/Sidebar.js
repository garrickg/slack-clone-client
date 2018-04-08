import React, { Component } from 'react';

import Channels from '../components/Channels';
import Teams from '../components/Teams';
import AddChannelModal from '../components/AddChannelModal';
import InvitePeopleModal from '../components/InvitePeopleModal';
import DirectMessageModal from '../components/DirectMessageModal';

export default class Sidebar extends Component {
  state = {
    openAddChannelModal: false,
    openInvitePeopleModal: false,
    openDirectMessageModal: false,
  };

  toggleAddChannelModal = (e) => {
    if (e) {
      e.preventDefault();
    }
    this.setState(state => ({ openAddChannelModal: !state.openAddChannelModal }));
  };

  toggleInvitePeopleModal = (e) => {
    if (e) {
      e.preventDefault();
    }
    this.setState(state => ({ openInvitePeopleModal: !state.openInvitePeopleModal }));
  };

  toggleDirectMessageModal = (e) => {
    if (e) {
      e.preventDefault();
    }
    this.setState(state => ({ openDirectMessageModal: !state.openDirectMessageModal }));
  };

  render() {
    const { teams, team, username } = this.props;
    const { openAddChannelModal, openInvitePeopleModal, openDirectMessageModal } = this.state;

    return [
      <Teams key="team-sidebar" teams={teams} />,
      <Channels
        key="channels-sidebar"
        teamName={team.name}
        username={username}
        channels={team.channels}
        teamId={team.id}
        isOwner={team.admin}
        users={team.directMessageMembers}
        onAddChannelClick={this.toggleAddChannelModal}
        onInvitePeopleClick={this.toggleInvitePeopleModal}
        onDirectMessageClick={this.toggleDirectMessageModal}
      />,
      <AddChannelModal
        open={openAddChannelModal}
        onClose={this.toggleAddChannelModal}
        key="sidebar-add-channel-modal"
        teamId={team.id}
      />,
      <InvitePeopleModal
        open={openInvitePeopleModal}
        onClose={this.toggleInvitePeopleModal}
        key="invite-people-modal"
        teamId={team.id}
      />,
      <DirectMessageModal
        open={openDirectMessageModal}
        onClose={this.toggleDirectMessageModal}
        key="direct-message-modal"
        teamId={team.id}
      />,
    ];
  }
}
