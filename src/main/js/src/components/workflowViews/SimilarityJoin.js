import React, { Component } from 'react'
import PropTypes from 'prop-types';
import {Form, Row, Col, Alert} from 'react-bootstrap/'
import axios from 'axios';


class SimilarityJoin extends Component {

    constructor(...args) {
        super(...args);
        window.scrollTo(0, 0)

        this.state = {
            method_name: this.props.state.value,
            label: this.props.state.label,
            attribute: null,
            headers: null
        }

        axios
        .get("/desktopmode/dataread/headers")
        .then(res => { 
            this.setState({headers: res.data, attribute: res.data[0]})
        })
    }

    methods = 
        [
            {
                value: "ALL_PAIRS_CHARACTER-BASED",
                label: "All Pairs (character-based)"
            },
            {
                value: "ALL_PAIRS_TOKEN-BASED",
                label: "All Pairs (token-based)"
            },
            {
                value: "FASTSS",
                label: "FastSS"
            },
            {
                value: "PASSJOIN",
                label: "PassJoin"
            },
            {
                value: "PPJOIN",
                label: "PPJoin"
            }
        ]
    
    changeMethod = (label, value) => {
        this.setState(
            {
                method_name: value,
                label: label
            }
        )
    }

    selectHeader = (e) => { this.setState({attribute: e.target.value})}


    render() {
        var options =  this.methods.map((method, index) => (
            <Form.Check
                type="radio"
                label={method.label}
                name="method_name"
                value={method.value}
                onChange={(e) => this.changeMethod(method.label, method.value)}
                checked={this.state.method_name === method.value }
                key={index}
            />
        ))

        var header_options = null
        if (this.state.headers) 
            header_options = this.state.headers.map((header, index) => (<option value={header} key={index}>{header}</option>  ))
        

        return (
            <div>

                <div style={{marginBottom:"5px"}}> 
                    <h1 style={{display:'inline', marginRight:"20px"}}>Similarity Join</h1> 
                    <span className="workflow-desc" >This step accelerates the computation of a specific character- or token-based similarity measure in combination with a user-determined similarity threshold</span>
                </div>

                <br/>
                <hr style={{ color: 'black', backgroundColor: 'black', height: '5' }}/>
                <br/>

                <Form>
                    <Form.Group as={Row} className="form-row">           
                        <Col style={{margin:'20px'}}>
                            <Form.Label><h5>Select a Similarity Join method</h5></Form.Label>
                            <Alert  variant="primary" style={{color:'black', margin:'auto'}}>
                                <Form.Label as="legend"><h5>{this.props.title}</h5> </Form.Label>
                                {options}
                            </Alert>
                        </Col>
                        <Col style={{margin:'20px'}}>
                            <Form.Label><h5>Select attribute to apply Similarity Join</h5></Form.Label>
                            <Form.Control 
                                as="select" 
                                placeholder="Select Attribute" 
                                name="attribute" 
                                onChange={(e) => this.selectHeader(e)}
                                value={this.state.attribute}
                            >
                                {header_options}
                            </Form.Control>
                        </Col>
                        
                    </Form.Group>
                </Form>
            </div>
        )
    }
}

SimilarityJoin.propTypes = {
    state: PropTypes.object.isRequired
}

export default SimilarityJoin