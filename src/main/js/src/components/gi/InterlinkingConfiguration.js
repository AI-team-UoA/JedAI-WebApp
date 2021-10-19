import React, {Component} from 'react';
import Jumbotron from 'react-bootstrap/Jumbotron';
import ConfigurationView from "../er/workflowViews/utilities/ConfigurationView";



class InterlinkingConfiguration extends Component {

    state ={
        source: null,
        target: null,
        algorithm_type: "",
        algorithm: "",
        budget: 0
    }


    render() {
        return (
            <div>
                <Jumbotron  className='jumbotron_2'>
                    <div className="container-fluid">
                        <div style={{marginBottom:"5px"}}>
                            <h1 style={{display:'inline', marginRight:"20px"}}>Geospatial Interlinking</h1>
                            <span className="workflow-desc">Discover the topological relations between the geometries of two datasets.</span>
                        </div>

                        <ConfigurationView  type="file" title="Source Dataset" data={this.state.source}/>
                        <ConfigurationView  type="file" title="Target Dataset" data={this.state.target}/>

                        <br/>
                        <hr style={{ color: 'black', backgroundColor: 'black', height: '5' }}/>
                        <br/>
                    </div>
                </Jumbotron>
            </div>
        );
    }
}

export default InterlinkingConfiguration;