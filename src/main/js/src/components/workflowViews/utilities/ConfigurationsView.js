import React, { Component } from 'react'
import PropTypes from 'prop-types';
import ConfigurationView from './ConfigurationView'

class ConfigurationsView extends Component {


    getDatasetConfigurations = (conf) => {
        var msg = null
        switch(conf.filetype) {
            case "CSV":
                msg = "\nFile: " +  conf.filename  +"\nAtributes in firts row: " + conf.first_row + "\nSeperator: " + conf.separator + "\nID index: "+ conf.id_index
                break;
            case "Database":
                msg = "\nURL: " +  conf.url  +"\nTable: " + conf.table + "\nUsername: " + conf.username + "\nSSL: "+ conf.ssl
                break;
            case "RDF":
                msg = "\nFile: " +  conf.filename  
                break;
            case "XML":
                msg = "\nFile: " +  conf.filename  
                break;
            case "Serialized":
                msg = "\nFile: " +  conf.filename  
                break;
            default:
                msg = ""
        }
        return msg
    }
     
    render() {
      
        window.scrollTo(0, 0)
        if (this.props.state != null) {
            const state = this.props.state
            console.log(state)

            //Data Reading Configurations
            var er_label = state.mode
            var er_mode = {label: er_label, configuration_type: ""}

            var entity_1 = 
                {
                    source: state.d1.filetype,
                    conf: this.getDatasetConfigurations(state.d1)
                }
            var entity_2 = null
            if (state.hasOwnProperty("d2"))
                entity_2 = 
                    {
                        source: state.d2.filetype,
                        conf: this.getDatasetConfigurations(state.d2)
                    }
            var ground_truth =
            {
                source: state.gt.filetype,
                conf: this.getDatasetConfigurations(state.gt)
            }

            //Single Selected methods configurations
            var schema_clustering = null;
            if (state['Schema Clustering' ] !== null){
                schema_clustering = {
                    label: state['Schema Clustering' ].label,
                    configuration_type: state['Schema Clustering' ].configuration_type,
                    parameters: state['Schema Clustering' ].parameters
                }
            }

            var comparison_cleaning = null;
            if (state['Comparison Cleaning' ] !== null){
                comparison_cleaning = {
                    label: state['Comparison Cleaning' ].label,
                    configuration_type: state['Comparison Cleaning' ].configuration_type,
                    parameters: state['Comparison Cleaning' ].parameters
                }
            }

            var entity_matching = null;
            if (state['Entity Matching' ] !== null){
                entity_matching = {
                    label: state['Entity Matching' ].label,
                    configuration_type: state['Entity Matching' ].configuration_type,
                    parameters: state['Entity Matching' ].parameters
                }
            }

            var entity_clustering = null;
            if (state['Entity Clustering' ] !== null){
                entity_clustering = {
                    label: state['Entity Clustering' ].label,
                    configuration_type: state['Entity Clustering' ].configuration_type,
                    parameters: state['Entity Clustering' ].parameters
                }
            }     
            
            return (
                <div>
                    <br/>
                    <div style={{marginBottom:"5px"}}> 
                        <h1 style={{display:'inline', marginRight:"20px"}}>Confirm Configurations</h1> 
                        <span className="workflow-desc" >Confirm the selected values and press the "Next" button to go to the results page.</span>
                    </div>

                    <br/>
                    <hr style={{ color: 'black', backgroundColor: 'black', height: '5' }}/>
                    <br/>

                    <ConfigurationView  type="inline" title="ER Type" data={er_mode}/>
                    <ConfigurationView  type="file" title="Dataset 1 Parameters" data={entity_1}/>
                    {entity_2 !== null ? <ConfigurationView  type="file" title="Dataset 2 Parameters" data={entity_2}/> : <div />}
                    <ConfigurationView  type="file" title="Ground Truth Parameters" data={ground_truth}/>
                    <ConfigurationView  type="inline" title="Schema Clustering" data={schema_clustering}/>
                    <ConfigurationView  type="array" title="Block Building" data={state['Block Building' ]}/>
                    {state.hasOwnProperty("Block Cleaning") ? <ConfigurationView  type="array" title="Block Cleaning" data={state['Block Cleaning' ]}/> : <div />}
                    <ConfigurationView  type="inline" title="Comparison Cleaning" data={comparison_cleaning}/>
                    <ConfigurationView  type="inline" title="Entity Matching" data={entity_matching}/>
                    <ConfigurationView  type="inline" title="Entity Clustering" data={entity_clustering}/>

                    <br/>
                    <br/>
                </div>
            )
        }
        else 
        return(<div/>)
    }
}



export default ConfigurationsView 