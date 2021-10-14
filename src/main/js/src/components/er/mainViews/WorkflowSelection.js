import React, { Component } from 'react'
import {Jumbotron, Button, Modal, Spinner, Alert} from 'react-bootstrap';
import {Link } from 'react-router-dom';
import axios from 'axios';
import TestSelection from '../../TestSelection'
import ClusterConnectionForm from '../../ClusterConnectionForm'
import { Redirect } from 'react-router';

class WorkflowSelection extends Component {

    state ={
        show_test_modal: false,
        show_cluster_modal: false,

        address: "",
        port: "",
        showConnectionAlert: false,
        cluster_connected: false,

        test_type: "",
        er_mode: "",
        wf_mode: "",
        dt_choice: "",

        redirect_path: "/",
        new_state: null,
        redirect: false,
        showSpinner: false
    }

    /** TEST SELECTION */

    selectTest = (e) => {
        if (e.target.name == "test_type"){
            this.setState({[e.target.name]: e.target.value, er_mode: "dirty", wf_mode: "", dt_choice: ""})
        }
        else if (e.target.name == "er_mode")
            this.setState({[e.target.name]: e.target.value, dt_choice: ""})
        else
            this.setState({[e.target.name]: e.target.value})
    }

    open_test_window = () => this.setState({show_test_modal : true});

    /**
     * submit the requested tests and redirect to the appropriate workflow
     */
    close_test_window = () => {
        if (this.state.test_type == "" || this.state.dt_choice == "" || this.state.er_mode == "" || this.state.wf_mode == "")
            this.setState({ show_test_modal : false })
        else{
            this.setState({showSpinner: true})
            axios.get("/test/get/" + this.state.test_type + "/" + this.state.er_mode + "/" + this.state.wf_mode + "/" + this.state.dt_choice)
            .then((res) => {
                var path = "/"
                if (this.state.test_type == "Budget-awareness Test")
                    path = "/progressive"
                else if (this.state.wf_mode == "Best Schema-agnostic Workflow" || this.state.wf_mode == "Default Schema-agnostic Workflow")
                    path = "/blockingbased"
                else
                    path = "/joinbased"
                this.setState({
                    redirect_path: path,
                    new_state: res.data, 
                    redirect: true,
                    show_test_modal : false,
                    show_cluster_modal: false,
                    showSpinner: false
                })
            })
        }
    }


    /** CLUSTER CONNECTION  */

    configureCluster = (e) => {
        var name = e.target.name
        var value = e.target.value
        if(name === "address")
            this.setState({address: value})
        else if(name === "port")
            this.setState({port: value})
    }
    open_cluster_window = () => this.setState({show_cluster_modal : true});

    /**
     * if the fields are empty close the window
     * if connection with cluster has been established, close
     * if just established or not, show message
     */
    close_cluster_window = () => {
        if (this.state.cluster_connected)
            this.setState({show_cluster_modal : false})
        if (this.state.address == "" || this.state.port == "")
            this.setState({ show_cluster_modal : false })
        else{
            this.setState({showSpinner: true, showConnectionAlert: false})
            axios.get("/spark/cluster/" + this.state.address.replaceAll("/", "--") + "/" + this.state.port)
            .then((res) => {
                this.setState({
                    showSpinner: false,
                    showConnectionAlert: true,
                    cluster_connected: res.data
                })
            })
        }
    }


