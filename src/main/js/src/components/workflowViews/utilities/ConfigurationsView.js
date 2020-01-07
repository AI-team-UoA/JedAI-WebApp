import React, { Component } from 'react'
import PropTypes from 'prop-types';
import ConfigurationView from './ConfigurationView'

class ConfigurationsView extends Component {


    getDatasetConfigurations = (data) => {
        var conf 
        switch(data.filetype) {
            case "CSV":
                conf ={
                    'Filename': data.filename,
                    'First Row': data.first_row,
                    'Separator': data.separator,
                    'ID index': data.id_index
                }
                break;
            case "Database":
                conf ={
                    'URL': data.url,
                    'Table': data.table,
                    'Username': data.dbUsername,
                    'SSL': data.ssl
                }
                break;
            case "RDF":
                conf ={
                    'Filename': data.filename
                }
                break;
            case "XML":
                conf ={
                    'Filename': data.filename
                }
                break;
            case "Serialized":
                conf ={
                    'Filename': data.filename
                }
                break;                   
        }
        return conf
    }
     
    render() {
      
        window.scrollTo(0, 0)
        if (this.props.state != null) {
            const state = this.props.state

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