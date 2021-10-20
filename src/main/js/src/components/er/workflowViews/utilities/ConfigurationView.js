import React, { Component } from 'react'
import PropTypes from 'prop-types';
import {Form, Col, Table, Row } from 'react-bootstrap/'

class ConfigurationView extends Component {

    render() {
        let title_col = 2
        let empty_col = 1
        let value_col_1 = 1
        let value_col_2 = 2
        let big_col = 8
        const {data, title, type} = this.props
        let return_stmnt = null

        if(type === "inline"){
            if (data.configuration_type !== ""){
                if(data.configuration_type === "Manual"){
                    return_stmnt = 
                            <Form.Row>
                                <Col sm={title_col}>
                                    <Form.Label style={{color:"#4663b9"}}><h5>{title+ ": "}</h5></Form.Label> 
                                </Col>
                                <Col sm={empty_col}/>
                                <Col sm={big_col}>
                                    <Table  striped bordered hover size="sm">
                                        <thead>
                                            <tr>
                                                <th style={{color:"#4663b9"}}>Method</th>
                                                {data.parameters.map((parameter, i) => (<th key={i} style={{color:"#4663b9"}}>{parameter.label}</th>))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr> 
                                                {data.label}
                                                {data.parameters.map((parameter, i) => (<td key={i} >{parameter.value}</td>))} 
                                             </tr>
                                        </tbody>
                                    </Table>
                                </Col>
                            </Form.Row>
                }
                else {
                    return_stmnt = 
                            <Form.Row>
                                <Col sm={title_col}>
                                    <Form.Label style={{color:"#4663b9"}}><h5>{title+ ": "}</h5></Form.Label> 
                                </Col>
                                <Col sm={empty_col}/>
                                <Col sm={value_col_2}>
                                    {data.label}
                                </Col>
                                <Col sm={value_col_2}>
                                    <h5 style={{color:"#4663b9", marginRight:'100px'}}>Configuration:</h5> 
                                </Col>
                                <Col sm={value_col_1}>
                                    {data.configuration_type}
                                </Col>
                            </Form.Row>
                }
            }
            else            
                return_stmnt =
                        <Form.Row>
                            <Col sm={title_col}>
                                <Form.Label style={{color:"#4663b9"}}><h5>{title+ ": "}</h5></Form.Label> 
                            </Col>
                            <Col sm={empty_col}/>
                            <Col sm={2}>
                                {data.label}
                            </Col>
                        </Form.Row>

        }


        else if (type === "array"){
            return_stmnt = 
                    <Form.Row>
                        <Col sm={title_col}>
                            <Form.Label style={{color:"#4663b9"}}><h5>{this.props.title + ": "}</h5></Form.Label> 
                        </Col>
                        <Col sm={empty_col}/>
                        <Col sm={big_col}>
                            <Table  striped bordered hover size="sm">
                                <thead>
                                    <tr>
                                        <th style={{color:"#4663b9"}}>Method</th>
                                        <th style={{color:"#4663b9"}}>Configuration</th>
                                        <th style={{color:"#4663b9"}}>Parameters</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((method, i) => (
                                        <tr key={i}> 
                                            <td>{method.label}</td>
                                            <td>{method.configuration_type}</td>
                                            <td>
                                                {method.parameters.map((parameter, j) => (
                                                    <Row key={j} >
                                                        <Col>
                                                            {parameter.label}
                                                        </Col>
                                                        <Col>
                                                            {parameter.value}
                                                        </Col>
                                                    </Row>
                                                ))}
                                                
                                            </td>
                                            
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Col>
                    </Form.Row>                
        }

        else if (type === "file"){

            let keys = Object.keys(data.conf);
            return_stmnt = 
                    <Form.Row>
                        <Col sm={title_col}>
                            <Form.Label style={{color:"#4663b9"}}><h5>{this.props.title + ": "}</h5></Form.Label> 
                        </Col>
                        <Col sm={empty_col}/>
                        <Col sm={big_col}>  
                            <Form.Control as="select" multiple>
                                <option key="filetype">Source: {data.source}</option>
                                {keys.map((key) => (
                                    <option key={key}>{key + ": " + data.conf[key]}</option>
                                ))}
                            </Form.Control>
                        </Col>
                    </Form.Row>         
        }
        else if (type === "sj"){
            return_stmnt = 

            <Form.Row>
                <Col sm={title_col}>
                    <Form.Label style={{color:"#4663b9"}}><h5>{this.props.title + ": "}</h5></Form.Label> 
                </Col>
                <Col sm={empty_col}></Col>
                <Col sm={big_col}>  
                    <Form.Control as="select" multiple>
                        <option key="method">Method: {data.label}</option>
                        <option key="param">{data.parameters[0].label + ": "+ data.parameters[0].value}</option>
                        <option key="attr1">D1 Attribute: {data.attribute1}</option>
                        {data.attribute2 != "" ? <option key="attr2">D2 Attribute: {data.attribute2}</option> : <div/>}
                    </Form.Control>
                </Col>
            </Form.Row>

        } 

        
        return(
            <div>
                <div style={{margin:'auto', marginLeft: "10%"}}>
                    {return_stmnt}
                </div>
                <hr style={{ color: 'black', backgroundColor: 'black', height: '1', marginBottom:'5px' }}/>
            </div>
        )
    }
}

ConfigurationView.propTypes = {
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired
  }

export default ConfigurationView

