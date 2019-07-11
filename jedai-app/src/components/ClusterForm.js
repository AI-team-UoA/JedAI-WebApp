import React, { Component } from 'react'
import {Form, Col, Button, Jumbotron } from 'react-bootstrap/';
import '../css/main.css'

class ClusterForm extends Component {

    
    constructor(...args) {
        super(...args);

        this.validate_address = 0
        this.validate_port = 0

        this.state = { 
            address:"",
            port:"",
            username:"",
            pswd:"",
        };
    }

    
    onChange = (e) => this.setState({[e.target.name]: e.target.value})


    handleSubmit(event) {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();

            this.validate_address = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(this.state.address)? 1 : 2
            this.validate_port = /^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/.test(this.state.port)? 1 : 2
            console.log(this.validate_address)
            this.forceUpdate();
        }
    }

    render() {
        return (
            <div >
                <Jumbotron style={{width:"80%", position:'relative', left:"-18%"}}>
                    <Form
                        noValidate
                        onSubmit={e => this.handleSubmit(e)}
                        style={{ margin: '10px 40px', float: 'rgiht' }}
                    >
                    <Form.Row>
                        <Form.Group  as={Col} md="8" controlId="addressId">
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                placeholder="127.0.0.1."
                                onChange={this.onChange} 
                                name="address" 
                                value={this.state.address}
                                
                                isInvalid={this.validate_address === 2}
                                isValid = {this.validate_address === 1}
                            />
                            <Form.Control.Feedback type="invalid">Invalid value</Form.Control.Feedback>
                            
                        </Form.Group>
                        <Form.Group as={Col} md="4" controlId="portId" >
                            <Form.Label>Port</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                placeholder="8080"
                                onChange={this.onChange} 
                                name="port" 
                                value={this.state.port}

                                isInvalid={this.validate_port === 2}
                                isValid = {this.validate_port === 1}
                            />
                            <Form.Control.Feedback type="invalid">Invalid value</Form.Control.Feedback>
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col} md="8" controlId="usernameId"  >
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text"
                                required
                                onChange={this.onChange} 
                                name="username" 
                                value={this.state.username}
                            />
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col} md="8" controlId="pswdId"  >
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" 
                                required
                                onChange={this.onChange} 
                                name="pswd" 
                                value={this.state.pswd} 
                            />
                        </Form.Group>
                    </Form.Row>

                    <Button type="submit" style={{float:'right'}}>Submit form</Button>
                    </Form>
                </Jumbotron>
            </div>
        );
    }
    

}



export default ClusterForm;