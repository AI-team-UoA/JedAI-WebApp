import React, {Component} from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'; 

import Header from './components/layout/Headers'
import Modes from './components/Modes'
import ClusterForm from './components/ClusterForm'
import DesktopForms from './components/DesktopForms'

 
class App extends Component {
 
    state = {};
 
    componentDidMount() {
        setInterval(this.hello, 250);
    }
 

 
    render() {
        return (
          <Router>
            <div className="App">
              <div className="container" >
              <Header />
                <Route exact path="/"  render={props=>(
                  <React.Fragment >
                  <Modes />
                </React.Fragment>
                )}/>
                <div style={{position:'relative', left:'20%'}}>
                  <Route exact path="/clustermode" render={props=>(  <ClusterForm/> )}/>
                  <Route exact path="/desktopmode" render={props=>(  <DesktopForms/> )}/>
                </div>  
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