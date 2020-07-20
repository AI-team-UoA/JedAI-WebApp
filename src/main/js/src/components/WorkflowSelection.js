import React, { Component } from 'react'
import {Jumbotron, Button, Modal} from 'react-bootstrap';
import {Link } from 'react-router-dom';
import axios from 'axios';
import TestSelection from './TestSelection'
import { Redirect } from 'react-router';

class WorkflowSelection extends Component {

    state ={
        show_test_modal: false,

        test_type: "",
        er_mode: "",
        wf_mode: "",
        dt_choice: "",

        redirect_path: "/",
        new_state: null,
        redirect: false
    }

    onChange = (e) => {
        if (e.target.name == "test_type"){
            this.setState({[e.target.name]: e.target.value, er_mode: "dirty", wf_mode: "", dt_choice: ""})
        }
        else if (e.target.name == "er_mode")
            this.setState({[e.target.name]: e.target.value, dt_choice: ""})
        else
            this.setState({[e.target.name]: e.target.value})
    }

    close_test_window = () => {
        console.log("in")
        if (this.state.test_type == "" || this.state.dt_choice == "" || this.state.er_mode == "" || this.state.wf_mode == ""){
            this.setState({
                show_test_modal : false
            })
        }
        else{
            axios.get("/test/get/" + this.state.test_type + "/" + this.state.er_mode + "/" + this.state.wf_mode + "/" + this.state.dt_choice)
            .then((res) => {
                var path = "/"
                if (this.state.wf_mode == "Best Blocking-based" || this.state.wf_mode == "Default Blocking-based")
                    path = "/blockingbased"
                else
                    path = "/joinbased" // todo add new case "default"
                this.setState({
                    redirect_path: path,
                    new_state: res.data, 
                    redirect: true,
                    show_test_modal : false
                })
            })
        }
    }
    open_test_window = () => this.setState({show_test_modal : true});

    render() {
       
        if (this.state.redirect) {
            return <Redirect to={{pathname: this.state.redirect_path, state:{conf: this.state.new_state}}} />;
          }

        return (
            <div >
                <Modal className="grey-modal" show={this.state.show_test_modal} onHide={this.close_test_window} size="lg">
                    <Modal.Header closeButton>
                    <Modal.Title>Select Test to execute {this.state.workflowID}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body >
                        <TestSelection test_type={this.state.test_type} er_mode={this.state.er_mode} wf_mode={this.state.wf_mode} dt_choice={this.state.dt_choice} change={this.onChange}/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" 
                        disabled={this.state.dt_choice == "" || this.state.er_mode == "" || this.state.wf_mode == ""}  
                        onClick={this.close_test_window}>
                            Confirm
                        </Button>
                    </Modal.Footer>
                </Modal>


                <Jumbotron  className='jumbotron_2'>
                    <div className="container-fluid">
                    <br/>
                <div style={{marginBottom:"5px"}}> 
                    <h1 style={{display:'inline', marginRight:"20px"}}>Select Workflow</h1> 
                    <span className="workflow-desc" >Select one of the three available workflows, or you can choose to execute one of the existing tests.</span>
                </div>

                <br/>
                <hr style={{ color: 'black', backgroundColor: 'black', height: '5' }}/>
                <br/>
                <br/>

                <div style={{textAlign: 'center'}}>

                    <Jumbotron className='jumbotron_alg'>
                        <div style={{ textAlign: 'center'}}>
                            <h3>Blocking-based Workflow</h3>
                            <br/>
                            Blocking-based workflow consisting of Data Reading, Schema Clustering, Block Building, Block Cleaning, Comparison Cleaning, Entity Matching and Entity Clustering.
                            For each step, the user can choose and parameterize multiple algorithms.
                            <br/><br/>
                            
                            <Link to="/blockingbased">
                                <Button variant="primary" onClick={(e) => axios.get("workflow/set_mode/Blocking-based")}>Blocking-based Workflow</Button>
                            </Link>
                        </div>
                    </Jumbotron>


                    <Jumbotron className='jumbotron_alg'>
                        <div style={{ textAlign: 'center'}}>
                            <h3>Join-based Workflow</h3>
                            <br/>
                            Similarity Join conveys the state-of-the-art algorithms for accelerating the computation of a specific character- or token-based similarity
                             measure in combination with a user-determined similarity threshold.<br/><br/>

                            <Link to="/joinbased">
                                <Button variant="primary" onClick={ (e) => axios.get("workflow/set_mode/Join-based")}>Join-based Workflow</Button>
                            </Link>
                        </div>
                    </Jumbotron>


                    <Jumbotron className='jumbotron_alg'>
                        <div style={{ textAlign: 'center'}}>
                            <h3>Progressive Workflow</h3>
                            <br/>
                            Comparison Prioritization associates all comparisons in a block collection with a weight that is proportional to the likelihood that they involve
                             duplicates and then, it emits them iteratively, in decreasing weight.<br/><br/>
                            
                             <Link to="/progressive">
                                <Button variant="primary" onClick={(e) => axios.get("workflow/set_mode/Progressive")}>Progressive Workflow</Button>
                            </Link>
                        </div>
                    </Jumbotron>
                
                </div>
            </div>
            <br/>
            <br/>
            <br/>
            <br/>
            <Button style={{float: 'right'}} onClick={this.open_test_window} >Run tests</Button>
        </Jumbotron>
        
        </div>
        )
    }
}


export default WorkflowSelection

