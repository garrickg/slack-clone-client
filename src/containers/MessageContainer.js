import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Comment } from 'semantic-ui-react';

import Messages from '../components/Messages';

const MessageContainer = ({ data: { loading, messages } }) => (loading ? null : (
  <Messages>
    <Comment.Group>
      {messages.map(m => (
        <Comment key={`${m.id}-message`}>
          <Comment.Content>
            <Comment.Author as="a">{m.user.username}</Comment.Author>
            <Comment.Metadata>
              <div>{m.created_at}</div>
            </Comment.Metadata>
            <Comment.Text>{m.text}</Comment.Text>
          </Comment.Content>
        </Comment>
    ))}
    </Comment.Group>
  </Messages>
));

const MessagesQuery = gql`
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

export default graphql(MessagesQuery, {
  variables: props => ({
    channelId: props.channelId,
  }),
})(MessageContainer);
