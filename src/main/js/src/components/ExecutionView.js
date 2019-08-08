import React, { Component } from 'react'
import {Jumbotron, Tabs, Tab, Form, Row, Col, Button, Spinner} from 'react-bootstrap';
import ReactSpeedometer from "react-d3-speedometer"
import {Link } from 'react-router-dom';
import "../../../resources/static/css/main.css"
import AlertModal from './workflowViews/utilities/AlertModal'
import axios from 'axios';




class ExecutionView extends Component {
   
    constructor(...args) {
        super(...args);
        this.alertText = ""
        
        this.state = {
                automatic_type: "Holistic",
                search_type: "Random Search",
                export_filetype: "",
                automatic_conf: false,

                details_msg: "", 
                execution_step: "",
                execution_status : "Not Run",

                execution_results:{
                    recall: 0,
                    f1_measure: 0,
                    precision: 0,

                    input_instances: 0,
                    existing_duplicates: 0,
                    total_time : 0,

                    no_clusters : 0,
                    detected_duplicates : 0,
                    total_matches: 0
                },
                
                alertShow: false,
            }
        
        axios.get("/workflow/automatic_conf/").then(res => this.setState({ automatic_conf: res.data}))
   
        this.eventSource = new EventSource("/workflow") 
        this.eventSource.addEventListener("execution_step", (e) => this.setState({execution_step: e.data}))
        
        this.eventSource.addEventListener("workflow_details", (e) => {
        	var msg = this.state.details_msg + "\n" + e.data 
        	this.setState({details_msg: msg})
        })

        this.eventSource.addEventListener("exception", (e) => {
        	console.log(e)
            this.alertText = e.data
            this.handleAlerShow()
            this.setState({
            		execution_step: "",
            		execution_status: "Failed"}
            )
        })
    }

    handleAlertClose = () => this.setState({alertShow : false});
    handleAlerShow = () => this.setState({alertShow : true});

    onChange = (e) => this.setState({[e.target.name]: e.target.value}) 

    
    
    executeWorkFlow = (e) =>{
        this.setState({
            execution_status: "Running"
        })
        axios
            .get("/workflow/execution/automatic_type/"+this.state.automatic_type + "/search_type/"+this.state.search_type)
            .then(res => {
            	
                var data_stat = res.data.value0
                var total_time = res.data.value1
                var no_istamces = res.data.value2
                
                if (res.data !== null){
                    var reuslts = {
                        recall: data_stat.recall,
                        f1_measure: data_stat.fmeasure,
                        precision: data_stat.precision,

                        input_instances: no_istamces,
                        existing_duplicates: data_stat.existingDuplicates,
                        total_time : total_time,

                        no_clusters : data_stat.entityClusters,
                        detected_duplicates : data_stat.detectedDuplicates,
                        total_matches: data_stat.totalMatches
                    }
                    this.setState({
                        execution_results: reuslts,
                        execution_status: "Completed"
                    })
                }
                else{
                    this.setState({
                        execution_status: "Failed"
                    })
                }
            })
    }

