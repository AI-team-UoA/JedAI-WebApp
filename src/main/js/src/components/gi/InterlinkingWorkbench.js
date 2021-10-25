import React, {Component} from 'react';
import {Button, Col, Collapse, Row, Table} from 'react-bootstrap';
import axios from "axios";
import PropTypes from "prop-types";

class InterlinkingWorkbench extends Component {

    constructor(...args) {
        super(...args);
        this.state = {
            collapseTriggers: [],
            executions: [],
            updateNumber: 0
        }
       this.update()
    }


    update(){
        axios.get(axios.get("/sequential/geospatialInterlinking/getExecutions")
            .then(res => {
                console.log(res.data)
                let executionsList = res.data
                let listOfFalse = new Array(executionsList.length).fill(false);
                this.setState({executions: executionsList, collapseTriggers: listOfFalse, updateNumber: this.props.updateWorkbenchNumber})
            }))
    }

    collapseRow = (e, i) => {
        let triggers = this.state.collapseTriggers
        triggers[i] = ! triggers[i]
        this.setState({collapseTriggers: triggers})
    }

    render() {
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

        /**
         * To update workbench we check the equality between `state.updateNumber` and the provided `props.updateWorkbenchNumber`
         * Whenever we want to update, we change the value of `props.updateWorkbenchNumber` on the parent component, then
         * Workbench sees that the value has changed and triggers an update.
         * To trigger an update, `props.updateWorkbenchNumber` must be different than `state.updateNumber`
         * The `updateNumber` is then set as the `updateWorkbenchNumber` to avoid repeating the update
         */
        if (this.props.updateWorkbenchNumber !== this.state.updateNumber)
            this.update()
        let tableValues = this.state.executions.map((exec, index) =>
            <tr key={index}>
                <td>{index}</td>
                <th>
                    {exec.sourceFilename}
                    <span style={{float:"right", margin: "5px"}}>{exec.sourceInstances}</span>
                </th>
                <th>{exec.targetFilename}
                    <span style={{float:"right", margin: "5px"}}>{exec.targetInstances}</span>
                </th>
                <th>{algorithmsMap.get(exec.algorithm)}</th>
                <th>
                    {exec.qualifyingPairs}
                    <Button style={{float:"right", margin: "5px"}} variant="light" size="sm" onClick={e => this.collapseRow(e, index)}>
                        <span className="fa fa-bars"/>
                    </Button>
                    <Collapse style={{marginBottom: "3px"}} in={this.state.collapseTriggers[index]}>
                        <div>
                            <br />
                            <Row style={{marginBottom: "5px", marginTop: "3px"}}>
                                <Col>
                                    <h6 style={{color:"#0073e6"}}>Verifications: </h6>
                                </Col>
                                <Col>
                                    <h4>{exec.verifications}</h4>
                                </Col>
                            </Row>

                            <Row style={{marginBottom: "3px"}}>
                                <Col>
                                    <h6 style={{color:"#0073e6"}}>Total Relations: </h6>
                                </Col>
                                <Col>
                                    <h4>{exec.totalRelations}</h4>
                                </Col>
                            </Row>

                            <Row style={{marginBottom: "3px"}}>
                                <Col>
                                    <h6 style={{color:"#0073e6"}}>Contains: </h6>
                                </Col>
                                <Col>
                                    <h4>{exec.contains}</h4>
                                </Col>
                            </Row>

                            <Row style={{marginBottom: "3px"}}>
                                <Col>
                                    <h6 style={{color:"#0073e6"}}>Covers: </h6>
                                </Col>
                                <Col>
                                    <h4>{exec.covers}</h4>
                                </Col>
                            </Row>
                            <Row style={{marginBottom: "3px"}}>
                                <Col>
                                    <h6 style={{color:"#0073e6"}}>Covered By: </h6>
                                </Col>
                                <Col>
                                    <h4>{exec.coveredBy}</h4>
                                </Col>
                            </Row>
                            <Row style={{marginBottom: "3px"}}>
                                <Col>
                                    <h6 style={{color:"#0073e6"}}>Crosses: </h6>
                                </Col>
                                <Col>
                                    <h4>{exec.crosses}</h4>
                                </Col>
                            </Row>
                            <Row style={{marginBottom: "3px"}}>
                                <Col>
                                    <h6 style={{color:"#0073e6"}}>Equals: </h6>
                                </Col>
                                <Col>
                                    <h4>{exec.equals}</h4>
                                </Col>
                            </Row>
                            <Row style={{marginBottom: "3px"}}>
                                <Col>
                                    <h6 style={{color:"#0073e6"}}>Intersects: </h6>
                                </Col>
                                <Col>
                                    <h4>{exec.intersects}</h4>
                                </Col>
                            </Row>
                            <Row style={{marginBottom: "3px"}}>
                                <Col>
                                    <h6 style={{color:"#0073e6"}}>Overlaps: </h6>
                                </Col>
                                <Col>
                                    <h4>{exec.overlaps}</h4>
                                </Col>
                            </Row>
                            <Row style={{marginBottom: "3px"}}>
                                <Col>
                                    <h6 style={{color:"#0073e6"}}>Touches: </h6>
                                </Col>
                                <Col>
                                    <h4>{exec.touches}</h4>
                                </Col>
                            </Row>
                            <Row style={{marginBottom: "3px"}}>
                                <Col>
                                    <h6 style={{color:"#0073e6"}}>Within: </h6>
                                </Col>
                                <Col>
                                    <h4>{exec.within}</h4>
                                </Col>
                            </Row>
                        </div>
                    </Collapse>
                </th>
                <th>{exec.executionTime}</th>
            </tr>
        )

        return (
            <div>
                <Table striped bordered hover size="sm">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Source</th>
                        <th>Target</th>
                        <th>Algorithm</th>
                        <th>Qualifying Pairs</th>
                        <th>Execution Time (ms)</th>
                    </tr>
                    </thead>
                    <tbody>
                    {tableValues}
                    </tbody>
                </Table>
            </div>
        );
    }
}


InterlinkingWorkbench.propTypes = {
    updateWorkbenchNumber: PropTypes.number.isRequired
}

export default InterlinkingWorkbench;