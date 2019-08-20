import React, { Component } from 'react'
import {Form, Col, Row, Alert } from 'react-bootstrap/'


class ErrorComponent extends Component {

    render() {
        return (
            <div>
               <Alert  variant="danger" style={{margin:"auto",width:"33%", textAlign:"center", border:"groove", borderColor:"red"}}>
                   <h3>Error 404</h3>
                   The requested page does not exist
                   </Alert>
            </div>
        )
    }
}


export default ErrorComponent;
