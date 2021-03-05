import React, { Component } from 'react'
import PropTypes from 'prop-types';
import RadioMethod from './utilities/RadioMethod'
import {Form, Row, Col, FormControl, Collapse, Jumbotron, Spinner} from 'react-bootstrap/'
import update from 'immutability-helper'
import axios from 'axios';

class EntityMatching extends Component {

    constructor(...args) {
        super(...args);
        window.scrollTo(0, 0)

        this.default_parameters = [
            {
                parameters: [
                    {
                        label: "Representation Model",
                        value: "TOKEN_UNIGRAM_GRAPHS"
                    },
                    {
                        label: "Similarity Measure",
                        value: "GRAPH_VALUE_SIMILARITY"
                    },
                    {
                        label: "Similarity Threshold",
                        value: "0.5"
                    }
                ]
            },
            {
                parameters: [
                    {
                        label: "Representation Model",
                        value: "TOKEN_UNIGRAM_GRAPHS"
                    },
                    {
                        label: "Similarity Measure",
                        value: "GRAPH_VALUE_SIMILARITY"
                    }
                ]
            }
        ]

        

        this.state = {
            method_name: this.props.state.method_name,
            configuration_type: this.props.state.configuration_type,
            label: this.props.state.label,
            parameters: this.props.state.parameters,
            showSpinner: false
        }
    }

    methods = 
    [
        {
            value: "GROUP_LINKAGE",
            label: "Group Linkage"
        },
        {
            value: "PROFILE_MATCHER",
            label: "Profile Matcher"
        }
    ]

