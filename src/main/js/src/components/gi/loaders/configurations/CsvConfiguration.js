import React, {Component} from 'react';
import {Button, Col, Form, FormControl, InputGroup, ListGroup} from "react-bootstrap/";
import Checkbox from "react-simple-checkbox";
import PropTypes from "prop-types";

class CsvConfiguration extends Component {
    constructor(...args) {
        super(...args);
        this.state={
            file: null,
            filename : "",
            first_row : false,
            separator : "\\t",
            id_index : 1,
            geometry_index : 0,
            browsing : false
        }
    }

    onChange = (e) => {
        if(e.target.name === "file"){
            const file = e.target.files[0];
            this.setState({file:file, filename: file.name}, () =>{
                let isDisabled = this.state.filename === "" || this.state.separator === "" ||
                    this.state.id_index === "" || isNaN(this.state.id_index) ||
                    this.state.geometry_index === "" || isNaN(this.state.geometry_index) ||
                    this.state.file == null;
                this.props.onChange(this.state, isDisabled)
            })
        }
        else{
            this.setState({[e.target.name]: e.target.value}, () =>{
                let isDisabled = this.state.filename === "" || this.state.separator === "" ||
                    this.state.id_index === "" || isNaN(this.state.id_index) ||
                    this.state.geometry_index === "" || isNaN(this.state.geometry_index) ||
                    this.state.file == null;
                this.props.onChange(this.state, isDisabled)
            })
        }
    }

    handleCheckbox = () =>   this.setState({first_row: !this.state.first_row})

    render() {
        const first_col = 4
        return (
            <div>
                <div style ={{textAlign:'center'}}>
                    <h3>CSV Reader</h3>
                    <p>Please configure the method's parameter below</p>
                </div>
                <br/>
                <div >
                    <Form.Row className="form-row">
                        <Col lg={first_col}>
                            <Form.Label> File Path </Form.Label>
                        </Col>
                        <Col>
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
                        <Col lg={first_col}>
                            <Form.Label>Headers in the first line</Form.Label>
                        </Col>
                        <Col>
                            <Checkbox
                                color="#1a75ff"
                                size="3"
                                borderThickness="2"
                                name="first_row"
                                value={this.state.first_row}
                                checked={this.state.first_row}
                                onChange={this.handleCheckbox.bind(this)}
                            />
                        </Col>

                    </Form.Row>

                    <Form.Row className="form-row">
                        <Col lg={first_col} >
                            <Form.Label>Separator</Form.Label>
                        </Col>
                        <Col>
                            <FormControl
                                type="text"
                                name="separator"
                                value={this.state.separator}
                                onChange={this.onChange}
                                isInvalid={this.state.separator === ""}
                            />
                        </Col>
                    </Form.Row>
                    <div>
                        <Form.Row className="form-row">
                            <Col lg={first_col} >
                                <Form.Label >Id index</Form.Label>
                            </Col>
                            <Col>
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
                            <Col lg={first_col} >
                                <Form.Label >Geometry index</Form.Label>
                            </Col>
                            <Col>
                                <FormControl
                                    type="text"
                                    name="id_index"
                                    value={this.state.geometry_index}
                                    onChange={this.onChange}
                                    isInvalid={isNaN(this.state.geometry_index) || this.state.id_index === "" }
                                />
                            </Col>
                        </Form.Row>
                    </div>
                </div>
            </div>
        )
    }
}


CsvConfiguration.propTypes = {
    onChange: PropTypes.func.isRequired
}

export default CsvConfiguration;