import React, {  Component } from 'react'
import PropTypes from 'prop-types';
import {Jumbotron, Form, Col, Button, FormControl} from 'react-bootstrap/'
import Checkbox from 'react-simple-checkbox';
import "../../../css/main.css"


/**
 * Configurations of CSV files
 */
 
class ConfigureRDB extends Component {

    constructor(...args) {
        super(...args);
        this.handleConfiguration = this.handleConfiguration.bind(this)

        this.state={
            url : "",
            table : "",
            username : "",
            password : "",
            ssl: true,
            excluded_attr : ""
        }

    }

    onChange = (e) => this.setState({[e.target.name]: e.target.value})
    
    handleCheckbox = () =>   this.setState({ssl: !this.state.ssl})

    // Send data back to profileReader (father component)
    handleConfiguration = (e) => this.props.setConfiguration(this.state)
        
    render() {
        return (

            <Jumbotron style={{backgroundColor:"white", border:"groove" }}>
                <div>
                    <div style ={{textAlign:'center'}}>
                        <h3>Database Reader</h3>
                        <p>Please configure the method's parameter below</p>
                    </div>
                    
                    <Form.Row className="form-row">
                        <Col sm={3}>
                            <Form.Label> URL </Form.Label> 
                        </Col>
                        <Col sm={6}>
                            <FormControl 
                                    type="text" 
                                    name="ulr" 
                                    value={this.state.url} 
                                    onChange={this.onChange}
                                />
                        </Col>
                    </Form.Row>

                    <Form.Row className="form-row">
                        <Col sm={3}>
                            <Form.Label> Table </Form.Label> 
                        </Col>
                        <Col sm={6}>
                            <FormControl 
                                    type="text" 
                                    name="table" 
                                    value={this.state.table} 
                                    onChange={this.onChange}
                                />
                        </Col>
                    </Form.Row>

                    <Form.Row className="form-row">
                        <Col sm={3}>
                            <Form.Label> Password </Form.Label> 
                        </Col>
                        <Col sm={6}>
                            <FormControl 
                                    type="password" 
                                    name="password" 
                                    value={this.state.password} 
                                    onChange={this.onChange}
                                />
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

                    <Form.Row className="form-row">
                        <Col sm={3}>
                            <Form.Label>SSL</Form.Label> 
                        </Col>
                        <Checkbox 
                            as={Col}
                            size="3"  
                            color="#1a75ff"
                            borderThickness="2" 
                            name="ssl" 
                            value={this.state.ssl} 
                            checked={this.state.ssl} 
                            onChange={this.handleCheckbox.bind(this)}
                        />
                        
                    </Form.Row>

                    <div style={{textAlign: 'center',  marginTop: '30px'}}>
                        <Button onClick={this.handleConfiguration} disabled={this.state.filepath === ""}>Save Configuration</Button>
                    </div>
                
                </div>
                
            </Jumbotron>
        )
    }
}


ConfigureRDB.propTypes = {
    setConfiguration: PropTypes.func.isRequired
  }


export default ConfigureRDB