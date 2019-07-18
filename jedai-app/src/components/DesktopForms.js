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


    state = {
        data_reading: null,
        schema_clustering: null,
        block_building: null,
        block_cleaning: null,
        comparison_cleaning: null,
        entity_matching: null,
        entity_clustering: null
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
        const steps =
        [
            {name: 'Data Reading', component: <DataReader submitState={this.submitState} />},
            {name: 'Schema Clustering', component: <SchemaClustering submitState={this.submitState}/>},
            {name: 'Block Building', component: <BlockBuilding submitState={this.submitState}/>},
            {name: 'Block Cleaning', component: <BlockCleaning submitState={this.submitState}/>},
            {name: 'Comparison Cleaning', component: <ComparisonCleaning submitState={this.submitState}/>},
            {name: 'Entity Matching', component: <EntityMatching submitState={this.submitState}/>},
            {name: 'Entity Clustering', component: <EntityClustering submitState={this.submitState} er_mode={er_mode}/>}, 
            {name: 'Confirm Configuration', component: <ConfirmConfiguration />} 
           
        ]
        return (
            <div >
                <Jumbotron  className='jumbotron_2'>
                    <div className='step-progress'>
                    
                        <StepZilla 
                            style={{padding:'10000px'}}
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