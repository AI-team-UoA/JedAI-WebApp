import React, { Component } from 'react'
import {Form, Col, Row, Button, Collapse} from 'react-bootstrap/'
import PropTypes from 'prop-types';


 class TestSelection extends Component {
    render() {

        var small = 5
        var large = 6

        if(this.props.er_mode == "clean"){
            var dataset_options = 

                <Form.Group as={Row} className="form-row">
                <Form.Label as="legend" column sm={small}>
                    <h5>Select Datasets:</h5>
                </Form.Label>
                <Col sm={large}>
                    <Form.Control 
                        as="select" 
                        placeholder="Select Datasets" 
                        name="dt_choice" 
                        onChange={this.props.change}
                        value={this.props.dt_choice}
                        disabled={this.props.er_mode == "" }
                    >
                        <option value="" ></option>
                        <option value="ABT-Buy" >ABT-Buy</option>
                        <option value="Amazon-Gp" >Amazon-Gp</option>
                        <option value="Amazon-Walmart" >Amazon-Walmart</option>
                        <option value="DBLP-ACM" >DBLP-ACM</option>
                        <option value="DBLP-Scholars" >DBLP-Scholars</option>
                        <option value="IMDB-DBpedia" >IMDB-DBpedia</option>
                        <option value="Restaurants" >Restaurants</option>
                    </Form.Control>
                </Col>       
            </Form.Group>
                
        }
        else if (this.props.er_mode == "dirty"){
            var dataset_options = 
                <Form.Group as={Row} className="form-row">
                <Form.Label as="legend" column sm={small}>
                    <h5>Select Datasets:</h5>
                </Form.Label>
                <Col sm={large}>
                    <Form.Control 
                        as="select" 
                        placeholder="Select Datasets" 
                        name="dt_choice" 
                        onChange={this.props.change}
                        value={this.props.dt_choice}
                        disabled={this.props.er_mode == ""}
                    >
                        <option value="" ></option>
                        <option value="CDDB" >CDDB</option>
                        <option value="Cora" >Cora</option>
                    </Form.Control>
                </Col>       
            </Form.Group>
        }
        else{
            var dataset_options = 
                <Form.Group as={Row} className="form-row">
                <Form.Label as="legend" column sm={small}>
                    <h5>Select Datasets:</h5>
                </Form.Label>
                <Col sm={large}>
                    <Form.Control 
                        as="select" 
                        placeholder="Select Datasets" 
                        name="dt_choice" 
                        onChange={this.props.change}
                        value={this.props.dt_choice}
                        disabled={this.props.er_mode == ""}
                    >
                        <option value="" ></option>
                    </Form.Control>
                </Col>       
            </Form.Group>
        }
        

        return (
            <div>
                <br/>
                <div style={{marginLeft: "15%"}}>
                    <Form.Group as={Row} className="form-row">
                        <Form.Label as="legend" column sm={small}>
                            <h5>Select ER Mode:</h5>
                        </Form.Label>
                        <Col sm={large}>
                            <Form.Control 
                                as="select" 
                                placeholder="Select ER Mode" 
                                name="er_mode" 
                                onChange={this.props.change}
                                value={this.props.er_mode}
                            >
                                <option value="" ></option>
                                <option value="dirty" >Dirty Entity Resolution</option>
                                <option value="clean" >Clean-Clean Entity Resolution</option>
                            </Form.Control>
                        </Col>       
                    </Form.Group>          
                    
                    <Form.Group as={Row} className="form-row">
                        <Form.Label as="legend" column sm={small}>
                            <h5>Select Workflow type:</h5>
                        </Form.Label>
                        <Col sm={large}>
                            <Form.Control 
                                as="select" 
                                placeholder="Select Workflow type:" 
                                name="wf_mode" 
                                onChange={this.props.change}
                                value={this.props.wf_mode}
                            >
                                <option value="" ></option>
                                <option value="Blocking-based" >Blocking-based Workflow</option>
                                <option value="Join-based" >Join-based</option>
                            </Form.Control>
                        </Col>       
                    </Form.Group>  
                    {dataset_options}
                    
                </div>
            </div>
        )
    }
}


TestSelection.propTypes = {
    er_mode: PropTypes.string.isRequired,
    wf_mode: PropTypes.string.isRequired,
    dt_choice: PropTypes.string.isRequired,
    change: PropTypes.func.isRequired
}

export default TestSelection