import React, {Component} from 'react';

import AlgorithmSelection from "./AlgorithmSelection";
import Jumbotron from "react-bootstrap/Jumbotron";
import StepZilla from "react-stepzilla";
import GeometryReaderView from "./loaders/GeometryReaderView";
import axios from "axios";
import InterlinkingConfiguration from "./InterlinkingConfiguration";

class InterlinkingMainView extends Component {

    static staticState = null

    constructor(...args) {
        super(...args);

        this.state ={
            source: {
                entity_id: "source",
                filetype : "",
                source : "",
                configurations: null
            },
            target: {
                entity_id: "target",
                filetype : "",
                source : "",
                configurations: null
            },
            algorithm_type: "",
            algorithm: "",
            budget: 2000
        }

        if (InterlinkingMainView.staticState != null){
            this.state = InterlinkingMainView.staticState
        }
        else{
            InterlinkingMainView.staticState = this.state
        }
    }

    updateState = (name, value) => {this.setState({[name]: value})}

    setDataset = (entity_id, dataset_state) => {
        switch(entity_id) {
            case "source":
                this.setState({source: dataset_state})
                break;
            case "target":
                this.setState({target: dataset_state})
                break;
            default:
                this.alertText = "Datasets were not configured properly"
                console.log("ERROR")
        }
    }

    submit = (_) => {
        InterlinkingMainView.staticState = this.state
    }

    setInterlinking = () => {
        let budget = this.state.budget !== "" ? this.state.budget : 0
        axios.get("/sequential/geospatialInterlinking/set/"+this.state.algorithm_type+"/"+this.state.algorithm+"/"+budget)
    }

    render() {
        let widthSize = "60%"
        const steps =
            [
                {name: 'Data Reading', component: <GeometryReaderView width={widthSize} setDataset={this.setDataset} source={this.state.source} target={this.state.target}/>},
                {name: 'Algorithm Selection', component: <AlgorithmSelection width={widthSize}
                                                                             algorithm={this.state.algorithm}
                                                                             algorithm_type={this.state.algorithm_type}
                                                                             budget={this.state.budget}
                                                                             setInterlinking={this.setInterlinking}
                                                                             updateState={this.updateState}/>},
                {name: 'Confirm Configuration', component: <InterlinkingConfiguration width={widthSize}
                                                                                      algorithm={this.state.algorithm}
                                                                                      algorithm_type={this.state.algorithm_type}
                                                                                      budget={this.state.budget}
                                                                                      source={this.state.source}
                                                                                      target={this.state.target}
                                                                                      submit={this.submit}/>}
            ]

        return (
            <div>
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
            </div>
        );
    }
}

export default InterlinkingMainView;