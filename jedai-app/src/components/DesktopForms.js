import React, { Component } from 'react'
import StepZilla from "react-stepzilla"
import Jumbotron from 'react-bootstrap/Jumbotron';
import DataReader from './workflowViews/dataRead/DataReader'
import SchemaClustering from './workflowViews/SchemaClustering'
import BlockBuilding from './workflowViews/BlockBuilding'
import BlockCleaning from './workflowViews/BlockCleaning'
import ComparisonCleaning from './workflowViews/ComparisonCleaning'
import EntityMatching from './workflowViews/EntityMatching' 
import EntityClustering from './workflowViews/EntityClustering' 
import ConfirmConfiguration from './workflowViews/ConfirmConfiguration'
import '../css/progressSteps.css'
import '../css/main.css'


class DesktopForms extends Component {

    // Default states of the workflow stages
    state = {
        
        data_reading: null,


        schema_clustering:  {
            method: "NO_SCHEMA_CLUSTERING",
            conf_type: "Default",
            label: "No Schema Clustering"
        },
        
        block_building: null,
        
        block_cleaning: null,

        comparison_cleaning: {
            method: "NO_CLEANING",
            conf_type: "Default",
            label: "No Cleaning"
        },
        
        entity_matching:  {
            method: "GROUP_LINKAGE",
            conf_type: "Default",
            label: "Group Linkage"
        },
        
        entity_clustering: {
            method: "CONNECTED_COMPONENTS_CLUSTERING",
            conf_type: "Default",
            label: "Connected Component Clustering"
        }
    }
    

    // Get data from child components
    submitState = (state_name, state_value) =>{
        this.setState({
            [state_name]: state_value
        })
    }

    render() {
        var er_mode = "dirty"
        if (this.state.data_reading !== null)
            er_mode = this.state.data_reading.er_mode
            if (er_mode === "clean" && this.state.entity_clustering.method !=="UNIQUE_MAPPING_CLUSTERING"){
                this.setState({ entity_clustering : {
                        method: "UNIQUE_MAPPING_CLUSTERING",
                        label: "Unique Mapping Clustering",
                        conf_type: "Default"
                    }
                })
            }

        const steps =
        [
            {name: 'Data Reading', component: <DataReader submitState={this.submitState} state={this.state.data_reading}/>},
            {name: 'Schema Clustering', component: <SchemaClustering submitState={this.submitState} state={this.state.schema_clustering}/>},
            {name: 'Block Building', component: <BlockBuilding submitState={this.submitState} state={this.state.block_building}/>},
            {name: 'Block Cleaning', component: <BlockCleaning submitState={this.submitState} state={this.state.block_cleaning}/>},
            {name: 'Comparison Cleaning', component: <ComparisonCleaning submitState={this.submitState} state={this.state.comparison_cleaning}/>},
            {name: 'Entity Matching', component: <EntityMatching submitState={this.submitState} state={this.state.entity_matching}/>},
            {name: 'Entity Clustering', component: <EntityClustering submitState={this.submitState} er_mode={er_mode} state={this.state.entity_clustering}/>}, 
            {name: 'Confirm Configuration', component: <ConfirmConfiguration state={this.state}/>} 
           
        ]
        return (
            <div >
                <Jumbotron  className='jumbotron_2'>
                    <div className='step-progress'>
                    
                        <StepZilla 
                            
                            steps={steps} 
                            showSteps={true}
                            stepsNavigation={false}
                            preventEnterSubmission={true}
                            
                            backButtonCls={"btn btn-next btn-primary float-left"}
                            nextButtonCls={"btn btn-prev btn-primary float-right"}
                            
                        />
                    </div>
                </Jumbotron>
            </div>
        )
    }
}





export default DesktopForms