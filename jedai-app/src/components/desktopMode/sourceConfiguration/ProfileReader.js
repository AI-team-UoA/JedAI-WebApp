import React, { Component } from 'react'
import PropTypes from 'prop-types';
import {Form, Col, Button, Collapse} from 'react-bootstrap/'
import ConfigureCSV from './ConfigureCSV'


class ProfileReader extends Component {


    constructor(...args) {
        super(...args);
        this.onClick = this.onClick.bind(this);
        this.setConfiguration = this.setConfiguration.bind(this)

        this.collapse_conf = false;
        this.collapse_explore = false;
        this.dataIsSet = false;
        
        this.state = { 
            entity_id: this.props.entity_id,
            filetype : "",
            configuration: null
        }
        
    }

    onChange = (e) => {
        this.setState({[e.target.name]: e.target.value, configuration: null})
        if(this.state.filetype === ""){
            this.collapse_conf = false;
            this.collapse_explore = false;
        }
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

    setConfiguration = (conf) => {
        
        let {configuration} = this.state;
        configuration = conf;
        this.setState({configuration});
        this.collapse_conf = false;
    }


    render() {
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

        var text_area_msg = this.state.filetype === ""? "" : "Source: " + this.state.filetype
        text_area_msg = this.state.configuration === null? text_area_msg+"" : text_area_msg+"\nFile: " +  this.state.configuration.filepath  +"\nAtributes in firts row: " + this.state.configuration.first_row + "\nSeperator: " + this.state.configuration.seperator + "\nID index: "+ this.state.configuration.id_index
        

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
                            <Form.Group >
                                <Form.Control as="textarea" rows="3" readOnly={true} value={text_area_msg}/>
                            </Form.Group>
                        </Col>
                    </Form.Row>
                    <Form.Row>
                        <Collapse in={this.collapse_conf} >
                            <div style={{width:'80%', margin:'auto'}}>
                                <ConfigureCSV  setConfiguration={this.setConfiguration}/>
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


ProfileReader.propTypes = {
    entity_id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    disabled: PropTypes.bool.isRequired,
    type: PropTypes.string.isRequired
  }


export default ProfileReader