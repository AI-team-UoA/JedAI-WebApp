import React, { Component } from 'react'
import PropTypes from 'prop-types';
import RadioMethod from './utilities/RadioMethod'
import {Form, Row } from 'react-bootstrap/'

 class SchemaClustering extends Component {
    
    constructor(...args) {
        super(...args);

        this.state = {
            method: this.props.state.method,
            conf_type: this.props.state.conf_type,
            label: this.props.state.label
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


    render() {
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

                <RadioMethod methods={this.methods} state={this.state}  auto_disabled={true} onChange={this.onChange} title={"Schema Clustering methods"}/>
                    
            </div>
        )
    }
}
SchemaClustering.propTypes = {
    state: PropTypes.object.isRequired,
    submitState: PropTypes.func.isRequired   
}

export default SchemaClustering