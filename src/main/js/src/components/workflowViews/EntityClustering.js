import React, { Component } from 'react'
import PropTypes from 'prop-types';
import RadioMethod from './utilities/RadioMethod'
import {Form, Row, Col, FormControl, Jumbotron, Collapse } from 'react-bootstrap/'
import update from 'immutability-helper'
import axios from 'axios';

class EntityClustering extends Component {

    constructor(...args) {
        super(...args);
        window.scrollTo(0, 0)

        this.default_parameters = [
            {
                parameters: [
                    {
                        label: "Similarity Threshold",
                        value: "0.5"
                    }
                ]
            },
            {
                parameters: [
                    {
                        label: "Similarity Threshold",
                        value: "0.5"
                    },
                    {
                        label: "A-cap",
                        value: "0.3"
                    }
                ]
            },
            {
                parameters: [
                    {
                        label: "Similarity Threshold",
                        value: "0.5"
                    },
                    {
                        label: "Cluster Threshold",
                        value: "0.001"
                    },
                    {
                        label: "Matrix Similarity Threshold",
                        value: "0.00001"
                    },
                    {
                        label: "Similarity Check Limit",
                        value: "2"
                    }
                ]
            }
        ]

        this.state = {
            method_name: this.props.state.method_name,
            configuration_type: this.props.state.configuration_type,
            label: this.props.state.label,
            parameters: this.props.state.parameters
        }
    }

    dirtyER_methods = 
    [
        {
            value: "CENTER_CLUSTERING",
            label: "Center Clustering"
        },
        {
            value: "CONNECTED_COMPONENTS_CLUSTERING",
            label: "Connected Components Clustering"
        },
        {
            value: "CUT_CLUSTERING",
            label: "Cut Clustering"
        },
        {
            value: "MARKOV_CLUSTERING",
            label: "Markov Clustering"
        },
        {
            value: "MERGE_CENTER_CLUSTERING",
            label: "Merge-Center Clustering"
        },
        {
            value: "RICOCHET_SR_CLUSTERING",
            label: "Ricochet SR Clustering"
        },
        {
            value: "CORRELATION_CLUSTERING",
            label: "Correlation Clustering"
        }
    ]

    cleanER_methods = 
    [
        {
            value: "UNIQUE_MAPPING_CLUSTERING",
            label: "Unique Mapping Clustering"
        },
        {
            value: "MERGE_CENTER_CLUSTERING",
            label: "Merge-Center Clustering"
        },
        {
            value: "ROW_COLUMN_CLUSTERING",
            label: "Row Column Clustering"
        }
    ]