    render() {

        var radio_col = 1.8
        var empty_col = 1
        var speedometer_col = 2.5
        
        // Set execution status view
        var execution_status_view
        switch(this.state.execution_status) {
            case "Not Run":
                execution_status_view =
                    <div>
                        <h3> <span style={{display:"inline", marginRight: "20px"}}>Status: </span>  <span style={{color: "#990000"}}><b>{this.state.execution_status}</b></span></h3>
                    </div>
                break;
            case "Running":
                execution_status_view =
                    <div>
                        <h3> <span style={{display:"inline", marginRight: "20px"}}>Status: </span>  <span style={{color: "#0073e6"}}><b>{this.state.execution_status}</b></span></h3>
                    </div>
                break;
            case "Completed":
                execution_status_view =
                    <div>
                        <h3> <span style={{display:"inline", marginRight: "20px"}}>Status: </span>  <span style={{color: "#00802b"}}><b>{this.state.execution_status}</b></span></h3>
                    </div>
                break;
            case "Failed":
                execution_status_view =
                    <div>
                        <h3> <span style={{display:"inline", marginRight: "20px"}}>Status: </span>  <span style={{color: "#e63900"}}><b>{this.state.execution_status}</b></span></h3>
                    </div>
                break;
            default:
                    execution_status_view =
                    <div>
                        <h3 style={{display:"inline"}}>Status</h3>  {this.state.execution_status}
                    </div>
          }
        
         
            


        // Workflow Step msg
        var execution_msg
        if (this.state.execution_step !== "" &&  this.state.execution_status === "Running"){
            execution_msg = 
        		
        		<div  style={{marginTop:"20px"}}>
        			<Spinner  style={{color:"#0073e6"}} animation="grow" />
	        		<div style={{marginLeft:"10px", display:"inline"}}>
	        			<h4 style={{marginRight:'20px', color:"#0073e6", display:'inline'}}>Executing:</h4> 
	        			<h4 style={{display:'inline'}}>{this.state.execution_step}</h4>
	        		</div>
                </div>
        }
        
        


        // Execution Results
        var execution_stats = this.state.execution_status === "Completed" ?
        <Form.Group style={{position:"relative", left:"28%"}}>
                <Row>
                    <Col Col sm={3}>
                        <Row>
                            <Col sm={8}><h4 style={{color:"#0073e6"}} className="form-row" >Input Instances:</h4> </Col>
                            <Col sm={1}>{this.state.execution_results.input_instances}</Col>
                        </Row>
                        <Row>
                            <Col sm={8}><h4 style={{color:"#0073e6"}} className="form-row" >Existing Duplicates:</h4> </Col>
                            <Col sm={1}>{this.state.execution_results.existing_duplicates}</Col>
                        </Row>
                        <Row>
                            <Col sm={8}><h4 style={{color:"#0073e6"}} className="form-row" >Total execution time:</h4> </Col>
                            <Col sm={1}>{this.state.execution_results.total_time}</Col>
                        </Row>
                    </Col>
                    <Col Col sm={3}>
                        <Row>
                            <Col sm={8}><h4 style={{color:"#0073e6"}} className="form-row" >Number of Clusters:</h4> </Col>
                            <Col sm={1}>{this.state.execution_results.no_clusters}</Col>
                        </Row>
                        <Row>
                            <Col sm={8}><h4 style={{color:"#0073e6"}} className="form-row" >Detected Duplicates:</h4> </Col>
                            <Col sm={1}>{this.state.execution_results.detected_duplicates}</Col>
                        </Row>
                        <Row>
                            <Col sm={8}><h4 style={{color:"#0073e6"}} className="form-row" >Total Matches:</h4> </Col>
                            <Col sm={1}>{this.state.execution_results.total_matches}</Col>
                        </Row>
                    </Col>
                </Row>
            </Form.Group>

            : <div/>


        
        return (
            <div>
                <AlertModal title="Exception" text={this.alertText} show={this.state.alertShow} handleClose={this.handleAlertClose} />
                <Jumbotron  className='jumbotron_2'>
                    <div className="container-fluid">
                        <br/>
                        <div style={{marginBottom:"5px"}}> 
                            <h1 style={{display:'inline', marginRight:"20px"}}>Workflow Execution</h1> 
                            <span className="workflow-desc" >Press "Run algorithm" to run the algorithm. You can export the results to a CSV file with the "Export CSV" button.</span>
                        </div>

                        <br/>
                        <hr style={{ color: 'black', backgroundColor: 'black', height: '5' }}/>
                        <br/>

                        
                        <Tabs defaultActiveKey="result" className="Jumbotron_Tabs">
                            <Tab eventKey="result" title="Results" className="Jumbotron_Tab">
                                <div className="Tab_container">
                                    <br/>
                                    <Form>
                                        <Form.Group as={Row}  className="form-row" >
                                            <Col  sm={radio_col}>
                                                <Form.Label as="legend"><h5>Automatic Configuration Type</h5> </Form.Label>
                                                <Form.Check
                                                    type="radio"
                                                    label="Holistic"
                                                    name="automatic_type"
                                                    value="Holistic"
                                                    checked={this.state.automatic_type === "Holistic"}
                                                    onChange={this.onChange}
                                                    disabled={!this.state.automatic_conf}
                                                />
                                                <Form.Check
                                                    type="radio"
                                                    label="Step-by-step"
                                                    name="automatic_type"
                                                    value="Step-by-step"
                                                    checked={this.state.automatic_type === "Step-by-step"}
                                                    onChange={this.onChange}
                                                    disabled={!this.state.automatic_conf}
                                                />
                                                <hr style={{ color: 'black', backgroundColor: 'black', height: '5' }}/>
                                                <Form.Label as="legend"><h5>Search Type</h5> </Form.Label>
                                                <Form.Check
                                                    type="radio"
                                                    label="Random Search"
                                                    name="search_type"
                                                    value="Random Search"
                                                    checked={this.state.search_type === "Random Search"}
                                                    onChange={this.onChange}
                                                    disabled={!this.state.automatic_conf || this.state.automatic_type === "Holistic"}
                                                />
                                                <Form.Check
                                                    type="radio"
                                                    label="Grid Search"
                                                    name="search_type"
                                                    value="Grid Search"
                                                    checked={this.state.search_type === "Grid Search"}
                                                    onChange={this.onChange}
                                                    disabled={!this.state.automatic_conf || this.state.automatic_type === "Holistic"}
                                                /> 
                                            
                                            <br/>
                                            <br/>
                                            {execution_status_view}

                                            </Col>

                                            <Col  sm={empty_col} />

                                            <Col  sm={speedometer_col}>
                                                <div className="caption_item">
                                                <span className="caption">Recall</span>
                                                    <ReactSpeedometer  
                                                        value={this.state.execution_results.recall} 
                                                        maxValue={100} 
                                                        segments={5} 
                                                        segmentColors={[
                                                            "#ffad33",
                                                            "#ffad33",
                                                            "#a3be8c",
                                                            "#a3be8c",
                                                            "#61d161"
                                                        ]}
                                                    />
                                                   
                                                </div>
                                            </Col>
                                            
                                            <Col  sm={speedometer_col}>
                                                <div className="caption_item">
                                                <span className="caption">Precision</span>
                                                    <ReactSpeedometer  
                                                        value={this.state.execution_results.precision} 
                                                        maxValue={100} 
                                                        segments={5} 
                                                        segmentColors={[
                                                            "#ffad33",
                                                            "#ffad33",
                                                            "#a3be8c",
                                                            "#a3be8c",
                                                            "#61d161"
                                                        ]}
                                                    />
                                                   
                                                </div>
                                            </Col>

                                            <Col  sm={speedometer_col}>
                                                <div className="caption_item">
                                                <span className="caption">F1-measure</span>
                                                    <ReactSpeedometer  
                                                        value={this.state.execution_results.f1_measure} 
                                                        maxValue={100} 
                                                        segments={5} 
                                                        segmentColors={[
                                                            "#ffad33",
                                                            "#ffad33",
                                                            "#a3be8c",
                                                            "#a3be8c",
                                                            "#61d161"
                                                        ]}
                                                    />
                                                    
                                                </div>
                                            </Col>
                                        </Form.Group>

                                        
                                                
                                        {execution_stats}
                                       
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
                                <h1>Workbench</h1>
                            </Tab>
                        </Tabs>


                        {execution_msg}

                        <br/>

                        <div style={{marginBottom: '20px', paddingBottom:'20px'}}>
                            <div style={{float:'left'}}>
                                <Form.Group as={Row}  className="form-row">
                                    <Button variant="primary" style={{width:"150", marginRight:"10px"}} onClick={this.executeWorkFlow}>Execute Workflow</Button>
                                    <Button variant="secondary" style={{width:"100px", marginRight:"10px"}}>Explore</Button>
                                    <Button variant="secondary" style={{width: "100px", marginRight:"10px"}}>Show Plot</Button>
                                </Form.Group>
                                <Form.Group as={Row}  className="form-row">
                                    <Form.Control
                                        style={{width:"260px", marginRight:"10px"}} 
                                        as="select" 
                                        placeholder="Select Filetype" 
                                        name="export_filetype" 
                                        onChange={this.onChange}
                                        disabled={false}
                                        value={this.state.export_filetype}
                                    >
                                        <option value="" ></option>
                                        <option value="CSV" >CSV</option>
                                        <option value="RDF" >RDF</option>
                                        <option value="XML" >XML</option>
                                    </Form.Control>   
                                    <Button style={{width:"100px", marginRight:"10px"}} disabled={this.state.export_filetype === ""}>Export</Button>
                                </Form.Group>
                            </div>
                            
                            
                            
                            <div style={{float: 'right'}}>                                    	
                                <Form.Group as={Row}   className="form-row">
                                    <Button variant="secondary" style={{width:"100px", marginRight:"10px"}}>Back</Button>
                                    <Link to="/">
                                        <Button variant="secondary" style={{width: "100px", marginRight:"10px"}}>Start Over</Button>
                                    </Link>
                                </Form.Group>
                            </div>
                        </div>
                        <br/>

                        
                    </div>
                </Jumbotron>
            </div>
        )
    }
}


export default ExecutionView 