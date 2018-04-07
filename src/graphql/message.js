import gql from 'graphql-tag';

export const messagesQuery = gql`
  query ($channelId: Int!) {
    messages(channelId: $channelId) {
      text
      id
      user {
        username
      }
      created_at
    }
  }
`;

export const directMessagesQuery = gql`
  query ($teamId: Int!, $userId: Int!) {
    directMessages(teamId: $teamId, otherUserId: $userId) {
      id
      sender {
        username
      }
      text
      created_at
    }
  }
`;

export const newChannelMessageSubscription = gql`
  subscription($channelId: Int!) {
    newChannelMessage(channelId: $channelId) {
      id
      text
      user {
        username
      }
      created_at
    }
  }
`;
