//myindex front-end

import ReactDOM from 'react-dom';
import React, {useState, useEffect} from 'react';
import {
  BrowserRouter as Router,
  Route, Switch, Link, NavLink
} from 'react-router-dom';

import './myindex.sass';

ReactDOM.render(<App />, document.getElementById('root'));

//main app component
export default function App(props){
  document.title="myIndex";
  
  // load data from db on start
  useEffect(()=>{

    fetcher('/data/getSymbolList', {})
    .then(dbReads=>{
      if(dbReads.status)
        setReads(dbReads.reads);
    });

    fetcher('/data/getIndexList', {})
    .then(dbCategories=>{
      if(dbCategories.status)
        setCategories(dbCategories.categories); 
    });
    
  },[]);

  return(
    <Router>
      <Header />
      <Switch>
        <Route path="/about" component={About} />
        <Route path="/browse" component={Browse} />
        <Route path="/make" component={Make} />
        <Route path="/" component={Home} />
      </Switch>
      <Footer />
    </Router>
  );
}

function Header(props){

}
function Footer(props){

}
function About(props){

}

function Wrapper(props){
  return(
    <div className="main">
      {props.children}
    </div>
  );
}
