import React, { Component } from 'react'
import {Link } from 'react-router-dom';
import jedai_logo from '../../../../../../images/JedAI_logo.png';

class Headers extends Component {
    render() {
        return (
            <div style={{textAlign:'center'}}>
                <br/>
                <p>
                    <Link to="/">
                        <img src={jedai_logo}  /> 
                    </Link>
                </p>
                <br/>
            </div>
        );
    }
}

export default Headers;
