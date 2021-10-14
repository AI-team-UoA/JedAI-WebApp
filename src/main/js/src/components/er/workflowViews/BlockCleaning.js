import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Form, Row, FormControl, Col, Jumbotron, Collapse } from 'react-bootstrap/'
import CheckboxMethod from './utilities/CheckboxMethod'
import update from 'immutability-helper'
import axios from 'axios';
import "../../../../../resources/static/css/main.css"


class BlockCleaning extends Component {

    constructor(...args) {
        super(...args);
        window.scrollTo(0, 0)
        this.submitChange = this.submitChange.bind(this)
        
        // Default values of the parameters of the methods
        this.default_parameters = [
            {
                parameters:
                    [
                        {
                            label: "Purging Factor",
                            value: "0.005"
                        }
                    ]
            },
            {
                parameters:
                    [
                        {
                            label: "Smoothing Factor",
                            value: "1.0"
                        }
                    ]
            },
            {
                parameters:
                    [
                        {
                            label: "Filtering Ratio",
                            value: "0.8"
                        }
                    ]
                
            }
        ]
        
        if (this.props.state.length !== 0){
            var selected_methods = new Map()
            this.props.state.forEach((selected_method) => {
                selected_methods.set(selected_method.method_name, selected_method)
            })

            // in case user has already selected and returns back, initialize state based on father component's state
            this.state = {
                block_cleaning : [
                    {
                        method_name: "SIZE_BASED_BLOCK_PURGING",
                        selected: selected_methods.has("SIZE_BASED_BLOCK_PURGING") ? selected_methods.get("SIZE_BASED_BLOCK_PURGING").selected : false,
                        label: "Size-based Block Purging",
                        configuration_type: selected_methods.has("SIZE_BASED_BLOCK_PURGING") ? selected_methods.get("SIZE_BASED_BLOCK_PURGING").configuration_type : "Default",
                        parameters: selected_methods.has("SIZE_BASED_BLOCK_PURGING") ? selected_methods.get("SIZE_BASED_BLOCK_PURGING").parameters : this.default_parameters[0].parameters
                    },  
                    {
                        method_name: "COMPARISON_BASED_BLOCK_PURGING",
                        selected: selected_methods.has("COMPARISON_BASED_BLOCK_PURGING") ? selected_methods.get("COMPARISON_BASED_BLOCK_PURGING").selected : false,
                        label: "Comparison-based Block Purging",
                        configuration_type: selected_methods.has("COMPARISON_BASED_BLOCK_PURGING") ? selected_methods.get("COMPARISON_BASED_BLOCK_PURGING").configuration_type : "Default",
                        parameters: selected_methods.has("COMPARISON_BASED_BLOCK_PURGING") ? selected_methods.get("COMPARISON_BASED_BLOCK_PURGING").parameters : this.default_parameters[1].parameters
                    },  
                    {
                        method_name: "BLOCK_FILTERING",
                        selected: selected_methods.has("BLOCK_FILTERING") ? selected_methods.get("BLOCK_FILTERING").selected : false,
                        label: "Block Filtering",
                        configuration_type: selected_methods.has("BLOCK_FILTERING") ? selected_methods.get("BLOCK_FILTERING").configuration_type : "Default",
                        parameters: selected_methods.has("BLOCK_FILTERING") ? selected_methods.get("BLOCK_FILTERING").parameters : this.default_parameters[2].parameters
                    }
                ]
            }
        }
        else{
            // Block cleaning is not initialized
            this.state = {
                block_cleaning : [
                    {
                        method_name: "SIZE_BASED_BLOCK_PURGING",
                        selected: false,
                        label: "Size-based Block Purging",
                        configuration_type: "Default",
                        parameters:  this.default_parameters[0].parameters
                    },  
                    {
                        method_name: "COMPARISON_BASED_BLOCK_PURGING",
                        selected: false,
                        label: "Comparison-based Block Purging",
                        configuration_type: "Default",
                        parameters: this.default_parameters[1].parameters
                    },  
                    {
                        method_name: "BLOCK_FILTERING",
                        selected: false,
                        label: "Block Filtering",
                        configuration_type: "Default",
                        parameters: this.default_parameters[2].parameters
                    }
                ]
            }
        }
        
        
    }

    // Change the parameters of the method
    onChange = (e, index) => {
        var value = e.target.value
        if (!isNaN(value) && value!== ""){


            // first calculate the new parameters
            var updated_state = update(this.state.block_cleaning[index].parameters[0], {value: {$set: value}}); 
            var newData = update(this.state.block_cleaning[index].parameters, {
                    $splice: [[0, 1, updated_state]]
            });  

             //then, apply them to the state
             this.setState(state => {
                const block_cleaning = state.block_cleaning.map((method, i) => {
                    if (i === index) 
                        return {...method, parameters: newData}
                    else 
                        return method;
                });
                return { block_cleaning,};
            });
        }
    }

    // update the selected element in the state
    submitChange(child_state){
        this.setState({
            block_cleaning: this.state.block_cleaning.map(el => (el.method_name === child_state.method_name ? {...child_state} : el))
        });
    }


    // Put selected methods into an array and return them back to the father compoenent
    // block cleaning is optional thus validation is always true
    isValidated(){
        var selected_methods = []
        this.state.block_cleaning.forEach((method) => {
            if (method.selected){
                selected_methods.push(method)
            }
        })
        if(selected_methods.length > 0) {

            axios({
                url: '/workflow/set_configurations/blockcleaning',
                method: 'POST',
                data: selected_methods
            }).then(res => {
                var success = res.data
                this.props.submitState("block_cleaning", selected_methods)
                return  success
            })     
        }
        else this.props.submitState("block_cleaning", [])
        return true
    }

