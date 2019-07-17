import React, { Component } from 'react'
import StepZilla from "react-stepzilla"
import Jumbotron from 'react-bootstrap/Jumbotron';
import DataReader from './workflowViews/dataRead/DataReader'
import SchemaClustering from './workflowViews/SchemaClustering'
import BlockBuilding from './workflowViews/BlockBuilding'
import BlockCleaning from './workflowViews/BlockCleaning'
import ComparisonCleaning from './workflowViews/ComparisonCleaning'
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
            {name: 'Entity Matching', component: <SchemaClustering />},
            {name: 'Entity Clustering', component: <BlockBuilding />}, 
            {name: 'Confirm Configuration', component: <BlockBuilding />} 
           
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
                            nextTextOnFinalActionStep={"Save"}
                            hocValidationAppliedTo={[7]}

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