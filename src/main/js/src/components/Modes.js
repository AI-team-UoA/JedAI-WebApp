import React, { Component } from 'react'
import {Jumbotron, Modal} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import {Link, withRouter } from 'react-router-dom';
import Workbench from './Workbench';
import axios from 'axios';
import ExecutionView from'./ExecutionView';

class Modes extends Component {

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
                <Modal show={this.state.show_exec_window} onHide={this.close_exec_window}>
                    <Modal.Header closeButton>
                        <Modal.Title>Choose New Workflow mode</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{textAlign:"center"}}>
                        <Link to="/selectworkflow">
                            <Button variant="primary" style={btnStyle}>Desktop Mode</Button>
                        </Link>
                        <br/>
                        <Link to="/clustermode">
                            <Button variant="primary" style={btnStyle}>Cluster Mode</Button>
                        </Link>
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
    height: '45px',
    margin: '5px'

}

export default withRouter(Modes)

