import React, { Component } from 'react'
import {Jumbotron, Modal} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import {Link, withRouter } from 'react-router-dom';
import Workbench from './er/mainViews/Workbench';
import axios from 'axios';
import InterlinkingWorkbench from "./gi/InterlinkingWorkbench";

class HomeView extends Component {

    constructor(...args) {
        super(...args);
        this.state = {
            workbench_data: [],
            show_exec_window : false
        }
        this.getWorkbenchData()
    }

    getWorkbenchData = () => 
        axios.get("/workflow/workbench/")
        .then(res => this.setState({workbench_data: res.data}))

    setNewWorkflow = (e, id) => {
        axios.get("/workflow/set_workflow/"+id)
        .then(res => {
            this.props.history.push({
                pathname:"/workflow",
                state: { data: res.data}
            })
        })
    }

    close_exec_window = () => this.setState({show_exec_window : false});
    open_exec_window = () => this.setState({show_exec_window : true});


    render() {
        return (
            <div>
                <Modal show={this.state.show_exec_window} onHide={this.close_exec_window} size="xl">
                    <Modal.Header closeButton>
                        <Modal.Title>Choose JedAI version </Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{textAlign:"center"}}>

                        {/*<div style={{textAlign: 'center'}}>*/}
                        {/*    <div> <h2><span className="fa fa-file"/> Entity Resolution</h2></div>*/}

                        {/*    <Jumbotron className='jumbotron_alg' style={{width: "40%", height: "250px", position: "relative"}}>*/}
                        {/*        TODO FIX*/}
                        {/*        <div style={{ textAlign: 'center'}}>*/}
                        {/*            <span className="fa fa-desktop"/>*/}
                        {/*            <h3>Sequential</h3>*/}
                        {/*            <p  style={{ height: "100px"}}>*/}
                        {/*                Run the Sequential version of JedAI, which provides the whole functionality of JedAIToolKit*/}
                        {/*                with multiple algorithms for each Workflow step. The execution will be performed server-side.*/}
                        {/*            </p>*/}
                        {/*            <br/>*/}
                        {/*            <div >*/}
                        {/*                <Link to={{pathname:"/selectworkflow", isSpark: false }}>*/}
                        {/*                    <Button variant="primary" style={btnStyle}> <span className="fa fa-desktop"/> Sequential ER</Button>*/}
                        {/*                </Link>*/}
                        {/*            </div>*/}
                        {/*        </div>*/}
                        {/*    </Jumbotron>*/}

                        {/*    <Jumbotron className='jumbotron_alg' style={{width: "40%", height: "250px", position: "relative"}}>*/}
                        {/*        <div style={{ textAlign: 'center'}}>*/}
                        {/*            <span className="fa fa-server"/>*/}
                        {/*            <h3>Distributed</h3>*/}
                        {/*            <p  style={{ height: "100px"}}>*/}
                        {/*                Run the distributed version of JedAI known as JedAI-Spark.*/}
                        {/*                The execution will be performed in a cluster configured by the user.*/}
                        {/*                The cluster must run an Apache Livy server so to establish connection.*/}
                        {/*            </p>*/}
                        {/*            <br/>*/}
                        {/*            <div>*/}
                        {/*                <Link to={{pathname:"/selectworkflow", isSpark: true }}>*/}
                        {/*                    <Button disabled={true} variant="primary" style={btnStyle}> <span className="fa fa-server"/> Distributed ER</Button>*/}
                        {/*                </Link>*/}
                        {/*            </div>*/}
                        {/*        </div>*/}
                        {/*    </Jumbotron>*/}
                        {/*</div>*/}

                        <div style={{textAlign: 'center', marginTop: "25px"}}>
                            <div><h2><span className="fa fa-globe"/> Geospatial Interlinking</h2></div>

                            <Jumbotron className='jumbotron_alg' style={{width: "40%", height: "250px", position: "relative"}}>
                                <div style={{ textAlign: 'center'}}>
                                    <span className="fa fa-desktop"/>
                                    <h3>Sequential</h3>
                                    <p style={{ height: "100px"}}>
                                        Run the Sequential version of GeoLinker.
                                        The execution will be performed server-side.
                                        {/*TODO FIX */}
                                        {/*Run the Sequential version of JedAI, which provides the whole functionality of JedAIToolKit*/}
                                        {/*with multiple algorithms for each Workflow step. The execution will be performed server-side.*/}
                                    </p>
                                    <br/>
                                    <div>
                                        <Link to={{pathname:"/sequential/geospatialInterlinking/main", isSpark: false }}>
                                            <Button variant="primary" style={btnStyle}> <span className="fa fa-desktop"/> Sequential GI</Button>
                                        </Link>
                                    </div>
                                </div>
                            </Jumbotron>

                            <Jumbotron className='jumbotron_alg' style={{width: "40%", height: "250px", position: "relative"}}>
                                <div style={{ textAlign: 'center'}}>
                                    <span className="fa fa-server"/>
                                    <h3>Distributed</h3>

                                    <p style={{ height: "100px"}}>
                                        Run the distributed version of GeoLinker.
                                        The execution will be performed in a cluster configured by the user.
                                        The cluster must run an Apache Livy server so to establish connection.
                                    </p>
                                    <br/>
                                    <div>
                                        <Link to={{pathname:"/selectworkflow", isSpark: true }}>
                                            <Button variant="primary" disabled={true} style={btnStyle}> <span className="fa fa-server"/> Distributed GI</Button>
                                        </Link>
                                    </div>
                                </div>
                            </Jumbotron>
                        </div>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="primary" onClick={this.close_exec_window}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>

               <Jumbotron className="jumbotron" style={{width:'90%', margin: "auto"}}>
                    <br/>
                    <div style={{marginBottom:"5px"}}> 
                        {/*<h1 style={{fontSize: "400%", display:'inline', marginRight:"20px"}}>JedAI</h1> */}
                        {/*<span className="workflow-desc" >The Java gEneric DAta Integration ToolKit is an open source, high scalability toolkit that offers out-of-the-box solutions for any data integration task.</span>*/}
                        <h1 style={{fontSize: "400%", display:'inline', marginRight:"20px"}}>GeoLinker</h1>
                        <span className="workflow-desc" >GeoLinker is an open source, high scalability toolkit that offers out-of-the-box
                            solutions for holistic geospatial interlinking task.</span>
                    </div>
                    <br/>
                    <br/>
                    <div style={{margin: "20px"}}>
                        <h3 style={{display:"inline", marginRight:"20px"}}>Workbench</h3> 
                        <Button variant="primary" onClick={this.open_exec_window}>
                            <span className="fa fa-plus-circle" style={{marginRight: "10px"}}/>
                            New Workflow
                        </Button>
                    </div>
                    <Jumbotron style={{margin:"auto", border:"groove", backgroundColor:"white"}}>
                        {/*<Workbench data={this.state.workbench_data} getDataFunc={this.getWorkbenchData} setNewWorkflow={this.setNewWorkflow} />*/}
                        <InterlinkingWorkbench updateWorkbenchNumber={0}/>
                    </Jumbotron>  
                </Jumbotron> 
            </div>
        )
    }
}

const btnStyle = {
    cursor: 'pointer',
    width : '200px',
    height: '35px',
    margin: 'auto',
    position: "absolute",
    bottom: "15px",
    right: "25%",
    left:"50%",
    marginLeft: "-100px"
}

export default withRouter(HomeView)

