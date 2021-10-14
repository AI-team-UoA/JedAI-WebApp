import React,{ Component } from 'react'
import PropTypes from 'prop-types';
import {Form, Col, Row, Collapse, Button} from 'react-bootstrap/'
import 'react-dropdown/style.css'
import ProfileReader from './ProfileReader';
import AlertModal from '../utilities/AlertModal'
import '../../../../../../resources/static/css/main.css'
import axios from 'axios'

 class DataReader extends Component {

    constructor(...args) {
        super(...args);
        
        this.collapse_conf = false;
        this.collapse_explore = false;
        this.dataIsSet = false;
        this.setEntity = this.setEntity.bind(this)
        this.alertText = "Select an ER Mode"
        if (this.props.state !== null){
            this.collapse_gt = true;
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

        this.collapse_gt = this.state.groundTruth_set != null
    }

    // Set er_mode and based on that it disables the second profileReader
    onChange = (e) => {
        var name = e.target.name
        var value = e.target.value
        this.setState({[e.target.name]: e.target.value})
        if (name === "er_mode"){
            axios
            .get("/workflow/set_configurations/ermode/"+value)

            if(value === "dirty") {
                this.alertText = "Entity profile D1 and Ground-truth must be set!"
            }
            else {
                this.alertText = "Entity profile D1, Entity profile D2 and Ground-truth must be set!"
            }
        }
    }        

    //Check which entities have been completed successfully
    setEntity = (entity_id, conf_state) => {
        switch(entity_id) {
            case "1":
                this.setState({entity1_set: conf_state, groundTruth_set: null }, () => (this.props.submitState("data_reading", this.state)))
                this.alertText = "Ground-truth has not been set properly!"
                break;
            case "2":
                this.setState({entity2_set: conf_state, groundTruth_set: null}, () => (this.props.submitState("data_reading", this.state)))
                this.alertText = "Ground-truth has not been set properly!"
                break;
            case "3":
                this.setState({groundTruth_set: conf_state}, () => (this.props.submitState("data_reading", this.state)))
                break;
            default:
                this.alertText = "Entity profiles were not set properly!"
                console.log("ERROR")
          }
    }

    handleAlertClose = () => this.setState({alertShow : false});
    handleAlertShow = () => this.setState({alertShow : true});

    openGT = (e) =>{
        this.collapse_gt = !this.collapse_gt
        this.setState({groundTruth_set: null})
    }


    isValidated(){
        var isSet
        if(this.state.er_mode === "dirty") isSet = this.state.entity1_set !== null 
        else if(this.state.er_mode === "clean") isSet = this.state.entity1_set !== null && this.state.entity2_set !== null
        else isSet = false
        if (isSet){
            return axios
                .get("/workflow/validate/dataread")
                .then(res => {
                    var validation_result = res.data
                    if (!validation_result){
                        this.alertText = "Entity profiles were not set properly!"
                        this.handleAlertShow()
                    }
                    
                    return validation_result})
        }
        else{
            this.handleAlertShow()
            return false
        }

    }

    render() {
        
        var disable_ground_truth = this.state.er_mode === "dirty" ? this.state.entity1_set === null : this.state.entity1_set === null || this.state.entity2_set === null 
        return ( 
            
            <div >
                <AlertModal title="Wrong Input" text={this.alertText} show={this.state.alertShow} handleClose={this.handleAlertClose} />
                <div className="workflow-container">
                    <br/>
                    <div style={{marginBottom:"5px"}}> 
                        <h1 style={{display:'inline', marginRight:"20px"}}>Data Reading</h1> 
                        <span style={{display:'inline'}} className="workflow-desc">  Data Reading transforms the input data into a list of entity profiles.</span>
                        <span title="If Dirty ER is selected, then you will need to configure only the Entity profiles D1, otherwise, if Clean-Clean ER is selected, you will need to configure both entity profiles D1 and D2. Configure Ground truth if you want to examine the performance of the workflow." className="fa fa-info-circle fa-2x" style={{marginLeft: "30px", color: "#4663b9"}}/>
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
                    <div>
                        <Button variant="primary" onClick={this.openGT}>
                            <span className="fa fa-plus-circle" style={{marginRight: "10px"}}/>
                            Add Ground-Truth file
                        </Button>
                        <br/>
                        <Collapse in={this.collapse_gt} >
                            <div>
                                <br/>
                                <br/>
                                <ProfileReader entity_id="3" title="Ground-Truth file:" disabled={this.state.er_mode === "" || disable_ground_truth} type="ground-truth" setEntity={this.setEntity} state={this.state.groundTruth_set} />   
                            </div>
                        </Collapse>
                    </div>
                    <br/>
                    <br/>
                    
                </div>
            </div>   
        )
    }
}

DataReader.propTypes = {
    submitState: PropTypes.func.isRequired
}

export default DataReader