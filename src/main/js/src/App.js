import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'; 

import Header from './components/layout/Headers'
import Modes from './components/Modes'
import ClusterForm from './components/ClusterForm'
import WorkflowSelection from './components/WorkflowSelection'
import BlockingForm from './components/BlockingForm'
import JoinForm from './components/JoinForm'
import ExecutionView from './components/ExecutionView'
import ErrorComponent from './components/ErrorComponent'





class App extends Component {
 
 
    componentDidMount() {
        setInterval(this.hello, 250);
    }
 

 
    render() {

        return (
          <Router>
            <div className="App">
            <Header />
            <div>
              <Switch>
                <Route exact path="/"  render={props=>(<React.Fragment ><Modes /></React.Fragment>)}/>
                <Route exact path="/clustermode" render={props=>(  <ClusterForm/> )}/>
                <Route exact path="/selectworkflow" render={props=>(  <WorkflowSelection/> )}/>
                <Route exact path="/workflow" render={props=>(  <ExecutionView/> )}/>
                <Route exact path="/blockingbased" render={props=>(  <BlockingForm/> )}/>
                <Route exact path="/joinbased" render={props=> (<JoinForm />) }/>
                <Route exact path="/progressive" render={props=>(  null )}/>
                <Route exact path="/*" render={props=>(  <ErrorComponent/> )}/>
              </Switch>
            </div>
                
                
          </div>
          <br />
          <br />
          <br />
          </Router>
          
        );
    }
}
 //style={{position:'relative', left:'20%'}}
export default App;