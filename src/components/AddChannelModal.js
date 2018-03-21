import React from 'react';
import { Modal, Input, Button, Form } from 'semantic-ui-react';
import { withFormik } from 'formik';
import gql from 'graphql-tag';
import { compose, graphql } from 'react-apollo';

import { allTeamsQuery } from '../graphql/team';

const AddChannelModal = ({
  open,
  onClose,
  values,
  handleChange,
  handleBlur,
  handleSubmit,
  handleReset,
  isSubmitting,
}) => (
  <Modal
    open={open}
    onClose={(e) => {
      onClose(e);
      handleReset();
    }}
  >
    <Modal.Header>Add Channel</Modal.Header>
    <Modal.Content>
      <Form>
        <Form.Field>
          <Input
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            name="name"
            fluid
            placeholder="Channel Name"
          />
        </Form.Field>
        <Form.Group widths="equal">
          <Button
            negative
            fluid
            onClick={(e) => {
              handleReset();
              onClose(e);
            }}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button positive fluid disabled={isSubmitting || !values.name} onClick={handleSubmit}>
            Create Channel
          </Button>
        </Form.Group>
      </Form>
    </Modal.Content>
  </Modal>
);

const createChannelMutation = gql`
  mutation($teamId: Int!, $name: String!) {
    createChannel(teamId: $teamId, name: $name) {
      ok
      channel {
        id
        name
      }
    }
  }
`;

export default compose(
  graphql(createChannelMutation),
  withFormik({
    mapPropsToValues: () => ({ name: '' }),
    handleSubmit: async (values, { props: { teamId, mutate, onClose }, setSubmitting }) => {
      await mutate({
        variables: { teamId, name: values.name },
        optimisticResponse: {
          __typename: 'Mutation',
          createChannel: {
            __typename: 'ChannelResponse',
            ok: true,
            channel: {
              __typename: 'Channel',
              name: values.name,
              id: -1,
            },
          },
        },
        update: (store, { data: { createChannel } }) => {
          const { ok, channel } = createChannel;
          if (!ok) {
            return;
          }
          const data = store.readQuery({ query: allTeamsQuery });
          const teamIdx = data.allTeams.findIndex(t => t.id === teamId);
          data.allTeams[teamIdx].channels.push(channel);
          store.writeQuery({ query: allTeamsQuery, data });
        },
      });
      onClose();
      setSubmitting(false);
    },
  }),
)(AddChannelModal);