    onChange = (e) => {
        var parameters 
        // set parameters to default values
        switch(e.method_name) {
            case "CUT_CLUSTERING":
                parameters = this.default_parameters[1].parameters
                break;
            case "MARKOV_CLUSTERING":
                parameters = this.default_parameters[2].parameters
                break;
            default:
                parameters = this.default_parameters[0].parameters
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

    //set the value of the parameters
    changeParameters = (e, parameter_index) =>{
        var value = e.target.value
        if(!isNaN(value) && value !== "" ){
            var updated_state = update(this.state.parameters[parameter_index], {value: {$set: value}}); 
            var newData = update(this.state.parameters, {
                    $splice: [[parameter_index, 1, updated_state]]
            });
            
            this.setState({parameters: newData})
        }
    }

    isValidated(){

        axios({
            url: '/workflow/set_configurations/entityclustering',
            method: 'POST',
            data: this.state
        }).then(res => {
            var success = res.data
            this.props.submitState("entity_clustering", this.state)
            return this.state.method_name !== "" && this.state.configuration_type !== "" && success
        })       
    }


    render() {

        //the JSX code of the parameters windows
        var empty_col = 2
        var first_col = 4
        var second_col = 3

       var parameters_JSX_window
       switch(this.state.method_name) {
           case "CUT_CLUSTERING":
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
                                       <Form.Label>Similarity Threshold</Form.Label> 
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
                                        <span title="The Similarity Threshold determines the cut-off similarity threshold for connecting two entities with an edge in the (initial) similarity graph." className="fa fa-info-circle fa-2x" style={{color: "#4663b9"}}/>	
                                    </Col>
                               </Form.Row>
                               <Form.Row className="form-row">
                                   <Col sm={empty_col} />
                                   <Col sm={first_col} >
                                       <Form.Label>A-cap</Form.Label> 
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
                                        <span title="The A-cap determines the weight of the capacity edges, which connect every vertex with the artificial sink." className="fa fa-info-circle fa-2x" style={{color: "#4663b9"}}/>	
                                    </Col>
                               </Form.Row>
                           </Form>
                           
               break;
             case "MARKOV_CLUSTERING":
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
                                        <Form.Label>Similarity Threshold</Form.Label> 
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
                                        <span title="The Similarity Threshold determines the cut-off similarity threshold for connecting two entities with an edge in the (initial) similarity graph." className="fa fa-info-circle fa-2x" style={{color: "#4663b9"}}/>	
                                    </Col>
                                </Form.Row>
                                <Form.Row className="form-row">
                                    <Col sm={empty_col} />
                                    <Col sm={first_col} >
                                        <Form.Label>Cluster Threshold</Form.Label> 
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
                                        <span title="The Cluster Threshold determines the similarity threshold for including an edge in the similarity graph." className="fa fa-info-circle fa-2x" style={{color: "#4663b9"}}/>	
                                    </Col>
                                </Form.Row>
                                <Form.Row className="form-row">
                                    <Col sm={empty_col} />
                                    <Col sm={first_col} >
                                        <Form.Label>Matrix Similarity Threshold</Form.Label> 
                                    </Col>
                                    <Col sm={second_col}>
                                        <FormControl 
                                            type="text" 
                                            name="value" 
                                            onChange={(e) => this.changeParameters(e, 2)}
                                            value={this.state.parameters[2].value} 
                                        />
                                    </Col>
                                    <Col sm={2}>
                                        <span title="The >Matrix Similarity Threshold determines the similarity threshold for compariing all cells of two matrices and considering them similar." className="fa fa-info-circle fa-2x" style={{color: "#4663b9"}}/>	
                                    </Col>
                                </Form.Row>
                                <Form.Row className="form-row">
                                    <Col sm={empty_col} />
                                    <Col sm={first_col} >
                                        <Form.Label>Similarity Check Limit</Form.Label> 
                                    </Col>
                                    <Col sm={second_col}>
                                        <FormControl 
                                            type="text" 
                                            name="value" 
                                            onChange={(e) => this.changeParameters(e, 3)}
                                            value={this.state.parameters[3].value} 
                                        />
                                    </Col>
                                    <Col sm={2}>
                                        <span title="The Similarity Check Limit determines the maximum number of repetitions we apply the expansion-inflation process" className="fa fa-info-circle fa-2x" style={{color: "#4663b9"}}/>	
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
                                <br />
                                <Form.Row className="form-row">
                                    <Col sm={empty_col} />
                                    <Col sm={first_col} >
                                        <Form.Label>Similarity Threshold</Form.Label> 
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
                                        <span title="The Similarity Threshold determines the cut-off similarity threshold for connecting two entities with an edge in the (initial) similarity graph." className="fa fa-info-circle fa-2x" style={{color: "#4663b9"}}/>	
                                    </Col>
                                </Form.Row>
                            </Form>
         }
        
        var er_mode = this.props.er_mode
        var configurations 
        if (er_mode === "dirty"){
            configurations = <RadioMethod methods={this.dirtyER_methods} state={this.state}   disableAutomatic={!this.props.GTIsSet} onChange={this.onChange} title={"Algorithms for Dirty ER"}/>
        }
        else if (er_mode === "clean"){
            configurations = <RadioMethod methods={this.cleanER_methods} state={this.state}  disableAutomatic={!this.props.GTIsSet} onChange={this.onChange} title={"Algorithms for Clean-Clean ER"}/>
        }
        else configurations = <h2>ERROR</h2>
        return (
            <div>
                <br/>
                <div style={{marginBottom:"5px"}}> 
                    <h1 style={{display:'inline', marginRight:"20px"}}>Entity Clustering</h1> 
                    <span className="workflow-desc">Entity Clustering takes as input the similarity graph produced by Entity Matching and partitions it into a set of equivalence clusters, with every cluster corresponding to a distinct real-world object.</span>
                </div>

                <br/>
                <hr style={{ color: 'black', backgroundColor: 'black', height: '5' }}/>
                <br/>

                <Form.Group as={Row} className="form-row" > 
                    <Form.Label><h5>Select an algorithm for Clustering entities</h5></Form.Label>
                </Form.Group> 

                {configurations}

                <br/>
                <Collapse in={this.state.configuration_type === "Manual"} >
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

EntityClustering.propTypes = {
    submitState: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
    er_mode: PropTypes.string.isRequired,
    GTIsSet: PropTypes.bool.isRequired  
}

export default  EntityClustering