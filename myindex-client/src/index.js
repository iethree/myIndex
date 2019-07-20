//myindex front-end

import ReactDOM from 'react-dom';
import React, {useState, useEffect} from 'react';
import {fetcher} from './utilities.js';
import {Home} from './home.js';
import {Browse} from './browse.js';
import {Make} from './make.js';
import {About} from './about.js';
import {
  BrowserRouter as Router,
  Route, Switch, Link, NavLink
} from 'react-router-dom';

import './myindex.sass';

ReactDOM.render(<App />, document.getElementById('root'));

//main app component
export default function App(props){
  document.title="myIndex";
  var [symbols, setSymbols] = useState([]);
  var [indexes, setIndexes] = useState([]);
  
  // load data from db on start
  useEffect(()=>{

    fetcher('/data/symbolList')
    .then(symbolList=>{
      if(symbolList.status)
        setSymbols(symbolList.data);
    });

    fetcher('/data/index')
    .then(indexList=>{
      if(indexList.status)
        setIndexes(indexList.data); 
    });
    
  },[]);

  return(
    <Router>
      <Header />
      <Switch>
        <Route path="/about" component={About} />
        <Route path="/browse" component={Browse} />
        <Route path="/make" component={Make} />
        <Route path="/" render={()=><Home indexes={indexes} />} />
      </Switch>
      <Footer />
    </Router>
  );
}

function Header(props){
  return(
    <section className="hero is-link is-small">
      <div className="hero-head">
        <nav className="navbar" role="navigation">
          <div className="navbar-brand">
            <Link className="navbar-item" to="/">myIndex</Link>
            <button className="button navbar-burger is-link">
              <span />
              <span />
              <span />
            </button>
          </div>
          <div className="navbar-menu">
            <div className="navbar-end">
              <NavLink className="navbar-item" activeClassName="is-active" 
                to="/" >Home</NavLink>
              <NavLink className="navbar-item" activeClassName="is-active" 
                to="/make">Make</NavLink>
              <NavLink className="navbar-item" activeClassName="is-active" 
                to="/browse">Browse</NavLink>
              <NavLink className="navbar-item" activeClassName="is-active" 
                to="/about">About</NavLink>
            </div>
          </div>
        </nav>
      </div>
    </section>
  );
}
function Footer(props){
  return(
    <footer className="footer is-small">
      <div className="content has-text-centered">
        <Link to="/about"> Disclaimer</Link>
      </div>
    </footer>
  );
}




