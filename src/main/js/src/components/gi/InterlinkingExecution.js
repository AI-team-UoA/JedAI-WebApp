import React, {Component} from 'react';
import {Button, Jumbotron, Form, Row, Spinner, Tab, Table, Tabs} from "react-bootstrap";
import {Link} from "react-router-dom";
import axios from "axios";

class InterlinkingExecution extends Component {

    constructor(...args) {

        super(...args);
        this.explorer_get_entities = false;
        this.alertText = ""
        this.start_over_path = "/"
        this.state = {
            export_filetype: "",
            automatic_conf: false,

            details_msg: "",
            execution_status : "Not Run",

            execution_results:{
                source_instances: 0,
                target_instances: 0,

                contains: 0,
                covers: 0,
                coveredBy: 0,
                crosses: 0,
                equals: 0,
                intersects: 0,
                overlaps: 0,
                touches: 0,
                within: 0,

                execution_time : 0,
                verifications : 0,
                qualifying_pairs: 0
            },
            alertShow: false,
        }
    }

    execute = (e) => {
        this.setState({
            details_msg: "",
            execution_status: "Running"
        })
        // TODO TEST
        axios.get("/sequential/geospatialInterlinking/run").then(res => {
            let results = res.data
            console.log(results)
            if (results != null) {
                this.setState({
                    contains: results['contains'],
                    covers: results['covers'],
                    coveredBy: results['coveredBy'],
                    crosses: results['crosses'],
                    equals: results['equals'],
                    intersects: results['intersects'],
                    overlaps: results['overlaps'],
                    touches: results['touches'],
                    within: results['within'],
                    source_instances: results['source_instances'],
                    target_instances: results['target_instances'],
                    execution_time: results['execution_time'],
                    verifications: results['verifications'],
                    qualifying_pairs: results['qualifying_pairs']
                })
            } else {
                this.setState({execution_status: "Failed"})
            }
        })
    }

