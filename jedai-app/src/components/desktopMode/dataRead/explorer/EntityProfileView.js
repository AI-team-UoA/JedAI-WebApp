import React, { Component } from 'react'
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form'


class EntityProfileView extends Component {
    render() {

        // The View of each entity profile
        const { entityUrl, attributes} = this.props.entity;
        const index = this.props.index;
        return (
            <div>
                <div style={{marginBottom:"5px"}}> 
                    <span style={{display:'inline', marginRight:"200px"}} >
                        <h5 style={{display:'inline'}} >Entity ID:</h5> {index+ ((this.props.page-1)*5)} 
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


EntityProfileView.propTypes = {
    page: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
    entity: PropTypes.object.isRequired
}



export default EntityProfileView;
