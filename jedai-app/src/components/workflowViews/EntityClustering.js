import React, { Component } from 'react'
import SelectMethod from './utilities/SelectMethod'
import {Form, Row } from 'react-bootstrap/'

class EntityClustering extends Component {

    state = {
        method: "NO_SCHEMA_CLUSTERING",
        conf_type: "default"
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
                conf_type: e.conf_type
            }
        )
    } 

    isValidated(){
        return this.state.method !== "" && this.state.conf_type !== ""
    }


    render() {
        //need changes here 
        var er_mode = "dirty"
        var configurations 
        if (er_mode === "dirty"){
            configurations = <SelectMethod methods={this.dirtyER_methods} default_method="CONNECTED_COMPONENTS_CLUSTERING" auto_disabled={false} onChange={this.onChange} title={"Algorithms for Dirty ER"}/>
        }
        else if (er_mode === "clean"){
            configurations = <SelectMethod methods={this.cleanER_methods} default_method="UNIQUE_MAPPING_CLUSTERING" auto_disabled={false} onChange={this.onChange} title={"Algorithms for Clean-Clean ER"}/>
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
export default  EntityClustering