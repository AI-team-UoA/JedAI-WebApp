import React, { Component } from 'react'
import SelectMethod from './utilities/SelectMethod'
import {Form, Row } from 'react-bootstrap/'

 class SchemaClustering extends Component {
     

    state = {
        method: "NO_SCHEMA_CLUSTERING",
        conf_type: "default"
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
                conf_type: e.conf_type
            }
        )
    } 

    isValidated(){
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

                <SelectMethod methods={this.methods} default_method="NO_SCHEMA_CLUSTERING" auto_disabled={true} onChange={this.onChange}/>
                    
            </div>
        )
    }
}

export default SchemaClustering