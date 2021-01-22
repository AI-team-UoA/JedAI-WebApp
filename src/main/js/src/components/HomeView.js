import React, { Component } from 'react'
import {Jumbotron, Modal} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import {Link, withRouter } from 'react-router-dom';
import Workbench from './mainViews/Workbench';
import axios from 'axios';

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
                <Modal show={this.state.show_exec_window} onHide={this.close_exec_window} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>Choose JedAI version </Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{textAlign:"center"}}>

                        <div style={{textAlign: 'center'}}>
                            <Jumbotron className='jumbotron_alg' style={{width: "40%", height: "280px"}}>
                                <div style={{ textAlign: 'center'}}>
                                    <span className="fa fa-desktop"/>
                                    <h3>JedAI</h3>
                                    The linear version of JedAI, that provides the whole functionality of JedAIToolKit. It will be executed server-side
                                    and provides multiple algorithms for each Workflow step. 
                                    <br/>
                                    <Link to={{pathname:"/selectworkflow", isSpark: false }}>
                                        <Button variant="primary" style={btnStyle}> <span className="fa fa-desktop"/> JedAI</Button>
                                    </Link>
                                </div>
                            </Jumbotron>


                            <Jumbotron className='jumbotron_alg' style={{width: "40%", height: "280px"}}>
                                <div style={{ textAlign: 'center'}}>
                                    <span className="fa fa-server"/> 
                                    <h3>JedAI-Spark</h3>
                                    JedAI-Spark is a parallelized version of JedAI that runs on top of Apache Spark. For the execution, it requires the
                                    connection with an Apache Livy server. 
                                   <br/>
                                    <Link to={{pathname:"/selectworkflow", isSpark: true }}> 
                                        <Button variant="primary" style={btnStyle}> <span className="fa fa-server"/> JedAI-Spark</Button>
                                    </Link>
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


               <Jumbotron className="jumbotron" style={{width:'90%'}}>
                    <header><h2></h2></header>
                    <br/>
                    <div style={{marginBottom:"5px"}}> 
                        <h1 style={{fontSize: "400%", display:'inline', marginRight:"20px"}}>JedAI</h1> 
                        <span className="workflow-desc" >The Java gEneric DAta Integration ToolKit is an open source, high scalability toolkit that offers out-of-the-box solutions for any data integration task.</span>
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
                        <Workbench data={this.state.workbench_data} getDataFunc={this.getWorkbenchData} setNewWorkflow={this.setNewWorkflow} />
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
    margin: '2.5px'

}

export default withRouter(HomeView)

