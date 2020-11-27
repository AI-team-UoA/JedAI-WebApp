import React, { Component } from 'react'
import PropTypes from 'prop-types';
import RadioMethod from './utilities/RadioMethod'
import {Form, Row, Col, FormControl, Jumbotron, Collapse } from 'react-bootstrap/'
import update from 'immutability-helper'
import axios from 'axios';

class ComparisonCleaning extends Component {

    constructor(...args) {
        super(...args);
        window.scrollTo(0, 0)

        this.default_parameters = [
            {
                parameters: []
            },
            {
                parameters: [
                    {
                        label: "Weighting Scheme",
                        value: "CBS"
                    }
                ]
            },
            {
                parameters: [
                    {
                        label: "Inclusive Threshold",
                        value: "0.5"
                    },
                    {
                        label: "Exclusive Threshold",
                        value: "0.75"
                    }
                ]
            },
            {
                parameters: [
                    {
                        label: "Weighting Scheme",
                        value: "10"
                    },
                    {
                        label: "Invalid Parameter id",
                        value: "1"
                    }
                ]
            },
        ]

        this.state = {
            method_name: this.props.state.method_name,
            configuration_type: this.props.state.configuration_type,
            label: this.props.state.label,
            parameters: this.props.state.parameters
        }
    }

    methods = 
        [
            {
                value: "NO_CLEANING",
                label: "No Cleaning"
            },
            {
                value: "COMPARISON_PROPAGATION",
                label: "Comparison Propagation"
            },
            {
                value: "CARDINALITY_EDGE_PRUNING",
                label: "Cardinality Edge Pruning (CEP)"
            },
            {
                value: "CARDINALITY_NODE_PRUNING",
                label: "Cardinality Node Pruning (CNP)"
            },
            {
                value: "WEIGHED_EDGE_PRUNING",
                label: "Weighed Edge Pruning (WEP)"
            },
            {
                value: "WEIGHED_NODE_PRUNING",
                label: "Weighed Node Pruning (WNP)"
            },
            {
                value: "RECIPROCAL_CARDINALITY_NODE_PRUNING",
                label: "Reciprocal Cardinality Node Pruning (ReCNP)"
            },
            {
                value: "RECIPROCAL_WEIGHED_NODE_PRUNING",
                label: "Reciprocal Weighed Node Pruning (ReWNP)"
            },
            {
                value: "CANOPY_CLUSTERING",
                label: "Canopy Clustering"
            },
            {
                value: "CANOPY_CLUSTERING_EXTENDED",
                label: "Extended Canopy Clustering"
            }
        ]

    onChange = (e) => {
        var parameters 

        // set parameters to default values
        switch(e.method_name) {
            case "NO_CLEANING":
                parameters = this.default_parameters[0].parameters
                break;
            case "CANOPY_CLUSTERING":
                parameters = this.default_parameters[2].parameters
                break;
              case "CANOPY_CLUSTERING_EXTENDED":
                parameters = this.default_parameters[3].parameters
                break;
            default:
                parameters = this.default_parameters[1].parameters
          }
        
        this.setState(
            {
                method_name: e.method_name,
                configuration_type: e.configuration_type,
                label: e.label,
                parameters: parameters

            }
        )
    } 

    
    changeParameters = (e, parameter_index) =>{
        var name = e.target.name
        var value = e.target.value
        var flag = false
        if(name !== "select"){
            if(!isNaN(value) && value !== "" )
                flag=true
        }
        else flag =true

        if (flag){
            var updated_state = update(this.state.parameters[parameter_index], {value: {$set: value}}); 
            var newData = update(this.state.parameters, {
                    $splice: [[parameter_index, 1, updated_state]]
            });
            
            this.setState({parameters: newData})
        }
    }

    isValidated(){

        axios({
            url: '/workflow/set_configurations/comparisoncleaning',
            method: 'POST',
            data: this.state
        }).then(res => {
            var success = res.data
            this.props.submitState("comparison_cleaning", this.state)
            return success
        })
    }

