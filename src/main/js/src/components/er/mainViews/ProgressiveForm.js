import React, { Component } from 'react'
import StepZilla from "react-stepzilla"
import Jumbotron from 'react-bootstrap/Jumbotron';
import DataReader from '../workflowViews/dataRead/DataReader'
import SchemaClustering from '../workflowViews/SchemaClustering'
import BlockBuilding from '../workflowViews/BlockBuilding'
import BlockCleaning from '../workflowViews/BlockCleaning'
import ComparisonCleaning from '../workflowViews/ComparisonCleaning'
import EntityMatching from '../workflowViews/EntityMatching'
import EntityClustering from '../workflowViews/EntityClustering'
import ConfirmConfiguration from '../workflowViews/ConfirmConfiguration'
import Prioritization from '../workflowViews/Prioritization'
import '../../../../../resources/static/css/progressSteps.css'
import '../../../../../resources/static/css/main.css'


class ProgressiveForm extends Component {

    constructor(...args){
        super(...args);

        if(typeof args[0].location.state != "undefined"){
            let new_state = args[0].location.state.conf
            this.state ={
                data_reading: new_state.data_reading,
                schema_clustering: new_state.schema_clustering,
                block_building: new_state.block_building,
                block_cleaning: new_state.block_cleaning,
                comparison_cleaning: new_state.comparison_cleaning,
                prioritization: new_state.prioritization,
                entity_matching: new_state.entity_matching,
                entity_clustering: new_state.entity_clustering
            }
        }
        else{

            // Default states of the workflow stages
            this.state = {
                data_reading: null,
                schema_clustering:  {
                    method_name: "NO_SCHEMA_CLUSTERING",
                    configuration_type: "Default",
                    label: "No Schema Clustering",
                    parameters: [
                        {
                            label: "Representation Model",
                            value: "TOKEN_UNIGRAM_GRAPHS"
                        },
                        {
                            label: "Similarity Measure",
                            value: "GRAPH_VALUE_SIMILARITY"
                        }
                    ]
                },
                block_building: [],
                block_cleaning: [],
                comparison_cleaning: {
                    method_name: "NO_CLEANING",
                    configuration_type: "Default",
                    label: "No Cleaning",
                    parameters: []
                },
                prioritization:  {
                    method_name: "PROGRESSIVE_BLOCK_SCHEDULING",
                    configuration_type: "Default",
                    label: "Progressive Block Scheduling",
                    parameters: [
                        {
                            label: "Budget",
                            value: "10000"
                        },
                        {
                            label: "Weighting Scheme",
                            value: "JS"
                        }
                    ]
                },
                entity_matching:  {
                    method_name: "PROFILE_MATCHER",
                    configuration_type: "Default",
                    label: "Profile Matcher",
                    parameters: [
                        {
                            label: "Representation Model",
                            value: "TOKEN_UNIGRAM_GRAPHS"
                        },
                        {
                            label: "Similarity Measure",
                            value: "GRAPH_VALUE_SIMILARITY"
                        }
                    ]
                },
                entity_clustering: {
                    method_name: "CENTER_CLUSTERING",
                    configuration_type: "Default",
                    label: "Center Clustering",
                    parameters  : [
                        {
                            label: "Similarity Threshold",
                            value: "0.5"
                        }
                    ]
                }
            }
        }
    }
    

    // Get data from child components
    submitState = (state_name, state_value) =>{
        this.setState({
            [state_name]: state_value
        })
    }

    componentDidMount(){
        if (typeof this.props.location.state != "undefined")
        console.log(this.props.location.state.conf)
    }

    render() {
        var GTIsSet = false
        if (this.state.data_reading != null && typeof this.state.data_reading !== 'undefined')
            if (this.state.data_reading.groundTruth_set != null && typeof this.state.data_reading.groundTruth_set !== 'undefined') 
                GTIsSet = true

        var er_mode = "dirty"
        if (this.state.data_reading !== null)
            er_mode = this.state.data_reading.er_mode
            if (er_mode === "clean" && this.state.entity_clustering.method_name !=="UNIQUE_MAPPING_CLUSTERING"){
                this.setState({ entity_clustering : {
                        method_name: "UNIQUE_MAPPING_CLUSTERING",
                        label: "Unique Mapping Clustering",
                        configuration_type: "Default",
                        parameters  : [
                            {
                                label: "Similarity Threshold",
                                value: "0.5"
                            }
                        ]
                    }
                })
            }

        const steps =
        [
            {name: 'Data Reading', component: <DataReader submitState={this.submitState} state={this.state.data_reading}/>},
            {name: 'Schema Clustering', component: <SchemaClustering submitState={this.submitState} state={this.state.schema_clustering} GTIsSet={GTIsSet}/>},
            {name: 'Block Building', component: <BlockBuilding submitState={this.submitState} state={this.state.block_building} isProgressive={true} GTIsSet={GTIsSet}/>},
            {name: 'Block Cleaning', component: <BlockCleaning submitState={this.submitState} state={this.state.block_cleaning} GTIsSet={GTIsSet}/>},
            {name: 'Comparison Cleaning', component: <ComparisonCleaning submitState={this.submitState} state={this.state.comparison_cleaning} GTIsSet={GTIsSet}/>},
            {name: 'Prioritization', component: <Prioritization submitState={this.submitState} state={this.state.prioritization} isBlockBuildingEmpty={this.state.block_building.length == 0}/>},
            {name: 'Entity Matching', component: <EntityMatching submitState={this.submitState} state={this.state.entity_matching} GTIsSet={GTIsSet}/>},
            {name: 'Entity Clustering', component: <EntityClustering submitState={this.submitState} er_mode={er_mode} state={this.state.entity_clustering} GTIsSet={GTIsSet}/>}, 
            {name: 'Confirm Configuration', component: <ConfirmConfiguration state={this.state}/>} 
           
        ]
        return (
            
                <Jumbotron  className='jumbotron_2'>
                    <div className="container-fluid">
                        <div className="step-progress">
                            <StepZilla    
                                steps={steps} 
                                showSteps={true}
                                stepsNavigation={false}
                                preventEnterSubmission={true}
                                
                                backButtonCls={"btn btn-next btn-primary float-left"}
                                nextButtonCls={"btn btn-prev btn-primary float-right"}
                                
                            />
                        </div>
                    </div>
                </Jumbotron>
        )
    }
}


export default ProgressiveForm