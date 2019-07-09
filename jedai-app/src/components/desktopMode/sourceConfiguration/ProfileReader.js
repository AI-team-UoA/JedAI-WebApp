import React, { Component } from 'react'
import {Form, Col, Button, Collapse} from 'react-bootstrap/'
import ConfigureCSV from './ConfigureCSV'


class ProfileReader extends Component {


    constructor(...args) {
        super(...args);
        this.onClick = this.onClick.bind(this);

        this.collapse_conf = false;
        this.collapse_explore = false;
        this.dataIsSet = false;
        
        this.state = { 
            filetype : "",
            path : ""   
        }
        
    }

    onChange = (e) => {
        this.setState({[e.target.name]: e.target.value})
        this.forceUpdate()
    }

    onClick= (e) =>{ 
        var btn = e.target.name
        if (btn === "conf_btn"){
            this.collapse_conf = !this.collapse_conf;
            this.collapse_explore = false;
        }
        else if(btn === "explore_btn"){
            this.collapse_explore = !this.collapse_explore;
            this.collapse_conf = false;
        }
        this.forceUpdate()
    }


    render() {
        return (
            <div>
                 <Form.Row>
                        <Col sm={2}>
                            <Form.Label ><h5>{this.props.title}</h5></Form.Label> 
                        </Col>
                        <Col sm={3}>
                            <Form.Group>
                                <Form.Control 
                                    as="select" 
                                    placeholder="Select Filetype" 
                                    name="filetype" 
                                    onChange={this.onChange}
                                    disabled={this.props.mode === ""}
                                >
                                    <option value="" ></option>
                                    <option value="csv" >CSV</option>
                                    <option value="rdb" >Database</option>
                                    <option value="rdf" >RDF</option>
                                    <option value="xml" >XML</option>
                                    <option value="obj" >Serialized</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col sm={1}>
                            <Form.Group> 
                                <Button  name="conf_btn" disabled={this.state.filetype === ""} onClick={this.onClick}>Configure</Button>  
                            </Form.Group>
                        </Col>
                        <Col sm={1}>
                            <Form.Group> 
                                <Button  name="explore_btn" disabled={!this.dataIsSet} onClick={this.onClick}>Explore</Button>
                            </Form.Group>
                        </Col>
                    </Form.Row>
                    <Form.Row>
                        <Collapse in={this.collapse_conf} >
                            <div style={{width:'80%', margin:'auto'}}>
                                <ConfigureCSV />
                            </div>
                        </Collapse>
                        <Collapse in={this.collapse_explore} >
                            <div >
                                <h1>Explore</h1>
                            </div>
                        </Collapse>
                    </Form.Row>
            </div>
        )
    }
}

export default ProfileReader