    render() {
         //the JSX code of the parameters windows
         var empty_col = 2
         var first_col = 4
         var second_col = 3
 
        var parameters_JSX_window
        switch(this.state.method_name) {
            case "NO_CLEANING":
                parameters_JSX_window = <div />
                break;
            case "CANOPY_CLUSTERING":
                parameters_JSX_window = 
                            <Form>
                                <div style ={{textAlign:'center'}}>
                                    <h3>{this.state.label}</h3>
                                    <p>Please configure the method's parameters below</p>
                                </div>
                                <br />
                                <Form.Row className="form-row">
                                    <Col sm={empty_col} />
                                    <Col sm={first_col} >
                                        <Form.Label>Inclusive Threshold</Form.Label> 
                                    </Col>
                                    <Col sm={second_col}>
                                        <FormControl 
                                            type="text" 
                                            name="value" 
                                            onChange={(e) => this.changeParameters(e, 0)}
                                            value={this.state.parameters[0].value}   
                                        />
                                    </Col>
                                    <Col sm={2}>
                                        <span title="The Inclusive Threshold defines the minimum similarity of a retained comparison/edge per entity/node." className="fa fa-info-circle fa-2x" style={{color: "#4663b9"}}/>	
                                    </Col>
                                </Form.Row>
                                <Form.Row className="form-row">
                                    <Col sm={empty_col} />
                                    <Col sm={first_col} >
                                        <Form.Label>Exclusive Threshold</Form.Label> 
                                    </Col>
                                    <Col sm={second_col}>
                                        <FormControl 
                                            type="text" 
                                            name="value" 
                                            onChange={(e) => this.changeParameters(e, 1)}
                                            value={this.state.parameters[1].value} 
                                        />
                                    </Col>
                                    <Col sm={2}>
                                        <span title="The Exclusive Threshold defines the similarity above which a node is removed from the blocking graph so that it is not considered as a candidate match for any other node." className="fa fa-info-circle fa-2x" style={{color: "#4663b9"}}/>	
                                    </Col>
                                </Form.Row>
                            </Form>
                            
                break;
              case "CANOPY_CLUSTERING_EXTENDED":
                parameters_JSX_window = 
                            <Form>
                                <div style ={{textAlign:'center'}}>
                                    <h3>{this.state.label}</h3>
                                    <p>Please configure the method's parameters below</p>
                                </div>
                                <br />
                                <Form.Row className="form-row">
                                    <Col sm={empty_col} />
                                    <Col sm={first_col} >
                                        <Form.Label>Weighting Scheme</Form.Label> 
                                    </Col>
                                    <Col sm={second_col}>
                                        <FormControl 
                                            type="text" 
                                            name="value" 
                                            onChange={(e) => this.changeParameters(e, 0)}
                                            value={this.state.parameters[0].value}   
                                        />
                                    </Col>
                                    <Col sm={2}>
                                        <span title="The Weighting Scheme determines the function that assigns weights to the edges of the Blocking Graph." className="fa fa-info-circle fa-2x" style={{color: "#4663b9"}}/>	
                                    </Col>
                                </Form.Row>
                                <Form.Row className="form-row">
                                    <Col sm={empty_col} />
                                    <Col sm={first_col} >
                                        <Form.Label>Invalid Parameter id</Form.Label> 
                                    </Col>
                                    <Col sm={second_col}>
                                        <FormControl 
                                            type="text" 
                                            name="value" 
                                            onChange={(e) => this.changeParameters(e, 1)}
                                            value={this.state.parameters[1].value} 
                                        />
                                    </Col>
                                    <Col sm={2}>
                                        <span title="The invalid parameter id defines the maximum number of nodes/entities that are removed from the blocking graph so that they are not considered as candidate matches for any other node." className="fa fa-info-circle fa-2x" style={{color: "#4663b9"}}/>	
                                    </Col>
                                </Form.Row>
                            </Form>
                break;
            default:
                parameters_JSX_window = 
                            <Form>
                                <div style ={{textAlign:'center'}}>
                                    <h3>{this.state.label}</h3>
                                    <p>Please configure the method's parameter below</p>
                                </div>
                                <br/>
                                <Form.Row>
                                    <Col sm={empty_col} />
                                    <Col sm={first_col}>
                                        <Form.Label >Weighting Scheme</Form.Label> 
                                    </Col>
                                    <Col sm={second_col}>
                                        <Form.Group>
                                            <Form.Control 
                                                as="select" 
                                                name="select" 
                                                value={this.state.parameters[0].value}
                                                onChange={(e) => this.changeParameters(e, 0)}
                                            >
                                                <option value="CBS" >CBS</option>
                                                <option value="ARCS" >ARCS</option>
                                                <option value="ECBS" >ECBS</option>
                                                <option value="JS" >JS</option>
                                                <option value="EJS" >EJS</option>
                                                <option value="PEARSON_X2" >PEARSON_X2</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col sm={2}>
                                        <span title="The Weighting Scheme determines the function that assigns weights to the edges of the Blocking Graph." className="fa fa-info-circle fa-2x" style={{color: "#4663b9"}}/>	
                                    </Col>
                                </Form.Row>
                            </Form>
          }
            
        return (
            <div >
                <br/>
                <div style={{marginBottom:"5px"}}> 
                    <h1 style={{display:'inline', marginRight:"20px"}}>Comparison Cleaning</h1> 
                    <span className="workflow-desc">Similar to Block Cleaning, Comparison Cleaning aims to clean a set of blocks from both redundant and superfluous comparisons. Unlike Block Cleaning, its methods operate on the finer granularity of individual comparisons.</span>
                </div>

                <br/>
                <hr style={{ color: 'black', backgroundColor: 'black', height: '5' }}/>
                <br/>

                

                <Form.Group as={Row} className="form-row" > 
                    <Form.Label><h5>Select a Comparison Cleaning method (Optional)</h5>  </Form.Label>
                </Form.Group> 

                <RadioMethod methods={this.methods} state={this.state} disableAutomatic={!this.props.GTIsSet} disable_manual={this.state.method_name === "NO_CLEANING"} onChange={this.onChange} title={"Comparison Cleaning method"}/>
                <br/>
                <Collapse in={this.state.configuration_type === "Manual" && this.state.method_name !== "NO_CLEANING"} >
                    <div className="jumbotron_parameters_container">
                        <Jumbotron className="jumbotron_parameters" style={{width:"100%"}}>
                            <div style={{margin:"auto"}}>
                                {parameters_JSX_window}
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

ComparisonCleaning.propTypes = {
    state: PropTypes.object.isRequired,
    submitState: PropTypes.func.isRequired,
    GTIsSet: PropTypes.bool.isRequired  
}


export default ComparisonCleaning 
