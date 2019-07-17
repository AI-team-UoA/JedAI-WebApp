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

    render() {
        const steps =
        [
            {name: 'Data Reading', component: <DataReader />},
            {name: 'Schema Clustering', component: <SchemaClustering />},
            {name: 'Block Building', component: <BlockBuilding />},
            {name: 'Block Cleaning', component: <BlockCleaning />},
            {name: 'Comparison Cleaning', component: <ComparisonCleaning />},
            {name: 'Entity Matching', component: <EntityMatching />},
            {name: 'Entity Clustering', component: <EntityClustering />}, 
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