import React, {Component} from 'react';
import {Form, Col, Row} from 'react-bootstrap/'
import Jumbotron from 'react-bootstrap/Jumbotron';
import Collapse from 'react-bootstrap/Collapse'
import ProfileReader from "../er/workflowViews/dataRead/ProfileReader";

class AlgorithmSelection extends Component {

    state={
        algorithm_type: "",
        algorithm: "",
        budget: "",

        sourcePath: "",
        targetPath: "",
    }

    change = (e) => this.setState({[e.target.name]: e.target.value})

    setBudget = (e) => {
        const re = /^[0-9\b]+$/;
        if (e.target.value === '' || re.test(e.target.value)) {
            this.setState({budget: e.target.value})
        }
    }
    render() {
        const BUDGET_AGNOSTIC = "BUDGET_AGNOSTIC"
        const BUDGET_AWARE = "BUDGET_AWARE"
        const EMPTY = ""
        const algorithm_types = new Map()
        algorithm_types.set("", EMPTY)
        algorithm_types.set("Budget Agnostic", BUDGET_AGNOSTIC)
        algorithm_types.set("Budget Aware", BUDGET_AWARE)

        const budgetAgnostic_algorithms = new Map()
        budgetAgnostic_algorithms.set("", EMPTY)
        budgetAgnostic_algorithms.set("RADON", "RADON")
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
        budgetAware_algorithms.set("", EMPTY)
        budgetAware_algorithms.set("Progressive GIA.nt", "PROGRESSIVE_GIANT")
        budgetAware_algorithms.set("Progressive RADON", "PROGRESSIVE_RADON")
        budgetAware_algorithms.set("Geometry-ordered Algorithm", "GEOMETRY_ORDERED")
        budgetAware_algorithms.set("Iterative Algorithm", "ITERATIVE_ALGORITHMS")

        const small = 5;
        const large = 6;

        return (
            <Jumbotron  className='jumbotron_2'>
                <div className="container-fluid">
                    <div style={{marginBottom:"5px"}}>
                        <h1 style={{display:'inline', marginRight:"20px"}}>Geospatial Interlinking</h1>
                        <span className="workflow-desc">Discover the topological relations within the geometries of two datasets.</span>
                    </div>

                    <br/>
                    <hr style={{ color: 'black', backgroundColor: 'black', height: '5' }}/>
                    <br/>

                    <Row>
                        <Col>
                            <Form.Group as={Row} className="form-row">
                                <Form.Label as="legend" column sm={small}>
                                    <h5>Select Algorithm Type:</h5>
                                </Form.Label>
                                <Col sm={large}>
                                    <Form.Control
                                        as="select"
                                        placeholder="Select Algorithm type"
                                        name="algorithm_type"
                                        onChange={this.change}
                                        value={this.state.algorithm_type}
                                    >
                                        { Array.from(algorithm_types).map(([k, v]) => <option key={k} value={v} >{k}</option>)}

                                    </Form.Control>
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="form-row">
                                <Form.Label as="legend" column sm={small}>
                                    <h5>Select ER Mode:</h5>
                                </Form.Label>
                                <Col sm={large}>
                                    <Form.Control
                                        as="select"
                                        placeholder="Select Algorithm"
                                        name="algorithm"
                                        onChange={this.change}
                                        value={this.state.algorithm}
                                        disabled={this.state.algorithm_type === ""}
                                    >
                                        {
                                            Array.from(this.state.algorithm_type === BUDGET_AGNOSTIC ? budgetAgnostic_algorithms: budgetAware_algorithms)
                                                .map(([k, v]) => <option key={k} value={v} >{k}</option>)
                                        }
                                    </Form.Control>
                                </Col>
                            </Form.Group>

                            <Collapse in={this.state.algorithm_type === BUDGET_AWARE} >

                                    <Form.Group as={Row}>
                                        <Form.Label as="legend" column sm={small}>
                                            <h5>Budget :</h5>
                                        </Form.Label>
                                        <Col sm={large}>
                                            <Form.Control type="text" name="budget" value={this.state.budget} onChange={this.setBudget}/>
                                        </Col>
                                    </Form.Group>
                            </Collapse>
                        </Col>

                        <Col md="auto">
                            <div className="vertical" />
                        </Col>

                        <Col>

                            <ProfileReader entity_id="1" title="Entity profiles D1:" disabled={this.state.er_mode === ""} type="entity" setEntity={this.setEntity} state={this.state.entity1_set}/>
                            <ProfileReader entity_id="2" title="Entity profiles D2:" disabled={this.state.er_mode !== "clean"} type="entity" setEntity={this.setEntity} state={this.state.entity2_set}/>


                        </Col>
                    </Row>
                </div>
            </Jumbotron>
        );
    }
}

export default AlgorithmSelection;