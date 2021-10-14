import React, { Component } from 'react'
import PropTypes from 'prop-types';
import {Form, Row, Col, FormControl, Collapse, Jumbotron } from 'react-bootstrap/'
import RadioMethod from './utilities/RadioMethod'
import AlertModal from './utilities/AlertModal'
import axios from 'axios';


class Prioritization extends Component {

    constructor(...args) {
        super(...args);
        window.scrollTo(0, 0)
        this.alertText = "Error while setting the methods parameters."

        this.default_parameters = [
            {
                parameters: [{
                    label: "Budget",
                    value: "10000"
                },
                {
                    label: "Weighting Scheme",
                    value: "JS"
                }]
            },
            {
                parameters: [{
                    label: "Budget",
                    value: "10000"
                }]
            }
        ]
        this.state = {
            method_name: this.props.state.method_name,
            configuration_type: this.props.state.configuration_type,
            label: this.props.state.label,
            parameters: this.props.state.parameters,
            alertShow : false
        }
        if (this.props.isBlockBuildingEmpty){
            this.state.method_name = "GLOBAL_PROGRESSIVE_SORTED_NEIGHBORHOOD"
            this.state.label = "Global Progressive Sorted Neighborhood"
        }
        
        this.methods = 
            [
                {
                    value: "GLOBAL_PROGRESSIVE_SORTED_NEIGHBORHOOD",
                    label: "Global Progressive Sorted Neighborhood",
                    disabled: !this.props.isBlockBuildingEmpty
                },
                {
                    value: "LOCAL_PROGRESSIVE_SORTED_NEIGHBORHOOD",
                    label: "Local Progressive Sorted Neighborhood",
                    disabled: !this.props.isBlockBuildingEmpty
                },
                {
                    value: "PROGRESSIVE_BLOCK_SCHEDULING",
                    label: "Progressive Block Scheduling",
                    disabled: this.props.isBlockBuildingEmpty
                },
                {
                    value: "PROGRESSIVE_ENTITY_SCHEDULING",
                    label: "Progressive Entity Scheduling",
                    disabled: this.props.isBlockBuildingEmpty
                },
                {
                    value: "PROGRESSIVE_GLOBAL_TOP_COMPARISONS",
                    label: "Progressive Global Top Comparisons",
                    disabled: this.props.isBlockBuildingEmpty
                },
                {
                    value: "PROGRESSIVE_LOCAL_TOP_COMPARISONS",
                    label: "Progressive Local Top Comparisons",
                    disabled: this.props.isBlockBuildingEmpty
                },
                {
                    value: "PROGRESSIVE_GLOBAL_RANDOM_COMPARISONS",
                    label: "Progressive Global Random Comparisons",
                    disabled: this.props.isBlockBuildingEmpty
                },
                {
                    value: "RANDOM",
                    label: "Random Prioritization",
                    disabled: this.props.isBlockBuildingEmpty
                }
            ]
    }


    

    onChange = (e) => {
        // set parameters to default values
        var parameters 
        if (e.method_name != "LOCAL_PROGRESSIVE_SORTED_NEIGHBORHOOD" && e.method_name != "GLOBAL_PROGRESSIVE_SORTED_NEIGHBORHOOD")
            parameters = this.default_parameters[0].parameters
        else 
            parameters = this.default_parameters[1].parameters
        this.setState(
            {
                method_name: e.method_name,
                configuration_type: e.configuration_type,
                label: e.label,
                parameters: parameters
            }
        )
    } 

    changeParameters = (e) =>{
        var name = e.target.name
        var value = e.target.value

        if (name == "budget"){
            var temp_parameters = this.state.parameters
            temp_parameters[0].value = value
            this.setState({parameters: temp_parameters})
        }
        else if(name == "weighting_scheme" && (value == "ARCS" || value == "CBS" || value == "ECBS" || value == "JS" || value == "EJS" || value == "PEARSON_X2")){
            var temp_parameters = this.state.parameters
            temp_parameters[1].value = value
            this.setState({parameters: temp_parameters})
        }
    }

    // 

    isValidated(){
        
        return axios({
            url: '/workflow/set_configurations/prioritization',
            method: 'POST',
            data: this.state
        }).then(res => {
            var success = res.data
            this.props.submitState("prioritization", this.state)
            var s = this.state.method_name !== "" && this.state.configuration_type !== "" && success
            if (!s){
                this.handleAlertShow()
                return false
            }
            else
                return true
        })
    }

