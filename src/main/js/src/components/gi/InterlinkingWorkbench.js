import React, {Component} from 'react';
import {Button, Collapse, Table, Col, Row} from 'react-bootstrap';
import axios from "axios";

class InterlinkingWorkbench extends Component {

    constructor(...args) {
        super(...args);
        this.state = {
            collapseTriggers: [],
            executions: []
        }
        axios.get(axios.get("/sequential/geospatialInterlinking/getExecutions")
            .then(res => {
                console.log(res.data)
                let executionsList = res.data
                let listOfFalse = new Array(executionsList.length).fill(false);
                this.setState({executions: executionsList, collapseTriggers: listOfFalse})
            }))
    }

    collapseRow = (e, i) => {
        let triggers = this.state.collapseTriggers
        triggers[i] = ! triggers[i]
        this.setState({collapseTriggers: triggers})
    }

    render() {
        let tableValues = this.state.executions.map((exec, index) =>
            <tr>
                <td>{index}</td>
                <th>{exec.sourceFilename}</th>
                <th>{exec.targetFilename}</th>
                <th>{exec.algorithm}</th>
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

export default InterlinkingWorkbench;