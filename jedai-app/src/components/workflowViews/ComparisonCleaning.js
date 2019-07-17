import React, { Component } from 'react'
import SelectMethod from './utilities/SelectMethod'
import {Form, Row } from 'react-bootstrap/'

class ComparisonCleaning extends Component {

    state = {
        method: "NO_CLEANING",
        conf_type: "default"
    }

    methods = 
        [
            {
                value: "NO_CLEANING",
                label: "No Cleaning"
            },
            {
                value: "COMPARISON_PROPAGATION",
                label: "Comparison Propagation"
            },
            {
                value: "CARDINALITY_EDGE_PRUNING",
                label: "Cardinality Edge Pruning (CEP)"
            },
            {
                value: "CARDINALITY_NODE_PRUNING",
                label: "Cardinality Node Pruning (CNP)"
            },
            {
                value: "WEIGHED_EDGE_PRUNING",
                label: "Weighed Edge Pruning (WEP)"
            },
            {
                value: "WEIGHED_NODE_PRUNING",
                label: "Weighed Node Pruning (WNP)"
            },
            {
                value: "RECIPROCAL_CARDINALITY_NODE_PRUNING",
                label: "Reciprocal Cardinality Node Pruning"
            },
            {
                value: "RECIPROCAL_WEIGHED_NODE_PRUNING",
                label: "Reciprocal Weighed Node Pruning"
            },
            {
                value: "CANOPY_CLUSTERING",
                label: "Canopy Clustering"
            },
            {
                value: "CANOPY_CLUSTERING_EXTENDED",
                label: "Extended Canopy Clustering"
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

                

                <Form.Group as={Row} className="form-row" > 
                    <Form.Label><h5>Select a Comparison Cleaning method (Optional)</h5>  </Form.Label>
                </Form.Group> 

                <SelectMethod methods={this.methods} default_method="NO_CLEANING" auto_disabled={false} onChange={this.onChange} title={"Comparison Cleaning method"}/>

            </div>
        )
    }
}

export default ComparisonCleaning 
