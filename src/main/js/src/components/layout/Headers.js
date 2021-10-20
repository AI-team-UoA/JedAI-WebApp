import React, { Component } from 'react'
import {Link } from 'react-router-dom';
import jedai_logo from '../../../../../../images/JedAI_logo.png';

class Headers extends Component {
    render() {
        return (
            <div style={{textAlign:'center'}}>
                <br/>
                <h1>
                    <Link to="/">
                        {/*TODO FIX*/}
                        {/*<img src={jedai_logo}  /> */}
                        GeoLinker
                    </Link>
                </h1>
                <br/>
            </div>
        );
    }
}

export default Headers;
