import React, {Component} from 'react';
import PropTypes from "prop-types";
import {Button, Col, Collapse, Form, Row} from "../../er/workflowViews/dataRead/DataReader";
import GeometryLoader from "./GeometryLoader";

class GeometryReaderView extends Component {

    render() {
        return (
            <div>
                <div >
                    <div className="workflow-container">
                        <br/>
                        <div style={{marginBottom:"5px"}}>
                            <h1 style={{display:'inline', marginRight:"20px"}}>Geometry Loader</h1>
                            <span style={{display:'inline'}} className="workflow-desc">  Load datasets into Geometries. </span>
                        </div>
                        <br/>
                        <Form.Row className="form-row">
                            <h5 >Select data files</h5>
                        </Form.Row>
                        <GeometryLoader entity_id="source" title="Source: " setEntity={this.props.setDataset} state={this.state.source}/>
                        <GeometryLoader entity_id="target" title="Target: " type="geometries" setEntity={this.props.setDataset} state={this.state.target}/>
                        <br/>
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
    setDataset: PropTypes.func.isRequired
}

export default GeometryReaderView;