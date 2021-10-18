import React, {Component} from 'react';
import {Button, Col, Form, FormControl, InputGroup, ListGroup} from "react-bootstrap/";
import PropTypes from "prop-types";

class RdfJsonConfiguration extends Component {
    constructor(...args) {
        super(...args);
        this.state={
            file: null,
            filename : "",
            prefix : "http://example.com",
            browsing : false
        }
    }

    onChange = (e) => {
        if(e.target.name === "file"){
            const file = e.target.files[0];
            this.setState({file:file, filename: file.name}, () =>{
                let isDisabled = this.state.filename === "" ||  this.state.prefix == null || this.state.file == null;
                this.props.onChange(this.state, isDisabled)
            })
        }
        else{
            this.setState({[e.target.name]: e.target.value}, () =>{
                let isDisabled = this.state.filename === "" ||  this.state.prefix == null || this.state.file == null;
                this.props.onChange(this.state, isDisabled)
            })
        }
    }

    render() {
        const first_col = 4
        return (
            <div>
                <div style ={{textAlign:'center'}}>
                    <h3>RDF/JSON Reader</h3>
                    <p>Please configure the method's parameter below</p>
                </div>
                <br/>
                <div >
                    <Form.Row className="form-row">
                        <Col lg={first_col}>
                            <Form.Label>File Path </Form.Label>
                        </Col>
                        <Col>
                            <InputGroup >
                                <FormControl
                                    placeholder=".json"
                                    aria-label=".json"
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
                        <Col lg={first_col} >
                            <Form.Label>Prefix </Form.Label>
                        </Col>
                        <Col>
                            <FormControl
                                type="text"
                                name="prefix"
                                value={this.state.prefix}
                                onChange={this.onChange}
                                isInvalid={this.state.prefix === "" }
                            />
                        </Col>
                    </Form.Row>
                </div>
            </div>
        )
    }
}


RdfJsonConfiguration.propTypes = {
    onChange: PropTypes.func.isRequired
}

export default RdfJsonConfiguration;