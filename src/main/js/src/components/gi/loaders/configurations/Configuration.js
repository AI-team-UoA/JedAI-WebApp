import React, {Component} from 'react';
import axios from "axios";
import {Alert, Button,Col, Collapse, Form, FormCheck, Jumbotron, Spinner} from "react-bootstrap/";
import PropTypes from "prop-types";
import CsvConfiguration from "./CsvConfiguration";
import RdfJsonConfiguration from "./RdfJsonConfiguration";
import SerializedConfiguration from "./SerializedConfiguration";

class Configuration extends Component {
    constructor(...args) {
        super(...args);
        this.disabled = true
        this.onChange = this.onChange.bind(this)
        this.collapse_error_message = false
        this.error_message = "Failed to read the input file!"

        this.state = {
            configuration: null,
            source: "",
            browsing: true,
            showSpinner: false
        }
    }

    flipURLSwitch = (e) => {
        let flipped =  !this.state.browsing
        this.setState({browsing: flipped})
    }

    onChange(conf_state, isDisable) {
        this.disabled = isDisable
        this.setState({configuration: conf_state});
        this.collapse_conf_flag = false;
    }

    onSubmit = (e) => {

        this.setState({showSpinner: true})

        //calculate and return msg to profileReader
        e.preventDefault()
        let text_area_msg, conf, file = null
        this.collapse_error_message = false
        this.error_message = "Failed to read the input file!"
        switch(this.props.filetype) {
            case "CSV":
                text_area_msg = this.state.configuration === null? "" :
                    "\nFile: " +  this.state.configuration.filename  +
                    "\nAttributes in first row: " + this.state.configuration.first_row +
                    "\nSeparator: " + this.state.configuration.separator +
                    "\nID index: " + this.state.configuration.id_index +
                    "\nGeometry index: " + this.state.configuration.geometry_index
                conf = {
                    entity_id: this.props.entity_id,
                    filetype: this.props.filetype,
                    filename : this.state.configuration.filename,
                    first_row: this.state.configuration.first_row,
                    separator: this.state.configuration.separator,
                    id_index: this.state.configuration.id_index,
                    geometry_index: this.state.configuration.geometry_index
                }
                file = this.state.configuration.file
                break;
            case "RDF/JSON":
                text_area_msg = this.state.configuration === null? "" :
                    "\nFile: " +  this.state.configuration.filename+"\nPrefix: " + this.state.configuration.prefix
                conf = {
                    entity_id: this.props.entity_id,
                    filetype: this.props.filetype,
                    filename: this.state.configuration.filename,
                    prefix: this.state.configuration.prefix
                }
                file = this.state.configuration.file
                break;
            default:
                text_area_msg = this.state.configuration === null? "" :
                    "\nFile: " +  this.state.configuration.filename
                conf = {
                    entity_id: this.props.entity_id,
                    filetype: this.props.filetype,
                    filename: this.state.configuration.filename,
                }
                file = this.state.configuration.file
                break;
        }
        const formData = new FormData();
        formData.append("file", file)
        let postPath = "/sequential/geospatialInterlinking/read/setConfigurationWithFile"
        formData.append("json_conf", JSON.stringify(conf))
        axios({
            url: postPath,
            method: 'POST',
            data: formData
        }).then(res => {
            let result = res.data
            if (result === "SUCCESS"){
                this.setState({source: result})
                this.props.submitted(this.state, text_area_msg)
                this.setState({showSpinner: false})
            }
            else{
                this.collapse_error_message = true
                this.error_message = "Failed to read the input file!\n"+result
                this.setState({showSpinner: false})
                this.forceUpdate()
            }
        });
    }


    render() {
        let spinner = <div/>
        if (this.state.showSpinner)
            spinner=
                <div>
                    <br/>
                    <br/>
                    <div style={{display: 'flex', justifyContent:'center', alignItems:'center'}}>
                        <Spinner style={{color:"#0073e6"}} animation="grow" />
                        <div style={{marginLeft:"10px", display:"inline"}}>
                            <h3 style={{marginRight:'20px', color:"#0073e6", display:'inline'}}>
                                Loading Data
                            </h3>
                        </div>
                    </div>
                </div>

        let configureSource
        switch(this.props.filetype) {
            case "CSV":
                configureSource =  <CsvConfiguration  onChange={this.onChange} entity_id={this.props.entity_id}  browsing={this.state.browsing}/>
                break;
            case "RDF/JSON":
                configureSource = <RdfJsonConfiguration onChange={this.onChange} entity_id={this.props.entity_id} browsing={this.state.browsing}/>
                break;
            default:
                configureSource = <SerializedConfiguration filetype={this.props.filetype} onChange={this.onChange} entity_id={this.props.entity_id} browsing={this.state.browsing}/>
                break;
        }

        const empty_col = 1
        const first_col = 4
        const second_col = 6

        let browsingSwitch = <FormCheck
                name="browsingSwitch"
                id={this.props.entity_id+"Switch"}
                type="switch"
                checked={!this.state.browsing}
                onChange={this.flipURLSwitch}
                label="Enable/Disable URL"
            />

        return (
            <Jumbotron style={{backgroundColor:"white", border:"groove", width:"85%" }}>
                <div style={{margin:"auto"}}>
                    <Form>
                        {configureSource}

                        <Form.Row className="form-row">

                            <Col sm={empty_col} />
                            <Col sm={first_col} />
                            <Col sm={second_col}>
                                {browsingSwitch}
                            </Col>
                        </Form.Row>
                        <Collapse in={this.collapse_error_message } >
                            <div style={{width:'75%', margin:'auto'}}>
                                <Alert variant="danger" >
                                    {this.error_message}
                                </Alert>
                            </div>
                        </Collapse>

                        <div style={{textAlign: 'center',  marginTop: '30px'}}>
                            <Button type="submit" onClick={this.onSubmit} disabled={this.disabled}>Save Configuration</Button>
                        </div>
                    </Form>
                </div>
                {spinner}
            </Jumbotron>
        )
    }
}

Configuration.propTypes = {
    filetype: PropTypes.string.isRequired,
    submitted: PropTypes.func.isRequired,
    entity_id:  PropTypes.string.isRequired
}

export default Configuration;