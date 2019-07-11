import React, { Component } from 'react'
import PropTypes from 'prop-types';
import {Form, Col, Button, Collapse} from 'react-bootstrap/'
import Configurations from './Configurations'

/**
 * The Form that sets  entity profiles and the ground truth
 */
class ProfileReader extends Component {

    constructor(...args) {
        super(...args);
        this.onClick = this.onClick.bind(this);
        this.submitted = this.submitted.bind(this)
        this.emptyConfiguration = this.emptyConfiguration.bind(this)
        
        this.collapse_conf_flag = false;
        this.collapse_explore_flag = false;
        this.dataIsSet = false;
        this.text_area_msg = ""
        
        this.state = { 
            entity_id: this.props.entity_id,
            filetype : "",
            configuration_submitted: false
        }
        
    }

    // it is activated only by the filetype handler. 
    // it also cleans the configurations
    onChange = (e) => {
        this.emptyConfiguration()
        this.setState({[e.target.name]: e.target.value})
        
    }

    // Reveal the filetype configurations or explore panel
    onClick= (e) =>{ 
        var btn = e.target.name
        if (btn === "conf_btn"){
            this.collapse_conf_flag = !this.collapse_conf_flag;
            this.collapse_explore_flag = false;
        }
        else if(btn === "explore_btn"){
            this.collapse_explore_flag = !this.collapse_explore_flag;
            this.collapse_conf_flag = false;
        }
        this.forceUpdate()
    }

    // Set configuration (received by the child) and update the DataReader
    submitted = (flag, msg) => {
        this.text_area_msg = "Source: " + this.state.filetype + msg
        this.collapse_conf_flag = false;
        this.setState({configuration_submitted: flag})
        this.props.setEntity(this.state.entity_id, flag)
        
    }

    // Empty configurations and hide collapses
    emptyConfiguration(){
       if (this.state.filetype !== ""){
            this.setState({filetype: "", configuration_submitted: false});
            this.props.setEntity(this.state.entity_id, false)
        }
        this.collapse_conf_flag = false;
        this.collapse_explore_flag = false;        
    }

    


    render() {

        if(this.props.disabled)
            this.emptyConfiguration()

        //if it is a ground-truth component it contains fewer options
        let control_options;
        if (this.props.type === "entity"){
            control_options = <Form.Control 
                as="select" 
                placeholder="Select Filetype" 
                name="filetype" 
                onChange={this.onChange}
                disabled={this.props.disabled}
            >
                <option value="" ></option>
                <option value="CSV" >CSV</option>
                <option value="Database" >Database</option>
                <option value="RDF" >RDF</option>
                <option value="XML" >XML</option>
                <option value="Serialized" >Serialized</option>
            </Form.Control>;
        }
        else if (this.props.type === "ground-truth"){
            control_options = <Form.Control 
                as="select" 
                placeholder="Select Filetype" 
                name="filetype" 
                value={this.state.filetype}
                onChange={this.onChange}
                disabled={this.props.disabled}

            >
                <option value="" ></option>
                <option value="CSV" >CSV</option>
                <option value="RDF" >RDF</option>
                <option value="Serialized" >Serialized</option>
            </Form.Control>;
        }
        
              

        return (
            <div>
                 <Form.Row>
                        <Col sm={2}>
                            <Form.Label ><h5>{this.props.title}</h5></Form.Label> 
                        </Col>
                        <Col sm={3}>
                            <Form.Group>
                                {control_options}
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
                        <Col sm={4}>
                            <Form.Group>
                                <Form.Control as="textarea" rows="3" readOnly={true} value={this.text_area_msg}/>
                            </Form.Group>
                        </Col>
                    </Form.Row>
                    <Form.Row>
                        <Collapse in={this.collapse_conf_flag} >
                            <div style={{width:'75%', margin:'auto'}}>
                                <Configurations entity_id={this.state.entity_id} filetype={this.state.filetype} submitted={this.submitted}/>
                            </div>
                        </Collapse>
                        <Collapse in={this.collapse_explore_flag} >
                            <div >
                                <h1>Explore</h1>
                            </div>
                        </Collapse>
                    </Form.Row>
            </div>
        )
    }
}


ProfileReader.propTypes = {
    title: PropTypes.string.isRequired,
    disabled: PropTypes.bool.isRequired,
    type: PropTypes.string.isRequired,
    setEntity: PropTypes.func.isRequired
  }



export default ProfileReader