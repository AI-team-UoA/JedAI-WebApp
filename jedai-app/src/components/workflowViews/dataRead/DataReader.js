import React, { Component } from 'react'
import PropTypes from 'prop-types';
import {Form, Col, Row} from 'react-bootstrap/'
import 'react-dropdown/style.css'
import ProfileReader from './ProfileReader';
import AlertModal from '../utilities/AlertModal'



 class DataReader extends Component {

    constructor(...args) {
        super(...args);
        
        this.collapse_conf = false;
        this.collapse_explore = false;
        this.dataIsSet = false;
        this.setEntity = this.setEntity.bind(this)

        this.alertText = "Select an ER Mode"

        if (this.props.state !== null){
            this.state = { 
                er_mode : this.props.state.er_mode,
                entity1_set : this.props.state.entity1_set,
                entity2_set : this.props.state.entity2_set,
                groundTruth_set : this.props.state.groundTruth_set,
                alertShow : false
            }
        }else{
            this.state = { 
                er_mode : "",
                entity1_set : null,
                entity2_set : null,
                groundTruth_set : null,
                alertShow : false
            }
        }
    }

    // Set er_mode and based on that it disables the second profileReader
    onChange = (e) => {
        this.setState({[e.target.name]: e.target.value})
        if (e.target.name === "er_mode")
            if(e.target.value === "dirty") {
                this.alertText = "Entity profile D1 and Ground-truth must be set!"
            }
            else {
                this.alertText = "Entity profile D1, Entity profile D2 and Ground-truth must be set!"
            }
    }        

    //Check which entities have been completed successfully
    setEntity = (entity_id, conf_state) => {
        switch(entity_id) {
            case "1":
                this.setState({entity1_set: conf_state }, () => (this.props.submitState("data_reading", this.state)))
                break;
            case "2":
                this.setState({entity2_set: conf_state}, () => (this.props.submitState("data_reading", this.state)))
                break;
            case "3":
                this.setState({groundTruth_set: conf_state}, () => (this.props.submitState("data_reading", this.state)))
                break;
            default:
                console.log("ERROR")
          }
    }

    handleAlertClose = () => this.setState({alertShow : false});
    handleAlerShow = () => this.setState({alertShow : true});


    isValidated(){
        var isSet
        if(this.state.er_mode === "dirty") isSet = this.state.entity1_set !==null && this.state.groundTruth_set !==null
        else if(this.state.er_mode === "clean") isSet = this.state.entity1_set !==null && this.state.entity2_set !== null && this.state.groundTruth_set !==null
        else isSet = false
        if (isSet)
            return true
        else{
            
            this.handleAlerShow()
            return false
        }

    }

    render() {
        
        return ( 
            
            <div >
                <AlertModal text={this.alertText} show={this.state.alertShow} handleClose={this.handleAlertClose} />
                <br/>
                <div style={{marginBottom:"5px"}}> 
                    <h1 style={{display:'inline', marginRight:"20px"}}>Data Reading</h1> 
                    <span className="workflow-desc">  Data Reading transforms the input data into a list of entity profiles.</span>
                </div>
                <br/>
                
                    <Form.Row className="form-row">
                        <h5 >Select files for the entity profiles and ground-truth</h5>  
                    </Form.Row>
                    <fieldset>
                        <Form.Group as={Row} className="form-row">
                    
                            <Form.Label as="legend" column sm={2}>
                                <h5>Select ER Mode:</h5>
                            </Form.Label>                    
                            <Col sm={8}>
                                <Form.Check
                                    type="radio"
                                    label="Dirty Entity Resolution"
                                    name="er_mode"
                                    value="dirty"
                                    onChange={this.onChange}
                                    checked={this.state.er_mode === "dirty"}
                                />
                                <Form.Check
                                    type="radio"
                                    label="Clean-Clean Entity Resolution"
                                    name="er_mode"
                                    value="clean"
                                    onChange={this.onChange}
                                    checked={this.state.er_mode === "clean"}
                                />
                            </Col>
                        </Form.Group>
                    </fieldset>

                    <hr style={{ color: 'black', backgroundColor: 'black', height: '5' }}/>
                    
                    <br/>
                    
                   <ProfileReader entity_id="1" title="Entity profiles D1:" disabled={this.state.er_mode === ""} type="entity" setEntity={this.setEntity} state={this.state.entity1_set}/>   
                   <ProfileReader entity_id="2" title="Entity profiles D2:" disabled={this.state.er_mode !== "clean"} type="entity" setEntity={this.setEntity} state={this.state.entity2_set}/> 
                   <ProfileReader entity_id="3" title="Ground-Truth file:" disabled={this.state.er_mode === ""} type="ground-truth" setEntity={this.setEntity} state={this.state.groundTruth_set}/>   
                   
                
            </div>   
        )
    }
}

DataReader.propTypes = {
    submitState: PropTypes.func.isRequired
}

export default DataReader