import React, { Component } from 'react'
import {Form, Col, Row, Alert} from 'react-bootstrap/'

class ComparisonCleaning extends Component {

    state = {
        method: "NO_CLEANING",
        conf_type: "default"
    }

    onChange = (e) => {
        this.setState({[e.target.name]: e.target.value})
    } 

    isValidated(){
        return true
    }

    render() {
        return (
            <div >
                <br/>
                <div style={{marginBottom:"5px"}}> 
                    <h1 style={{display:'inline', marginRight:"20px"}}>Comparison Cleaning</h1> 
                    <span className="workflow-desc">Similar to Block Cleaning, Comparison Cleaning aims to clean a set of blocks from both redundant and superfluous comparisons. Unlike Block Cleaning, its methods operate on the finer granularity of individual comparisons.</span>
                </div>

                <br/>
                <hr style={{ color: 'black', backgroundColor: 'black', height: '5' }}/>
                <br/>

                    <fieldset>
                        <Alert  variant="primary" style={{width:"65%", margin:'auto'}}>
                            <Form.Group as={Row} className="form-row">           
                                <Col sm={8}>
                                    <Form.Label as="legend">
                                        <h5>Select a Comparison Cleaning method (Optional)</h5>  
                                    </Form.Label>
                                    <Form.Check
                                        type="radio"
                                        label="No Cleaning"
                                        name="method"
                                        value="NO_CLEANING"
                                        onChange={this.onChange}
                                        checked={this.state.method ===  "NO_CLEANING"}
                                    />
                                    <Form.Check
                                        type="radio"
                                        label="Comparison Propagation"
                                        name="method"
                                        value="COMPARISON_PROPAGATION"
                                        onChange={this.onChange}
                                    />
                                    <Form.Check
                                        type="radio"
                                        label="Cardinality Edge Pruning (CEP)"
                                        name="method"
                                        value="CARDINALITY_EDGE_PRUNING"
                                        onChange={this.onChange}
                                    />
                                    <Form.Check
                                        type="radio"
                                        label="Cardinality Node Pruning (CNP)"
                                        name="method"
                                        value="CARDINALITY_NODE_PRUNING"
                                        onChange={this.onChange}
                                    />
                                    <Form.Check
                                        type="radio"
                                        label="Weighed Edge Pruning (WEP)"
                                        name="method"
                                        value="WEIGHED_EDGE_PRUNING"
                                        onChange={this.onChange}
                                    />
                                    <Form.Check
                                        type="radio"
                                        label="Weighed Node Pruning (WNP)"
                                        name="method"
                                        value="WEIGHED_NODE_PRUNING"
                                        onChange={this.onChange}
                                    />
                                    <Form.Check
                                        type="radio"
                                        label="Reciprocal Cardinality Node Pruning"
                                        name="method"
                                        value="RECIPROCAL_CARDINALITY_NODE_PRUNING"
                                        onChange={this.onChange}
                                    />
                                    <Form.Check
                                        type="radio"
                                        label="Reciprocal Weighed Node Pruning"
                                        name="method"
                                        value="RECIPROCAL_WEIGHED_NODE_PRUNING"
                                        onChange={this.onChange}
                                    />
                                    <Form.Check
                                        type="radio"
                                        label="Canopy Clustering"
                                        name="method"
                                        value="CANOPY_CLUSTERING"
                                        onChange={this.onChange}
                                    />
                                    <Form.Check
                                        type="radio"
                                        label="Extended Canopy Clustering"
                                        name="method"
                                        value="CANOPY_CLUSTERING_EXTENDED"
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
                                        label="Automatic"
                                        name="conf_type"
                                        value="automatic"
                                        onChange={this.onChange}
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
                        </Alert>
                    </fieldset>

                    <br/>
                    <br/>
            </div>
        )
    }
}

export default ComparisonCleaning 
