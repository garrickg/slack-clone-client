import React from 'react';
import { Modal, Input, Button, Form } from 'semantic-ui-react';
import { withFormik } from 'formik';
import gql from 'graphql-tag';
import { compose, graphql } from 'react-apollo';

import normalizeErrors from '../shared/normalizeErrors';

const InvitePeopleModal = ({
  open,
  onClose,
  values,
  handleChange,
  handleBlur,
  handleSubmit,
  handleReset,
  isSubmitting,
  touched,
  errors,
}) => (
  <Modal
    open={open}
    onClose={(e) => {
      onClose(e);
      handleReset();
    }}
  >
    <Modal.Header>Add Team Member</Modal.Header>
    <Modal.Content>
      <Form>
        <Form.Field>
          <Input
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            name="email"
            fluid
            placeholder="Email Address"
          />
        </Form.Field>
        {touched.email && errors.email ? errors.email : null}
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
          <Button positive fluid disabled={isSubmitting || !values.email} onClick={handleSubmit}>
            Add Team Memeber
          </Button>
        </Form.Group>
      </Form>
    </Modal.Content>
  </Modal>
);

const addTeamMemberMutation = gql`
  mutation($email: String!, $teamId: Int!) {
    addTeamMember(email: $email, teamId: $teamId) {
      ok
      errors {
        path
        message
      }
    }
  }
`;

export default compose(
  graphql(addTeamMemberMutation),
  withFormik({
    mapPropsToValues: () => ({ email: '' }),
    handleSubmit: async (
      values,
      { props: { teamId, mutate, onClose }, setSubmitting, setErrors },
    ) => {
      const response = await mutate({
        variables: { teamId, email: values.email },
      });
      const { ok, errors } = response.data.addTeamMember;
      console.log(errors);
      if (ok) {
        onClose();
        setSubmitting(false);
      } else {
        setSubmitting(false);
        const errorsLength = errors.length;
        const filteredErrors = errors.filter(e => e.message !== 'user_id must be unique');
        if (errorsLength !== filteredErrors.length) {
          filteredErrors.push({
            path: 'email',
            message: 'this user has already been added to the team',
          });
        }
        setErrors(normalizeErrors(filteredErrors));
      }
    },
  }),
)(InvitePeopleModal);
