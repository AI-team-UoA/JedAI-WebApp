import React, { Component } from 'react'
import PropTypes from 'prop-types';
import ConfigurationsView from './utilities/ConfigurationsView'
import {Link } from 'react-router-dom';
import {Button} from 'react-bootstrap/'
import axios from 'axios';

class ConfirmConfiguration extends Component {


    
    sendConfigurations = (e) => {
        var data_reading = this.props.state.data_reading
        console.log(data_reading)
        let entity_1 = new FormData()
        entity_1.append('entity_id',data_reading.entity1_set.entity_id)
        entity_1.append('filetype', data_reading.entity1_set.filetype)
        entity_1.append('source', data_reading.entity1_set.source)
        Object.keys(data_reading.entity1_set.configurations).forEach((key) => { entity_1.append(key, JSON.stringify(data_reading.entity1_set.configurations[key]));})

        var success = true

        axios({
            url: '/set_configurations/dataread',
            method: 'POST',
            data: entity_1
        }).then(res => success = success && res.data)

        if(data_reading.er_mode !== "dirty"){
            let entity_2 = new FormData()
            entity_2.append('entity_id',data_reading.entity2_set.entity_id)
            entity_2.append('filetype', data_reading.entity2_set.filetype)
            entity_2.append('source', data_reading.entity2_set.source)
            Object.keys(data_reading.entity2_set.configurations).forEach((key) => { entity_2.append(key, JSON.stringify(data_reading.entity2_set.configurations[key]));})

            axios({
                url: '/set_configurations/dataread',
                method: 'POST',
                data: entity_2
            }).then(res => success = success && res.data)
        }

        let ground_truth = new FormData()
        ground_truth.append('entity_id',data_reading.groundTruth_set.entity_id)
        ground_truth.append('filetype', data_reading.groundTruth_set.filetype)
        ground_truth.append('source', data_reading.groundTruth_set.source)
        Object.keys(data_reading.groundTruth_set.configurations).forEach((key) => { ground_truth.append(key, JSON.stringify(data_reading.groundTruth_set.configurations[key]));})

        axios({
            url: '/set_configurations/dataread',
            method: 'POST',
            data: ground_truth
        }).then(res => success = success && res.data)

        console.log(success )

    }



    render() {
        window.scrollTo(0, 0)

        const state = this.props.state

        //Data Reading Configurations
        var er_label = state.data_reading.er_mode ==="dirty" ? "Dirty Entity Resolution" : "Clean-Clean Entity Resolution"
        var er_mode = {label: er_label, conf_type: ""}

        var entity_1 = 
            {
                source: state.data_reading.entity1_set.filetype,
                conf: state.data_reading.entity1_set.configurations
            }
        var entity_2 = null
        if (state.data_reading.entity2_set !== null)
            entity_2 = 
                {
                    source: state.data_reading.entity2_set.filetype,
                    conf: state.data_reading.entity2_set.configurations
                }
        var ground_truth =
        {
            source: state.data_reading.groundTruth_set.filetype,
            conf: state.data_reading.groundTruth_set.configurations
        }

        //Single Selected methods configurations
        var shcema_clustering = null;
        if (state.schema_clustering !== null){
            shcema_clustering = {
                label: state.schema_clustering.label,
                conf_type: state.schema_clustering.conf_type,
                parameters: state.schema_clustering.parameters
            }
        }

        var comparison_cleaning = null;
        if (state.comparison_cleaning !== null){
            comparison_cleaning = {
                label: state.comparison_cleaning.label,
                conf_type: state.comparison_cleaning.conf_type,
                parameters: state.comparison_cleaning.parameters
            }
        }

        var entity_matching = null;
        if (state.entity_matching !== null){
            entity_matching = {
                label: state.entity_matching.label,
                conf_type: state.entity_matching.conf_type,
                parameters: state.entity_matching.parameters
            }
        }

        var entity_clustering = null;
        if (state.entity_clustering !== null){
            entity_clustering = {
                label: state.entity_clustering.label,
                conf_type: state.entity_clustering.conf_type,
                parameters: state.entity_clustering.parameters
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

                <ConfigurationsView  type="inline" title="ER Type" data={er_mode}/>
                <ConfigurationsView  type="file" title="Dataset 1 Parameters" data={entity_1}/>
                {entity_2 !== null ? <ConfigurationsView  type="file" title="Dataset 2 Parameters" data={entity_2}/> : <div />}
                <ConfigurationsView  type="file" title="Ground Truth Parameters" data={ground_truth}/>
                <ConfigurationsView  type="inline" title="Schema Clustering" data={shcema_clustering}/>
                <ConfigurationsView  type="array" title="Block Building" data={state.block_building}/>
                {state.block_cleaning !== null ? <ConfigurationsView  type="array" title="Block Building" data={state.block_building}/> : <div />}
                <ConfigurationsView  type="inline" title="Comparison Cleaning" data={comparison_cleaning}/>
                <ConfigurationsView  type="inline" title="Entity Matching" data={entity_matching}/>
                <ConfigurationsView  type="inline" title="Entity Clustering" data={entity_clustering}/>

                
                    <Button style={{float: 'right'}} onClick={this.sendConfigurations}>Confirm</Button>
                

            </div>
        )
    }
}

ConfirmConfiguration.propTypes = {
    state: PropTypes.object.isRequired
  }

export default ConfirmConfiguration