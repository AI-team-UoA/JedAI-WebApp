import React, { Component } from 'react'
import PropTypes from 'prop-types';
import ConfigurationsView from './utilities/ConfigurationsView'
import {Link, withRouter } from 'react-router-dom';
import {Button} from 'react-bootstrap/'
import axios from 'axios';

class ConfirmConfiguration extends Component {


    storeWorkflow = () => axios.get("/workflow/store").then(r => this.props.history.push("/workflow"))


    render() {
        window.scrollTo(0, 0)

        return (
            <div>
                <ConfigurationsView state={this.props.state} />
                <br/>
                <br/>
                
                <Button style={{float: 'right'}} onClick={this.storeWorkflow} >Confirm</Button>
                
                
            </div>
        )
    }
}

ConfirmConfiguration.propTypes = {
    state: PropTypes.object.isRequired
  }

export default withRouter(ConfirmConfiguration)