import React, { Component } from 'react'
import {Form, Row, Col, Button} from 'react-bootstrap/'
import 'react-dropdown/style.css'
import Collapse from '@kunukn/react-collapse';




 class DataReading extends Component {

    constructor(...args) {
        super(...args);
        this.conf = false

        this.validate_address = 0
        this.validate_port = 0

        this.state = { 

            filetype : "",
            path : ""   
        }
        console.log(this.conf )
        
    }

   
    
    
    


    onChange = (e) => this.setState({[e.target.name]: e.target.value})

    onClick(){ 
        console.log(this.conf )
        this.conf = !true ? true: false 
       
    }

    render() {
        
        return ( 

            <div >
                <br/>
                <div > 
                    <h1 style={{display:'inline'}}>Data Reading</h1> 
                    {'  '}
                    <span className="workflow-desc">  Data Reading transforms the input data into a list of entity profiles.</span>
                </div>
                <h5>Select files for the entity profiles and ground-truth</h5>
                
                <br/>
                <Form>
                    <fieldset>
                        <Form.Group as={Row}>
                            <Form.Label as="legend" column sm={5}>
                            <h5><b>Select mode</b></h5>
                            </Form.Label>
                            <Col sm={10}>
                                <Form.Check
                                    type="radio"
                                    label="Dirty Entity Resolution"
                                    name="dirtyRes"
                                    id="dirtyRes"
                                />
                                <Form.Check
                                    type="radio"
                                    label="Clean-Clean Entity Resolution"
                                    name="cleanRes"
                                    id="cleanRes"
                                />
                            </Col>
                        </Form.Group>
                    </fieldset>
                    
                    <hr style={{ color: 'black', backgroundColor: 'black', height: '5' }}/>
                    <br/>
                    <Form.Row>
                        <Form.Label ><h5><b>Choose Filetype:</b></h5></Form.Label> 
                        {"   "}
                        <Form.Group as={Col} md="3" controlId="formGridState">
                            
                            <Form.Control as="select" placeholder="Select Filetype" 
                                name="filetype" onChange={this.onChange}>
                                <option value="" ></option>
                                <option value="csv" >CSV</option>
                                <option value="rdb" >Database</option>
                                <option value="rdf" >RDF</option>
                                <option value="xml" >XML</option>
                                <option value="obj" >Serialized</option>
                            </Form.Control>
                            
                        </Form.Group>{" "}
                        <Form.Group as={Col} md="3" controlId="formGridState"> 
                            <Button  disabled={this.state.filetype === ""} onClick={this.onClick}>Configure</Button>  
                            <Collapse isOpen={this.conf}>
                                <div>Random content</div>
                            </Collapse>
                        </Form.Group>
                    </Form.Row>    

                </Form>
                
            </div>   
        )
    }
}

export default DataReading