import React, { Component } from 'react'
import PropTypes from 'prop-types';
import {Form, Col, Row, Alert} from 'react-bootstrap/'

class SelectMethod extends Component {
    
    constructor(...args) {
        super(...args);

        this.state = {
            method_name: this.props.state.method_name,
            configuration_type: this.props.state.configuration_type,
            label: this.props.state.label,
            parameters: this.props.state.parameters
        }
    }

    onChange = (label, e) => {
        if (e.target.name ==="method_name"){
            this.setState({[e.target.name]: e.target.value, label: label},
                () => (this.props.onChange(this.state)))
        }
        else
            this.setState({[e.target.name]: e.target.value},
                () => (this.props.onChange(this.state)))
    } 

    
    
    
    render() {
        var configurations =  this.props.methods.map((conf, index) => (
            <Form.Check
                type="radio"
                label={conf.label}
                name="method_name"
                value={conf.value}
                onChange={(e) => this.onChange(conf.label, e)}
                checked={this.state.method_name === conf.value }
                key={index}
                disabled = {conf.disabled == undefined ? false : conf.disabled}
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
                                            name="configuration_type"
                                            value="Default"
                                            onChange={(e) => this.onChange("", e)}
                                            checked={this.state.configuration_type ===  "Default"}
                                        />
                                        <Form.Check
                                            type="radio"
                                            label="Automatic"
                                            name="configuration_type"
                                            value="Automatic"
                                            onChange={(e) => this.onChange("", e)}
                                            disabled={this.props.disableAutomatic}
                                            checked={this.state.configuration_type ===  "Automatic"}
                                        />
                                        <Form.Check
                                            type="radio"
                                            label="Manual"
                                            name="configuration_type"
                                            value="Manual"
                                            onChange={(e) => this.onChange("", e)}
                                            disabled={this.props.disable_manual}
                                            checked={this.state.configuration_type ===  "Manual"}
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
    state: PropTypes.object.isRequired,
    disableAutomatic: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
}

export default SelectMethod 