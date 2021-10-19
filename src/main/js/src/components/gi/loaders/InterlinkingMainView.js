import React, {Component} from 'react';

import AlgorithmSelection from "../AlgorithmSelection";
import Jumbotron from "react-bootstrap/Jumbotron";
import StepZilla from "react-stepzilla";
import GeometryReaderView from "./GeometryReaderView";

class InterlinkingMainView extends Component {
    state ={
        source: null,
        target: null,
        algorithm_type: "",
        algorithm: "",
        budget: 0
    }


    setDataset = (entity_id, conf_state) => {
        switch(entity_id) {
            case "source":
                this.setState({source: conf_state})
                break;
            case "target":
                this.setState({target: conf_state})
                break;
            default:
                this.alertText = "Entity profiles were not set properly!"
                console.log("ERROR")
        }
    }

    render() {
        const steps =
            [
                {name: 'Data Reading', component: <GeometryReaderView setDataset={this.setDataset} source={this.state.source} target={this.state.target}/>},
                {name: 'Algorithm Selection', component: <AlgorithmSelection />},
                {name: 'Confirm Configuration', component: <div/>}

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