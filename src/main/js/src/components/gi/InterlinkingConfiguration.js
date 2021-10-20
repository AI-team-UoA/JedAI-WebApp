import React, {Component} from 'react';
import ConfigurationView from "../er/workflowViews/utilities/ConfigurationView";
import PropTypes from "prop-types";
import {Form, Col, Table, Row } from 'react-bootstrap/'


class InterlinkingConfiguration extends Component {


    // TODO
    //  add tooltip
    //  add button leading to execution page
    getDatasetConfigurations = (filetype, data) => {
        let conf
        switch(filetype) {
            case "CSV":
                conf ={
                    'Filename': data.filename,
                    'First Row': data.first_row,
                    'Separator': data.separator,
                    'ID index': data.id_index,
                    'Geometry index': data.geometry_index
                }
                break;
            case "RDF/JSON":
                conf ={
                    'Filename': data.filename,
                    'Prefix': data.prefix
                }
                break;
            default:
                conf ={
                    'Filename': data.filename
                }
                break;
        }
        return {'conf': conf}
    }


    render() {

        let title_col = 2
        let empty_col = 1
        let value_col_1 = 1
        let value_col_2 = 2
        let big_col = 8

        return (
            <div >
                <div className="container-fluid">
                    <div style={{marginBottom:"5px"}}>
                        <h1 style={{display:'inline', marginRight:"20px"}}>Confirm Configuration</h1>
                        <span className="workflow-desc" >
                            Confirm the configurations you have provided, to proceed to interlinking.
                        </span>
                    </div>
                    <br/>
                    <br/>
                    <div style={{width: this.props.width, margin: "auto"}}>
                        <ConfigurationView  type="file" title="Source Dataset" data={this.getDatasetConfigurations(this.props.source.filetype, this.props.source.configurations)}/>
                        <br/>

                        <ConfigurationView  type="file" title="Target Dataset" data={this.getDatasetConfigurations(this.props.target.filetype, this.props.target.configurations)}/>
                        <br/>
                        <div style={{marginLeft: "10%"}}>
                            <Row>
                                <Col sm={title_col}>
                                    <Row>
                                        <Form.Label style={{color:"#4663b9"}}><h5>Algorithm Type: </h5></Form.Label>
                                    </Row>
                                    {this.props.algorithm_type === "BUDGET_AWARE" ?
                                        <Row>
                                            <Form.Label style={{color:"#4663b9"}}><h5>Budget: </h5></Form.Label>
                                        </Row>
                                        : <div />
                                    }
                                </Col>

                                <Col sm={empty_col}/>
                                <Col sm={big_col}>
                                    <Row>
                                        <Form.Label style={{color:"#4663b9"}}><h2>{this.props.algorithm_type}</h2></Form.Label>
                                    </Row>
                                    {this.props.algorithm_type === "BUDGET_AWARE" ?
                                        <Row>
                                            <Form.Label style={{color:"#4663b9"}}><h2>{this.props.budget}</h2></Form.Label>
                                        </Row>
                                        : <div />
                                    }
                                </Col>
                            </Row>

                            <Row>
                                <Col sm={title_col}>
                                    <Form.Label style={{color:"#4663b9"}}><h5>Algorithm: </h5></Form.Label>
                                </Col>
                                <Col sm={empty_col}/>
                                <Col sm={big_col}>
                                    <Form.Label style={{color:"#4663b9"}}><h2>{this.props.algorithm}</h2></Form.Label>
                                </Col>
                            </Row>
                        </div>
                        <br/>
                    </div>
                </div>
            </div>
        );
    }
}

InterlinkingConfiguration.propTypes = {
    algorithm_type: PropTypes.string.isRequired,
    algorithm: PropTypes.string.isRequired,
    budget: PropTypes.number.isRequired,
    source: PropTypes.object.isRequired,
    target: PropTypes.object.isRequired,
    width: PropTypes.string.isRequired

}

export default InterlinkingConfiguration;