    render() {

        //Manual paramters windows
        var empty_col = 3
        var first_col = 3
        var second_col = 3

        this.BC_parameters_JSX =  [
                    <Form >
                        <div style ={{textAlign:'center'}}>
                            <h3>Size-Based Block Purging</h3>
                            <p>Please configure the method's parameter below</p>
                        </div>
                        <br />
                        <Form.Row className="form-row">
                            <Col sm={empty_col} />
                            <Col sm={first_col} >
                                <Form.Label>Purging Factor</Form.Label> 
                            </Col>
                            <Col sm={second_col}>
                                <FormControl 
                                    type="text" 
                                    name="value" 
                                    onChange={(e) => this.onChange(e, 0)}
                                    value={this.state.block_cleaning[0].parameters[0].value} 
                                />
                            </Col>
                            <Col sm={2}>
                                <span title="The Purging Factor determines indirectly the maximum number of entities per block." className="fa fa-info-circle fa-2x" style={{color: "#4663b9"}}/>	
                            </Col>
                        </Form.Row>
                    </Form>
                , 
                <Form>
                    <div style ={{textAlign:'center'}}>
                        <h3>Comparison-Based Block Purging</h3>
                        <p>Please configure the method's parameter below</p>
                    </div>
                    <br />
                    <Form.Row className="form-row">
                        <Col sm={empty_col} />
                        <Col sm={first_col} >
                            <Form.Label>Smoothing Factor</Form.Label> 
                        </Col>
                        <Col sm={second_col}>
                            <FormControl 
                                type="text" 
                                name="value" 
                                onChange={(e) => this.onChange(e, 1)}
                                value={this.state.block_cleaning[1].parameters[0].value} 
                            />
                        </Col>
                        <Col sm={2}>
                                <span title="The Smoothing Factor determines the termination criterion for automatically estimating the maximum number of comparisons per block." className="fa fa-info-circle fa-2x" style={{color: "#4663b9"}}/>	
                            </Col>
                    </Form.Row>
                </Form>, 
                <Form>
                    <div style ={{textAlign:'center'}}>
                        <h3>Block Filtering</h3>
                        <p>Please configure the method's parameter below</p>
                    </div>
                    <br />
                    <Form.Row className="form-row">
                        <Col sm={empty_col} />
                        <Col sm={first_col} >
                            <Form.Label>Filtering Ratio</Form.Label> 
                        </Col>
                        <Col sm={second_col}>
                            <FormControl 
                                type="text" 
                                name="value" 
                                onChange={(e) => this.onChange(e, 2)}
                                value={this.state.block_cleaning[2].parameters[0].value} 
                            />
                        </Col>
                        <Col sm={2}>
                            <span title="The Filtering Ratio specifies the portion of the retained smaller blocks per entity." className="fa fa-info-circle fa-2x" style={{color: "#4663b9"}}/>	
                        </Col>
                    </Form.Row>
                </Form>]
        
        this.parameters_collapse = [false, false, false]

        
        // open the Collapses of the Manual configurations 
        for (var i = 0; i < 3; i++) {
            if (this.state.block_cleaning[i].selected && this.state.block_cleaning[i].configuration_type === "Manual")    
                this.parameters_collapse[i] = true
            else
                this.parameters_collapse[i] = false
        }

        return (
            <div>
                <br/>
                <div style={{marginBottom:"5px"}}> 
                    <h1 style={{display:'inline', marginRight:"20px"}}>Block Cleaning</h1> 
                    <span className="workflow-desc" >Block Cleaning aims to clean a set of overlapping blocks from unnecessary comparisons, which can be either redundant (i.e., repeated) or superfluous (i.e., between non-matching entities). Its methods operate on the coarse level of individual blocks or entities.</span>
                </div>

                <br/>
                <hr style={{ color: 'black', backgroundColor: 'black', height: '5' }}/>
                <br/>

                <Form.Group as={Row} className="form-row" > 
                    <Form.Label><h5>Select methods for Block Cleaning (Optional)</h5></Form.Label>
                </Form.Group> 

                <CheckboxMethod submitChange={this.submitChange} state={this.state.block_cleaning[0]} disableAutomatic={!this.props.GTIsSet} />
                <Collapse in={this.parameters_collapse[0]} >
                    <div className="jumbotron_parameters_container">
                        <Jumbotron className="jumbotron_parameters">
                            <div style={{margin:"auto"}}>
                                {this.BC_parameters_JSX[0]}
                            </div>  
                        </Jumbotron>
                    </div>
                </Collapse>

                <CheckboxMethod submitChange={this.submitChange} state={this.state.block_cleaning[1]} disableAutomatic={!this.props.GTIsSet} />
                <Collapse in={this.parameters_collapse[1]} >
                    <div className="jumbotron_parameters_container">
                        <Jumbotron className="jumbotron_parameters">
                            <div style={{margin:"auto"}}>
                                {this.BC_parameters_JSX[1]}
                            </div>  
                        </Jumbotron>
                    </div>
                </Collapse>

                <CheckboxMethod submitChange={this.submitChange} state={this.state.block_cleaning[2]} disableAutomatic={!this.props.GTIsSet} />
                <Collapse in={this.parameters_collapse[2]} >
                    <div className="jumbotron_parameters_container">
                        <Jumbotron className="jumbotron_parameters">
                            <div style={{margin:"auto"}}>
                                {this.BC_parameters_JSX[2]}
                            </div>  
                        </Jumbotron>
                    </div>
                </Collapse>
                <br/>
                <br/>
                
            </div>
        )
    }
}

BlockCleaning.propTypes = {
    submitState: PropTypes.func.isRequired,
    GTIsSet: PropTypes.bool.isRequired  
}

export default BlockCleaning