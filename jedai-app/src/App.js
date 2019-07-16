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
 
    /*hello = () => {
        fetch('/api')
            .then(response => response.text())
            .then(message => {this.setState({message: message});
            });
            
    };*/
 
    render() {
        return (
          <Router>
            <div className="App">
              <div className="container" >
              <Header />
                <Route exact path="/"  render={props=>(
                  <React.Fragment >
                    <header  className="App-header">
                      <h1>   Returned from REACT </h1>
                    </header>
                    <br/><br/>
                  <Modes />
                </React.Fragment>
                )}/>
                <div style={{position:'relative', left:'20%'}}>
                  <Route exact path="/clustermode" render={props=>(  <ClusterForm/> )}/>
                  <Route exact path="/desktopmode" render={props=>(  <DesktopForms/> )}/>
                </div>  
            </div>
          </div>
          </Router>
        );
    }
}
 
export default App;