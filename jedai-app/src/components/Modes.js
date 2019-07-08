import React, { Component } from 'react'
import Jumbotron from 'react-bootstrap/Jumbotron';
import Button from 'react-bootstrap/Button';
import {Link } from 'react-router-dom';


class Modes extends Component {
    render() {
        return (
            <div>
               <Jumbotron style={jumbotronStyle}>
                    <header >Execute JedAI   </header>
                    <div style={{textAlign:'center'}}>
                        <Link to="/desktopmode">
                            <Button variant="primary" style={btnStyle}>Desktop Mode</Button>
                        </Link>
                        <Link to="/clustermode">
                            <Button variant="primary" style={btnStyle}>Cluster Mode</Button>
                        </Link>
                    </div>
                </Jumbotron> 
            </div>
        )
    }
}

const jumbotronStyle = {
  background: '#b3d9ff',
  border: 'solid #0039e6',
  padding: '15px 8px',
  width: '40%',
  margin: 'auto'
}

const btnStyle = {
    cursor: 'pointer',
    width : '250px',
    height: '50px',
    margin: '5px'

}

export default Modes;

