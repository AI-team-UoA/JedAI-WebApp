import React, {  Component } from 'react'
import PropTypes from 'prop-types';
import {Form, Col, Button, InputGroup, FormControl, ListGroup} from 'react-bootstrap/'
import "../../../../css/main.css"


/**
 * Configurations of CSV files
 */
 
class ConfigureXML extends Component {

    constructor(...args) {
        super(...args);
        this.excluded_attr_value =""
        this.state={
            file: null,
            filename : "",
            excluded_attr : []
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
                    var isDisabled = this.state.filename === "" 
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
                    var isDisabled = this.state.filename === "" 
                    this.props.onChange(this.state, isDisabled)
                });
        })        
    }

    render() {
        return (

            <div>
                <div style ={{textAlign:'center'}}>
                    <h3>XML Reader</h3>
                    <p>Please configure the method's parameter below</p>
                </div>
                
                <Form.Row className="form-row">
                    <Col sm={3}>
                        <Form.Label> File Path </Form.Label> 
                    </Col>
                    <Col sm={6}>
                        <InputGroup >
                            <FormControl
                                placeholder=".xml"
                                aria-label=".xml"
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
                        <InputGroup >
                            <FormControl 
                                type="text" 
                                name="excluded_attr"   
                                aria-describedby="basic-addon2" 
                                disabled={this.state.filename === ""}   
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
                    <Col sm={3} />
                    <Col sm={4}>
                        <ListGroup>
                            {this.state.excluded_attr.map((attr, index) => (<ListGroup.Item key={index}> 
                                <span style={{color:"#990000"}}>Exclude Item with ID: </span>{attr} <Button onClick={this.removeExcludedItem.bind(this, attr)} className="X_btnStyle">X</Button></ListGroup.Item>))}
                        </ListGroup>                        
                    </Col>
                </Form.Row>    
            </div>
            
        )
    }
}

ConfigureXML.propTypes = {
    onChange: PropTypes.func.isRequired
}

export default ConfigureXML