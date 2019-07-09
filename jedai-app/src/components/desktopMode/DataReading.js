import React, { Component } from 'react'
import {Form, Col, Row} from 'react-bootstrap/'
import 'react-dropdown/style.css'
import ProfileReader from './sourceConfiguration/ProfileReader';




 class DataReading extends Component {

    constructor(...args) {
        super(...args);
       
        this.collapse_conf = false;
        this.collapse_explore = false;
        this.dataIsSet = false;
        
        this.state = { 
            mode : "",
            filetype : "",
            path : ""   
        }
        
    }


    onChange = (e) => {
        this.setState({[e.target.name]: e.target.value})
        this.forceUpdate()
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
                <Form>
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
                    
                   <ProfileReader title="Entity profiles D1:" mode={this.state.mode}/>   
                </Form>
                
            </div>   
        )
    }
}

export default DataReading