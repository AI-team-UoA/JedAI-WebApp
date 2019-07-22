import React, { Component } from 'react'
import PropTypes from 'prop-types'
import update from 'immutability-helper';
import {Form, Row, FormControl, Col, Jumbotron, Collapse } from 'react-bootstrap/'
import CheckboxMethod from './utilities/CheckboxMethod'
import AlertModal from './utilities/AlertModal'

class BlockBuilding extends Component {

    constructor(...args) {
        super(...args);
        this.submitChange = this.submitChange.bind(this)
        this.alertText = "Select at least one Block Building method!"

        if (this.props.state !== null){
            var selected_methods = new Map()
            this.props.state.forEach((selected_method) => {
                selected_methods.set(selected_method.name, selected_method)
            })

            // in case user has already selected and returned back, initialize state based on father component's state
            this.state = {
                block_building : [
                    {
                        name: "STANDARD_TOKEN_BUILDING",
                        selected: selected_methods.has("STANDARD_TOKEN_BUILDING") ? selected_methods.get("STANDARD_TOKEN_BUILDING").selected : false,
                        label: "Standard/Token Blocking",
                        conf_type: selected_methods.has("STANDARD_TOKEN_BUILDING") ? selected_methods.get("STANDARD_TOKEN_BUILDING").conf_type : "Default"
                    },  
                    {
                        name: "SORTED_NEIGHBORHOOD",
                        selected: selected_methods.has("SORTED_NEIGHBORHOOD") ? selected_methods.get("SORTED_NEIGHBORHOOD").selected : false,
                        label: "Sorted Neighborhood",
                        conf_type: selected_methods.has("SORTED_NEIGHBORHOOD") ? selected_methods.get("SORTED_NEIGHBORHOOD").conf_type : "Default"
                    },  
                    {
                        name: "SORTED_NEIGHBORHOOD_EXTENDED",
                        selected: selected_methods.has("SORTED_NEIGHBORHOOD_EXTENDED") ? selected_methods.get("SORTED_NEIGHBORHOOD_EXTENDED").selected : false,
                        label: "Extended Sorted Neighborhood",
                        conf_type: selected_methods.has("SORTED_NEIGHBORHOOD_EXTENDED") ? selected_methods.get("SORTED_NEIGHBORHOOD_EXTENDED").conf_type : "Default"
                    },  
                    {
                        name: "Q_GRAMS_BLOCKING",
                        selected: selected_methods.has("Q_GRAMS_BLOCKING") ? selected_methods.get("Q_GRAMS_BLOCKING").selected : false,
                        label: "Q-Grams Blocking",
                        conf_type: selected_methods.has("Q_GRAMS_BLOCKING") ? selected_methods.get("Q_GRAMS_BLOCKING").conf_type : "Default"
                    },  
                    {
                        name: "Q_GRAMS_BLOCKING_EXTENDED",
                        selected: selected_methods.has("Q_GRAMS_BLOCKING_EXTENDED") ? selected_methods.get("Q_GRAMS_BLOCKING_EXTENDED").selected : false,
                        label: "Extended Q-Grams Blocking",
                        conf_type: selected_methods.has("Q_GRAMS_BLOCKING_EXTENDED") ? selected_methods.get("Q_GRAMS_BLOCKING_EXTENDED").conf_type : "Default"
                    },  
                    {
                        name: "SUFFIX_ARRAYS_BLOCKING",
                        selected: selected_methods.has("SUFFIX_ARRAYS_BLOCKING") ? selected_methods.get("SUFFIX_ARRAYS_BLOCKING").selected : false,
                        label: "Suffix Arrays Blocking",
                        conf_type: selected_methods.has("SUFFIX_ARRAYS_BLOCKING") ? selected_methods.get("SUFFIX_ARRAYS_BLOCKING").conf_type : "Default"
                    },  
                    {
                        name: "SUFFIX_ARRAYS_BLOCKING_EXTENDED",
                        selected: selected_methods.has("SUFFIX_ARRAYS_BLOCKING_EXTENDED") ? selected_methods.get("SUFFIX_ARRAYS_BLOCKING_EXTENDED").selected : false,
                        label: "Extended Suffix Arrays Blocking",
                        conf_type: selected_methods.has("SUFFIX_ARRAYS_BLOCKING_EXTENDED") ? selected_methods.get("SUFFIX_ARRAYS_BLOCKING_EXTENDED").conf_type : "Default"
                    },  
                    {
                        name: "LSH_SUPERBIT_BLOCKING",
                        selected: selected_methods.has("LSH_SUPERBIT_BLOCKING") ? selected_methods.get("LSH_SUPERBIT_BLOCKING").selected : false,
                        label: "LSH SuperBit Blocking",
                        conf_type: selected_methods.has("LSH_SUPERBIT_BLOCKING") ? selected_methods.get("LSH_SUPERBIT_BLOCKING").conf_type : "Default"
                    },  
                    {
                        name: "LSH_MINHASH_BLOCKING",
                        selected: selected_methods.has("LSH_MINHASH_BLOCKING") ? selected_methods.get("LSH_MINHASH_BLOCKING").selected : false,
                        label: "LSH MinHash Blocking",
                        conf_type: selected_methods.has("LSH_MINHASH_BLOCKING") ? selected_methods.get("LSH_MINHASH_BLOCKING").conf_type : "Default"
                    } 
            ],
            alertShow : false
        }

        }
        else{
            this.state = {
                block_building : [
                    {
                        name: "STANDARD_TOKEN_BUILDING",
                        selected: false,
                        label: "Standard/Token Blocking",
                        conf_type: "Default"
                    },  
                    {
                        name: "SORTED_NEIGHBORHOOD",
                        selected: false,
                        label: "Sorted Neighborhood",
                        conf_type: "Default",
                        window_size: 4
                            
                    },  
                    {
                        name: "SORTED_NEIGHBORHOOD_EXTENDED",
                        selected: false,
                        label: "Extended Sorted Neighborhood",
                        conf_type: "Default"
                    },  
                    {
                        name: "Q_GRAMS_BLOCKING",
                        selected: false,
                        label: "Q-Grams Blocking",
                        conf_type: "Default"
                    },  
                    {
                        name: "Q_GRAMS_BLOCKING_EXTENDED",
                        selected: false,
                        label: "Extended Q-Grams Blocking",
                        conf_type: "Default"
                    },  
                    {
                        name: "SUFFIX_ARRAYS_BLOCKING",
                        selected: false,
                        label: "Suffix Arrays Blocking",
                        conf_type: "Default"
                    },  
                    {
                        name: "SUFFIX_ARRAYS_BLOCKING_EXTENDED",
                        selected: false,
                        label: "Extended Suffix Arrays Blocking",
                        conf_type: "Default"
                    },  
                    {
                        name: "LSH_SUPERBIT_BLOCKING",
                        selected: false,
                        label: "LSH SuperBit Blocking",
                        conf_type: "Default"
                    },  
                    {
                        name: "LSH_MINHASH_BLOCKING",
                        selected: false,
                        label: "LSH MinHash Blocking",
                        conf_type: "Default"
                    } 
                ],
                alertShow : false
            }
        }

        var empty_col = 3
        var first_col = 2
        var second_col = 4

        this.BB_configurations =  [ <div />, 
                                <Jumbotron style={{backgroundColor:"white", border:"groove", width:"70%" }}>
                                    <div style={{margin:"auto"}}>
                                        <Form>
                                            <div style ={{textAlign:'center'}}>
                                                <h3>Sorted Neighborhood Blocking</h3>
                                                <p>Please configure the method's parameter below</p>
                                            </div>
                                            <br />
                                            <br />
                                            <Form.Row className="form-row">
                                                <Col sm={empty_col} />
                                                <Col sm={first_col} >
                                                    <Form.Label>Window Size</Form.Label> 
                                                </Col>
                                                <Col sm={second_col}>
                                                    <FormControl 
                                                        type="text" 
                                                        name="window_size" 
                                                        onChange={(e) => this.onChange(1, e)}
                                                        value={this.state.block_building[1].window_size} 
                                                    />
                                                </Col>
                                            </Form.Row>
                                        </Form>
                                    </div>
                                </Jumbotron>, <div />, <div />, <div />, <div />, <div />, <div />, <div />, <div />, <div />,]
        
        this.configurations_collapse = [false, false, false, false, false, false, false, false, false]

    }

    
    // how to update varaible without knowing its name,
    // e.target is null after o
    onChange = (index, e) => {
        console.log(e, index)

        this.setState(prevState => ({
            block_building: {
                ...prevState.block_building,
                [prevState.block_building[index].window_size]: e.target.value,
            },
        }));
        console.log(this.state.block_building[index])
    }
                
        

    
    submitChange(child_state){
        this.setState({
            block_building: this.state.block_building.map(el => (el.name === child_state.name ? {...child_state} : el))
            });
    }

    

