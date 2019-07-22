import React, { Component } from 'react'
import PropTypes from 'prop-types';
import ConfigurationsView from './utilities/ConfigurationsView'
import {Link } from 'react-router-dom';
import {Button} from 'react-bootstrap/'

class ConfirmConfiguration extends Component {
    render() {

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
                conf_type: state.schema_clustering.conf_type
            }
        }

        var comparison_cleaning = null;
        if (state.comparison_cleaning !== null){
            comparison_cleaning = {
                label: state.comparison_cleaning.label,
                conf_type: state.comparison_cleaning.conf_type
            }
        }

        var entity_matching = null;
        if (state.entity_matching !== null){
            entity_matching = {
                label: state.entity_matching.label,
                conf_type: state.entity_matching.conf_type
            }
        }

        var entity_clustering = null;
        if (state.entity_clustering !== null){
            entity_clustering = {
                label: state.entity_clustering.label,
                conf_type: state.entity_clustering.conf_type
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

                <Link to="/execution">
                    <Button style={{float: 'right'}} >Confirm</Button>
                </Link>

            </div>
        )
    }
}

ConfirmConfiguration.propTypes = {
    state: PropTypes.object.isRequired
  }
export default ConfirmConfiguration