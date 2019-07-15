import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'


class EntityProfileView extends Component {
    render() {

        const { entityUrl, attributes} = this.props.entity;
        const index = this.props.index;
        return (
            <div>
                <div style={{marginBottom:"5px"}}> 
                    <span style={{display:'inline', marginRight:"200px"}} >
                        <h5 style={{display:'inline'}} >Entity ID:</h5> {index} 
                    </span>
                    <span><h5 style={{display:'inline'}}>Entity URL:</h5> {entityUrl} </span>
                    
                    <br/>

                    <Form.Group >
                        <Form.Control as="select" multiple>
                            {attributes.map((attr) => (<option key={attr.name}>{attr.name + ":\t\t" + attr.value}</option>))}
                        </Form.Control>
                </Form.Group>
                </div>
            </div>
        )
    }
}


export default EntityProfileView;
