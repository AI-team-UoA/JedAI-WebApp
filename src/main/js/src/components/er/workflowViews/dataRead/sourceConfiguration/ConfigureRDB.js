import React, {  Component } from 'react'
import PropTypes from 'prop-types';
import {Form, Col, FormControl, Button, InputGroup, ListGroup} from 'react-bootstrap/'
import Checkbox from 'react-simple-checkbox';
import '../../../../../../../resources/static/css/main.css'


/**
 * Configurations of CSV files
 */
 
class ConfigureRDB extends Component {

    constructor(...args) {
        super(...args);
        this.excluded_attr_value =""
        this.state={
            url : "",
            table : "",
            username : "",
            password : "",
            ssl: true,
            excluded_attr : []
        }

    }

    onChange = (e) => {
        this.setState({[e.target.name]: e.target.value}, () =>{
            var isDisabled = this.state.url === "" || this.state.table === "" || this.state.username === "" || this.state.password === "" 
            this.props.onChange(this.state, isDisabled)
        })   
    }
    
    handleCheckbox = () =>   this.setState({ssl: !this.state.ssl})

    // insert value to the exclude text area
    excludedAttr_change = (e) => {
        this.excluded_attr_value = e.target.value
        this.forceUpdate()
    }

    // add element to exclude list
    addExcludedItem = (e) => {
        var id = ""
        if(!isNaN(this.excluded_attr_value)){

            id = parseInt(this.excluded_attr_value)
            var exist = false
            this.state.excluded_attr.forEach((item_id) => {
                if (item_id === id)
                    exist = true
            })
            if (!exist && id !== "")
                this.setState({ excluded_attr: [...this.state.excluded_attr, id] }, () =>{
                    var isDisabled = this.state.url === "" || this.state.table === "" || this.state.username === "" || this.state.password === "" 
                    this.props.onChange(this.state, isDisabled)
                })
        }
        
        this.excluded_attr_value = ""
        this.forceUpdate()
    }

    //remove element from exclude list
    removeExcludedItem = (id, e) =>{
        var excluded = [...this.state.excluded_attr];
        excluded.forEach((item_id, index) => {
            if (item_id === id)
                excluded.splice(index, 1);
                this.setState({excluded_attr: excluded}, () =>{
                    var isDisabled = this.state.url === "" || this.state.table === "" || this.state.username === "" || this.state.password === "" 
                    this.props.onChange(this.state, isDisabled)}
                );
        })        
    }

    render() {

        const empty_col = 1
        const first_col = 3
        const second_col = 6

        return (
            <div>
                <div style ={{textAlign:'center'}}>
                    <h3>Database Reader</h3>
                    <p>Please configure the method's parameter below</p>
                </div>
                <div>
                    <Form.Row className="form-row">
                    <Col sm={empty_col} />
                        <Col sm={first_col}>
                            <Form.Label> URL </Form.Label> 
                        </Col>
                        <Col sm={second_col}>
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
                        <Col sm={empty_col} />
                        <Col sm={first_col}>
                            <Form.Label> Table </Form.Label> 
                        </Col>
                        <Col sm={second_col}>
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
                        <Col sm={empty_col} />
                        <Col sm={first_col}>
                            <Form.Label> Username </Form.Label> 
                        </Col>
                        <Col sm={second_col}>
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
                        <Col sm={empty_col} />
                        <Col sm={first_col}>
                            <Form.Label> Password </Form.Label> 
                        </Col>
                        <Col sm={second_col}>
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
                        <Col sm={empty_col} />
                        <Col sm={first_col}>
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

                    <Form.Row className="form-row">
                        <Col sm={empty_col} />  
                        <Col sm={first_col} >
                            <Form.Label >Attributes to Exclude</Form.Label> 
                        </Col>
                        <Col sm={second_col}>
                            <InputGroup >
                                <FormControl 
                                    type="text" 
                                    name="excluded_attr"   
                                    aria-describedby="basic-addon2" 
                                    disabled={this.state.url === "" || this.state.table === ""}   
                                    value={this.excluded_attr_value}
                                    onChange={this.excludedAttr_change}                     
                                />
                                <div  className="upload-btn-wrapper" style={{cursor:'pointer'}}>
                                    <Button disabled={this.state.filename === ""} onClick={this.addExcludedItem}>Add</Button>
                                </div>
                            </InputGroup>
                        </Col>
                    </Form.Row>
                    <Form.Row className="form-row">
                        <Col sm={empty_col} />
                        <Col sm={first_col} />
                        <Col sm={second_col}>
                            <ListGroup>
                                {this.state.excluded_attr.map((attr, index) => (<ListGroup.Item key={index}> 
                                    <span style={{color:"#990000"}}>Exclude Item with ID: </span>{attr} <Button onClick={this.removeExcludedItem.bind(this, attr)} className="X_btnStyle">X</Button></ListGroup.Item>))}
                            </ListGroup>                        
                        </Col>
                    </Form.Row>
                </div>       
            </div>
        )
    }
}

ConfigureRDB.propTypes = {
    onChange: PropTypes.func.isRequired
}


export default ConfigureRDB