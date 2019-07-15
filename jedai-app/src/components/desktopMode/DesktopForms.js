import React, { Component } from 'react'
import StepZilla from "react-stepzilla"
import Jumbotron from 'react-bootstrap/Jumbotron';
import DataReader from './dataRead/DataReader'
import SchemaClustering from './SchemaClustering'
import BlockBuilding from './BlockBuilding'

import '../../css/progressSteps.css'
import '../../css/main.css'

class DesktopForms extends Component {



    render() {
        const steps =
        [
            {name: 'Data Reading', component: <DataReader />},
            {name: 'Schema Clustering', component: <SchemaClustering />},
            {name: 'Block Building', component: <BlockBuilding />},
            {name: 'Data Reading', component: <DataReader />},
            {name: 'Schema Clustering', component: <SchemaClustering />},
            {name: 'Schema Clustering', component: <SchemaClustering />},
            {name: 'Block Building', component: <BlockBuilding />} 
           
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