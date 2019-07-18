import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Form, Row } from 'react-bootstrap/'
import SelectMultipleMethods from './utilities/SelectMultipleMethods'



class BlockCleaning extends Component {

    constructor(...args) {
        super(...args);
        this.submitChange = this.submitChange.bind(this)
        
        
        if (this.props.state !== null){
            var selected_methods = new Map()
            this.props.state.forEach((selected_method) => {
                selected_methods.set(selected_method.name, selected_method)
            })

            // in case user has already selected and returns back, initialize state based on father component's state
            this.state = {
                block_cleaning : [
                    {
                        name: "SIZE_BASED_BLOCK_PURGING",
                        selected: selected_methods.has("SIZE_BASED_BLOCK_PURGING") ? selected_methods.get("SIZE_BASED_BLOCK_PURGING").selected : false,
                        label: "Size-based Block Purging",
                        conf_type: selected_methods.has("SIZE_BASED_BLOCK_PURGING") ? selected_methods.get("SIZE_BASED_BLOCK_PURGING").conf_type : "Default"
                    },  
                    {
                        name: "COMPARISON_BASED_BLOCK_PURGING",
                        selected: selected_methods.has("COMPARISON_BASED_BLOCK_PURGING") ? selected_methods.get("COMPARISON_BASED_BLOCK_PURGING").selected : false,
                        label: "Comparison-based Block Purging",
                        conf_type: selected_methods.has("COMPARISON_BASED_BLOCK_PURGING") ? selected_methods.get("COMPARISON_BASED_BLOCK_PURGING").conf_type : "Default"
                    },  
                    {
                        name: "BLOCK_FILTERING",
                        selected: selected_methods.has("BLOCK_FILTERING") ? selected_methods.get("BLOCK_FILTERING").selected : false,
                        label: "Block Filrering",
                        conf_type: selected_methods.has("BLOCK_FILTERING") ? selected_methods.get("BLOCK_FILTERING").conf_type : "Default"
                    }
                ]
            }
        }
        else{
            // Block cleaning is not initialized
            this.state = {
                block_cleaning : [
                    {
                        name: "SIZE_BASED_BLOCK_PURGING",
                        selected: false,
                        label: "Size-based Block Purging",
                        conf_type: "Default"
                    },  
                    {
                        name: "COMPARISON_BASED_BLOCK_PURGING",
                        selected: false,
                        label: "Comparison-based Block Purging",
                        conf_type: "Default"
                    },  
                    {
                        name: "BLOCK_FILTERING",
                        selected: false,
                        label: "Block Filrering",
                        conf_type: "Default"
                    }
                ]
            }
        }
        
        
    }

    // update the selected element in the state
    submitChange(child_state){
            this.setState({
                block_cleaning: this.state.block_cleaning.map(el => (el.name === child_state.name ? {...child_state} : el))
            });
    }


    // Put selected methods into an array and return them back to the father compoenent
    // block cleaning is optional thus validation is always true
    isValidated(){
        var selected_methods = []
        this.state.block_cleaning.forEach((method) => {
            if (method.selected){
                selected_methods.push(method)
            }
        })
        if(selected_methods.length > 0) this.props.submitState("block_cleaning", selected_methods)
        else this.props.submitState("block_cleaning", null)
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

                <SelectMultipleMethods submitChange={this.submitChange} state={this.state.block_cleaning[0]} />
                <SelectMultipleMethods submitChange={this.submitChange} state={this.state.block_cleaning[1]} />
                <SelectMultipleMethods submitChange={this.submitChange} state={this.state.block_cleaning[2]} />

            </div>
        )
    }
}

BlockCleaning.propTypes = {
    submitState: PropTypes.func.isRequired
}

export default BlockCleaning