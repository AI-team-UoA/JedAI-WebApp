import React, {Component} from 'react';
import PropTypes from "prop-types";
import {Alert} from "react-bootstrap/";
import GeometryLoader from "./GeometryLoader";

class GeometryReaderView extends Component {

    state ={showAlert: false}

    isEmpty(dataset_state){
        return dataset_state.filetype === ""  || dataset_state.source === "" || dataset_state.configurations == null
    }

    isValidated(){
        let isValid = !this.isEmpty(this.props.source) && !this.isEmpty(this.props.target)
        this.setState({showAlert: !isValid})
        return isValid
    }

    render() {
        let alert = <div />
        if (this.state.showAlert)
            alert = <Alert key={1} variant="danger" style={{width:"60%", margin:"auto", textAlign: "center"}}>Datasets were not set correctly</Alert>

        return (
            <div>
                <div>
                    <div className="workflow-container">
                        <br/>
                        <div style={{marginBottom:"5px"}}>
                            <h1 style={{display:'inline', marginRight:"20px"}}>Geometry Loader</h1>
                            <span className="workflow-desc" >Load datasets into Geometries.
                            Only the source dataset will be stored in the memory while the target dataset
                            will be streamed from the Disk.</span>
                        </div>
                        <br/>
                        <br/>
                        <div style={{width: this.props.width, margin: "auto"}}>
                            <GeometryLoader title="Source: " setDataset={this.props.setDataset} state={this.props.source}/>
                            <GeometryLoader title="Target: " setDataset={this.props.setDataset} state={this.props.target}/>
                            <br/>
                            {alert}
                        </div>

                        <br/>
                    </div>
                </div>
            </div>
        );
    }
}

GeometryReaderView.propTypes = {
    source: PropTypes.object.isRequired,
    target: PropTypes.object.isRequired,
    setDataset: PropTypes.func.isRequired,
    width: PropTypes.string.isRequired
}

export default GeometryReaderView;