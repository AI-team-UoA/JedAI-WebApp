import React, {Component} from 'react';
import {Button, Col, Form, FormControl, InputGroup, Collapse} from "react-bootstrap/";
import PropTypes from "prop-types";
import Configuration from "./Configuration";

class GeometryLoader extends Component {
    constructor(...args) {
        super(...args);
        this.onClick = this.onClick.bind(this);
        this.submitted = this.submitted.bind(this)
        this.emptyConfiguration = this.emptyConfiguration.bind(this)

        this.collapse_conf_flag = false;
        this.collapse_explore_flag = false;
        this.text_area_msg = ""
        this.explorer_get_geometries = false

        if (this.props.state !== null){
            this.state = {
                entity_id: this.props.entity_id,
                filetype : this.props.state.filetype,
                source : this.props.state.source,
                configurations: this.props.state.configurations
            }
            this.explorer_get_geometries = true
            var msg
            switch(this.state.filetype) {
                case "CSV":
                    msg = this.state.configurations === null? "" : "\nFile: " +  this.state.configurations.filename  +
                        "\nAtributes in firts row: " + this.state.configurations.first_row + "\nSeperator: " +
                        this.state.configurations.separator +
                        "\nID index: "+ this.state.configurations.id_index +
                        "\nGeometry index: "+ this.state.configurations.geometry_index
                    break;
                case "RDF":
                    msg = this.state.configurations === null? "" : "\nFile: " +  this.state.configurations.filename +
                        "\nGeometry index: "+ this.state.configurations.geometry_predicate
                    break;
                default:
                    msg = ""
            }
            this.text_area_msg = "Source: " + this.state.filetype + msg
        }
        else{
            this.state = {
                entity_id: this.props.entity_id,
                filetype : "",
                source : "",
                configurations: null
            }
        }

    }

    // in case the dataread component change the state back to null
    // in case the profileReader is the ground truth and the user changed
    // an entity profile after had set the ground truth
    componentDidUpdate(){
        if (this.props.state === null && this.state.configurations !== null){
            this.emptyConfiguration()
        }
    }

    // activated only by the filetype handler.
    // it also cleans the configurations
    changeFiletype = (e) => {
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
    submitted = (conf_state, msg) => {
        this.text_area_msg = "Source: " + this.state.filetype + msg
        this.collapse_conf_flag = false;
        //tell explorer to empty your data
        this.explorer_get_geometries = false
        var temp_state = {source: conf_state.source, configurations: conf_state.configuration, filetype: this.state.filetype}
        this.props.setEntity(this.state.entity_id, temp_state)
        this.setState({source: conf_state.source, configurations: conf_state.configuration} )
        //tell explorer to fetch (probably new) data
        this.explorer_get_geometries = true

    }

    // Empty configurations and hide collapses
    emptyConfiguration(){
        this.text_area_msg = "";
        if (this.state.filetype !== ""){
            this.setState({filetype : "", source : "", configurations: null});
            this.props.setEntity(this.state.entity_id, null)
        }
        this.collapse_conf_flag = false;
        this.collapse_explore_flag = false;
        this.explorer_get_geometries = false;
    }


    render() {

        if(this.props.disabled)
            this.emptyConfiguration()

        let control_options = <Form.Control
                as="select"
                placeholder="Select Filetype"
                name="filetype"
                value={this.state.filetype}
                onChange={this.changeFiletype}
                disabled={this.props.disabled}

            >
                <option value="" />
                <option value="CSV" >CSV</option>
                <option value="RDF" >RDF</option>
            </Form.Control>;

        return (
            <div>
                <Form.Row>
                    <Col lg={1}>
                        <Form.Label ><h5>{this.props.title}</h5></Form.Label>
                    </Col>
                    <Col lg={3}>
                        <Form.Group>
                            {control_options}
                        </Form.Group>
                    </Col>
                    <Col lg={3}>
                        <Form.Group>
                            <Button style={{display:'inline-block', marginRight:"5px"}} name="conf_btn" disabled={this.state.filetype === ""} onClick={this.onClick}>Configure</Button>
                            <Button  name="explore_btn" disabled={this.state.configurations === null} onClick={this.onClick}>Explore</Button>
                        </Form.Group>
                    </Col>
                     <Col>
                        <Form.Group>
                            <Form.Control as="textarea" rows="3" readOnly={true} value={this.text_area_msg}/>
                        </Form.Group>
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Collapse in={this.collapse_conf_flag} >
                        <div style={{width:'75%', margin:'auto'}}>
                            <Configuration entity_id={this.props.entity_id} filetype={this.state.filetype} submitted={this.submitted} />
                        </div>
                    </Collapse>
                    <Collapse in={this.collapse_explore_flag} >
                        <div style={{width:'75%', margin:'auto'}}>
                            <h1>Explore</h1>
                        </div>
                    </Collapse>
                </Form.Row>
            </div>
        )
    }
}

GeometryLoader.propTypes = {
    title: PropTypes.string.isRequired,
    entity_id: PropTypes.string.isRequired,
    setEntity: PropTypes.func.isRequired
}

export default GeometryLoader;