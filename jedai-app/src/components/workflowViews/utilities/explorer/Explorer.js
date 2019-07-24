import React, { Component } from 'react'
import PropTypes from 'prop-types';
import {Jumbotron, Pagination, Form } from 'react-bootstrap/'
import axios from 'axios';
import EntityProfileView from "./EntityProfileView"

class Explorer extends Component {

    constructor(...args) {
        super(...args);
        this.headers = []
        this.pagination = <h1>Not Loaded</h1>
        this.maxPages = 0
        this.page = 1

        this.state = { 
            entities : [],
            headers :[]
        }
    }
    

    // Form pagianation based on the requested page
    setPagination(pageNumber){
        var displayed_pages = [];
        var  pagination 

        var start = (pageNumber-2) >= 1 ?  pageNumber-2 : 1        
        var end = (pageNumber+2) < this.maxPages? pageNumber+2 : this.maxPages

        for (let number = start; number <= end; number++) {
            displayed_pages.push(
              <Pagination.Item  onClick={this.handlePageChange} key={number} name={number} active={pageNumber === number}>
                {number}
              </Pagination.Item>,
            );
        }
        
        if (start === 1){
            if (end === this.maxPages){
                pagination = 
                    <Pagination className="pagination justify-content-center" >
                        <Pagination.First name={1}  disabled={true}/>
                        <Pagination.Prev name={pageNumber-1} disabled={true}/>
                        {displayed_pages}
                        <Pagination.Ellipsis />
                        <Pagination.Next name={pageNumber+1} disabled={true}/>
                        <Pagination.Last name={this.maxPages} disabled={true}/>
                    </Pagination>
            }
            else{
                pagination =
                    <Pagination  className="pagination justify-content-center"  >
                        <Pagination.First name={1} onClick={this.handlePageChange} disabled={pageNumber===1}/>
                        <Pagination.Prev name={pageNumber-1} onClick={this.handlePageChange} disabled={pageNumber===1}/>
                        {displayed_pages}
                        <Pagination.Ellipsis />
                        <Pagination.Item name={this.maxPages} onClick={this.handlePageChange}>{this.maxPages}</Pagination.Item>
                        <Pagination.Next name={pageNumber+1} onClick={this.handlePageChange} />
                        <Pagination.Last name={this.maxPages} onClick={this.handlePageChange} />
                    </Pagination>
            }
        }
        else{
            if (end === this.maxPages){
                pagination =
                    <Pagination className="pagination justify-content-center" >
                        <Pagination.First name={1} onClick={this.handlePageChange}/>
                        <Pagination.Prev name={pageNumber-1} onClick={this.handlePageChange}/>
                        <Pagination.Item name={1} onClick={this.handlePageChange}>{1}</Pagination.Item>
                        <Pagination.Ellipsis />
                        {displayed_pages}
                        <Pagination.Next name={pageNumber+1} disabled={pageNumber === this.maxPages}/>
                        <Pagination.Last name={this.maxPages} disabled={pageNumber === this.maxPages}/>
                    </Pagination>
                }
            else{
                pagination =
                    <Pagination className="pagination justify-content-center">
                        <Pagination.First name={1} onClick={this.handlePageChange}/>
                        <Pagination.Prev name={pageNumber-1} onClick={this.handlePageChange}/>
                        <Pagination.Item name={1}>{1}</Pagination.Item>
                        <Pagination.Ellipsis />
                        {displayed_pages}
                        <Pagination.Ellipsis />
                        <Pagination.Item name={this.maxPages} onClick={this.handlePageChange} >{this.maxPages}</Pagination.Item>
                        <Pagination.Next name={pageNumber+1} onClick={this.handlePageChange}/>
                        <Pagination.Last name={this.maxPages} onClick={this.handlePageChange}/>
                    </Pagination>
            }
        }
        
        return  pagination 
    }

    // Handle page change and set paginations
    handlePageChange = (e) => {
        var tmp_page = parseInt(e.target.name)
        if (!isNaN(tmp_page)){
            this.page = tmp_page
            this.pagination = this.setPagination(this.page)
            axios.get("/desktopmode/dataread/"+this.props.entity_id+"/explore/" + this.page)
                    .then(
                        res => {this.setState({
                            entities: res.data,
                            headers:  res.data[0].attributes
                    })})
        }
    }


    render() {

        // Get first data from the server
        if (this.props.get_entities && this.state.entities.length === 0) {
            axios.get("/desktopmode/dataread/"+this.props.entity_id+"/explore/")
                .then(res => {
                    this.maxPages = res.data
                    this.pagination = this.setPagination(1)
                })
                
            axios.get("/desktopmode/dataread/"+this.props.entity_id+"/explore/" + this.page)
                .then(
                    res => {this.setState({
                            entities: res.data,
                            headers:  res.data[0].attributes
                        })
                    })
                    
            
        }
        else if (!this.props.get_entities && this.state.entities.length !== 0)
       {
        console.log("EMPTY DATA")
        this.setState({
            entities: [],
            headers:  []
        })
       }
        return (
            <div>
                <Jumbotron style={{backgroundColor:"white", border:"groove" }}>
                <Form>
                    <div>
                        {this.state.entities.map((entity, index) => ( <EntityProfileView key={index} page={this.page} entity={entity} index={index}/>))}
                        <br/>
                        <div style={{margin:'auto' }}>
                            {this.pagination}
                        </div>
                    </div>
                </Form>
            </Jumbotron>
            </div>
        )
    }
}

Explorer.propTypes = {
    get_entities: PropTypes.bool.isRequired,
    entity_id: PropTypes.string.isRequired
}


export default Explorer;