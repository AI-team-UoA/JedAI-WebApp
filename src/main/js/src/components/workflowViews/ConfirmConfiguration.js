import React, { Component } from 'react'
import PropTypes from 'prop-types';
import _ from 'lodash'
import ConfigurationsView from './utilities/ConfigurationsView'
import {Link, withRouter } from 'react-router-dom';
import {Button} from 'react-bootstrap/'
import axios from 'axios';
import { Redirect } from 'react-router';


class ConfirmConfiguration extends Component {

    constructor(...args) {
        super(...args)
        this.setData()

        this.state = {
            data : null,
            redirect: false
        } 

        this.setData()
    }

    componentDidMount = () => this.setData()
    componentDidUpdate = () => this.setData()

    setData = () => {

        axios.get("/workflow/get_configurations").then(res => {
            var data = res.data
            if (! _.isEqual(this.state.data, data)) 
                this.setState({data: data})     
        })
    }
   
    storeWorkflow = () => axios.get("/workflow/store").then(r => {if (r.data === true) this.setState({redirect: true})})


    render() {
        window.scrollTo(0, 0)

        if (this.state.redirect) {
            return <Redirect to={{pathname: "/workflow", state:{conf: this.props.state}}} />;
          }

        return (
            <div>
                <br/>
                <div style={{marginBottom:"5px"}}> 
                    <h1 style={{display:'inline', marginRight:"20px"}}>Confirm Configurations</h1> 
                    <span className="workflow-desc" >Confirm the selected values and press the "Next" button to go to the results page.</span>
                </div>

                <br/>
                <hr style={{ color: 'black', backgroundColor: 'black', height: '5' }}/>
                <br/>

                <ConfigurationsView state={this.state.data} />
                <br/>
                <br/>
                
                <Button style={{float: 'right'}} onClick={this.storeWorkflow} >Confirm</Button>
                
                
            </div>
        )
    }
}



export default withRouter(ConfirmConfiguration)