    onChange = (e) => {
        // set parameters to default values
        var parameters 
        if (e.method_name === "GROUP_LINKAGE")
            parameters = this.default_parameters[0].parameters
        else 
            parameters = this.default_parameters[1].parameters
        this.setState(
            {
                method_name: e.method_name,
                configuration_type: e.configuration_type,
                label: e.label,
                parameters: parameters,
                showSpinner: false
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
            var newData = update(this.state.parameters, {$splice: [[parameter_index, 1, updated_state]]});
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
    }

    isValidated(){

        this.setState({showSpinner: true})

        return axios({
            url: '/workflow/set_configurations/entitymatching',
            method: 'POST',
            data: this.state
        }).then(res => {
            var success = res.data
            this.props.submitState("entity_matching", this.state)
            return this.state.method_name !== "" && this.state.configuration_type !== "" && success
        })
    }


    render() {


        var empty_col = 1
        var first_col = 4
        var second_col = 5

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
                    <span title="The Representation Model aggregates the textual values that correspond to every entity." className="fa fa-info-circle fa-2x" style={{color: "#4663b9"}}/>	
                </Col>
            </Form.Row>

        // set the options of the similarity measures according the 
        // selected representation model
        var similarityMeasure_window
        switch(this.state.parameters[0].value){
            case "CHARACTER_BIGRAMS":
            case "CHARACTER_TRIGRAMS":
            case "CHARACTER_FOURGRAMS":
            case "TOKEN_UNIGRAMS":
            case "TOKEN_BIGRAMS":
            case "TOKEN_TRIGRAMS":
                    similarityMeasure_window = 
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
                            <span title="The Similarity Measure compares the models of two entities, returning a value between 0 (completely dissimlar) and 1 (identical)." className="fa fa-info-circle fa-2x" style={{color: "#4663b9"}}/>	
                        </Col>
                    </Form.Row>
                    break;
            case "CHARACTER_BIGRAM_GRAPHS":
            case "CHARACTER_TRIGRAM_GRAPHS":
            case "CHARACTER_FOURGRAM_GRAPHS":
            case "TOKEN_UNIGRAM_GRAPHS":
            case "TOKEN_BIGRAM_GRAPHS":
            case "TOKEN_TRIGRAM_GRAPHS":
                    similarityMeasure_window = 
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
                            <span title="The Similarity Measure compares the models of two entities, returning a value between 0 (completely dissimlar) and 1 (identical)." className="fa fa-info-circle fa-2x" style={{color: "#4663b9"}}/>	
                        </Col>
                    </Form.Row>
                    break;
            case "CHARACTER_BIGRAMS_TF_IDF":
            case "CHARACTER_TRIGRAMS_TF_IDF":
            case "CHARACTER_FOURGRAMS_TF_IDF":
            case "TOKEN_UNIGRAMS_TF_IDF":
            case "TOKEN_BIGRAMS_TF_IDF":
            case "TOKEN_TRIGRAMS_TF_IDF":
                    similarityMeasure_window = 
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
                            <span title="The Similarity Measure compares the models of two entities, returning a value between 0 (completely dissimlar) and 1 (identical)." className="fa fa-info-circle fa-2x" style={{color: "#4663b9"}}/>	
                        </Col>
                    </Form.Row>
                    break;
        }

        var parameters_JSX_window 

        switch(this.state.method_name) {
            case "GROUP_LINKAGE":
                parameters_JSX_window = 
                    <Form>
                        <div style ={{textAlign:'center'}}>
                            <h3>{this.state.label}</h3>
                            <p>Please configure the method's parameters below</p>
                        </div>
                        <br />
                        <div>
                            {representationModel_window}
                            {similarityMeasure_window}
                        </div>
                        <Form.Row className="form-row">
                            <Col sm={empty_col} />
                            <Col sm={first_col} >
                                <Form.Label>Similarity Threshold</Form.Label> 
                            </Col>
                            <Col sm={second_col}>
                                <FormControl 
                                    type="text" 
                                    name="value" 
                                    onChange={(e) => this.changeParameters(e, 2)}
                                />
                            </Col>
                            <Col sm={2}>
                                <span title="The Similarity Threshold determines the similarity value over which two compared attribute values are connected with an edge in the bipartite graph." className="fa fa-info-circle fa-2x" style={{color: "#4663b9"}}/>	
                            </Col>
                        </Form.Row>
                    </Form>

                break;
            case "PROFILE_MATCHER":
                parameters_JSX_window = 
                    <Form>
                        <div style ={{textAlign:'center'}}>
                            <h3>{this.state.label}</h3>
                            <p>Please configure the method's parameters below</p>
                        </div>
                        <br />
                        <div>
                            {representationModel_window}
                            {similarityMeasure_window}
                        </div>
                    </Form>
                break;
            default:
                parameters_JSX_window = <div />
        }

        var spinner = <div/>
        if (this.state.showSpinner)
            spinner= 
                <div>
                    <br/>
                    <br/>
                    <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
                        <Spinner style={{color:"#0073e6"}} animation="grow" />
                        <div style={{marginLeft:"10px", display:"inline"}}>
                            <h3 style={{marginRight:'20px', color:"#0073e6", display:'inline'}}>
                                Creating Representation Model
                            </h3>
                        </div>
                    </div>
                </div>



        return (
            <div>
                <br/>
                <div style={{marginBottom:"5px"}}> 
                    <h1 style={{display:'inline', marginRight:"20px"}}>Entity Matching</h1> 
                    <span className="workflow-desc">Entity Matching compares pairs of entity profiles, associating every pair with a similarity in [0,1]. Its output comprises the similarity graph, i.e., an undirected, weighted graph where the nodes correspond to entities and the edges connect pairs of compared entities.</span>
                </div>

                <br/>
                <hr style={{ color: 'black', backgroundColor: 'black', height: '5' }}/>
                <br/>

                <Form.Group as={Row} className="form-row" > 
                    <Form.Label><h5>Select parameters for Entity Matching</h5></Form.Label>
                </Form.Group> 

                <RadioMethod methods={this.methods} state={this.state} disableAutomatic={!this.props.GTIsSet} onChange={this.onChange} title={"Entity Matching Parameters"}/>

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
               
               {spinner}
               <br/>
               <br/>
               </div>
        )
    }
}

EntityMatching.propTypes = {
    state: PropTypes.object.isRequired,
    submitState: PropTypes.func.isRequired,
    GTIsSet: PropTypes.bool.isRequired  
}

export default  EntityMatching