    //handle alert modal
    handleAlertClose = () => this.setState({alertShow : false});
    handleAlerShow = () => this.setState({alertShow : true});


    // Put selected methods into an array and return them back to the father compoenent
    // User is required to select a method, otherwise she can not pass this step
    isValidated(){
        var selected_methods = []
        this.state.block_building.forEach((method) => {
            if (method.selected){
                selected_methods.push(method)
            }
        })
        if (selected_methods.length === 0) {
            this.handleAlerShow()
            return false
        }
        else{
            this.props.submitState("block_building", selected_methods)
            return true
        }
            
    }

    render() {
        for (var i = 0; i < 9; i++) {
            if (this.state.block_building[i].selected && this.state.block_building[i].conf_type === "Manual")    
                this.configurations_collapse[i] = true
            else
                this.configurations_collapse[i] = false
        }
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
                 
               
               
                <CheckboxMethod submitChange={this.submitChange} state={this.state.block_building[0]} />
                
                <CheckboxMethod submitChange={this.submitChange} state={this.state.block_building[1]} configurations={this.SN_configurations}/>
                <Collapse in={this.configurations_collapse[1]} >
                    <div style={{width:'75%', margin:'auto'}}>
                        {this.BB_configurations[1]}
                    </div>
                </Collapse>  
                
                <CheckboxMethod submitChange={this.submitChange} state={this.state.block_building[2]} />

                <CheckboxMethod submitChange={this.submitChange} state={this.state.block_building[3]} />
                <CheckboxMethod submitChange={this.submitChange} state={this.state.block_building[4]} />
                <CheckboxMethod submitChange={this.submitChange} state={this.state.block_building[5]} />
                <CheckboxMethod submitChange={this.submitChange} state={this.state.block_building[6]} />
                <CheckboxMethod submitChange={this.submitChange} state={this.state.block_building[7]} />
                <CheckboxMethod submitChange={this.submitChange} state={this.state.block_building[8]} />
                
            </div>
        )
    }
}

BlockBuilding.propTypes = {
    submitState: PropTypes.func.isRequired
}

export default BlockBuilding

