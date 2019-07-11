import React, { Component } from 'react'
import {Form, Col, Row} from 'react-bootstrap/'
import 'react-dropdown/style.css'
import ProfileReader from './sourceConfiguration/ProfileReader';




 class DataReader extends Component {

    constructor(...args) {
        super(...args);
       
        this.collapse_conf = false;
        this.collapse_explore = false;
        this.dataIsSet = false;
        this.setEntity = this.setEntity.bind(this)
        
        this.state = { 
            mode : "",
            entity1_set : false,
            entity2_set : false,
            groundTruth_set : false            
        }
    }

    // Set mode and based on that it disables the second profileReader
    onChange = (e) => {
        this.setState({[e.target.name]: e.target.value})
        if (e.target.name === "mode")
            if(e.target.value === "dirty") 
                this.setState({entity2_set: true})
            else 
                this.setState({entity2_set: false})
    }        

    //Check which entities have been completed successfully
    setEntity = (entity_id, isSet) => {
        switch(entity_id) {
            case "1":
                this.setState({entity1_set: isSet})
                break;
            case "2":
                this.setState({entity2_set: isSet})
                break;
            case "3":
                this.setState({groundTruth_set: isSet})
                break;
            default:
                console.log("ERROR")

          }
    }

    render() {
        
        return ( 

            <div >
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
                                <h5>Select Mode:</h5>
                            </Form.Label>                    
                            <Col sm={8}>
                                <Form.Check
                                    type="radio"
                                    label="Dirty Entity Resolution"
                                    name="mode"
                                    value="dirty"
                                    onChange={this.onChange}
                                />
                                <Form.Check
                                    type="radio"
                                    label="Clean-Clean Entity Resolution"
                                    name="mode"
                                    value="clean"
                                    onChange={this.onChange}
                                />
                            </Col>
                        </Form.Group>
                    </fieldset>

                    <hr style={{ color: 'black', backgroundColor: 'black', height: '5' }}/>
                    
                    <br/>
                    
                   <ProfileReader entity_id="1" title="Entity profiles D1:" disabled={this.state.mode === ""} type="entity" setEntity={this.setEntity}/>   
                   <ProfileReader entity_id="2" title="Entity profiles D2:" disabled={this.state.mode !== "clean"} type="entity" setEntity={this.setEntity}/> 
                   <ProfileReader entity_id="3" title="Ground-Truth file:" disabled={this.state.mode === ""} type="ground-truth" setEntity={this.setEntity}/>   
                   
                
            </div>   
        )
    }
}

export default DataReader