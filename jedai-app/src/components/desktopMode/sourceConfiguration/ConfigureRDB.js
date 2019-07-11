import React, {  Component } from 'react'
import PropTypes from 'prop-types';
import {Form, Col, FormControl} from 'react-bootstrap/'
import Checkbox from 'react-simple-checkbox';
import "../../../css/main.css"


/**
 * Configurations of CSV files
 */
 
class ConfigureRDB extends Component {

    constructor(...args) {
        super(...args);
        
        this.state={
            url : "",
            table : "",
            username : "",
            password : "",
            ssl: true,
            excluded_attr : ""
        }

    }

    onChange = (e) => {
        this.setState({[e.target.name]: e.target.value}, () =>{
            var isDisabled = this.state.url === "" || this.state.table === "" || this.state.username === "" || this.state.password === "" 
            this.props.onChange(this.state, isDisabled)
        })   
    }
    
    handleCheckbox = () =>   this.setState({ssl: !this.state.ssl})


    render() {

        return (
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
                                name="url" 
                                value={this.state.url} 
                                onChange={this.onChange}
                                isValid={this.state.url !== ""}
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
                                isValid={this.state.table !== ""}
                            />
                    </Col>
                </Form.Row>

                <Form.Row className="form-row">
                    <Col sm={3}>
                        <Form.Label> Username </Form.Label> 
                    </Col>
                    <Col sm={6}>
                        <FormControl 
                                type="text" 
                                name="username" 
                                value={this.state.username} 
                                onChange={this.onChange}
                                isValid={this.state.username !== ""}
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
                                isValid={this.state.password !== ""}
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
            </div>
        )
    }
}

ConfigureRDB.propTypes = {
    onChange: PropTypes.func.isRequired
}


export default ConfigureRDB