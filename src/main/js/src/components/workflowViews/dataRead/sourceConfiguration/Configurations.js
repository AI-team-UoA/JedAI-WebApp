import React, {  Component } from 'react'
import PropTypes from 'prop-types';
import {Jumbotron, Form, Button, Alert, Collapse } from 'react-bootstrap/'
import axios from 'axios';
import ConfigureCSV from './ConfigureCSV'
import ConfigureRDB from './ConfigureRDB'
import ConfigureRDF from './ConfigureRDF'
import ConfigureXML from './ConfigureXML'
import ConfigureSerialized from './ConfigureSerialized'
import '../../../../../../resources/static/css/main.css'


/**
 * Configurations of CSV files
 */
 
class Configurations extends Component {

    constructor(...args) {
        super(...args);
        this.disabled = true
        this.onChange = this.onChange.bind(this)
        this.collapse_flag = false
        this.state = { 
            configuration: null,
            source: ""
        }
    }


    onChange(conf_state, isDisable) {
        this.disabled = isDisable
        this.setState({configuration: conf_state});
        this.collapse_conf_flag = false;
    } 
    
    onSubmit = (e) => {
        
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
        // Form the data that will be sent to server
        var json_conf= JSON.stringify(conf)
        const formData = new FormData();
        formData.append("file", file)
        formData.append("json_conf", JSON.stringify(conf))
        axios({
            url: '/desktopmode/dataread/set',
            method: 'POST',
            data: formData 
        }).then(res => {
            var result = res.data
            
            if (result !== ""){
                this.setState({source: result})
                this.props.submitted(this.state, text_area_msg)
            }
            else{
                this.collapse_flag = true
                this.forceUpdate()
                }
        });

    }

    render() {
        var configureSource
        switch(this.props.filetype) {
            case "CSV":
                configureSource =  <ConfigureCSV  onChange={this.onChange} entity_id={this.props.entity_id}/>
                break;
            case "Database":
                configureSource  = <ConfigureRDB  onChange={this.onChange}/>
                break;
            case "RDF":
                configureSource = <ConfigureRDF  onChange={this.onChange} />
                break;
            case "XML":
                configureSource = <ConfigureXML  onChange={this.onChange} />
                break;
            case "Serialized":
                configureSource = <ConfigureSerialized onChange={this.onChange} />
                break;
            default:
                configureSource = <div />
        }

        return (

            <Jumbotron style={{backgroundColor:"white", border:"groove", width:"70%" }}>
                <div style={{margin:"auto"}}>
                    <Form>
                        {configureSource}
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