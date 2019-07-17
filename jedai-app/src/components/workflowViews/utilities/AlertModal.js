import {Modal, Button} from 'react-bootstrap/';
import PropTypes from 'prop-types';
import React, { Component } from 'react'


class AlertModal extends Component{
    render() {
        return (
            <div>
            
                <Modal show={this.props.show} onHide={this.props.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Wrong Input</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{this.props.text}</Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={this.props.handleClose}>
                        Close
                        </Button>
                       
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

AlertModal.propTypes = {
    show: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired,
    handleClose: PropTypes.func.isRequired
}



export default AlertModal;


