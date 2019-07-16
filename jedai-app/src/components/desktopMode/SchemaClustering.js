import React, { Component } from 'react'
import {Form, Col, Row, FormControl} from 'react-bootstrap/'

 class SchemaClustering extends Component {
     

    state = {
        method: "NO_SCHEMA_CLUSTERING",
        conf_type: "default"
    }

    onChange = (e) => {
        this.setState({[e.target.name]: e.target.value})
    } 

    isValidated(){
        return this.state.method !== "" && this.state.conf_type !== ""
    }


    render() {
        return (
            <div >
                <br/>
                <div style={{marginBottom:"5px"}}> 
                    <h1 style={{display:'inline', marginRight:"20px"}}>Schema Clustering</h1> 
                    <span className="workflow-desc">Schema Clustering groups together syntactically (not semantically) similar attributes. This can improve the performance of all workflow steps.</span>
                </div>

                <br/>
                <hr style={{ color: 'black', backgroundColor: 'black', height: '5' }}/>
                <br/>

                    <fieldset>
                        <Form.Group as={Row} className="form-row" style={{position:'relative', left:'20%'}}>           
                            <Col sm={4}>
                                <Form.Label as="legend">
                                    <h5>Select a Schema clustering method</h5>  
                                </Form.Label>
                                <Form.Check
                                    type="radio"
                                    label="No Schema Clustering"
                                    name="method"
                                    value="NO_SCHEMA_CLUSTERING"
                                    onChange={this.onChange}
                                    checked={this.state.method ===  "NO_SCHEMA_CLUSTERING"}
                                />
                                <Form.Check
                                    type="radio"
                                    label="ATTRIBUTE_NAME_CLUSTERING"
                                    name="method"
                                    value="name-clustering"
                                    onChange={this.onChange}
                                />
                                <Form.Check
                                    type="radio"
                                    label="Attribute Value Clustering"
                                    name="method"
                                    value="ATTRIBUTE_VALUE_CLUSTERING"
                                    onChange={this.onChange}
                                />
                                <Form.Check
                                    type="radio"
                                    label="Holistic Attribute Clustering"
                                    name="method"
                                    value="HOLISTIC_ATTRIBUTE_CLUSTERING"
                                    onChange={this.onChange}
                                />
                            </Col>
                            <Col sm={4}>
                                <Form.Label as="legend"><h5>Configuration Type</h5> </Form.Label>
                                <Form.Check
                                    type="radio"
                                    label="Default"
                                    name="conf_type"
                                    value="default"
                                    onChange={this.onChange}
                                    checked={this.state.conf_type ===  "default"}
                                />
                               <Form.Check
                                    type="radio"
                                    label="Manual"
                                    name="conf_type"
                                    value="manual"
                                    onChange={this.onChange}
                                />


                                
                            </Col>
                        </Form.Group>
                    </fieldset>

                    <br/>
                    <br/>
            </div>
        )
    }
}

export default SchemaClustering