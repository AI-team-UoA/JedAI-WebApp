import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import Header from './components/layout/Headers'
import HomeView from './components/HomeView'
import WorkflowSelection from './components/er/mainViews/WorkflowSelection'
import BlockingForm from './components/er/mainViews/BlockingForm'
import JoinForm from './components/er/mainViews/JoinForm'
import ExecutionView from './components/er/mainViews/ExecutionView'
import ErrorComponent from './components/ErrorView'
import ProgressiveForm from './components/er/mainViews/ProgressiveForm'
import InterlinkingExecution from "./components/gi/InterlinkingExecution";
import InterlinkingMainView from "./components/gi/InterlinkingMainView";


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
                <Route exact path="/"  render={props=>(<React.Fragment ><HomeView /></React.Fragment>)}/>
                <Route exact path="/selectworkflow" render={props=>(  <WorkflowSelection {...props}/> )}/>
                <Route exact path="/sequential/geospatialInterlinking/main" render={props=>(  <InterlinkingMainView {...props}/> )}/>
                <Route exact path="/sequential/geospatialInterlinking/execute" render={props=>(  <InterlinkingExecution {...props}/> )}/>
                <Route exact path="/workflow" render={props=>(  <ExecutionView {...props}/> )}/>
                <Route exact path="/blockingbased" render={props=>(  <BlockingForm {...props}/> )}/>
                <Route exact path="/joinbased" render={props=> (<JoinForm {...props}/>) }/>
                <Route exact path="/progressive" render={props=>(  <ProgressiveForm {...props}/> )}/>
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
export default App;