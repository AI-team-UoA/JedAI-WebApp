import React, { Component } from 'react'
import Jumbotron from 'react-bootstrap/Jumbotron';
import Button from 'react-bootstrap/Button';
import {Link } from 'react-router-dom';


class Modes extends Component {
    render() {
        return (
            <div>
               <Jumbotron className="jumbotron" style={{width:'55%'}}>
                    <header >Execute JedAI   </header>
                    <br/>
                    <div style={{textAlign:'center'}}>
                        <Link to="/desktopmode">
                            <Button variant="primary" style={btnStyle}>Desktop Mode</Button>
                        </Link>
                        <br/>
                        <Link to="/clustermode">
                            <Button variant="primary" style={btnStyle}>Cluster Mode</Button>
                        </Link>
                    </div>
                </Jumbotron> 
            </div>
        )
    }
}

const btnStyle = {
    cursor: 'pointer',
    width : '250px',
    height: '50px',
    margin: '5px'

}

export default Modes;

