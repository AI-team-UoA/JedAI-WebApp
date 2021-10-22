import React, {Component} from 'react';
import ConfigurationView from "../er/workflowViews/utilities/ConfigurationView";
import PropTypes from "prop-types";
import {Col, Form, Row, Button} from 'react-bootstrap/'
import axios from "axios";
import {Link} from "react-router-dom";


class InterlinkingConfiguration extends Component {

    state = {
        algorithmConf: ""
    }

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

    getAlgorithmConf(){
        if(this.state.algorithmConf === ""){
            axios.get("/sequential/geospatialInterlinking/getAlgorithmConf/"+this.props.algorithm).then(res => this.setState({algorithmConf: res.data}))
        }
    }


    render() {
        this.getAlgorithmConf()

        let title_col = 3
        let empty_col = 1
        let big_col = 6

        let BUDGET_AGNOSTIC = "BUDGET_AGNOSTIC"
        let BUDGET_AWARE = "BUDGET_AWARE"

        const algorithm_typesMap = new Map()
        algorithm_typesMap.set(BUDGET_AGNOSTIC, "Budget Agnostic")
        algorithm_typesMap.set(BUDGET_AWARE, "Budget Aware")

        const algorithmsMap = new Map()
        algorithmsMap.set("RADON", "RADON")
        algorithmsMap.set("GIANT", "GIA.nt ")
        algorithmsMap.set("STATIC_RADON", "Static RADON")
        algorithmsMap.set("STATIC_GIANT", "Static GIA.nt")
        algorithmsMap.set("PLANE_SWEEP", "Plane Sweep")
        algorithmsMap.set("STRIPE_SWEEP", "Stripe Sweep")
        algorithmsMap.set("PBSM", "PBSM")
        algorithmsMap.set("RTREE", "R-Tree")
        algorithmsMap.set("QUADTREE", "Quadtree")
        algorithmsMap.set("CRTREE", "CR-Tree")
        algorithmsMap.set("PROGRESSIVE_GIANT", "Progressive GIA.nt")
        algorithmsMap.set("PROGRESSIVE_RADON", "Progressive RADON")
        algorithmsMap.set("GEOMETRY_ORDERED", "Geometry-ordered Algorithm")
        algorithmsMap.set("ITERATIVE_ALGORITHMS", "Iterative Algorithm")
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
                                    <Form.Label style={{color:"#4663b9"}}><h5>Algorithm Type: </h5></Form.Label>
                                </Col>
                                <Col sm={empty_col}/>
                                <Col sm={big_col}>
                                    <Form.Label style={{color:"#4663b9"}}><h2>{algorithm_typesMap.get(this.props.algorithm_type)}</h2></Form.Label>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={title_col}>
                                    <Form.Label style={{color:"#4663b9"}}><h5>Algorithm: </h5></Form.Label>
                                </Col>
                                <Col sm={empty_col}/>
                                <Col sm={big_col}>
                                    <Form.Label style={{color:"#4663b9"}}><h2>{algorithmsMap.get(this.props.algorithm)}</h2></Form.Label>
                                </Col>

                                <Col sm={empty_col}>
                                    <span title={this.state.algorithmConf} className="fa fa-info-circle fa-2x" style={{color: "#4663b9"}}/>
                                </Col>
                            </Row>

                            {this.props.algorithm_type === "BUDGET_AWARE" ?
                                <Row>
                                    <Col sm={title_col}>
                                        <Form.Label style={{color:"#4663b9"}}><h5>Budget: </h5></Form.Label>
                                    </Col>
                                    <Col sm={empty_col}/>
                                    <Col sm={big_col}>
                                        <Form.Label style={{color:"#4663b9"}}><h3>{this.props.budget}</h3></Form.Label>
                                    </Col>
                                </Row>
                                : <div />
                            }
                        </div>
                        <br/>
                        <br/>
                    </div>
                    <Link to={{ pathname:"/sequential/geospatialInterlinking/execute"}}>
                        <Button style={{float: 'right'}} onClick={this.props.submit}>Confirm</Button>
                    </Link>
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
    width: PropTypes.string.isRequired,
    submit: PropTypes.func.isRequired
}

export default InterlinkingConfiguration;