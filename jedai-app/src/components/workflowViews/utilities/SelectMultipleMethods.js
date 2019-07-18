import React, { Component } from 'react'
import PropTypes from 'prop-types';
import {Form, Col, Row, Alert } from 'react-bootstrap/'


class SelectMultipleMethods extends Component {

    constructor(...args) {
        super(...args);
        this.state = {
            name: this.props.state.name,
            label:this.props.state.label,
            selected: this.props.state.selected,
            conf_type: this.props.state.conf_type
        }
    }

    onChange = (e) => {
        if (e.target.name === "conf_type")
            this.setState({conf_type: e.target.value}, () => (this.submitChange()))
        else
            this.setState({selected:  !this.state.selected},() => (this.submitChange()))
    }

    submitChange(){
        this.props.submitChange(this.state)
    }

    render() {
        return (
            <div>
                <Alert  variant="primary" style={{height:'45px', width:"65%", margin:'auto', marginBottom:'10px' }}>
                    <Form.Group as={Row} className="form-row" > 
                        <Col sm={1}>
                            <input type="checkbox" name={this.state.name} onChange={this.onChange} checked={this.state.selected}/>
                        </Col>

                        <Col sm={4}>
                            <Form.Label>{this.state.label}</Form.Label>
                        </Col>
                        <Form>
                            <Col sm={3} style={{ display: 'flex', flexDirection: 'row', float:'right'}} >
                             
                            <Form.Check
                                    type="radio"
                                    label="Default"
                                    name="conf_type"
                                    value="Default"
                                    style={{marginRight:'5px'}}
                                    onChange={this.onChange}   
                                    disabled={this.state.selected === false}   
                                    checked={this.state.conf_type === "Default"}              
                                />
                                <Form.Check
                                    type="radio"
                                    label="Automatic"
                                    name="conf_type"
                                    value="Automatic"
                                    style={{marginRight:'5px'}}
                                    onChange={this.onChange} 
                                    disabled={this.state.selected === false}
                                    checked={this.state.conf_type === "Automatic"}
                                />
                                <Form.Check
                                    type="radio"
                                    label="Manual"
                                    name="conf_type"
                                    value="Manual"
                                    style={{marginRight:'5px'}}
                                    onChange={this.onChange} 
                                    disabled={this.state.selected === false}
                                    checked={this.state.conf_type === "Manual"}
                                />
                            </Col>
                        </Form>
                    </Form.Group>   
                </Alert>
            </div>
        )
    }
}


SelectMultipleMethods.propTypes = {
    state: PropTypes.object.isRequired,
    submitChange: PropTypes.func.isRequired
}
export default SelectMultipleMethods