import React, { Component } from 'react'
import { Blob } from 'react-blob'
import {Jumbotron,Modal, Tabs, Tab, Form, Row, Col, Button, Spinner, OverlayTrigger, Tooltip, Table} from 'react-bootstrap';
import ReactSpeedometer from "react-d3-speedometer"
import {Link,withRouter } from 'react-router-dom';
import "../../../../../resources/static/css/main.css"
import AlertModal from '../workflowViews/utilities/AlertModal'
import Explorer from '../workflowViews/utilities/explorer/Explorer'
import axios from 'axios';
import { saveAs } from 'file-saver';
import Workbench from './Workbench'
import ConfigurationsView from '../workflowViews/utilities/ConfigurationsView'
import Plot from '../../../../../../../node_modules/react-plotly.js/react-plotly';


class ExecutionView extends Component {
    
    constructor(...args) {
       
        super(...args);
        this.explorer_get_entities = false;
        this.alertText = ""
        this.start_over_path = "/"
        this.state = {
            workflowID : -1,
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
            workbench_data: [],
            
            alertShow: false,
            show_explore_window : false,
            show_plot_modal: false,
            show_configuration_modal: false,
            workflow_configurations: {},
            tabkey: "result",
            plot: {x: [], y: []},
            wf_mode: null
        }
    
               
    }

    componentDidMount(){
        if (typeof this.props.location.state.conf != "undefined"){
            this.setState({wf_state: this.props.location.state.conf})
        }
        else
          this.start_over_path = "/"
        if (typeof this.props.location.state.data != "undefined"){
            this.init(this.props.location.state.data)
        }
        else 
            this.init("") 
    }

    init = (state) =>{
        window.scrollTo(0, 0)
        this.alertText = ""
        this.explorer_get_entities = false;

        if (state != ""){
            this.explorer_get_entities = true;
            var results = {
                recall: parseFloat(state.recall[0]).toFixed(2),
                f1_measure: parseFloat(state.fmeasure[0]).toFixed(2),
                precision: parseFloat(state.precision[0]).toFixed(2),

                input_instances: state.inputInstances,
                existing_duplicates: state.existingDuplicates,
                total_time : parseFloat(state.time[0]).toFixed(2),

                no_clusters : state.clusters,
                detected_duplicates : state.detectedDuplicates,
                total_matches: state.totalMatches
            }
            this.setState({
                workflowID : state.workflowID,
                details_msg: "", 
                execution_step: "",
                execution_status : "Completed",
                execution_results : results,
                tabkey: "result"              
            })

        }
        axios.get("/workflow/automatic_conf/").then(res => this.setState({ automatic_conf: res.data}))
        axios.get("/workflow/gtisset/").then(res => this.setState({ GT_isSet: res.data}))
        this.getWorkbenchData()
        this.eventSource = new EventSource("/workflow/sse") 
        this.eventSource.addEventListener("execution_step", (e) => this.setState({execution_step: e.data}))
       
        this.eventSource.addEventListener("workflow_details", (e) => {
            var msg = this.state.details_msg + "\n" + e.data 
            this.setState({details_msg: msg})
        })

        this.eventSource.addEventListener("exception", (e) => {
            this.alertText = e.data
            this.handleAlertShow()
            this.setState({
                execution_step: "",
                execution_status: "Failed"}
            )
        })
        axios.get("/workflow/id").then(res => this.setState({ workflowID: res.data}))
        axios.get("/workflow/wfmode").then(res => {
            let mode = res.data
            switch(mode){
                case "Blocking-based":
                    this.start_over_path = "/blockingbased"
                    break
                case "Join-based":
                    this.start_over_path = "/joinbased"
                    break
                case "Progressive":
                    this.start_over_path = "/progressive"
                    break
                default:
                    this.start_over_path = "/"
            }
            this.setState({ wf_mode: mode})
        })
    }


    setNewWorkflow = (e, id) => {
        axios.get("/workflow/set_workflow/"+id)
        .then(res => {
            this.init(res.data) 
        })
    }

    getWorkbenchData = () => 
        axios.get("/workflow/workbench/")
        .then(res => this.setState({workbench_data: res.data}))
    
    handleAlertClose = () => this.setState({alertShow : false});
    handleAlertShow = () => this.setState({alertShow : true});
    
    close_explore_window = () => this.setState({show_explore_window : false});
    open_explore_window = () => this.setState({show_explore_window : true});
    
