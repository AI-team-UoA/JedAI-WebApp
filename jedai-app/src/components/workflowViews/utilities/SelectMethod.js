import React, { Component } from 'react'
import PropTypes from 'prop-types';
import {Form, Col, Row, Alert} from 'react-bootstrap/'

class SelectMethod extends Component {
    
    constructor(...args) {
        super(...args);

        this.state = {
            method: this.props.default_method,
            conf_type: "default"
        }
    }

    onChange = (e) => {
        this.setState({[e.target.name]: e.target.value},
            () => (this.props.onChange(this.state)))
    } 

    
    
    
    render() {
        var configurations =  this.props.methods.map((conf, index) => (
            <Form.Check
                type="radio"
                label={conf.label}
                name="method"
                value={conf.value}
                onChange={this.onChange}
                checked={this.state.method === conf.value }
                key={index}
            />
        ))
        return (
            <div>
                <fieldset>
                        <Alert  variant="primary" style={{color:'black', width:"65%", margin:'auto'}}>
                            <Form>
                                <Form.Group as={Row} className="form-row">           
                                    <Col sm={8}>
                                        <Form.Label as="legend"><h5>{this.props.title}</h5> </Form.Label>
                                        {configurations}
                                    </Col>
                                    <Col sm={4}>
                                        <Form.Label as="legend"><h5>Configuration Type</h5> </Form.Label>
                                        <Form.Check
                                            type="radio"
                                            label="Default"
                                            name="conf_type"
                                            value="default"
                                            onChange={this.onChange}
                                            checked={this.state.conf_type ===  "default"}
                                        />
                                        <Form.Check
                                            type="radio"
                                            label="Automatic"
                                            name="conf_type"
                                            value="automatic"
                                            onChange={this.onChange}
                                            disabled={this.props.auto_disabled}
                                        />
                                        <Form.Check
                                            type="radio"
                                            label="Manual"
                                            name="conf_type"
                                            value="manual"
                                            onChange={this.onChange}
                                        />
                                    </Col>
                                </Form.Group>
                            </Form>
                        </Alert>
                    </fieldset>
            </div>
        )
    }
}

SelectMethod.propTypes = {
    methods: PropTypes.array.isRequired,
    default_method: PropTypes.string.isRequired,
    auto_disabled: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
}

export default SelectMethod 