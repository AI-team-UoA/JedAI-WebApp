import React, { Component } from 'react'
import {Form, Col, Button, Jumbotron } from 'react-bootstrap/';
import PropTypes from 'prop-types'
import '../../../resources/static/css/main.css'

class ClusterConnectionForm extends Component {
    urlPattern = new RegExp('^((https?|hdfs|s3):\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    portPattern = new RegExp('^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])')
    validURL = (str) => {return !!this.urlPattern.test(str)}
    validPort = (str) => {return !isNaN(str) && parseInt(str) > 999 &&  parseInt(str) < 65530}
    

    render() {
        var validAddress = this.validURL(this.props.address)
        var validPort = this.validPort(this.props.port)

        return (
            <div>
                <Form style={{ marginLeft: '100px' }}>
                <Form.Row>
                    <Form.Group md="8" controlId="addressId">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="http://127.0.0.1"
                            onChange={this.props.onChange} 
                            name="address" 
                            value={this.props.address}
                            
                            isInvalid={! validAddress}
                            isValid = {validAddress}
                        />
                        <Form.Control.Feedback type="invalid">Invalid value</Form.Control.Feedback>
                    </Form.Group>
                    </Form.Row>
                    <Form.Row>
                    <Form.Group md="8" controlId="portId" >
                        <Form.Label>Port</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="8998"
                            onChange={this.props.onChange} 
                            name="port"
                            value={this.props.port}

                            isInvalid={! validPort}
                            isValid = {validPort}
                        />
                        <Form.Control.Feedback type="invalid">Invalid value</Form.Control.Feedback>
                    </Form.Group>
                </Form.Row>
                </Form>
            </div>
        );
    }
    

} 

ClusterConnectionForm.propTypes = {
    address: PropTypes.string.isRequired,
    port: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
}
export default ClusterConnectionForm;