import React, { Component } from 'react'
import {Form, Row } from 'react-bootstrap/'
import SelectMultipleMethods from './utilities/SelectMultipleMethods'



class BlockCleaning extends Component {

    constructor(...args) {
        super(...args);
        this.submitChange = this.submitChange.bind(this)
        this.state = {
            block_cleaning : [
                {
                    name: "SIZE_BASED_BLOCK_PURGING",
                    selected: false,
                    conf_type: ""
                },  
                {
                    name: "COMPARISON_BASED_BLOCK_PURGING",
                    selected: false,
                    conf_type: ""
                },  
                {
                    name: "BLOCK_FILTERING",
                    selected: false,
                    conf_type: ""
                }
            ]
        }
    }

    submitChange(child_state){
        
        this.setState({
            block_cleaning: this.state.block_cleaning.map(el => (el.name === child_state.name ? {...child_state} : el))
            });
    }

    isValidated(){
        return true
    }

    render() {
        return (
            <div>
                <br/>
                <div style={{marginBottom:"5px"}}> 
                    <h1 style={{display:'inline', marginRight:"20px"}}>Block Cleaning</h1> 
                    <span className="workflow-desc" >Block Cleaning aims to clean a set of overlapping blocks from unnecessary comparisons, which can be either redundant (i.e., repeated) or superfluous (i.e., between non-matching entities). Its methods operate on the coarse level of individual blocks or entities.</span>
                </div>

                <br/>
                <hr style={{ color: 'black', backgroundColor: 'black', height: '5' }}/>
                <br/>

                <Form.Group as={Row} className="form-row" > 
                    <Form.Label><h5>Select methods for Block Cleaning (Optional)</h5></Form.Label>
                </Form.Group> 

                <SelectMultipleMethods submitChange={this.submitChange} name="SIZE_BASED_BLOCK_PURGING" label="Size-based Block Purging" />
                <SelectMultipleMethods submitChange={this.submitChange} name="COMPARISON_BASED_BLOCK_PURGING" label="Comparison-based Block Purging" />
                <SelectMultipleMethods submitChange={this.submitChange} name="BLOCK_FILTERING" label="Block Filering" />

            </div>
        )
    }
}


export default BlockCleaning