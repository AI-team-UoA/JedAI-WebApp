import React, { Component } from 'react'
import PropTypes from 'prop-types';
import SelectMethod from './utilities/SelectMethod'
import {Form, Row } from 'react-bootstrap/'

class ComparisonCleaning extends Component {

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
                conf_type: e.conf_type,
                label: e.label
            }
        )
    } 

    isValidated(){
        this.props.submitState("comparison_cleaning", this.state)
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

                <SelectMethod methods={this.methods} state={this.state} auto_disabled={false} onChange={this.onChange} title={"Comparison Cleaning method"}/>

            </div>
        )
    }
}

ComparisonCleaning.propTypes = {
    state: PropTypes.object.isRequired,
    submitState: PropTypes.func.isRequired
}


export default ComparisonCleaning 
