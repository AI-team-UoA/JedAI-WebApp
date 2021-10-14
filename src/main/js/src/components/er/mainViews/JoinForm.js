
import React, { Component } from 'react'
import StepZilla from "react-stepzilla"
import Jumbotron from 'react-bootstrap/Jumbotron';
import DataReader from '../workflowViews/dataRead/DataReader'
import SimilarityJoin from '../workflowViews/SimilarityJoin'
import EntityClustering from '../workflowViews/EntityClustering'
import ConfirmConfiguration from '../workflowViews/ConfirmConfiguration'
import '../../../../../resources/static/css/progressSteps.css'
import '../../../../../resources/static/css/main.css'



class JoinForm extends Component {

  
    constructor(...args){
        super(...args);
        if(typeof args[0].location.state != "undefined"){
            let new_state = args[0].location.state.conf
            this.state ={
                data_reading: new_state.data_reading,
                similarity_join: new_state.similarity_join,
                entity_clustering: new_state.entity_clustering
            }
        }
        else{
            // Default states of the workflow stages
            this.state = {
                data_reading: null,
                similarity_join: 
                {
                    method:{
                        name: "ALL_PAIRS_CHARACTER-BASED",
                        label: "All Pairs (character-based)",
                        parameters: [{label: "Threshold", value:"3"}]
                    },
                    attribute1: "",
                    attribute2: "",
                    headers1: [],
                    headers2: []
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
        if (typeof this.props.location.state != "undefined"){
           let new_state = this.props.location.state.conf
           this.setState({
                data_reading: new_state.data_reading,
                similarity_join: new_state.similarity_join,
                entity_clustering: new_state.entity_clustering
           })
        }
    }

    render() {

        var GTIsSet = false
        if (this.state.data_reading != null && typeof this.state.data_reading !== 'undefined')
            if (this.state.data_reading.groundTruth_set != null && typeof this.state.data_reading.groundTruth_set !== 'undefined') 
                GTIsSet = true

        var er_mode = null
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
            {name: 'Data Reading', component: <DataReader submitState={this.submitState} state={this.state.data_reading} />},
            {name: 'Similarity Join', component: <SimilarityJoin submitState={this.submitState} state={this.state.similarity_join} clean_er= {er_mode == "clean"}/>},
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
export default JoinForm