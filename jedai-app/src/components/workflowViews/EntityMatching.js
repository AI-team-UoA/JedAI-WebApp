import React, { Component } from 'react'
import PropTypes from 'prop-types';
import SelectMethod from './utilities/SelectMethod'
import {Form, Row } from 'react-bootstrap/'


class EntityMatching extends Component {

    state = {
        method: "GROUP_LINKAGE",
        conf_type: "Default",
        label: "Group Linkage"
    }

    methods = 
    [
        {
            value: "GROUP_LINKAGE",
            label: "Group Linkage"
        },
        {
            value: "PROFILE_MATCHER",
            label: "Profile Matcher"
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
        this.props.submitState("entity_matching", this.state)
        return this.state.method !== "" && this.state.conf_type !== ""
    }


    render() {
        return (
            <div>
                <br/>
                <div style={{marginBottom:"5px"}}> 
                    <h1 style={{display:'inline', marginRight:"20px"}}>Entity Matching</h1> 
                    <span className="workflow-desc">Entity Matching compares pairs of entity profiles, associating every pair with a similarity in [0,1]. Its output comprises the similarity graph, i.e., an undirected, weighted graph where the nodes correspond to entities and the edges connect pairs of compared entities.</span>
                </div>

                <br/>
                <hr style={{ color: 'black', backgroundColor: 'black', height: '5' }}/>
                <br/>

                <Form.Group as={Row} className="form-row" > 
                    <Form.Label><h5>Select parameters for Entity Matching</h5></Form.Label>
                </Form.Group> 

                <SelectMethod methods={this.methods} default_method="GROUP_LINKAGE" default_method_label="Group Linkage" auto_disabled={false} onChange={this.onChange} title={"Entity Matching Parameters"}/>
                    
            </div>
        )
    }
}

EntityMatching.propTypes = {
    submitState: PropTypes.func.isRequired
}

export default  EntityMatching