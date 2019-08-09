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
            
            //two columns exploration view   
            console.log(this.props.entity)

            const id_1 = this.props.entity.value0.id
            const entityUrl_1 = this.props.entity.value0.profile.entityUrl
            const attributes_1 = this.props.entity.value0.profile.attributes

            const id_2 = this.props.entity.value1.id
            const entityUrl_2 = this.props.entity.value1.profile.entityUrl
            const attributes_2 = this.props.entity.value1.profile.attributes

            return (
                <div style={{marginBottom:"5px"}}>
                    <Row>
                        <Col >
                            <span style={{display:"inline", float:"left"}} >
                                <h5 style={{display:"inline"}} >Entity ID:</h5> {id_1} 
                            </span>
                            <span style={{float:"right"}}><h5 style={{display:"inline"}}>Entity URL:</h5> {entityUrl_1} </span>
                            
                            <br/>

                            <Form.Group >
                                <Form.Control as="select" multiple>
                                    {attributes_1.map((attr) => (<option key={attr.name}> {attr.name + ":\t\t" + attr.value}</option>))}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col >
                            <span style={{display:'inline'}} >
                                <h5 style={{display:'inline'}} >Entity ID:</h5> {id_2} 
                            </span>
                            <span style={{float:"right"}}><h5 style={{display:'inline'}}>Entity URL:</h5> {entityUrl_2} </span>
                            
                            <br/>

                            <Form.Group  as={Row}>
                                <Form.Control as="select" multiple>
                                    {attributes_2.map((attr) => (<option key={attr.name}> {attr.name + ":\t\t" + attr.value}</option>))}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>
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
