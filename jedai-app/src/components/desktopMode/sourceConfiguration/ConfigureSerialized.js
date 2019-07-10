import React, {  Component } from 'react'
import PropTypes from 'prop-types';
import {Jumbotron, Form, Col, Button, InputGroup, FormControl} from 'react-bootstrap/'
import "../../../css/main.css"


/**
 * Configurations of CSV files
 */
 
class ConfigureSerialized extends Component {

    constructor(...args) {
        super(...args);
        this.handleConfiguration = this.handleConfiguration.bind(this)

        this.state={
            filepath : "",
            excluded_attr : ""
        }

    }

    onChange = (e) => this.setState({[e.target.name]: e.target.value})
    
    // Send data back to profileReader (father component)
    handleConfiguration = (e) => this.props.setConfiguration(this.state)
        
    render() {
        return (

            <Jumbotron style={{backgroundColor:"white", border:"groove" }}>
                <div>
                    <div style ={{textAlign:'center'}}>
                        <h3>Serialization Reader</h3>
                        <p>Please configure the method's parameter below</p>
                    </div>
                    
                    <Form.Row className="form-row">
                        <Col sm={3}>
                            <Form.Label> File Path </Form.Label> 
                        </Col>
                        <Col sm={6}>
                            <InputGroup >
                                <FormControl
                                    aria-describedby="basic-addon2"
                                    name="filepath"
                                    value={this.state.filepath}
                                    onChange={this.onChange}
                                />
                            
                                <div  className="upload-btn-wrapper" style={{cursor:'pointer'}}>
                                    <Button >Browse</Button>
                                    <input type="file" name="filepath" onChange={this.onChange}/>
                                </div>
                            </InputGroup>
                        </Col>
                    </Form.Row>
                    <div style={{textAlign: 'center',  marginTop: '30px'}}>
                        <Button onClick={this.handleConfiguration} disabled={this.state.filepath === ""}>Save Configuration</Button>
                    </div>
                
                </div>
                
            </Jumbotron>
        )
    }
}


ConfigureSerialized.propTypes = {
    setConfiguration: PropTypes.func.isRequired
  }


export default ConfigureSerialized