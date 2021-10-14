import React, {  Component } from 'react'
import PropTypes from 'prop-types';
import {Form, Col, Button, InputGroup, FormControl, ListGroup} from 'react-bootstrap/'
import Checkbox from 'react-simple-checkbox';
import '../../../../../../../resources/static/css/main.css'


/**
 * Configurations of CSV files
 */
 
class ConfigureCSV extends Component {

    constructor(...args) {
        super(...args);
        this.excluded_attr_value =""
        this.state={
            file: null,
            filename : "",
            first_row : true,
            separator : ",",
            id_index : 0,
            excluded_attr : []
        }

    }

    


    onChange = (e) => {
        
        if(e.target.name === "file"){
            var file = e.target.files[0]
            if (file == null){
                this.setState({file:null, filename: ""}, () =>{
                    var isDisabled = this.state.filename === "" || this.state.separator === "" || this.state.id_index === "" || isNaN(this.state.id_index)
                    this.props.onChange(this.state, isDisabled)})         
            }
            else{
                this.setState({file:file, filename: file.name}, () =>{
                    var isDisabled = this.state.filename === "" || this.state.separator === "" || this.state.id_index === "" || isNaN(this.state.id_index)
                    this.props.onChange(this.state, isDisabled)})         
            }
        }
        else{
            this.setState({[e.target.name]: e.target.value}, () =>{
                var isDisabled = this.state.filename === "" || this.state.separator === "" || this.state.id_index === "" || isNaN(this.state.id_index)
                this.props.onChange(this.state, isDisabled)
            })   
        }
    }
    
    handleCheckbox = () =>   this.setState({first_row: !this.state.first_row})

    // insert value to the exclude text area
    excludedAttr_change = (e) => {
        this.excluded_attr_value = e.target.value
        this.forceUpdate()
    }

    // add element to exclude list
    addExcludedItem = (e) => {
        var value = this.excluded_attr_value
        if(!isNaN(value) && value !== ""){

            var id = parseInt(this.excluded_attr_value)
            var exist = false
            this.state.excluded_attr.forEach((item_id) => {
                if (item_id === id)
                    exist = true
            })
            if (!exist && id !== "")
                this.setState({ excluded_attr: [...this.state.excluded_attr, id] }, () => {
                    var isDisabled = this.state.filename === "" || this.state.separator === "" || this.state.id_index === "" || isNaN(this.state.id_index)
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
                    var isDisabled = this.state.filename === "" || this.state.separator === "" || this.state.id_index === "" || isNaN(this.state.id_index)
                    this.props.onChange(this.state, isDisabled)});
        })        
    }
    
    render() {
        const empty_col = 1
        const first_col = 4
        const second_col = 6

        if (this.props.entity_id != "3"){
        var conf = 
                <div>
                <Form.Row className="form-row">
                <Col sm={empty_col} />
                <Col sm={first_col} >
                    <Form.Label >Id index</Form.Label> 
                </Col>
                <Col sm={second_col}>
                    <FormControl 
                        type="text" 
                        name="id_index" 
                        value={this.state.id_index} 
                        onChange={this.onChange}
                        isInvalid={isNaN(this.state.id_index) || this.state.id_index === "" }
                    />
                </Col>
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
    }
    else{ var conf = <div/> }

        return (
            <div>
                <div style ={{textAlign:'center'}}>
                    <h3>CSV Reader</h3>
                    <p>Please configure the method's parameter below</p>
                </div>
                <br/>
                <div >
                    
                    <Form.Row className="form-row">
                        <Col sm={empty_col} />
                        <Col sm={first_col}>
                            <Form.Label> File Path </Form.Label> 
                        </Col>
                        <Col sm={second_col}>
                            <InputGroup >
                                <FormControl
                                    placeholder=".csv"
                                    aria-label=".csv"
                                    aria-describedby="basic-addon2"
                                    name="filename"
                                    value={this.state.filename}
                                    onChange={this.onChange}
                                    readOnly = {this.props.browsing}
                                />
                            
                                <div  className="upload-btn-wrapper" style={{cursor:'pointer'}}>
                                    <Button >Browse</Button>
                                    <FormControl type="file" name="file" onChange={this.onChange} disabled={!this.props.browsing}/>
                                </div>
                            </InputGroup>
                        </Col>
                    </Form.Row>

                    <Form.Row className="form-row">
                        <Col sm={empty_col} />
                        <Col sm={first_col}>
                            <Form.Label>Attributes names in first row</Form.Label> 
                        </Col>
                        <Checkbox 
                            as={Col}
                            size="3"  
                            color="#1a75ff"
                            borderThickness="2" 
                            name="first_row" 
                            value={this.state.first_row} 
                            checked={this.state.first_row} 
                            onChange={this.handleCheckbox.bind(this)}
                        />
                        
                    </Form.Row>

                    <Form.Row className="form-row">
                        <Col sm={empty_col} />
                        <Col sm={first_col} >
                            <Form.Label>Seperator</Form.Label> 
                        </Col>
                        <Col sm={second_col}>
                            <FormControl 
                                type="text" 
                                name="separator" 
                                value={this.state.separator} 
                                onChange={this.onChange}
                                isInvalid={this.state.separator === ""}
                            />
                        </Col>
                    </Form.Row>

                    {conf}
                </div>



            </div>
        )
    }
}





ConfigureCSV.propTypes = {
    onChange: PropTypes.func.isRequired,
    entity_id: PropTypes.string.isRequired,
    browsing: PropTypes.bool.isRequired
  }

export default ConfigureCSV