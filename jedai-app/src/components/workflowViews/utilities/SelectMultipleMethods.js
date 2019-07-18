import React, { Component } from 'react'
import PropTypes from 'prop-types';
import {Form, Col, Row, Alert } from 'react-bootstrap/'


class SelectMultipleMethods extends Component {

    constructor(...args) {
        super(...args);
        this.state = {
            name: this.props.name,
            label:this.props.label,
            selected: false,
            conf_type: "default"
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
                            <input type="checkbox" name={this.props.name} onChange={this.onChange}/>
                        </Col>

                        <Col sm={4}>
                            <Form.Label>{this.props.label}</Form.Label>
                        </Col>
                        <Form>
                            <Col sm={3} style={{ display: 'flex', flexDirection: 'row', float:'right'}} >
                             
                            <Form.Check
                                    type="radio"
                                    label="Default"
                                    name="conf_type"
                                    value="default"
                                    style={{marginRight:'5px'}}
                                    onChange={this.onChange}   
                                    disabled={this.state.selected === false}   
                                    defaultChecked
                                                
                                />
                                <Form.Check
                                    type="radio"
                                    label="Automated"
                                    name="conf_type"
                                    value="automated"
                                    style={{marginRight:'5px'}}
                                    onChange={this.onChange} 
                                    disabled={this.state.selected === false}
                                />
                                <Form.Check
                                    type="radio"
                                    label="Manual"
                                    name="conf_type"
                                    value="manual"
                                    style={{marginRight:'5px'}}
                                    onChange={this.onChange} 
                                    disabled={this.state.selected === false}
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
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    submitChange: PropTypes.func.isRequired
}
export default SelectMultipleMethods