    render() {
        let execution_msg = ""
        if (this.state.execution_status === "Running"){
            execution_msg =
                <div  style={{marginTop:"20px"}}>
                    <Spinner  style={{color:"#0073e6"}} animation="grow" />
                </div>
        }

        let totalRelations = this.state.execution_results.contains + this.state.execution_results.covers + this.state.execution_results.coveredBy +
            this.state.execution_results.crosses + this.state.execution_results.equals + this.state.execution_results.intersects +
            this.state.execution_results.overlaps + this.state.execution_results.touches + this.state.execution_results.within
        return (
            <div>
                <Jumbotron  className='jumbotron_2'>
                    <div className="container-fluid">
                        <br/>
                        <div style={{marginBottom:"5px"}}>
                            <h1 style={{display:'inline', marginRight:"20px"}}>Geospatial Interlinking Execution</h1>
                            <span className="workflow-desc" > Press "Execute Interlinking" to run the selected algorithm.
                                You can export the results to a file with the "Export" button.</span>
                        </div>
                        <br/>
                        <hr style={{ color: 'black', backgroundColor: 'black', height: '5' }}/>
                        <br/>
                        <Tabs activeKey={this.state.tabkey} onSelect={this.changeTab} defaultActiveKey="result" className="Jumbotron_Tabs">
                            <Tab eventKey="result" title="Results" className="Jumbotron_Tab">
                                <div className="Tab_container">
                                    <br/>
                                    <Form>
                                        <div style={{margin:"auto", width:"70%"}}>
                                            <Table responsive="sm">
                                                <thead>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td><h4 style={{color:"#4663b9"}} className="form-row" >Source Geometries:</h4></td>
                                                        <td style={{fontSize:"150%"}}>{this.state.execution_results.source_instances}</td>

                                                        <td><h4 style={{color:"#4663b9"}} className="form-row" >Target Geometries:</h4></td>
                                                        <td style={{fontSize:"150%"}}>{this.state.execution_results.target_instances}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><h4 style={{color:"#4663b9"}} className="form-row" >Total Relations:</h4></td>
                                                        <td style={{fontSize:"150%"}}>{totalRelations}</td>

                                                        <td><h4 style={{color:"#4663b9"}} className="form-row" >Qualifying Pairs:</h4></td>
                                                        <td style={{fontSize:"150%"}}>{this.state.execution_results.qualifying_pairs}</td>
                                                    </tr>

                                                    <tr>
                                                        <td><h4 style={{color:"#4663b9"}} className="form-row" >Verifications:</h4></td>
                                                        <td style={{fontSize:"150%"}}>{this.state.execution_results.verifications}</td>

                                                        <td><h4 style={{color:"#4663b9"}} className="form-row" >Total execution time (sec):</h4></td>
                                                        <td style={{fontSize:"150%"}}>{this.state.execution_results.execution_time}</td>
                                                    </tr>
                                                </tbody>
                                            </Table>

                                            <hr style={{ color: 'black', backgroundColor: 'black', height: '5' }}/>

                                            <Table responsive="sm">
                                                <thead>
                                                </thead>
                                                <tbody>
                                                <tr>
                                                    <td><h6 style={{color:"#4663b9"}} className="form-row" >Contains:</h6></td>
                                                    <td style={{fontSize:"150%"}}>{this.state.execution_results.contains}</td>

                                                    <td><h6 style={{color:"#4663b9"}} className="form-row" >Covers:</h6></td>
                                                    <td style={{fontSize:"150%"}}>{this.state.execution_results.covers}</td>

                                                    <td><h6 style={{color:"#4663b9"}} className="form-row" >Covered By:</h6></td>
                                                    <td style={{fontSize:"150%"}}>{this.state.execution_results.coveredBy}</td>
                                                </tr>
                                                <tr>
                                                    <td><h6 style={{color:"#4663b9"}} className="form-row" >Crosses:</h6></td>
                                                    <td style={{fontSize:"150%"}}>{this.state.execution_results.crosses}</td>

                                                    <td><h6 style={{color:"#4663b9"}} className="form-row" >Intersects:</h6></td>
                                                    <td style={{fontSize:"150%"}}>{this.state.execution_results.intersects}</td>

                                                    <td><h6 style={{color:"#4663b9"}} className="form-row" >Overlaps:</h6></td>
                                                    <td style={{fontSize:"150%"}}>{this.state.execution_results.overlaps}</td>
                                                </tr>
                                                <tr>
                                                    <td><h6 style={{color:"#4663b9"}} className="form-row" >Touches:</h6></td>
                                                    <td style={{fontSize:"150%"}}>{this.state.execution_results.touches}</td>

                                                    <td><h6 style={{color:"#4663b9"}} className="form-row" >Equals:</h6></td>
                                                    <td style={{fontSize:"150%"}}>{this.state.execution_results.equals}</td>

                                                    <td><h6 style={{color:"#4663b9"}} className="form-row" >Within:</h6></td>
                                                    <td style={{fontSize:"150%"}}>{this.state.execution_results.within}</td>
                                                </tr>
                                                </tbody>
                                            </Table>


                                        </div>
                                        <br/>
                                    </Form>
                                </div>
                            </Tab>
                            <Tab eventKey="details" title="Details" className="Jumbotron_Tab">
                                <br/>
                                <h1>Details</h1>
                                <Form.Group>
                                    <Form.Control as="textarea" rows="20" readOnly={true} value={this.state.details_msg}/>
                                </Form.Group>
                            </Tab>
                            <Tab eventKey="workbench" title="Workbench" className="Jumbotron_Tab">
                                <br/>

                            </Tab>
                        </Tabs>
                        {execution_msg}
                        <br/>
                        <div style={{marginBottom: '20px', paddingBottom:'20px'}}>
                            <div style={{float:'left'}}>
                                <Form.Group as={Row}  className="form-row">
                                    <Button variant="primary"
                                            style={{width:"180", marginRight:"10px"}}
                                            onClick={this.execute}
                                            disabled={this.state.execution_status === "Running"}
                                    >
                                        <span className="fa fa-play-circle" style={{marginRight: "10px"}}/>
                                        Execute Interlinking
                                    </Button>
                                    <Button variant="secondary"
                                            style={{width:"100px", marginRight:"10px"}}
                                            disabled={this.state.execution_status !== "Completed"}
                                            onClick={this.explore}>
                                        Explore
                                    </Button>
                                    <Button variant="secondary"
                                            style={{width: "100px", marginRight:"10px"}}
                                            disabled={this.state.execution_status !== "Completed"}
                                            onClick={this.plotCurve}
                                    >
                                        Show Plot
                                    </Button>
                                </Form.Group>
                                <Form.Group as={Row}  className="form-row">
                                    <Form.Control
                                        style={{width:"290px", marginRight:"10px"}}
                                        as="select"
                                        placeholder="Select Filetype"
                                        name="export_filetype"
                                        onChange={this.onChange}
                                        disabled={this.state.execution_status !== "Completed"}
                                        value={this.state.export_filetype}
                                    >
                                        <option value="" />
                                        <option value="CSV" >CSV</option>
                                    </Form.Control>
                                    <Button
                                        style={{width:"100px", marginRight:"10px"}}
                                        disabled={this.state.export_filetype === ""}
                                        onClick={this.export}
                                    >
                                        Export
                                    </Button>
                                </Form.Group>
                            </div>

                            <div style={{float: 'right'}}>
                                <Form.Group as={Row} className="form-row">
                                    <Button variant="secondary"
                                            style={{width:"100px", marginRight:"10px"}}
                                            disabled={this.state.execution_status !== "Running"}
                                            onClick={this.stop_execution}
                                    >
                                        <span className="fa fa-stop" style={{marginRight: "10px"}}/>
                                        Stop
                                    </Button>
                                    <Link to={{pathname: this.start_over_path, state:{conf: this.state.wf_state}}}>
                                        <Button variant="secondary"
                                                style={{width: "100px", marginRight:"10px"}}
                                                disabled={this.state.execution_status === "Running"}
                                        >
                                            Start Over
                                        </Button>
                                    </Link>
                                </Form.Group>
                            </div>
                        </div>
                    </div>
                    <br/>
                </Jumbotron>
            </div>
        );
    }
}

export default InterlinkingExecution;