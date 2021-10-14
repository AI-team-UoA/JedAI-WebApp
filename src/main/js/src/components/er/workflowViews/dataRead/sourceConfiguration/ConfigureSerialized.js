import React, {  Component } from 'react'
import PropTypes from 'prop-types';
import {Form, Col, Button, InputGroup, FormControl} from 'react-bootstrap/'
import '../../../../../../../resources/static/css/main.css'


/**
 * Configurations of Serialized files
 */
 
class ConfigureSerialized extends Component {

    constructor(...args) {
        super(...args);

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

    render() {
      
        const empty_col = 1
        const first_col = 4
        const second_col = 6

        return (

            <div>
                <div style ={{textAlign:'center'}}>
                    <h3>Serialization Reader</h3>
                    <p>Please configure the method's parameter below</p>
                </div>
                
                <Form.Row className="form-row">
                    <Col sm={empty_col} />
                    <Col sm={first_col}>
                        <Form.Label> File Path </Form.Label> 
                    </Col>
                    <Col sm={second_col}>
                        <InputGroup >
                            <FormControl
                                
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
        )
    }
}


ConfigureSerialized.propTypes = {
    onChange: PropTypes.func.isRequired,
    entity_id: PropTypes.string.isRequired,
    browsing: PropTypes.bool.isRequired
}

export default ConfigureSerialized