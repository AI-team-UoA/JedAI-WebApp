import React, { Component } from 'react'
import {Form, Row } from 'react-bootstrap/'
import SelectMultipleMethods from './utilities/SelectMultipleMethods'
import AlertModal from './utilities/AlertModal'

class BlockBuilding extends Component {

    constructor(...args) {
        super(...args);
        this.submitChange = this.submitChange.bind(this)
        this.alertText = "Select at least one Block Building method!"
        this.state = {
            block_building : [
                {
                        name: "STANDARD_TOKEN_BUILDING",
                        selected: false,
                        conf_type: ""
                },  
                {
                        name: "SORTED_NEIGHBORHOOD",
                        selected: false,
                        conf_type: ""
                    },  
                    {
                        name: "SORTED_NEIGHBORHOOD_EXTENDED",
                        selected: false,
                        conf_type: ""
                    },  
                    {
                        name: "Q_GRAMS_BLOCKING",
                        selected: false,
                        conf_type: ""
                    },  
                    {
                        name: "Q_GRAMS_BLOCKING_EXTENDED",
                        selected: false,
                        conf_type: ""
                    },  
                    {
                        name: "SUFFIX_ARRAYS_BLOCKING",
                        selected: false,
                        conf_type: ""
                },  
                {
                        name: "SUFFIX_ARRAYS_BLOCKING_EXTENDED",
                        selected: false,
                        conf_type: ""
                    },  
                    {
                        name: "LSH_SUPERBIT_BLOCKING",
                        selected: false,
                        conf_type: ""
                    },  
                    {
                        name: "LSH_MINHASH_BLOCKING",
                        selected: false,
                        conf_type: ""
                    } 
            ],
            alertShow : false
        }
    }

    submitChange(child_state){
        
        this.setState({
            block_building: this.state.block_building.map(el => (el.name === child_state.name ? {...child_state} : el))
            });
    }

    handleAlertClose = () => this.setState({alertShow : false});
    handleAlerShow = () => this.setState({alertShow : true});

    isValidated(){
        var blockBuilding_isSet = false
        this.state.block_building.forEach((method_state) => {
          if (method_state.selected === true){
                blockBuilding_isSet = true
          }
        })
        if (!blockBuilding_isSet) this.handleAlerShow()
        return blockBuilding_isSet
    }

    render() {
        return (
            <div>
                <AlertModal text={this.alertText} show={this.state.alertShow} handleClose={this.handleAlertClose} />
                <br/>
                <div style={{marginBottom:"5px"}}> 
                    <h1 style={{display:'inline', marginRight:"20px"}}>Block Building</h1> 
                    <span className="workflow-desc" >Block Building clusters entities into overlapping blocks in a lazy manner that relies on unsupervised blocking keys: every token in an attribute value forms a key. Blocks are then extracted, based on its equality or on its similarity with other keys.</span>
                </div>

                <br/>
                <hr style={{ color: 'black', backgroundColor: 'black', height: '5' }}/>
                <br/>

                <Form.Group as={Row} className="form-row" > 
                    <Form.Label><h5>Select Block Building methods and Configurations</h5></Form.Label>
                </Form.Group>
                 
                <SelectMultipleMethods submitChange={this.submitChange} name="STANDARD_TOKEN_BUILDING" label="Standard/Token Blocking" />
                <SelectMultipleMethods submitChange={this.submitChange} name="SORTED_NEIGHBORHOOD" label="Sorted Neighborhood" />
                <SelectMultipleMethods submitChange={this.submitChange} name="SORTED_NEIGHBORHOOD_EXTENDED" label="Extended Sorted Neighborhood" />
                <SelectMultipleMethods submitChange={this.submitChange} name="Q_GRAMS_BLOCKING" label="Q-Grams Blocking" />
                <SelectMultipleMethods submitChange={this.submitChange} name="Q_GRAMS_BLOCKING_EXTENDED" label="Extended Q-Grams Blocking" />
                <SelectMultipleMethods submitChange={this.submitChange} name="SUFFIX_ARRAYS_BLOCKING" label="Suffix Arrays Blocking" />
                <SelectMultipleMethods submitChange={this.submitChange} name="SUFFIX_ARRAYS_BLOCKING_EXTENDED" label="Extended Suffix Arrays Blocking" />
                <SelectMultipleMethods submitChange={this.submitChange} name="LSH_SUPERBIT_BLOCKING" label="LSH SuperBit Blocking" />
                <SelectMultipleMethods submitChange={this.submitChange} name="LSH_MINHASH_BLOCKING" label="LSH MinHash Blocking" />
                
            </div>
        )
    }
}
export default BlockBuilding

