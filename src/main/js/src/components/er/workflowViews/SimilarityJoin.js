import React, { Component } from 'react'
import PropTypes from 'prop-types';
import {Form, Row, Col, Alert, FormControl, Jumbotron} from 'react-bootstrap/'
import axios from 'axios';
import AlertModal from './utilities/AlertModal'



class SimilarityJoin extends Component {

    constructor(...args) {
        super(...args);
        window.scrollTo(0, 0)
        this.alertText = "Select attribute"
        

        this.state = {
            method: this.props.state.method,
            attribute1: this.props.state.attribute1,
            attribute2: this.props.state.attribute2,
            headers1: this.props.state.headers1,
            headers2: this.props.state.headers2,
            alertShow : false
        }

        if (this.state.headers1.length == 0){
            axios
            .get(HttpPaths.erDataReadPath + "headers")
            .then(res => { 
                var h1 = res.data[0]
                h1.push("all")
                if (this.props.clean_er){
                    var h2 = res.data[1]
                    h2.push("all")
                    if (this.state.attribute1 != "" && this.state.attribute2 != "")
                        this.setState({headers1: h1, headers2: h2})
                    else
                        this.setState({headers1: h1, headers2: h2, attribute1: h1[0], attribute2: h2[0]})
                }
                else{
                    if (this.state.attribute1 != "")
                        this.setState({headers1: h1})
                    else
                        this.setState({headers1: h1, attribute1: h1[0]})
                }
            })
        }
    }

    methods = 
        [
            {
                name: "ALL_PAIRS_CHARACTER-BASED",
                label: "All Pairs (character-based)",
                parameters: [{label: "Threshold", value:"3"}]
            },
            {
                name: "ALL_PAIRS_TOKEN-BASED",
                label: "All Pairs (token-based)",
                parameters: [{label: "Similarity Threshold", value:"0.8"}]
            },
            {
                name: "FASTSS",
                label: "FastSS",
                parameters: [{label: "Threshold", value:"3"}]
            },
            {
                name: "PASSJOIN",
                label: "PassJoin",
                parameters: [{label: "Threshold", value:"3"}]
            },
            {
                name: "PPJOIN",
                label: "PPJoin",
                parameters: [{label: "Similarity Threshold", value:"0.8"}]
            }
        ]

    
    isValidated(){
        var send_state = {
            name: this.state.method.name,
            label: this.state.method.label,
            parameters: this.state.method.parameters,
            attribute1: this.state.attribute1,
            attribute2: this.state.attribute2
        }
       
        return axios({
            url: '/workflow/set_configurations/similarityjoin',
            method: 'POST',
            data: send_state
        }).then(res => {
            var success = res.data
            this.props.submitState("similarity_join", this.state)
            if (!success){
                this.alertText = "Error while setting the methods parameters. The values must be numeric"
                this.handleAlertShow()
            }
            return success
        })
    }
    
    
    changeMethod = (index) => {
        this.setState({method: this.methods[index]})
    }

    changeParameter = (e) => {
        var new_method_state = {
            name: this.state.method.name,
            label: this.state.method.label,
            parameters: [{label: this.state.method.parameters[0].label, value: e.target.value}]
        }
        this.setState({
            method: new_method_state
        })
    }


    //handle alert modal
    handleAlertClose = () => this.setState({alertShow : false});
    handleAlertShow = () => this.setState({alertShow : true});


    selectHeader = (e) => { this.setState({[e.target.name]: e.target.value})}


