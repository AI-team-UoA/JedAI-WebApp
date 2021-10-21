import React, {Component} from 'react';
import {Alert, Col, Form, Row} from 'react-bootstrap/'
import Jumbotron from 'react-bootstrap/Jumbotron';
import Collapse from 'react-bootstrap/Collapse'
import PropTypes from "prop-types";

class AlgorithmSelection extends Component {

    state={showAlert: false}
    BUDGET_AGNOSTIC = "BUDGET_AGNOSTIC"
    BUDGET_AWARE = "BUDGET_AWARE"
    EMPTY = ""

    setBudget = (e) => {
        const re = /^[0-9\b]+$/;
        if (e.target.value === '' || re.test(e.target.value)) {
            this.onChange(e)
        }
    }

    onChange = (e) => {
        let name = e.target.name
        let value = e.target.value

        this.setState({showAlert: false})
        this.props.updateState(name, value)
        if (name === "algorithm_type"){
            this.props.updateState("budget", 2000)
            this.props.updateState("algorithm", "")
        }
    }

    isValidated(){
        let isValid = this.props.algorithm_type !== "" && this.props.algorithm !== ""
        if (isValid && this.props.algorithm_type === this.BUDGET_AWARE)
            isValid = this.props.budget !== ""
        this.setState({showAlert: !isValid})
        if (isValid)
            this.props.setInterlinking()
        return isValid
    }

    render() {
        const algorithm_types = new Map()
        algorithm_types.set("", this.EMPTY)
        algorithm_types.set("Budget Agnostic", this.BUDGET_AGNOSTIC)
        algorithm_types.set("Budget Aware", this.BUDGET_AWARE)

        const budgetAgnostic_algorithms = new Map()
        budgetAgnostic_algorithms.set("", this.EMPTY)
        budgetAgnostic_algorithms.set("RADON", "RADON")
        budgetAgnostic_algorithms.set("GIA.nt ", "GIANT")
        budgetAgnostic_algorithms.set("Static RADON", "STATIC_RADON")
        budgetAgnostic_algorithms.set("Static GIA.nt", "STATIC_GIANT")
        budgetAgnostic_algorithms.set("Plane Sweep", "PLANE_SWEEP")
        budgetAgnostic_algorithms.set("Stripe Sweep", "STRIPE_SWEEP")
        budgetAgnostic_algorithms.set("PBSM", "PBSM")
        budgetAgnostic_algorithms.set("R-Tree", "RTREE")
        budgetAgnostic_algorithms.set("Quadtree", "QUADTREE")
        budgetAgnostic_algorithms.set("CR-Tree", "CRTREE")

        const budgetAware_algorithms = new Map()
        budgetAware_algorithms.set("", this.EMPTY)
        budgetAware_algorithms.set("Progressive GIA.nt", "PROGRESSIVE_GIANT")
        budgetAware_algorithms.set("Progressive RADON", "PROGRESSIVE_RADON")
        budgetAware_algorithms.set("Geometry-ordered Algorithm", "GEOMETRY_ORDERED")
        budgetAware_algorithms.set("Iterative Algorithm", "ITERATIVE_ALGORITHMS")

        const small = 4;
        const large = 6;
        let alert = <div />
        if (this.state.showAlert)
            alert = <Alert key={1} variant="danger" style={{width:"30%", margin:"auto", textAlign: "center"}}>Configurations were not set correctly</Alert>

        return (
            <div className="container-fluid">
                <br/>
                <div style={{marginBottom:"5px"}}>
                    <h1 style={{display:'inline', marginRight:"20px"}}>Algorithm Selection</h1>
                    <span className="workflow-desc" >Choose the geospatial interlinking algorithm.
                        In case of Budget Agnostic algorithms, users must provide a budget.</span>
                </div>
                <br/>
                <br/>
                <Jumbotron style={{backgroundColor:"white", border:"groove", width: this.props.width, margin: "auto"}}>
                    <Row className="form-row">
                        <Col lg={small}>
                            <Form.Label as="legend" column>
                                <h5>Select Algorithm Type:</h5>
                            </Form.Label>
                        </Col>
                        <Col lg={large}>
                            <Form.Control
                                as="select"
                                placeholder="Select Algorithm type"
                                name="algorithm_type"
                                onChange={this.onChange}
                                value={this.props.algorithm_type}
                            >
                                { Array.from(algorithm_types).map(([k, v]) => <option key={k} value={v} >{k}</option>)}
                            </Form.Control>
                        </Col>
                    </Row>
                    <Row className="form-row">
                        <Col lg={small}>
                            <Form.Label as="legend" column >
                                <h5>Select Algorithm:</h5>
                            </Form.Label>
                        </Col>
                        <Col lg={large}>
                            <Form.Control
                                as="select"
                                placeholder="Select Algorithm"
                                name="algorithm"
                                onChange={this.onChange}
                                value={this.props.algorithm}
                                disabled={this.props.algorithm_type === ""}
                            >
                                {
                                    Array.from(this.props.algorithm_type === this.BUDGET_AGNOSTIC ? budgetAgnostic_algorithms: budgetAware_algorithms)
                                        .map(([k, v]) => <option key={k} value={v} >{k}</option>)
                                }
                            </Form.Control>
                        </Col>
                    </Row>
                    <Collapse in={this.props.algorithm_type === this.BUDGET_AWARE} >
                        <Row className="form-row">
                            <Col lg={small}>
                                <Form.Label as="legend" column >
                                    <h5>Budget :</h5>
                                </Form.Label>
                            </Col>
                            <Col lg={large}>
                                <Form.Control type="text" name="budget" value={this.props.budget} onChange={this.setBudget}/>
                            </Col>
                        </Row>
                    </Collapse>
                    <br />
                </Jumbotron>
                <br/>
                {alert}
                <br/>
            </div>
        )
    }
}

AlgorithmSelection.propTypes = {
    algorithm_type: PropTypes.string.isRequired,
    algorithm: PropTypes.string.isRequired,
    budget: PropTypes.number.isRequired,
    updateState: PropTypes.func.isRequired,
    setInterlinking: PropTypes.func.isRequired,
    width: PropTypes.string.isRequired

}
export default AlgorithmSelection;