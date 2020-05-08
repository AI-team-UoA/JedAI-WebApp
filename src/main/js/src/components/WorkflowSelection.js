import React, { Component } from 'react'
import {Jumbotron, Button} from 'react-bootstrap';
import {Link } from 'react-router-dom';


class WorkflowSelection extends Component {
    render() {
        console.log("here")
        return (
            <div >
                <Jumbotron  className='jumbotron_2'>
                    <div className="container-fluid">
                    <br/>
                <div style={{marginBottom:"5px"}}> 
                    <h1 style={{display:'inline', marginRight:"20px"}}>Select Workflow</h1> 
                    <span className="workflow-desc" >Select one of the three available workflows.</span>
                </div>

                <br/>
                <hr style={{ color: 'black', backgroundColor: 'black', height: '5' }}/>
                <br/>
                <br/>

                <div style={{textAlign: 'center'}}>

                    <Jumbotron className='jumbotron_alg'>
                        <div style={{ textAlign: 'center'}}>
                            <h3>Blocking-based Workflow</h3>
                            <br/>
                            Blocking-based workflow consisting of Data Reading, Schema Clustering, Block Building, Block Cleaning, Comparison Cleaning, Entity Matching and Entity Clustering.
                            For each step, the user can choose and parameterize multiple algorithms.
                            <br/><br/>
                            
                            <Link to="/blockingbased">
                                <Button variant="primary">Blocking-based Workflow</Button>
                            </Link>
                        </div>
                    </Jumbotron>


                    <Jumbotron className='jumbotron_alg'>
                        <div style={{ textAlign: 'center'}}>
                            <h3>Join-based Workflow</h3>
                            <br/>
                            Similarity Join conveys the state-of-the-art algorithms for accelerating the computation of a specific character- or token-based similarity
                             measure in combination with a user-determined similarity threshold.<br/><br/>

                            <Link to="/joinbased">
                                <Button>Join-based Workflow</Button>
                            </Link>
                        </div>
                    </Jumbotron>


                    <Jumbotron className='jumbotron_alg'>
                        <div style={{ textAlign: 'center'}}>
                            <h3>Progressive Workflow</h3>
                            <br/>
                            Comparison Prioritization associates all comparisons in a block collection with a weight that is proportional to the likelihood that they involve
                             duplicates and then, it emits them iteratively, in decreasing weight.<br/><br/>
                            
                             <Link to="/progressive">
                                <Button>Progressive Workflow</Button>
                            </Link>
                        </div>
                    </Jumbotron>
                
                </div>
            </div>
        </Jumbotron>
   </div>
        )
    }
}


export default WorkflowSelection