    render() {

        //the JSX code of the parameters windows
        var empty_col = 1
        var first_col = 5
        var second_col = 5
        
        var options =  this.methods.map((method, index) => (
            <Form.Check
                type="radio"
                label={method.label}
                name="method_name"
                value={method.name}
                onChange={(e) => this.changeMethod(index)}
                checked={this.state.method.name === method.name }
                key={index}
            />
        ))

        
        var header1_options = this.state.headers1.map((header, index) => (<option value={header} key={index}>{header}</option>  ))
        var header2_options = this.state.headers2.map((header, index) => (<option value={header} key={index}>{header}</option>  ))
        var parameterInfo = this.state.method.parameters[0].label == "Similarity Threshold" ? "The Similarity Threshold specifies the minimum Jaccard similarity between two attribute values, above which they are considered as matches." : "The Threshold specifies the minimum edit distance between two attribute values, below which they are considered as matches. "
        
        var parameter_view = 
                    <Form.Row className="form-row">
                        <Col sm={first_col} >
                            <Form.Label>{this.state.method.parameters[0].label}</Form.Label> 
                        </Col>
                        <Col sm={empty_col} />
                        <Col sm={second_col}>
                            <FormControl type="text" name="value" value={this.state.method.parameters[0].value} onChange={this.changeParameter}/>
                        </Col>
                        <Col sm={2}>
                                <span title={parameterInfo} className="fa fa-info-circle fa-2x" style={{color: "#4663b9"}}/>	
                            </Col>
                    </Form.Row>  

        return (
            <div>
                <AlertModal title="Wrong Input" text={this.alertText} show={this.state.alertShow} handleClose={this.handleAlertClose} />
                <div style={{marginBottom:"5px"}}> 
                    <h1 style={{display:'inline', marginRight:"20px"}}>Similarity Join</h1> 
                    <span className="workflow-desc" >This step accelerates the computation of a specific character- or token-based similarity measure in combination with a user-determined similarity threshold</span>
                </div>

                <br/>
                <hr style={{ color: 'black', backgroundColor: 'black', height: '5' }}/>
                <br/>

                <Form >
                    <Form.Group > 
                        <Row className="justify-content-md-center">       
                            <Col sm={4} style={{height: "100%", margin:'20px'}}>
                                <Alert variant="primary" style={{color:'black', margin:'auto'}}>
                                    <Form.Label><h5>Select a Similarity Join method</h5></Form.Label>
                                    {options}
                                </Alert>
                            </Col>  
                            <Col sm={4} style={{margin:'20px'}}>
                                <Alert variant="primary" style={{height: "100%", color:"black", backgroundColor:"#FFFFFF", margin:'auto', border:"groove"}}>
                                    <Form.Label><h5>Select Algorithm's Parameter</h5></Form.Label>
                                    <div style={{ margin: 'auto'}}>
                                        {parameter_view}
                                    </div>
                                </Alert>
                            </Col>
                        </Row>
                        <br />
                        <Row className="justify-content-md-center">
                            <Col sm={4} style={{margin:'20px'}}>
                                <Form.Label><h5>Select attribute of Dataset 1:</h5></Form.Label>
                            </Col>
                            <Col sm={4} style={{margin:'20px'}}>
                                <Form.Control 
                                    as="select" 
                                    placeholder="Select Attribute" 
                                    name="attribute1" 
                                    onChange={(e) => this.selectHeader(e)}
                                    value={this.state.attribute1}
                                >
                                    {header1_options}
                                </Form.Control>
                            </Col>
                        </Row>

                        <Row className="justify-content-md-center">
                            <Col sm={4} style={{margin:'20px'}}>
                                <Form.Label><h5>Select attribute of Dataset 2:</h5></Form.Label>
                            </Col>
                            <Col sm={4} style={{margin:'20px'}}>
                                <Form.Control 
                                    as="select" 
                                    placeholder="Select Attribute" 
                                    name="attribute2" 
                                    onChange={(e) => this.selectHeader(e)}
                                    value={this.state.attribute2}
                                    disabled={!this.props.clean_er}
                                >
                                    {header2_options}
                                </Form.Control>
                            </Col>
                        </Row>
                        
                    </Form.Group>
                </Form>
            </div>
        )
    }
}

SimilarityJoin.propTypes = {
    state: PropTypes.object.isRequired,
    clean_er: PropTypes.bool.isRequired,
    submitState: PropTypes.func.isRequired
}

export default SimilarityJoin