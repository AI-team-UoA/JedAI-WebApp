import React, {  Component } from 'react'
import PropTypes from 'prop-types';
import {Jumbotron, FormCheck, Col, Form, Button, Alert, Collapse, Spinner } from 'react-bootstrap/'
import axios from 'axios';
import ConfigureCSV from './ConfigureCSV'
import ConfigureRDB from './ConfigureRDB'
import ConfigureRDF from './ConfigureRDF'
import ConfigureXML from './ConfigureXML'
import ConfigureSerialized from './ConfigureSerialized'
import '../../../../../../../resources/static/css/main.css'


/**
 * Configurations 
 */
 
class Configurations extends Component {

    constructor(...args) {
        super(...args);
        this.disabled = true
        this.onChange = this.onChange.bind(this)
        this.collapse_flag = false
        this.state = { 
            configuration: null,
            source: "",
            browsing: true,
            showSpinner: false
        }
    }

    flipURLSwitch = (e) => {
        var flipped =  !this.state.browsing
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
        var text_area_msg, conf, file = null
        this.collapse_flag =false
        switch(this.props.filetype) {
            case "CSV":
                text_area_msg = this.state.configuration === null? "" : "\nFile: " +  this.state.configuration.filename  +"\nAtributes in firts row: " + this.state.configuration.first_row + "\nSeperator: " + this.state.configuration.separator + "\nID index: "+ this.state.configuration.id_index
                conf = {
                    excluded_attr: this.state.configuration.excluded_attr,
                    entity_id: this.props.entity_id,
                    filetype: this.props.filetype,
                    filename : this.state.configuration.filename,
                    first_row: this.state.configuration.first_row,
                    separator: this.state.configuration.separator,
                    id_index: this.state.configuration.id_index
                }
                file = this.state.configuration.file
                break;
            case "Database":
                text_area_msg = this.state.configuration === null? "" : "\nURL: " +  this.state.configuration.url  +"\nTable: " + this.state.configuration.table + "\nUsername: " + this.state.configuration.username + "\nSSL: "+ this.state.configuration.ssl
                conf = {
                    excluded_attr: this.state.configuration.excluded_attr,
                    entity_id: this.props.entity_id,
                    filetype: this.props.filetype,
                    url: this.state.configuration.url,
                    table: this.state.configuration.table,
                    username: this.state.configuration.username,
                    ssl: this.state.configuration.ssl
                }
                break;
            case "RDF":
                text_area_msg = this.state.configuration === null? "" : "\nFile: " +  this.state.configuration.filename
                conf = {
                    excluded_attr: this.state.configuration.excluded_attr,
                    entity_id: this.props.entity_id,
                    filetype: this.props.filetype,
                    filename: this.state.configuration.filename
                }
                file = this.state.configuration.file
                break;
            case "XML":
                text_area_msg = this.state.configuration === null? "" : "\nFile: " +  this.state.configuration.filename  
                conf = {
                    excluded_attr: this.state.configuration.excluded_attr,
                    entity_id: this.props.entity_id,
                    filetype: this.props.filetype,
                    filename: this.state.configuration.filename
                }
                file = this.state.configuration.file
                break;
            case "Serialized":
                text_area_msg = this.state.configuration === null? "" : "\nFile: " +  this.state.configuration.filename  
                conf = {
                    excluded_attr: this.state.configuration.excluded_attr,
                    entity_id: this.props.entity_id,
                    filetype: this.props.filetype,
                    filename: this.state.configuration.filename
                }
                file = this.state.configuration.file
                break;
            default:
                text_area_msg = ""
                conf = null
        }
        
        const formData = new FormData();
        var postPath = "setConfiguration"
        if (file != null){
            formData.append("file", file)
            postPath = "setConfigurationWithFile"
        } 
        formData.append("json_conf", JSON.stringify(conf))
        axios({
            url: '/desktopmode/dataread/' + postPath,
            method: 'POST',
            data: formData 
        }).then(res => {
            var result = res.data
            
            if (result !== ""){
                this.setState({source: result})
                this.props.submitted(this.state, text_area_msg)
                this.setState({showSpinner: false})
            }
            else{
                this.collapse_flag = true
                this.setState({showSpinner: false})
                this.forceUpdate()
                }
        });

    }

    render() {

        var spinner = <div/>
        if (this.state.showSpinner)
            spinner= 
                <div>
                    <br/>
                    <br/>
                    <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
                        <Spinner style={{color:"#0073e6"}} animation="grow" />
                        <div style={{marginLeft:"10px", display:"inline"}}>
                            <h3 style={{marginRight:'20px', color:"#0073e6", display:'inline'}}>
                               Loading Data
                            </h3>
                        </div>
                    </div>
                </div>

        var configureSource
        switch(this.props.filetype) {
            case "CSV":
                configureSource =  <ConfigureCSV  onChange={this.onChange} entity_id={this.props.entity_id}  browsing={this.state.browsing}/>
                break;
            case "Database":
                configureSource  = <ConfigureRDB  onChange={this.onChange}  entity_id={this.props.entity_id} />
                break;
            case "RDF":
                configureSource = <ConfigureRDF  onChange={this.onChange}  entity_id={this.props.entity_id} browsing={this.state.browsing}/>
                break;
            case "XML":
                configureSource = <ConfigureXML  onChange={this.onChange}  entity_id={this.props.entity_id} browsing={this.state.browsing}/>
                break;
            case "Serialized":
                configureSource = <ConfigureSerialized onChange={this.onChange}  entity_id={this.props.entity_id} browsing={this.state.browsing} />
                break;
            default:
                configureSource = <div />
        }

        const empty_col = 1
        const first_col = 4
        const second_col = 6

        var browsingSwitch = <div />

        if (this.props.filetype != "Database")
            browsingSwitch = <FormCheck 
                    name="browsingSwitch"
                    id={this.props.entity_id+"Switch"}
                    type="switch"
                    checked={!this.state.browsing}
                    onChange={this.flipURLSwitch}
                    label="Enable/Disable URL"
                    />
       
        return (

            <Jumbotron style={{backgroundColor:"white", border:"groove", width:"70%" }}>
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
                        <Collapse in={this.collapse_flag } >
                            <div style={{width:'75%', margin:'auto'}}>
                                <Alert variant="danger" >
                                    Could not read successfully the input file!
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


Configurations.propTypes = {
    filetype: PropTypes.string.isRequired,
    entity_id: PropTypes.string.isRequired,
    submitted: PropTypes.func.isRequired
  }

export default Configurations