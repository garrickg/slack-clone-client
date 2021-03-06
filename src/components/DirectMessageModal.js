import React from 'react';
import { Modal, Input, Button, Form } from 'semantic-ui-react';
import Downshift from 'downshift';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';

import { getTeamMembersQuery } from '../graphql/team';

const DirectMessageModal = ({
  history,
  open,
  onClose,
  teamId,
  data: {
    loading,
    getTeamMembers,
  },
}) => (
  <Modal
    open={open}
    onClose={(e) => {
      onClose(e);
    }}
  >
    <Modal.Header>New Direct Message</Modal.Header>
    <Modal.Content>
      <Form>
        <Form.Field>
          {!loading && (
          <Downshift
            onChange={selectedUser =>
                history.push(`/view-team/user/${teamId}/${selectedUser.id}`)}
            render={({
        getInputProps,
        getItemProps,
        isOpen,
        inputValue,
        selectedItem,
        highlightedIndex,
      }) => (
        <div>
          <Input {...getInputProps({ placeholder: 'Search Team Members' })} fluid />
          {isOpen ? (
            <div style={{ border: '1px solid #ccc' }}>
              {getTeamMembers
                .filter(i =>
                    !inputValue ||
                    i.username.toLowerCase().includes(inputValue.toLowerCase()))
                .map((item, index) => (
                  <div
                    {...getItemProps({ item })}
                    key={item.id}
                    style={{
                      backgroundColor:
                        highlightedIndex === index ? 'gray' : 'white',
                      fontWeight: selectedItem === item ? 'bold' : 'normal',
                    }}
                  >
                    {item.username}
                  </div>
                ))}
            </div>
          ) : null}
        </div>
      )}
          />)}
        </Form.Field>
        <Form.Group>
          <Button
            negative
            fluid
            onClick={(e) => {
              onClose(e);
            }}
          >
            Cancel
          </Button>
        </Form.Group>
      </Form>
    </Modal.Content>
  </Modal>
);

export default withRouter(graphql(getTeamMembersQuery)(DirectMessageModal));
