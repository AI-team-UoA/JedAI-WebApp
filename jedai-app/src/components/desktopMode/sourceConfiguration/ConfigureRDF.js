import React, {  Component } from 'react'
import PropTypes from 'prop-types';
import {Form, Col, Button, InputGroup, FormControl} from 'react-bootstrap/'
import "../../../css/main.css"


/**
 * Configurations of CSV files
 */
 
class ConfigureRDF extends Component {

    constructor(...args) {
        super(...args);

        this.state={
            file: null,
            filename : "",
            excluded_attr : ""
        }

    }

    onChange = (e) => {
        
        if(e.target.name === "file"){
            var file = e.target.files[0]
            this.setState({file:file, filename: file.name}, () =>{
                var isDisabled = this.state.filename === ""
                this.props.onChange(this.state, isDisabled)})         
        }
        else{
            this.setState({[e.target.name]: e.target.value}, () =>{
                var isDisabled = this.state.filename === "" 
                this.props.onChange(this.state, isDisabled)
            })   
        }
    }
            
    render() {
        return (

            <div>
                <div style ={{textAlign:'center'}}>
                    <h3>RDF Reader</h3>
                    <p>Please configure the method's parameter below</p>
                </div>
                
                <Form.Row className="form-row">
                    <Col sm={3}>
                        <Form.Label> File Path </Form.Label> 
                    </Col>
                    <Col sm={6}>
                        <InputGroup >
                            <FormControl
                                placeholder=".nt"
                                aria-label=".nt"
                                aria-describedby="basic-addon2"
                                name="filename"
                                value={this.state.filename}
                                onChange={this.onChange}
                                readOnly
                            />
                        
                            <div  className="upload-btn-wrapper" style={{cursor:'pointer'}}>
                                <Button >Browse</Button>
                                <FormControl type="file" name="file" onChange={this.onChange}/>
                            </div>
                        </InputGroup>
                    </Col>
                </Form.Row>

                <Form.Row className="form-row">
                    <Col sm={3} >
                        <Form.Label >Attributes to Exclude</Form.Label> 
                    </Col>
                    <Col sm={6}>
                        <FormControl 
                            type="text" 
                            name="excluded_attr" 
                            value={this.state.excluded_attr} 
                            onChange={this.onChange}
                        />
                    </Col>
                </Form.Row>            
            </div>
        )
    }
}

ConfigureRDF.propTypes = {
    onChange: PropTypes.func.isRequired
}

export default ConfigureRDF