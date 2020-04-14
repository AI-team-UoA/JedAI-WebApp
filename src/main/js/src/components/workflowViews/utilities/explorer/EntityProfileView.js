import React, { Component } from 'react'
import PropTypes from 'prop-types';
import {Row, Col,Form} from 'react-bootstrap'


class EntityProfileView extends Component {
    render() {
        // The View of each entity profile
        
        
        if (this.props.entity_type !== "3"){

            const id = this.props.entity.id
            const { entityUrl, attributes} = this.props.entity.profile;
            return (
                <div>
                    <div style={{marginBottom:"5px"}}> 
                        <span style={{display:"inline", float:"left"}} >
                            <h5 style={{display:"inline"}} >Entity ID:</h5> {id} 
                        </span>
                        <span style={{float:"right"}}><h5 style={{display:"inline"}}>Entity URL:</h5> {entityUrl} </span>
                        
                        <br/>

                        <Form.Group >
                            <Form.Control as="select" multiple>
                                {attributes.map((attr) => (<option key={attr.name}> {attr.name + ":\t\t" + attr.value}</option>))}
                            </Form.Control>
                    </Form.Group>
                    </div>
                </div>
            )
        }
        else{
            // multiple columns of explorations
            const columns = this.props.entity.map( entity =>
                (
                    <div style={{width:"45%", display:"inline-block", marginRight: "1%"}}>
                        <span style={{display:"inline", float:"left"}}>
                            <h5 style={{display:"inline"}} >Entity ID:</h5> {entity.id} 
                            <br/>
                            <h5 style={{display:"inline", maxWidth:"200px"}}>Entity URL:</h5> {entity.profile.entityUrl} 
                        </span>
                        
                        <br/>

                        <Form.Group >
                            <Form.Control as="select" multiple>
                                {entity.profile.attributes.map((attr) => (<option key={attr.name}> {attr.name + ":\t\t" + attr.value}</option>))}
                            </Form.Control>
                        </Form.Group>
                    </div>
                )
            )            
                        
            return (
                <div style={{marginBottom:"5px"}}>
                    <div  style={{overflowX: 'scroll', whiteSpace: 'nowrap'}}>
                        {columns} 
                    </div>
                </div>
            )
        }
    }
}


EntityProfileView.propTypes = {
    page: PropTypes.number.isRequired,
    entity: PropTypes.object.isRequired,
    entity_type: PropTypes.string.isRequired
}



export default EntityProfileView;