    //handle alert modal
    handleAlertClose = () => this.setState({alertShow : false});
    handleAlertShow = () => this.setState({alertShow : true});
    

    render() {

        var empty_col = 1
        var first_col = 4
        var second_col = 5

        var weighting_scheme_form = <div />
        if (this.state.method_name != "LOCAL_PROGRESSIVE_SORTED_NEIGHBORHOOD" && this.state.method_name != "GLOBAL_PROGRESSIVE_SORTED_NEIGHBORHOOD" && this.state.method_name != "RANDOM")
            weighting_scheme_form = 
                        <Form.Row>
                            <Col sm={empty_col} />
                            <Col sm={first_col}>
                                <Form.Label >Weighting Scheme</Form.Label> 
                            </Col>
                            <Col sm={second_col}>
                                <Form.Group>
                                    <Form.Control 
                                        as="select" 
                                        name="weighting_scheme" 
                                        value={this.state.parameters[1].value}
                                        onChange={e => this.changeParameters(e)}
                                    >
                                        <option value="ARCS" >ARCS</option>
                                        <option value="CBS" >CBS</option>
                                        <option value="ECBS" >ECBS</option>
                                        <option value="JS" >JS</option>
                                        <option value="EJS" >EJS</option>
                                        <option value="PEARSON_X2" >PEARSON_X2</option>

                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col sm={2}>
                                <span title="The Weighting Scheme determines the function that assigns weights to the non-redundant comparisons within each block." className="fa fa-info-circle fa-2x" style={{color: "#4663b9"}}/>	
                            </Col>
                        </Form.Row>

        var parameters_JSX_window = 
                    <Form>
                        <div style ={{textAlign:'center'}}>
                            <h3>{this.state.label}</h3>
                            <p>Please configure the method's parameters below</p>
                        </div>
                        <br />
                        <Form.Row className="form-row">
                            <Col sm={empty_col} />
                            <Col sm={first_col} >
                                <Form.Label>Budget</Form.Label> 
                            </Col>
                            <Col sm={second_col}>
                                <FormControl 
                                    type="text" 
                                    name="budget" 
                                    onChange={(e) => this.changeParameters(e)}
                                    value={this.state.parameters[0].value} 
                                />
                            </Col>
                            <Col sm={2}>
                                <span title="The Budget defines the maximum number of pairwise comparisons that will be executed." className="fa fa-info-circle fa-2x" style={{color: "#4663b9"}}/>	
                            </Col>
                        </Form.Row>
                        {weighting_scheme_form}
                    </Form>
            

        return (
            <div>
                <AlertModal title="Wrong Input" text={this.alertText} show={this.state.alertShow} handleClose={this.handleAlertClose} />
                
                <br/>
                <div style={{marginBottom:"5px"}}> 
                    <h1 style={{display:'inline', marginRight:"20px"}}>Prioritization</h1> 
                    <span className="workflow-desc">This step associates all comparisons in a block collection with a weight that is proportional to the likelihood that they involve duplicates and ten, it emits them iteratively, in a decreasing weight.</span>
                </div>

                <br/>
                <hr style={{ color: 'black', backgroundColor: 'black', height: '5' }}/>
                <br/>

                <Form.Group as={Row} className="form-row" > 
                    <Form.Label><h5>Select a Prioritization method</h5></Form.Label>
                </Form.Group> 

                <RadioMethod methods={this.methods} state={this.state} auto_disabled={false} onChange={this.onChange} title={"Prioritization methods"}/>

                <br/>
                <Collapse in={this.state.configuration_type === "Manual"} >
                    <div className="jumbotron_parameters_container">
                        <Jumbotron className="jumbotron_parameters" style={{width:"100%"}}>
                            <div style={{margin:"auto"}}>
                                {parameters_JSX_window}
                            </div>
                        </Jumbotron>
                    </div>
                </Collapse>

            </div>
        )
    }
}

Prioritization.propTypes = {
    state: PropTypes.object.isRequired,
    submitState: PropTypes.func.isRequired,
    isBlockBuildingEmpty: PropTypes.bool.isRequired
}

export default Prioritization