    close_plot_window = () => this.setState({show_plot_window : false});
    open_plot_window = () => this.setState({show_plot_window : true});
    
    close_configuration_modal = () => this.setState({show_configuration_modal : false});
    open_configuration_modal = () => this.setState({show_configuration_modal : true});

    previewWorkflow = (e) => {
        var wf_data = null
        axios
        .get("/workflow/get_configurations/" + this.state.workflowID)
        .then(res => {
            wf_data = res.data
            if (wf_data != ""){
                this.setState(
                    {workflow_configurations: wf_data},
                    () => {this.open_configuration_modal()})
            }
        })
    }

    onChange = (e) => this.setState({[e.target.name]: e.target.value}) 

    changeTab = (key) => this.setState({tabkey: key})

    // get filename from header
    extractFileName = (contentDispositionValue) => {
         var filename = "";
         if (contentDispositionValue && contentDispositionValue.indexOf('attachment') !== -1) {
             var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
             var matches = filenameRegex.exec(contentDispositionValue);
             if (matches != null && matches[1]) {
                 filename = matches[1].replace(/['"]/g, '');
             }
         }
         return filename;
     }
    
    
    // export file containing the results and the performance
    export =(e) =>{
    	
    	this.setState({ execution_status: "Downloading" });
        axios
        .get("/workflow/export/"+this.state.export_filetype, { responseType:"blob" })
        .then(response => {
        	
            this.setState({ execution_status: "Completed" });
            
            //extract file name from Content-Disposition header
            var filename=this.extractFileName(response.headers['content-disposition']);
            saveAs(response.data, filename);
            
        }).catch(function (error) {
            console.log(error);
            
            if (error.response) {
                console.log('Error', error.response.status);
                this.alertText = error.response.status
                this.handleAlertShow()
            } else {
                console.log('Error', error.message);
                this.alertText = error.message
                this.handleAlertShow()
            }
        });
    }
    
    
    explore=(e) =>{
        this.forceUpdate()
    	if (this.state.show_explore_window)
    		this.close_explore_window()
    	else
    		this.open_explore_window()
    }
    
    // Execute the Workflow
    executeWorkFlow = (e) =>{
        this.setState({
            details_msg: "",
            execution_status: "Running",
            show_explore_window: false
        })
        axios
        .get("/workflow/execution/automatic_type/"+this.state.automatic_type + "/search_type/"+this.state.search_type)
        .then(res => {
            
            if (res.data !== null && res.data !== ""){
                this.explorer_get_entities = true;
                var data_stat = res.data.value0
                var total_time = res.data.value1
                var no_istamces = res.data.value2
                
                if (data_stat.recall > 0 ) data_stat.recall = parseFloat(data_stat.recall).toFixed(3)
                else data_stat.recall = parseFloat(0.00)

                if (data_stat.fmeasure > 0 ) data_stat.fmeasure = parseFloat(data_stat.fmeasure).toFixed(3)
                else data_stat.fmeasure = parseFloat(0.00)

                if (data_stat.precision > 0 ) data_stat.precision = parseFloat(data_stat.precision).toFixed(3)
                else data_stat.precision = parseFloat(0.00)
                
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
                this.getWorkbenchData()
                
            }
            else{
                this.setState({
                    execution_status: "Failed"
                })
            }
        })
    }

    stop_execution = (e) => {
        this.setState({execution_step: "Stopping"})
        axios.get("/workflow/stop/")
    }

    plotCurve = () =>{
        axios.get("/workflow/plot/").then(res => { 
            let data = res.data
            let y_ = data.map(p => p[0])
            let x_ = data.map(p => p[1])
            let plotStats = {x: x_, y: y_}
            this.setState({plot: plotStats}, () => {this.open_plot_window()})
        })
    }


    render() {
        var radio_col = 1.8
        var empty_col = 1
        var speedometer_col = 2.5
        var execution_stats = <div />

        var plot_size = this.state.plot.length
        var plot_curve = [{
            x:this.state.plot.x,
            y: this.state.plot.y,
            mode: 'markers',
            type: 'scatter'
        }]

        var layout = {
            title: {
              text:'Progressive Workflow plot Curve',
              font: {
                family: 'Courier New, monospace',
                size: 24
              },
              xref: 'paper',
              x: 0.05,
            },
            xaxis: {
              title: {
                text: 'comparisons/#matches',
                font: {
                  family: 'Courier New, monospace',
                  size: 18,
                  color: '#7f7f7f'
                }
              },
            },
            yaxis: {
              title: {
                text: 'Recall',
                font: {
                  family: 'Courier New, monospace',
                  size: 18,
                  color: '#7f7f7f'
                }
              }
            }
          };

          
        
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
            case "Downloading":
                execution_status_view =
                    <div>
                        <h3> <span style={{display:"inline", marginRight: "20px"}}>Status: </span>  <span style={{color: "#4663b9"}}><b>{this.state.execution_status}</b></span></h3>
                    </div>
                break;
            case "Completed":
                
                execution_status_view =
                    <div>
                        <h3> <span style={{display:"inline", marginRight: "20px"}}>Status: </span>  <span style={{color: "#00802b"}}><b>{this.state.execution_status}</b></span></h3>
                    </div>
                    
               // Execution Results style={{marginLeft:"28%"}}
               execution_stats = 
                <div style={{margin:"auto", width:"70%"}}>
                        <Table responsive="sm">
                            <thead>
                            </thead>
                            <tbody>
                            <tr>
                                <td><h4 style={{color:"#4663b9"}} className="form-row" >Input Instances:</h4></td>
                                <td style={{fontSize:"150%"}}>{this.state.execution_results.input_instances}</td>
                                <td><h4 style={{color:"#4663b9"}} className="form-row" >Number of Clusters:</h4></td>
                                <td style={{fontSize:"150%"}}>{this.state.execution_results.no_clusters}</td>
                            </tr>
                            <tr>
                                <td><h4 style={{color:"#4663b9"}} className="form-row" >Existing Duplicates:</h4></td>
                                <td style={{fontSize:"150%"}}>{this.state.execution_results.existing_duplicates}</td>
                                <td><h4 style={{color:"#4663b9"}} className="form-row" >Detected Duplicates:</h4></td>
                                <td style={{fontSize:"150%"}}>{this.state.execution_results.detected_duplicates}</td>
                            </tr>
                            <tr>
                                <td><h4 style={{color:"#4663b9"}} className="form-row" >Total execution time (sec):</h4></td>
                                <td style={{fontSize:"150%"}}>{this.state.execution_results.total_time}</td>
                                <td><h4 style={{color:"#4663b9"}} className="form-row" >Total Matches:</h4></td>
                                <td style={{fontSize:"150%"}}>{this.state.execution_results.total_matches}</td>
                            </tr>
                        </tbody>
                    </Table>
                </div>
              
                break;
            case "Failed":
            case "Download Failed":
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

        var explorer =  <Explorer source="/workflow/" entity_id={"3"} get_entities={this.explorer_get_entities}  />
                         
        if (this.state.GT_isSet) {
            return (
                <div>
                    <Modal className="grey-modal" show={this.state.show_configuration_modal} onHide={this.close_configuration_modal} size="xl">
                        <Modal.Header closeButton>
                            <Modal.Title>Configurations of Workflow {this.state.workflowID}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body >
                            <ConfigurationsView state={this.state.workflow_configurations} />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" onClick={this.close_configuration_modal}>Close</Button>
                        </Modal.Footer>
                    </Modal>
                    <Modal show={this.state.show_explore_window} onHide={this.close_explore_window} size="xl">
                        <Modal.Header closeButton>
                            <Modal.Title>Explore</Modal.Title>
                        </Modal.Header>
                        <Modal.Body >{explorer}</Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" onClick={this.close_explore_window}>Close</Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal show={this.state.show_plot_window} onHide={this.close_plot_window} size="xl">
                        <Modal.Header closeButton>
                            <Modal.Title>Recall Curve</Modal.Title>
                        </Modal.Header>
                        <Modal.Body >
                            <h2>AUC: {(this.state.plot.y.reduce(function(a, b) { return a + b; }, 0) / this.state.plot.y.length).toFixed(3)}</h2>
                            <Plot data={plot_curve} layout={layout} style={{textAlign: "center", margin:"auto"}} />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" onClick={this.close_plot_window}>Close</Button>
                        </Modal.Footer>
                    </Modal>

                    <AlertModal title="Exception" text={this.alertText} show={this.state.alertShow} handleClose={this.handleAlertClose} />
                    <Jumbotron  className='jumbotron_2'>
                        <div className="container-fluid">
                            <br/>
                            <div style={{marginBottom:"5px"}}> 
                                <h1 style={{display:'inline', marginRight:"20px"}}>Workflow Execution</h1> 
                                <span className="workflow-desc" > Press "Execute Workflow" to run the algorithm. You can export the results to a file with the "Export" button.</span>
                            </div>
                            <br/>
                            <hr style={{ color: 'black', backgroundColor: 'black', height: '5' }}/>
                            <br/>

                            <Tabs activeKey={this.state.tabkey} onSelect={this.changeTab} defaultActiveKey="result" className="Jumbotron_Tabs">
                                <Tab eventKey="result" title="Results" className="Jumbotron_Tab">
                                    <div className="Tab_container">
                                        <br/>
                                        <Form>
                                            <Form.Group as={Row}  className="form-row" >
                                                <Col sm={radio_col}  style={{display: "inline-block"}}>
                                                    <Form.Label as="legend"><h5>Workflow ID: {this.state.workflowID}</h5> </Form.Label>
                                                    <OverlayTrigger
                                                        placement='top'
                                                        overlay={<Tooltip id='tooltip-top'>Preview</Tooltip>}>
                                                        <Button style={{marginLeft:"5px"}} variant="info" size="sm" onClick={e => this.previewWorkflow()} >
                                                            <span className="fa fa-eye"/>
                                                        </Button>
                                                    </OverlayTrigger>
                                                </Col>
                                            </Form.Group>
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

                                                <Col sm={empty_col} />
                                                <Col sm={speedometer_col} style={{marginRight:"20px"}}>
                                                    <div className="caption_item">
                                                    <h4 className="caption"><b>Precision</b></h4>
                                                        <ReactSpeedometer  
                                                            value={this.state.execution_results.precision} 
                                                            maxValue={1} 
                                                            segments={5} 
                                                            segmentColors={[
                                                                "#ffad33",
                                                                "#ffad33",
                                                                "#a3be8c",
                                                                "#a3be8c",
                                                                "#61d161"
                                                            ]}/>    
                                                    </div>
                                                </Col>

                                                <Col sm={speedometer_col} style={{marginRight:"20px"}}>
                                                    <div className="caption_item">
                                                    <h4 className="caption"><b>Recall</b></h4>
                                                        <ReactSpeedometer  
                                                            value={this.state.execution_results.recall} 
                                                            maxValue={1} 
                                                            segments={5} 
                                                            segmentColors={[
                                                                "#ffad33",
                                                                "#ffad33",
                                                                "#a3be8c",
                                                                "#a3be8c",
                                                                "#61d161"
                                                            ]}/>
                                                    </div>
                                                </Col>
                                                
                                                <Col sm={speedometer_col}style={{marginRight:"20px"}}>
                                                    <div className="caption_item">
                                                    <h4 className="caption"><b>F1-Measure</b></h4>
                                                        <ReactSpeedometer  
                                                            value={this.state.execution_results.f1_measure} 
                                                            maxValue={1} 
                                                            segments={5} 
                                                            segmentColors={[
                                                                "#ffad33",
                                                                "#ffad33",
                                                                "#a3be8c",
                                                                "#a3be8c",
                                                                "#61d161"
                                                            ]}/>   
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
                                    <Workbench data={this.state.workbench_data} getDataFunc={this.getWorkbenchData} setNewWorkflow={this.setNewWorkflow} />
                                </Tab>
                            </Tabs>
                            {execution_msg}
                            <br/>
                            <div style={{marginBottom: '20px', paddingBottom:'20px'}}>
                                <div style={{float:'left'}}>
                                    <Form.Group as={Row}  className="form-row">
                                        <Button variant="primary" 
                                            style={{width:"180", marginRight:"10px"}} 
                                            onClick={this.executeWorkFlow}
                                            disabled={this.state.execution_status === "Running"}
                                        >
                                            <span className="fa fa-play-circle" style={{marginRight: "10px"}}/>
                                            Execute Workflow
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
                                            disabled={this.state.wf_mode != "Progressive"}
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
                                            <option value="" ></option>
                                            <option value="CSV" >CSV</option>
                                            <option value="RDF" >RDF</option>
                                            <option value="XML" >XML</option>
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
                            <br/>
                                
                        </div>
                    </Jumbotron>
                </div>
            )
        }
        else
            return(
                <div>
                    <Modal className="grey-modal" show={this.state.show_configuration_modal} onHide={this.close_configuration_modal} size="xl">
                        <Modal.Header closeButton>
                            <Modal.Title>Configurations of Workflow {this.state.workflowID}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body >
                            <ConfigurationsView state={this.state.workflow_configurations} />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" onClick={this.close_configuration_modal}>Close</Button>
                        </Modal.Footer>
                    </Modal>
                    <Modal show={this.state.show_explore_window} onHide={this.close_explore_window} size="xl">
                        <Modal.Header closeButton>
                            <Modal.Title>Explore</Modal.Title>
                        </Modal.Header>
                        <Modal.Body >{explorer}</Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" onClick={this.close_explore_window}>Close</Button>
                        </Modal.Footer>
                    </Modal>

                    <AlertModal title="Exception" text={this.alertText} show={this.state.alertShow} handleClose={this.handleAlertClose} />
                    <Jumbotron  className='jumbotron_2'>
                        <div className="container-fluid">
                            <br/>
                            <div style={{marginBottom:"5px"}}> 
                                <h1 style={{display:'inline', marginRight:"20px"}}>Workflow Execution</h1> 
                                <span className="workflow-desc" > Press "Execute Workflow" to run the algorithm. You can export the results to a file with the "Export" button.</span>
                            </div>
                            <br/>
                            <hr style={{ color: 'black', backgroundColor: 'black', height: '5' }}/>
                            <br/>
                            <Tabs activeKey={this.state.tabkey} onSelect={this.changeTab} defaultActiveKey="result" className="Jumbotron_Tabs">
                                <Tab eventKey="result" title="Results" className="Jumbotron_Tab">
                                    <div className="Tab_container">
                                        <br/>
                                        <Form>
                                            <Form.Group as={Row}  className="form-row" >
                                                <Col sm={radio_col}  style={{display: "inline-block"}}>
                                                    <Form.Label as="legend"><h5>Workflow ID: {this.state.workflowID}</h5> </Form.Label>
                                                    <OverlayTrigger
                                                        placement='top'
                                                        overlay={<Tooltip id='tooltip-top'>Preview</Tooltip>}>
                                                        <Button style={{marginLeft:"5px"}} variant="info" size="sm" onClick={e => this.previewWorkflow()} >
                                                            <span className="fa fa-eye"/>
                                                        </Button>
                                                    </OverlayTrigger>
                                                </Col>
                                            </Form.Group>
                                            <Form.Group as={Row}  className="form-row" >
                                                <Col  sm={radio_col}>
                                                    <br/>
                                                    <br/>
                                                    {execution_status_view}
                                                </Col>
                                                <Col sm={empty_col} />
                                               
                                            </Form.Group>  
                                            <div style={{margin:"auto", width:"70%"}}>
                                            <Table responsive="sm">
                                                <thead>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td><h4 style={{color:"#4663b9"}} className="form-row" >Input Instances:</h4></td>
                                                        <td style={{fontSize:"150%"}}>{this.state.execution_results.input_instances}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><h4 style={{color:"#4663b9"}} className="form-row" >Number of Clusters:</h4></td>
                                                        <td style={{fontSize:"150%"}}>{this.state.execution_results.no_clusters}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><h4 style={{color:"#4663b9"}} className="form-row" >Total Matches:</h4></td>
                                                        <td style={{fontSize:"150%"}}>{this.state.execution_results.total_matches}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><h4 style={{color:"#4663b9"}} className="form-row" >Total execution time (sec):</h4></td>
                                                        <td style={{fontSize:"150%"}}>{this.state.execution_results.total_time}</td>
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
                                    <Workbench data={this.state.workbench_data} getDataFunc={this.getWorkbenchData} setNewWorkflow={this.setNewWorkflow} />
                                </Tab>
                            </Tabs>
                            {execution_msg}
                            <br/>
                            <div style={{marginBottom: '20px', paddingBottom:'20px'}}>
                                <div style={{float:'left'}}>
                                    <Form.Group as={Row}  className="form-row">
                                        <Button variant="primary" 
                                            style={{width:"180", marginRight:"10px"}} 
                                            onClick={this.executeWorkFlow}
                                            disabled={this.state.execution_status === "Running"}
                                        >
                                            <span className="fa fa-play-circle" style={{marginRight: "10px"}}/>
                                            Execute Workflow
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
                                            disabled={this.state.wf_mode != "Progressive"}
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
                                            <option value="" ></option>
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
                            <br/>

                        </div>
                    </Jumbotron>
                </div>
                
            )
        
    }
}


export default withRouter(ExecutionView)
