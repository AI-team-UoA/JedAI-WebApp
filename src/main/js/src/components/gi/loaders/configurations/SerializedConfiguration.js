import React, {Component} from 'react';
import {Button, Col, Form, FormControl, InputGroup} from "react-bootstrap/";
import PropTypes from "prop-types";

class SerializedConfiguration extends Component {
    constructor(...args) {
        super(...args);
        this.state={
            file: null,
            filename : "",
            browsing : false
        }
    }

    onChange = (e) => {
        if(e.target.name === "file"){
            const file = e.target.files[0];
            this.setState({file:file, filename: file.name}, () =>{
                let isDisabled = this.state.filename === "" || this.state.file == null;
                this.props.onChange(this.state, isDisabled)
            })
        }
        else{
            this.setState({[e.target.name]: e.target.value}, () =>{
                let isDisabled = this.state.filename === "" || this.state.file == null;
                this.props.onChange(this.state, isDisabled)
            })
        }
    }

    render() {
        const first_col = 4
        const second_col = 7
        return (
            <div>
                <div style ={{textAlign:'center'}}>
                    <h3>{this.props.filetype + " Reader"}</h3>
                    <p>Please configure the method's parameter below</p>
                </div>
                <br/>
                <div >
                    <Form.Row className="form-row">
                        <Col lg={first_col}>
                            <Form.Label>File Path </Form.Label>
                        </Col>
                        <Col lg={second_col}>
                            <InputGroup >
                                <FormControl
                                    placeholder=""
                                    aria-label=""
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
                </div>
            </div>
        )
    }
}


SerializedConfiguration.propTypes = {
    onChange: PropTypes.func.isRequired,
    filetype: PropTypes.string.isRequired
}

export default SerializedConfiguration;