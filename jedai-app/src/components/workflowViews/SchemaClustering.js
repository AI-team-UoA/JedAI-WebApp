import React, { Component } from 'react'
import PropTypes from 'prop-types';
import RadioMethod from './utilities/RadioMethod'
import update from 'immutability-helper'
import {Form, Row, Jumbotron, Collapse, Col } from 'react-bootstrap/'

 class SchemaClustering extends Component {
    
    constructor(...args) {
        super(...args);

        this.state = {
            method: this.props.state.method,
            conf_type: this.props.state.conf_type,
            label: this.props.state.label,
            parameters: this.props.state.parameters
        }
    }

    methods = 
        [
            {
                value: "NO_SCHEMA_CLUSTERING",
                label: "No Schema Clustering"
            },
            {
                value: "ATTRIBUTE_NAME_CLUSTERING",
                label: "Attribute Name Clustering"
            },
            {
                value: "ATTRIBUTE_VALUE_CLUSTERING",
                label: "Attribute Value Clustering"
            },
            {
                value: "HOLISTIC_ATTRIBUTE_CLUSTERING",
                label: "Holistic Attribute Clustering"
            }
        ]

    onChange = (e) => {
        this.setState(
            {
                method: e.method,
                conf_type: e.conf_type,
                label: e.label
            }
        )
    } 

    isValidated(){
        this.props.submitState("schema_clustering", this.state)
        return this.state.method !== "" && this.state.conf_type !== ""
    }

    // set the new parameters...triggered by select bars
    changeParameters = (e, parameter_index) => {
        var  value = e.target.value        
        var updated_state = update(this.state.parameters[parameter_index], {value: {$set: value}}); 
        var newData = update(this.state.parameters, {
                $splice: [[parameter_index, 1, updated_state]]
        });
        
        this.setState({parameters: newData})

    }


    render() {
        var empty_col = 1
        var first_col = 5
        var second_col = 5

        return (
            <div>
                <br/>
                <div style={{marginBottom:"5px"}}> 
                    <h1 style={{display:'inline', marginRight:"20px"}}>Schema Clustering</h1> 
                    <span className="workflow-desc">Schema Clustering groups together syntactically (not semantically) similar attributes. This can improve the performance of all workflow steps.</span>
                </div>

                <br/>
                <hr style={{ color: 'black', backgroundColor: 'black', height: '5' }}/>
                <br/>

                <Form.Group as={Row} className="form-row" > 
                    <Form.Label><h5>Select a Schema Clustering method</h5></Form.Label>
                </Form.Group> 

                <RadioMethod methods={this.methods} state={this.state}  auto_disabled={true} disable_manual={this.state.method === "NO_SCHEMA_CLUSTERING"} onChange={this.onChange} title={"Schema Clustering methods"}/>
                
                <br/>
                <Collapse in={this.state.conf_type === "Manual" && this.state.method !== "NO_SCHEMA_CLUSTERING"} >
                    <div className="jumbotron_parameters_container">
                        <Jumbotron className="jumbotron_parameters">
                            <div style={{margin:"auto"}}>
                                <div style ={{textAlign:'center'}}>
                                    <h3>{this.state.label}</h3>
                                    <p>Please configure the method's parameters below</p>
                                </div>
                                <br/>
                                <Form.Row>
                                    <Col sm={empty_col} />
                                    <Col sm={first_col}>
                                        <Form.Label ><h5>Representation Model</h5></Form.Label> 
                                    </Col>
                                    <Col sm={second_col}>
                                        <Form.Group>
                                            <Form.Control 
                                                as="select" 
                                                name="representation_model" 
                                                value={this.state.parameters[0].value}
                                                onChange={e => this.changeParameters(e, 0)}
                                            >
                                                <option value="CHARACTER_BIGRAMS" >CHARACTER_BIGRAMS</option>
                                                <option value="CHARACTER_BIGRAMS_TF_IDF" >CHARACTER_BIGRAMS</option>
                                                <option value="CHARACTER_BIGRAMS_GRAPHS" >CHARACTER_BIGRAMS</option>

                                                <option value="CHARACTER_TRIGRAMS" >CHARACTER_TRIGRAMS</option>
                                                <option value="CHARACTER_TRIGRAMS_TF_IDF" >CHARACTER_TRIGRAMS_TF_IDF</option>
                                                <option value="CHARACTER_TRIGRAMS_GRAPHS" >CHARACTER_TRIGRAMS_GRAPHS</option>

                                                <option value="CHARACTER_FOURGRAMS" >CHARACTER_FOURGRAMS</option>
                                                <option value="CHARACTER_FOURGRAMS_TF_IDF" >CHARACTER_FOURGRAMS_TF_IDF</option>
                                                <option value="CHARACTER_FOURGRAMS_GRAPHS" >CHARACTER_FOURGRAMS_GRAPHS</option>

                                                <option value="TOKEN_UNIGRAM" >TOKEN_UNIGRAM</option>
                                                <option value="TOKEN_UNIGRAM_TF_IDF" >TOKEN_UNIGRAM_TF_IDF</option>
                                                <option value="TOKEN_UNIGRAM_GRAPHS" >TOKEN_UNIGRAM_GRAPHS</option>

                                                <option value="TOKEN_BIGRAMS" >TOKEN_BIGRAMS</option>
                                                <option value="TOKEN_BIGRAMS_TF_IDF" >TOKEN_BIGRAMS_TF_IDF</option>
                                                <option value="TOKEN_BIGRAMS_GRAPHS" >TOKEN_BIGRAMS_GRAPHS</option>

                                                <option value="TOKEN_TRIGRAMS" >TOKEN_TRIGRAMS</option>
                                                <option value="TOKEN_TRIGRAMS_TF_IDF" >TOKEN_TRIGRAMS_TF_IDF</option>
                                                <option value="TOKEN_TRIGRAMS_GRAPHS" >TOKEN_TRIGRAMS_GRAPHS</option>

                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                </Form.Row>
                                <Form.Row>
                                    <Col sm={empty_col} />
                                    <Col sm={first_col}>
                                        <Form.Label ><h5>Similarity Measure</h5></Form.Label> 
                                    </Col>
                                    <Col sm={second_col}>
                                        <Form.Group>
                                            <Form.Control 
                                                as="select"
                                                name="similarity_measure" 
                                                value={this.state.parameters[1].value}
                                                onChange={e => this.changeParameters(e, 1)}
                                            >
                                                <option value="GRAPH_CONTAINMENT_SIMILARITY" >GRAPH_CONTAINMENT_SIMILARITY</option>
                                                <option value="GRAPH_NORMALIZED_VALUE_SIMILARITY" >GRAPH_NORMALIZED_VALUE_SIMILARITY</option>
                                                <option value="GRAPH_OVERALL_SIMILARITY" >GRAPH_OVERALL_SIMILARITY</option>
                                                <option value="GRAPH_VALUE_SIMILARITY" >GRAPH_VALUE_SIMILARITY</option>
                                               
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                </Form.Row>
                            </div>  
                        </Jumbotron>
                    </div>
                </Collapse>
            </div>
        )
    }
}
SchemaClustering.propTypes = {
    state: PropTypes.object.isRequired,
    submitState: PropTypes.func.isRequired   
}

export default SchemaClustering