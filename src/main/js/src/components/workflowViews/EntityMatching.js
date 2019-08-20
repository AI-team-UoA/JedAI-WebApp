import React, { Component } from 'react'
import PropTypes from 'prop-types';
import RadioMethod from './utilities/RadioMethod'
import {Form, Row, Col, FormControl, Collapse, Jumbotron } from 'react-bootstrap/'
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
            parameters: this.props.state.parameters
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

        var default_window = 
                    <div>
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
                        </Form.Row>
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
                        </Form.Row>
                    </div>
 


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
                        {default_window}
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
                                    value={this.state.parameters[2].value} 
                                />
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
                        {default_window}
                    </Form>
                break;
            default:
                parameters_JSX_window = <div />
        }


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

                <RadioMethod methods={this.methods} state={this.state} auto_disabled={false} onChange={this.onChange} title={"Entity Matching Parameters"}/>

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


            </div>
        )
    }
}

EntityMatching.propTypes = {
    state: PropTypes.object.isRequired,
    submitState: PropTypes.func.isRequired
}

export default  EntityMatching