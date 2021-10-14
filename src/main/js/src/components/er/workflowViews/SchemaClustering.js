import React, { Component } from 'react'
import PropTypes from 'prop-types';
import RadioMethod from './utilities/RadioMethod'
import update from 'immutability-helper'
import {Form, Row, Jumbotron, Collapse, Col } from 'react-bootstrap/'
import axios from 'axios';

 class SchemaClustering extends Component {
    
    
    constructor(...args) {
        super(...args);
        window.scrollTo(0, 0)

        this.state = {
            method_name: this.props.state.method_name,
            configuration_type: this.props.state.configuration_type,
            label: this.props.state.label,
            parameters: this.props.state.parameters,
            parametersInfo: null
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
                method_name: e.method_name,
                configuration_type: e.configuration_type,
                label: e.label
            }
        )
    } 

    isValidated(){
        var schema_clustering = this.state
        
        axios({
            url: '/workflow/set_configurations/schemaclustering',
            method: 'POST',
            data: schema_clustering
        }).then(res => {
            var success = res.data
            this.props.submitState("schema_clustering", this.state)
            return this.state.method_name !== "" && this.state.configuration_type !== "" && success
        })
    }

    // set the new parameters...triggered by select bars
    changeParameters = (e, parameter_index) => {
        var  value = e.target.value        
        var updated_state = update(this.state.parameters[parameter_index], {value: {$set: value}}); 
        var newData = update(this.state.parameters, {
                $splice: [[parameter_index, 1, updated_state]]
        });
        
        this.setState({parameters: newData}, () => {
            //if user changed the representation model, the set the appropriate values in similarity measure
            var updated_state_2
            var newData_2
            if (parameter_index === 0){
                if (value.endsWith("_TF_IDF")){
                    updated_state_2 = update(this.state.parameters[1], {value: {$set: "COSINE_SIMILARITY"}}); 
                    newData_2 = update(this.state.parameters, {$splice: [[1, 1, updated_state_2]]});
                }
                else if (value.endsWith("_GRAPHS")){
                    updated_state_2 = update(this.state.parameters[1], {value: {$set: "GRAPH_VALUE_SIMILARITY"}}); 
                    newData_2 = update(this.state.parameters, {$splice: [[1, 1, updated_state_2]]});
                }
                else{
                    updated_state_2 = update(this.state.parameters[1], {value: {$set: "JACCARD_SIMILARITY"}}); 
                    newData_2 = update(this.state.parameters, {$splice: [[1, 1, updated_state_2]]});
                }
                this.setState({parameters: newData_2})
            }
        })

    }

    
    render() {
        var empty_col = 1
        var first_col = 4
        var second_col = 5

        var collapse = this.state.configuration_type === "Manual" && this.state.method !== "NO_SCHEMA_CLUSTERING"

        var representationModel_window = 
            <Form.Row>
                <Col sm={empty_col} />
                <Col sm={first_col}>
                    <Form.Label >Representation Model</Form.Label> 
                </Col>
                <Col sm={second_col}>
                    <Form.Group>
                        <Form.Control 
                            as="select" 
                            name="select" 
                            value={this.state.parameters[0].value}
                            onChange={e => this.changeParameters(e, 0)}
                        >
                            <option value="CHARACTER_BIGRAMS" >CHARACTER_BIGRAMS</option>
                            <option value="CHARACTER_BIGRAMS_TF_IDF" >CHARACTER_BIGRAMS_TF_IDF</option>
                            <option value="CHARACTER_BIGRAM_GRAPHS" >CHARACTER_BIGRAM_GRAPHS</option>

                            <option value="CHARACTER_TRIGRAMS" >CHARACTER_TRIGRAMS</option>
                            <option value="CHARACTER_TRIGRAMS_TF_IDF" >CHARACTER_TRIGRAMS_TF_IDF</option>
                            <option value="CHARACTER_TRIGRAM_GRAPHS" >CHARACTER_TRIGRAM_GRAPHS</option>

                            <option value="CHARACTER_FOURGRAMS" >CHARACTER_FOURGRAMS</option>
                            <option value="CHARACTER_FOURGRAMS_TF_IDF" >CHARACTER_FOURGRAMS_TF_IDF</option>
                            <option value="CHARACTER_FOURGRAM_GRAPHS" >CHARACTER_FOURGRAM_GRAPHS</option>

                            <option value="TOKEN_UNIGRAMS" >TOKEN_UNIGRAMS</option>
                            <option value="TOKEN_UNIGRAMS_TF_IDF" >TOKEN_UNIGRAMS_TF_IDF</option>
                            <option value="TOKEN_UNIGRAM_GRAPHS" >TOKEN_UNIGRAM_GRAPHS</option>

                            <option value="TOKEN_BIGRAMS" >TOKEN_BIGRAMS</option>
                            <option value="TOKEN_BIGRAMS_TF_IDF" >TOKEN_BIGRAMS_TF_IDF</option>
                            <option value="TOKEN_BIGRAM_GRAPHS" >TOKEN_BIGRAM_GRAPHS</option>

                            <option value="TOKEN_TRIGRAMS" >TOKEN_TRIGRAMS</option>
                            <option value="TOKEN_TRIGRAMS_TF_IDF" >TOKEN_TRIGRAMS_TF_IDF</option>
                            <option value="TOKEN_TRIGRAM_GRAPHS" >TOKEN_TRIGRAM_GRAPHS</option>

                        </Form.Control>
                    </Form.Group>
                </Col>
                <Col sm={2}>
                    <span title="The Representation Model aggregates the textual items that correspond to every attribute." className="fa fa-info-circle fa-2x" style={{color: "#4663b9"}}/>	
                </Col>
            </Form.Row>


        // set the options of the similarity measures according the 
        // selected representation model
        var similaritymeasure_window
        switch(this.state.parameters[0].value){
            case "CHARACTER_BIGRAMS":
            case "CHARACTER_TRIGRAMS":
            case "CHARACTER_FOURGRAMS":
            case "TOKEN_UNIGRAMS":
            case "TOKEN_BIGRAMS":
            case "TOKEN_TRIGRAMS":
                    similaritymeasure_window = 
                    <Form.Row>
                        <Col sm={empty_col} />
                        <Col sm={first_col}>
                            <Form.Label>Similarity Measure</Form.Label> 
                        </Col>
                        <Col sm={second_col}>
                            <Form.Group>
                                <Form.Control 
                                    as="select"
                                    name="select" 
                                    value={this.state.parameters[1].value}
                                    onChange={e => this.changeParameters(e, 1)}
                                >
                                    <option value="COSINE_SIMILARITY" >COSINE_SIMILARITY</option>
                                    <option value="ENHANCED_JACCARD_SIMILARITY" >ENHANCED_JACCARD_SIMILARITY</option>
                                    <option value="GENERALIZED_JACCARD_SIMILARITY" >GENERALIZED_JACCARD_SIMILARITY</option>
                                    <option value="JACCARD_SIMILARITY" >JACCARD_SIMILARITY</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col sm={2}>
                            <span title="The Similarity Measure compares the models of two attributes, returning a value between 0 (completely dissimlar) and 1 (identical)." className="fa fa-info-circle fa-2x" style={{color: "#4663b9"}}/>	
                        </Col>
                    </Form.Row>
                    break;
            case "CHARACTER_BIGRAM_GRAPHS":
            case "CHARACTER_TRIGRAM_GRAPHS":
            case "CHARACTER_FOURGRAM_GRAPHS":
            case "TOKEN_UNIGRAM_GRAPHS":
            case "TOKEN_BIGRAM_GRAPHS":
            case "TOKEN_TRIGRAM_GRAPHS":
                    similaritymeasure_window = 
                    <Form.Row>
                        <Col sm={empty_col} />
                        <Col sm={first_col}>
                            <Form.Label>Similarity Measure</Form.Label> 
                        </Col>
                        <Col sm={second_col}>
                            <Form.Group>
                                <Form.Control 
                                    as="select"
                                    name="select" 
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
                        <Col sm={2}>
                            <span title="The Similarity Measure compares the models of two attributes, returning a value between 0 (completely dissimlar) and 1 (identical)." className="fa fa-info-circle fa-2x" style={{color: "#4663b9"}}/>	
                        </Col>
                    </Form.Row>
                    break;
            case "CHARACTER_BIGRAMS_TF_IDF":
            case "CHARACTER_TRIGRAMS_TF_IDF":
            case "CHARACTER_FOURGRAMS_TF_IDF":
            case "TOKEN_UNIGRAMS_TF_IDF":
            case "TOKEN_BIGRAMS_TF_IDF":
            case "TOKEN_TRIGRAMS_TF_IDF":
                    similaritymeasure_window = 
                    <Form.Row>
                        <Col sm={empty_col} />
                        <Col sm={first_col}>
                            <Form.Label>Similarity Measure</Form.Label> 
                        </Col>
                        <Col sm={second_col}>
                            <Form.Group>
                                <Form.Control 
                                    as="select"
                                    name="select" 
                                    value={this.state.parameters[1].value}
                                    onChange={e => this.changeParameters(e, 1)}
                                >
                                    <option value="ARCS_SIMILARITY" >ARCS_SIMILARITY</option>
                                    <option value="COSINE_SIMILARITY" >COSINE_SIMILARITY</option>
                                    <option value="GENERALIZED_JACCARD_SIMILARITY" >GENERALIZED_JACCARD_SIMILARITY</option>
                                    <option value="SIGMA_SIMILARITY" >SIGMA_SIMILARITY</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col sm={2}>
                            <span title="The Similarity Measure compares the models of two attributes, returning a value between 0 (completely dissimlar) and 1 (identical)." className="fa fa-info-circle fa-2x" style={{color: "#4663b9"}}/>	
                        </Col>
                    </Form.Row>
                    break;
        }

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

                <RadioMethod methods={this.methods} state={this.state}  disableAutomatic={!this.props.GTIsSet} disable_manual={this.state.method_name === "NO_SCHEMA_CLUSTERING"} onChange={this.onChange} title={"Schema Clustering methods"}/>
                
                <br/>
                <Collapse in={collapse} >
                    <div className="jumbotron_parameters_container">
                        <Jumbotron className="jumbotron_parameters" style={{width:"100%"}}>
                            <div style={{margin:"auto"}}>
                                <div style ={{textAlign:'center'}}>
                                    <h3>{this.state.label}</h3>
                                    <p>Please configure the method's parameters below</p>
                                </div>
                                <br/>
                                <div>
                                    {representationModel_window}
                                    {similaritymeasure_window}
                                </div>
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
SchemaClustering.propTypes = {
    state: PropTypes.object.isRequired,
    submitState: PropTypes.func.isRequired,
    GTIsSet: PropTypes.bool.isRequired  
}

export default SchemaClustering