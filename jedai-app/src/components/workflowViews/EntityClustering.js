import React, { Component } from 'react'
import PropTypes from 'prop-types';
import SelectMethod from './utilities/SelectMethod'
import {Form, Row } from 'react-bootstrap/'

class EntityClustering extends Component {

    constructor(...args) {
        super(...args);

        this.state = {
            method: this.props.state.method,
            conf_type: this.props.state.conf_type,
            label: this.props.state.label
        }
    }

    dirtyER_methods = 
    [
        {
            value: "CENTER_CLUSTERING",
            label: "Center Clustering"
        },
        {
            value: "CONNECTED_COMPONENTS_CLUSTERING",
            label: "Connected Component Clustering"
        },
        {
            value: "CUT_CLUSTERING",
            label: "Cut Clustering"
        },
        {
            value: "MARKOV_CLUSTERING",
            label: "Markov Clustering"
        },
        {
            value: "GROUP_LIMERGE_CENTER_CLUSTERINGNKAGE",
            label: "Merge-Center Clustering"
        },
        {
            value: "RICOCHET_SR_CLUSTERING",
            label: "Ricochet SR Clustering"
        }
    ]

    cleanER_methods = 
    [
        {
            value: "UNIQUE_MAPPING_CLUSTERING",
            label: "Unique Mapping Clustering"
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
        this.props.submitState("entity_clustering", this.state)
        return this.state.method !== "" && this.state.conf_type !== ""
    }


    render() {
        
        var er_mode = this.props.er_mode
        var configurations 
        if (er_mode === "dirty"){
            configurations = <SelectMethod methods={this.dirtyER_methods} state={this.state}  auto_disabled={false} onChange={this.onChange} title={"Algorithms for Dirty ER"}/>
        }
        else if (er_mode === "clean"){
            configurations = <SelectMethod methods={this.cleanER_methods} state={this.state} auto_disabled={false} onChange={this.onChange} title={"Algorithms for Clean-Clean ER"}/>
        }
        else configurations = <h2>ERROR</h2>
        return (
            <div>
                <br/>
                <div style={{marginBottom:"5px"}}> 
                    <h1 style={{display:'inline', marginRight:"20px"}}>Entity Clustering</h1> 
                    <span className="workflow-desc">Entity Clustering takes as input the similarity graph produced by Entity Matching and partitions it into a set of equivalence clusters, with every cluster corresponding to a distinct real-world object.</span>
                </div>

                <br/>
                <hr style={{ color: 'black', backgroundColor: 'black', height: '5' }}/>
                <br/>

                <Form.Group as={Row} className="form-row" > 
                    <Form.Label><h5>Select an algorithm for Clustering entities</h5></Form.Label>
                </Form.Group> 

                {configurations}
                   
            </div>
        )
    }
}

EntityClustering.propTypes = {
    submitState: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
    er_mode: PropTypes.string.isRequired
}

export default  EntityClustering