    render() {
        
        if (this.state.redirect) return <Redirect to={{pathname: this.state.redirect_path, state:{conf: this.state.new_state}}} />;
          
        
        // spinner for test loading or connection establishing
        var spinner = <div/>
        if (this.state.showSpinner)
            spinner= 
                <div>
                    <br/>
                    <br/>
                    <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
                        <Spinner style={{color:"#0073e6"}} animation="grow" />
                        <div style={{marginLeft:"10px", display:"inline"}}>
                            <div style={{marginRight:'20px', color:"#0073e6", display:'inline'}}>
                               {this.state.show_cluster_modal ? "Connecting to Server" : "Loading Data"}
                            </div>
                        </div>
                    </div>
                </div>

        // alert for informing about cluster connection in modal
        var modalAlert = <div/>
        if (this.state.showConnectionAlert)
            modalAlert = <Alert key={"connectionAlert"} variant={this.state.cluster_connected ? 'success': 'danger'}>
                        {this.state.cluster_connected ? <div><span className="fa fa-check"/> Connection Established! </div>  :  <div><span className="fa fa-exclamation-circle"/> Could not connect to server!</div>}
                    </Alert>

        
        return (
            <div >
                <Modal className="grey-modal" show={this.state.show_test_modal} onHide={this.close_test_window} size="lg">
                    <Modal.Header closeButton>
                    <Modal.Title>Select Test to execute {this.state.workflowID}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body >
                        <TestSelection test_type={this.state.test_type} er_mode={this.state.er_mode} wf_mode={this.state.wf_mode} dt_choice={this.state.dt_choice} change={this.selectTest}/>
                        {spinner}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" 
                        disabled={this.state.dt_choice == "" || this.state.er_mode == "" || this.state.wf_mode == ""}  
                        onClick={this.close_test_window}>
                            Confirm
                        </Button> 
                    </Modal.Footer>
                </Modal>


                <Modal className="grey-modal" show={this.state.show_cluster_modal} onHide={this.close_cluster_window}>
                    <Modal.Header closeButton>
                    <Modal.Title>Connect to cluster</Modal.Title>
                    </Modal.Header>
                    <Modal.Body >
                        <ClusterConnectionForm address={this.state.address} port={this.state.port} onChange={this.configureCluster}/>
                        {spinner}
                        {modalAlert}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" 
                        disabled={this.state.address == "" || this.state.port == "" }  
                        onClick={this.close_cluster_window}>
                            Connect
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
                            
                            <Link to={{pathname:"/blockingbased", isSpark: this.props.location.isSpark }}>
                                <Button variant="primary" onClick={(e) => axios.get("workflow/set_mode/Blocking-based")} disabled={this.props.location.isSpark && !this.state.cluster_connected}>Blocking-based Workflow</Button>
                            </Link>
                        </div>
                    </Jumbotron>


                    <Jumbotron className='jumbotron_alg'>
                        <div style={{ textAlign: 'center'}}>
                            <h3>Join-based Workflow</h3>
                            <br/>
                            Similarity Join conveys the state-of-the-art algorithms for accelerating the computation of a specific character- or token-based similarity
                             measure in combination with a user-determined similarity threshold.<br/><br/>

                            <Link to={{pathname:"/joinbased", isSpark: this.props.location.isSpark }}>
                                <Button variant="primary" onClick={ (e) => axios.get("workflow/set_mode/Join-based")} disabled={this.props.location.isSpark && !this.state.cluster_connected}>Join-based Workflow</Button>
                            </Link>
                        </div>
                    </Jumbotron>


                    <Jumbotron className='jumbotron_alg'>
                        <div style={{ textAlign: 'center'}}>
                            <h3>Progressive Workflow</h3>
                            <br/>
                            Comparison Prioritization associates all comparisons in a block collection with a weight that is proportional to the likelihood that they involve
                             duplicates and then, it emits them iteratively, in decreasing weight.<br/><br/>
                            
                             <Link to={{pathname:"/progressive", isSpark: this.props.location.isSpark }}>
                                <Button variant="primary" onClick={(e) => axios.get("workflow/set_mode/Progressive")} disabled={this.props.location.isSpark && !this.state.cluster_connected}>Progressive Workflow</Button>
                            </Link>
                        </div>
                    </Jumbotron>
                
                </div>
            </div>
            <br/>
            <br/>
            <br/>
            <br/>
            <div style={{display:"inline"}}>

                {
                    this.props.location.isSpark ?
                     <span style={{float: 'left'}}><Button onClick={this.open_cluster_window} ><span className="fa fa-cog"/> Configure Cluster </Button> </span>
                    :<span />
                }
                

                {
                    this.props.location.isSpark ?
                            <span>
                                <Alert style={{width: "15%", margin: "auto", textAlign: 'center'}} key={"connectionAlert"} variant={this.state.cluster_connected ? 'success': 'warning'}>
                                    {this.state.cluster_connected ? <div><span className="fa fa-check"/> Connection Established! </div> :  <div><span className="fa fa-exclamation"/> Need to connect to server! </div>}
                                </Alert>
                            </span>
                    :<span />
                }
                <span style={{float: 'right', textAlign: "right"}}>{this.props.location.isSpark ? <div/> : <Button onClick={this.open_test_window}>Run tests</Button>}</span>
            </div>
        </Jumbotron>
        
        </div>
        )
    }
}


export default WorkflowSelection

