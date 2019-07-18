import React, { Component } from 'react'
import PropTypes from 'prop-types';
import {Form, Col, Table } from 'react-bootstrap/'

class ConfigurationsView extends Component {

    confLabels = new Map([
        ['filename', 'Filename'],
        ['first_row', 'First Row'],
        ['seperator', 'Seperator'],
        ['id_index', 'ID index'],
        ['excluded_attr', 'Excluded attirbutes'],

        ['url', 'DB URL'],
        ['table', 'Table'],
        ['username', 'Username'],
        ['ssl', 'SSL']
      ]);


    render() {
        const {data, title, type} = this.props
        var return_stmnt = null

        if(type === "inline"){
            if (data.conf_type !== "")
                return_stmnt = 
                        <Form.Row>
                            <Col sm={2}>
                                <Form.Label style={{color:"#990000"}}><h5>{title+ ": "}</h5></Form.Label> 
                            </Col>
                            <Col sm={1}></Col>
                            <Col sm={2}>
                                {data.label}
                            </Col>
                            <Col sm={2}>
                                <h5 style={{color:"#990000", marginRight:'100px'}}>Configuration:</h5> 
                            </Col>
                            <Col sm={1}>
                                {data.conf_type}
                            </Col>
                        </Form.Row>

            else            
                return_stmnt =
                        <Form.Row>
                            <Col sm={2}>
                                <Form.Label style={{color:"#990000"}}><h5>{title+ ": "}</h5></Form.Label> 
                            </Col>
                            <Col sm={1}></Col>
                            <Col sm={2}>
                                {data.label}
                            </Col>
                        </Form.Row>

        }
        else if (type === "array"){
            
            return_stmnt = 
                    <Form.Row>
                        <Col sm={2}>
                            <Form.Label style={{color:"#990000"}}><h5>{this.props.title + ": "}</h5></Form.Label> 
                        </Col>
                        <Col sm={1}></Col>
                        <Col sm={6}>
                            <Table  striped bordered hover size="sm">
                                <thead>
                                    <tr>
                                    <th style={{color:"#990000"}}>Method</th>
                                    <th style={{color:"#990000"}}>Configuration</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((method) => (
                                        <tr> 
                                            <td>{method.label}</td>
                                            <td>{method.conf_type}</td>
                                            
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Col>
                    </Form.Row>                
        }
        else if (type === "file"){
            var keys = Object.keys(data.conf);
            return_stmnt =
                
                    <Form.Row>
                        <Col sm={2}>
                            <Form.Label style={{color:"#990000"}}><h5>{this.props.title + ": "}</h5></Form.Label> 
                        </Col>
                        <Col sm={1}></Col>
                        <Col sm={6}>
                            <Form.Control as="select" multiple>
                                <option key="filetype">Source: {data.source}</option>
                                {keys.map((key) => (
                                    this.confLabels.has(key) ?
                                    <option key={key}>{this.confLabels.get(key) + ": " + data.conf[key]}</option>
                                    : <div/>
                                ))}
                            </Form.Control>
                        </Col>
                    </Form.Row>         
        }
        return(
            <div>
                <div style={{margin:'auto', position:'relative', left:'16%'}}>
                    {return_stmnt}
                </div>
                <hr style={{ color: 'black', backgroundColor: 'black', height: '1', marginBottom:'5px' }}/>
            </div>
        )
    }
}

ConfigurationsView.propTypes = {
    title: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired

  }

export default ConfigurationsView

