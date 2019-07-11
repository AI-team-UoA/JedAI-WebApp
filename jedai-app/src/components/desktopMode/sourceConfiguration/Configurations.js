import React, {  Component } from 'react'
import PropTypes from 'prop-types';
import {Jumbotron, Form, Button } from 'react-bootstrap/'
import ConfigureCSV from './ConfigureCSV'
import ConfigureRDB from './ConfigureRDB'
import ConfigureRDF from './ConfigureRDF'
import ConfigureXML from './ConfigureXML'
import ConfigureSerialized from './ConfigureSerialized'
import "../../../css/main.css"


/**
 * Configurations of CSV files
 */
 
class Configurations extends Component {

    constructor(...args) {
        super(...args);
        this.disabled = true
        this.onChange = this.onChange.bind(this)

        this.state = { 
            configuration: null
        }

    }


    onChange(conf_state, isDisable) {
        this.disabled = isDisable
        let {configuration} = this.state;
        configuration = conf_state;
        this.setState({configuration});
        this.collapse_conf_flag = false;
    } 
    
    onSubmit = (e) => {
        //calculate and return msg to profileReader
        e.preventDefault()
        var text_area_msg
        switch(this.props.filetype) {
            case "CSV":
                text_area_msg = this.state.configuration === null? "" : "\nFile: " +  this.state.configuration.filepath  +"\nAtributes in firts row: " + this.state.configuration.first_row + "\nSeperator: " + this.state.configuration.seperator + "\nID index: "+ this.state.configuration.id_index
                break;
            case "Database":
                text_area_msg = this.state.configuration === null? "" : "\nURL: " +  this.state.configuration.url  +"\nTable: " + this.state.configuration.table + "\nUsername: " + this.state.configuration.username + "\nSSL: "+ this.state.configuration.ssl
                break;
            case "RDF":
                text_area_msg = this.state.configuration === null? "" : "\nFile: " +  this.state.configuration.filepath  
                break;
            case "XML":
                text_area_msg = this.state.configuration === null? "" : "\nFile: " +  this.state.configuration.filepath  
                break;
            case "Serialized":
                text_area_msg = this.state.configuration === null? "" : "\nFile: " +  this.state.configuration.filepath  
                break;
            default:
                text_area_msg = ""
        }
        
        // Post to Server
        this.props.submitted(true, text_area_msg)

        this.setState({ configuration: null})
        
    }

    render() {
        var configureSource
        switch(this.props.filetype) {
            case "CSV":
                configureSource =  <ConfigureCSV  onChange={this.onChange} />
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

            <Jumbotron style={{backgroundColor:"white", border:"groove" }}>
                <div>
                    <Form>
                        {configureSource}
                        
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
    submitted: PropTypes.func.isRequired
  }

export default Configurations