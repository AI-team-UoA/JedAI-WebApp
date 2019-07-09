import React, { Component } from 'react'
import {Jumbotron, Form, Col, Button, InputGroup, FormControl} from 'react-bootstrap/'
import Checkbox from 'react-simple-checkbox';
import "../../../css/main.css"


 class ConfigureCSV extends Component {

    constructor(...args) {
        super(...args);
        
        this.state={
            filepath : "",
            first_row : true,
            seperator : ",",
            id_index : 0,
            exclude_attr : ""
        }

    }

    setPath = (e) => {
       console.log(e.target.value)
       this.setState({filepath: e.target.value})
       
       this.forceUpdate();
    }

    onChange = (e) =>  this.setState({[e.target.name]: e.target.value})
    
    handleCheckbox = () =>   this.setState({first_row: !this.state.first_row})
    
    render() {
        return (

            <Jumbotron style={{backgroundColor:"white", border:"groove" }}>
                <div>
                    <div style ={{textAlign:'center'}}>
                        <h3>CSV Reader</h3>
                        <p>Please configure the method's parameter below</p>
                    </div>
                    <Form>
                        
                        <Form.Row className="form-row">
                            <Col sm={4}>
                                <Form.Label> File Path </Form.Label> 
                            </Col>
                            <Col sm={6}>
                                <InputGroup >
                                    <FormControl
                                        placeholder=".csv"
                                        aria-label=".csv"
                                        aria-describedby="basic-addon2"
                                        value={this.state.filepath}
                                    />
                                
                                    <div  className="upload-btn-wrapper" style={{cursor:'pointer'}}>
                                        <Button >Browse</Button>
                                        <input type="file" name="file" onChange={this.setPath}/>
                                    </div>
                                </InputGroup>
                            </Col>
                        </Form.Row>

                        <Form.Row className="form-row">
                            <Col sm={4}>
                                <Form.Label>Attributes names in first row</Form.Label> 
                            </Col>
                            <Checkbox 
                                as={Col}
                                size="3"  
                                color="#1a75ff"
                                borderThickness="2" 
                                name="first_row" 
                                
                                value={this.state.first_row} 
                                checked={this.state.first_row} 
                                onChange={this.handleCheckbox.bind(this)}
                            />
                            
                        </Form.Row>

                        <Form.Row className="form-row">
                            <Col sm={4} >
                                <Form.Label  >Seperator</Form.Label> 
                            </Col>
                            <Col sm={2}>
                               <FormControl 
                                    type="text" 
                                    name="seperator" 
                                    value={this.state.seperator} 
                                    onChange={this.onChange}
                                    
                                />
                            </Col>
                        </Form.Row>

                        <Form.Row className="form-row">
                            <Col sm={4} >
                                <Form.Label >Id index</Form.Label> 
                            </Col>
                            <Col sm={2}>
                                <FormControl 
                                    type="text" 
                                    name="id_index" 
                                    value={this.state.id_index} 
                                    onChange={this.onChange}
                                />
                            </Col>
                        </Form.Row>

                        <Form.Row className="form-row">
                            <Col sm={4} >
                                <Form.Label >Attributes to Exclude</Form.Label> 
                            </Col>
                            <Col sm={6}>
                                <FormControl 
                                    type="text" 
                                    name="exclude_attr" 
                                    value={this.state.exclude_attr} 
                                    onChange={this.onChange}
                                />
                            </Col>
                        </Form.Row>

                        <div style={{textAlign: 'center',  marginTop: '30px'}}>
                            <Button >Save Configuration</Button>
                        </div>
                    </Form>
                </div>
                
            </Jumbotron>
        )
    }
}
export default ConfigureCSV