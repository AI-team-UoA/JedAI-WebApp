import React, { Component } from 'react'
import {Table, Button, Collapse} from 'react-bootstrap';


class Workbench extends Component {

    constructor(...args) {
        super(...args);

        this.data = [
            {   
                id: 1,
                inputInstances: 10,
                clusters: 10,
                times: [1,2,3,4,5,6],
                methodNmaes: ["m1", "m2", "m3", "m4", "m5", "m6"],
                recall: [11, 22, 33, 44, 32, 12],
                f1measure: [11, 12, 13, 14, 15, 19],
                precision: [111, 222, 333, 444, 213, 321]
            }
            ,
            {
                id: 2,
                inputInstances: 20,
                clusters: 20,
                times: [1,2,3,4],
                methodNmaes: ["m21", "m22", "m23", "m24"],
                recall: [21, 22, 23, 24],
                f1measure: [21, 22, 23, 24],
                precision: [211, 222, 233, 244]
            },
            {
                id: 3,
                inputInstances: 30,
                clusters: 30,
                times: [1,2,3,4],
                methodNmaes: ["m31", "m32", "m33", "m34"],
                recall: [31, 32, 33, 34],
                f1measure: [31, 32, 33, 34],
                precision: [311, 322, 333, 344]
            }
            ,{
                id: 4,
                inputInstances: 40,
                clusters: 40,
                times: [1,2,3,4],
                methodNmaes: ["m41", "m42", "m43", "m44"],
                recall: [41, 42, 43, 44],
                f1measure: [41, 42, 43, 44],
                precision: [411, 422, 433, 444]
            }
         
        ]

        var collapse_rows = new Array(this.data.length).fill(false)
        this.state = { 
            collapse_rows: collapse_rows
        }
        
    }

    

    collapseRows = (e, indexName) => {
        
        var collapse_rows = this.state.collapse_rows
        collapse_rows[indexName] = !collapse_rows[indexName]

        var elements = document.getElementsByName(indexName)
        if (collapse_rows[indexName]) 
            elements.forEach(x => x.style.display = "")
        else 
            elements.forEach(x => x.style.display = "none")

        this.setState({collapse_rows: collapse_rows})
        
    }

    formInnerTable = (d, ar_length, index) => {
        const rows = []
        var row = 
                <tr key={0}>
                    <td>
                        <Button variant="light" size="sm" onClick={e => this.collapseRows(e, index)}>
                            <span className="fa fa-bars"/>
                        </Button>
                    </td>
                    <td>{d.methodNmaes[0]}</td>
                    <td>{d.recall[0]}</td>
                    <td>{d.f1measure[0]}</td>
                    <td>{d.precision[0]}</td>
                    <td>{d.times[0]}</td>
                </tr>
        rows.push(row)
 
        var i = 1 
        for (i = 1; i < ar_length; i++){
            row =  
                <tr key={i} name={index} style={{display:"none"}}>
                    <td/>
                    <td>
                        <Collapse in={this.state.collapse_rows[index]} >
                            <div>{d.methodNmaes[i]}</div>
                        </Collapse>
                    </td>
                    <td>
                        <Collapse in={this.state.collapse_rows[index]} >
                            <div>{d.f1measure[i]}</div>
                        </Collapse>
                    </td>
                    <td>
                        <Collapse in={this.state.collapse_rows[index]} >
                            <div>{d.f1measure[i]}</div>
                        </Collapse>
                    </td>
                    <td>
                        <Collapse in={this.state.collapse_rows[index]} >
                            <div>{d.precision[i]}</div>
                        </Collapse>
                    </td>
                    <td>
                        <Collapse in={this.state.collapse_rows[index]} >
                            <div>{d.times[i]}</div>
                        </Collapse>
                    </td>
                </tr>
            rows.push(row)
        }

        var table =
            <Table striped bordered hover size="sm">
                <thead>
                    <tr>
                        <th>&nbsp;</th>
                        <th>Method</th>
                        <th>Recall</th>
                        <th>F1 Measure</th>
                        <th>Precision</th>
                        <th>Time</th>
                    </tr>                        
                </thead>
                <tbody>
                   {rows}
                </tbody>
            </Table>

        return table

    }


    formTable = () =>{
        const rows = []
        this.data.forEach( (d, index) => {
            var inner_table = this.formInnerTable(d, d.methodNmaes.length, index)
            var row =
                <tr key={index}>
                    <td style={{textAlign:"center", margin:"auto"}}>{d.id}</td>
                    <td style={{textAlign:"center", margin:"auto"}}>{inner_table}</td>
                    <td style={{textAlign:"center", margin:"auto"}}>{d.inputInstances}</td>
                    <td style={{textAlign:"center", margin:"auto"}}>{d.clusters}</td>
                </tr>   
            rows.push(row)
        })
        var table = 
                <Table bordered hover size="sm">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Performance</th>
                            <th>Input Instancies</th>
                            <th>Clusters</th>                           
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </Table>
    
        return table
    }



    render() {

        var table = this.formTable()

        return (
            <div>
                {table}
            </div>
        )
    }
}
export default Workbench