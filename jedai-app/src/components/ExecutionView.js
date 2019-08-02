import React, { Component } from 'react'
import {Jumbotron, Tabs, Tab, Form, Row, Col, Button} from 'react-bootstrap';
import ReactSpeedometer from "react-d3-speedometer"

import "../css/main.css"

class ExecutionView extends Component {

    state = {
        automatic_type: "Holistic",
        search_type: "Random Search",
        export_filetype: ""
      };

    onChange = (e) => this.setState({[e.target.name]: e.target.value}) 

    executeWorkFlow = (e) =>{
       axios.get("/workflow/execution/automatic_type/"+this.state.automatic_type + "/search_type/"+this.state.search_type)
    }

    render() {

        var radio_col = 1.8
        var empty_col = 1
        var speedometer_col = 2.5


        return (
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
                                    <Form.Group as={Row}  className="form-row">
                                        <Col  sm={radio_col}>
                                            <Form.Label as="legend"><h5>Automatic Configuration Type</h5> </Form.Label>
                                            <Form.Check
                                                type="radio"
                                                label="Holistic"
                                                name="automatic_type"
                                                value="Holistic"
                                                checked={this.state.automatic_type === "Holistic"}
                                                onChange={this.onChange}
                                            />
                                            <Form.Check
                                                type="radio"
                                                label="Step-by-step"
                                                name="automatic_type"
                                                value="Step-by-step"
                                                checked={this.state.automatic_type === "Step-by-step"}
                                                onChange={this.onChange}
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
                                            />
                                            <Form.Check
                                                type="radio"
                                                label="Grid Search"
                                                name="search_type"
                                                value="Grid Search"
                                                checked={this.state.search_type === "Grid Search"}
                                                onChange={this.onChange}
                                            />                                            
                                        </Col>

                                        <Col  sm={empty_col} />

                                        <Col  sm={speedometer_col}>
                                            <div className="caption_item">
                                            <span className="caption">Recall</span>
                                                <ReactSpeedometer  
                                                    value={50} 
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
                                                    value={50} 
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
                                                    value={50} 
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
                                    <br />

                                    
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
                                    


                                </Form>
                            </div>
                        </Tab>
                        <Tab eventKey="details" title="Details" className="Jumbotron_Tab">
                            <br/>
                            <h1>Details</h1>
                        </Tab>
                        <Tab eventKey="workbench" title="Workbench" className="Jumbotron_Tab">
                            <br/>
                            <h1>Workbench</h1>
                        </Tab>
                    </Tabs>
                    
                </div>
            </Jumbotron>
        )
    }
}




export default ExecutionView 