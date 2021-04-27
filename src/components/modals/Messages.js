import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Moment from 'react-moment';
import moment from 'moment';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';

import MessageForm from '../elements/MessageForm';
import 'react-bootstrap-typeahead/css/Typeahead.css';


const MessagesModal = props => {
  const { address, messages, toggleModal, wallet, ...rest } = props;

  const [showForm, setShowForm] = useState(false);
  const [filteredMessages, setFilteredMessages] = useState(messages);
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = e => setSearchTerm(e.target.value);

  useEffect(() => {
    const regex = new RegExp(`.?${searchTerm}.?`, 'gi');
    setFilteredMessages(searchTerm !== '' ? messages.filter(message => message.message.match(regex)) : messages);
  }, [messages, searchTerm]);

  return (
    <Modal
      {...rest}
      size="lg"
	    id="dlgMessages"
      onHide={() => toggleModal('messages')}
    >
      <Modal.Header closeButton>
        <Modal.Title>Messages</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex flex-row width-100 justify-content-between mg-b-10">
          <Form.Control
            type="text"
            placeholder="Search by message content"
            onKeyUp={e => handleChange(e)}
          />
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'CANCEL' : 'SEND NEW MESSAGE'}
          </button>
        </div>

        {showForm && <MessageForm address={address} wallet={wallet} />}

        <label className="section-title d-inline-block">Your Messages</label>
        <div className="list-group tx-details">
          {filteredMessages.length > 0 && filteredMessages
            .sort((a, b) => (moment(b.timestamp).unix() - moment(a.timestamp).unix()))
            .map(message =>
              <div key={moment(message.timestamp).unix()} className="list-group-item pd-y-20">
                <div className="media">
                  <div className="d-flex mg-r-10 wd-50">
                    {message.type === 'in'
                      ? <FaArrowDown className="text-success tx-icon" />
                      : <FaArrowUp className="text-danger tx-icon" />
                    }
                  </div>
                  <div className="media-body">
                    <small className="mg-b-10 tx-timestamp"><Moment>{message.timestamp}</Moment></small>
                    <p className="mg-b-5">
                      {message.message}
                    </p>
                  </div>
                </div>
              </div>
            )}
        </div>

      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-outline-secondary" onClick={() => toggleModal('messages')}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  )
};

export default MessagesModal;
