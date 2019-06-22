//LittleFoot Library front-end

import ReactDOM from 'react-dom';
import React, {useState, useEffect} from 'react';

import {TextInput, RadioInput} from './inputs.js';
import { getPageCounts, fetcher } from './utilities.js';
import './library.sass';

ReactDOM.render(<App />, document.getElementById('root'));

//main app component
export default function App(props){
  document.title="Littlefoot Library";

  const [reads, setReads] = useState(null);
  const [categories, setCategories] = useState(null);
  const [showForm, setShowForm] = useState(true);
  
  // load data from db on start
  // potential issue if user data is entered really fast
  useEffect(()=>{
    fetcher('/data/getAllReads', {})
    .then(dbReads=>{
      if(dbReads.status)
        setReads(dbReads.reads);
    });

    fetcher('/data/getCategories', {})
    .then(dbCategories=>{
      if(dbCategories.status)
        setCategories(dbCategories.categories); 
    });
    
  },[]);

  function addRead(newRead){
    setReads([newRead, ...reads]);
  }

  return(
    <Wrapper>
      <h1 className="title is-3 has-text-centered has-text-primary">Littlefoot Library</h1>
      {
        showForm 
        ? <ReadEntry addRead = {addRead} hide={()=>setShowForm(false)} />
        : <button className="button is-primary" onClick={()=>setShowForm(true)}> Add Read Record </button>
      }
      {
        reads && categories
        ? <React.Fragment>
            <SummaryDisplay reads={reads} categories = {categories} />
            <ReadList reads={reads} />
          </React.Fragment>
        : null
      }
    </Wrapper> 
  );
}

function ReadEntry(props){
  const [title, setTitle]=useState('');
  const [author, setAuthor]=useState('');
  const [pages, setPages]=useState('');
  const [read, setRead]=useState('');
  const [dewey, setDewey]=useState('');

  const [message, setMessage]=useState('');

  function isValidDewey(dewey){
    if (dewey.match(/^\d{3}\.\d/)) 
       return true;
    else 
       return false;
  }

  async function submit(e){
    e.preventDefault();
    
    if(pages > 0 && isValidDewey(dewey) && read){
      document.getElementById("saveButton").classList.add('is-loading');
      
      var formData = {
        title: title,
        author: author,
        pages: pages,
        dewey: dewey,
        read: read,
        date: new Date()
      };

      props.addRead(formData);
      var result = await fetcher('/data/saveRead', formData);
      document.getElementById("saveButton").classList.remove('is-loading');
    
      if(result.status){
        clearInput();
        setMessage('Record Saved');
      } 
      else 
        setMessage('Error Saving');
    }
    else
      setMessage("Missing or invalid input");
    
  }

  function clearInput(){
    setDewey('');
    setRead('');
    setTitle('');
    setAuthor('');
    setPages('');
  };

  return(
    <div className="box">
      <form>
        <h4 className="title is-5">New Read Record</h4>

        <TextInput name="Title" onChange={setTitle} value={title}/>
        <TextInput name="Author" onChange={setAuthor} value={author}/>
        <TextInput name="Pages" type="number" onChange={setPages} value={pages}/>
        <TextInput name="Dewey Decimal" onChange={setDewey} value={dewey}/>
        <RadioInput name="Read" options = {["Fully", "Partially", "Unread"]} onChange={setRead} />
        <br />
        
        <div className="buttons is-centered">
          <button id="saveButton" className="button is-primary" type="submit" onClick={submit}>Save</button>
          <button  className="button"  onClick={props.hide}>Close</button>
        </div>
        
        {message ? <div className="has-text-centered has-text-danger">{message}</div> : null}
      </form>
    </div>
  );
}

function SummaryDisplay(props){
   
   //build ouput
   function parsePageCounts(categories, reads){
      var pageDisplay=[];
      var [totalPages, pageCounts] = getPageCounts(categories, reads);

      pageDisplay.push(<div key = "total">Total Pages Read: {totalPages} </div>)
      pageDisplay.push(<div key = "categories">By Category:</div>)
      
      for(let category in pageCounts){
         if(pageCounts[category]>0)
            pageDisplay.push(
               <div className="indent" key = {category}>{props.categories[category]} : {pageCounts[category]}</div>
            );
      }
      return pageDisplay;
   }  

   return(
      <div className="summaryDisplay has-text-left">
         <h3 className="title is-5 has-text-centered">Reading Summary</h3>
         <div>
          {parsePageCounts(props.reads, props.categories)}
         </div>
      </div>
   );
}

function ReadList(props){
  return(
    <div>
       <h3 className="title is-5">Books Read</h3>
        {props.reads.map(read=>
          <div className="read-item" key = {read.date}>
            <div className = "read-left">
               <div key="title"> <strong>{read.title}</strong></div>
               <div key = "author"> {read.author} </div>
            </div>
            <div className = "read-right">
               <div key = "dewey"> {read.dewey} </div>
               <div key = "pages"> {read.pages} pages ({read.read}) </div>
            </div>
          </div>
        )}
    </div>
  );
}

function Wrapper(props){
  return(
    <div className="main">
      {props.children}
    </div>
  );
}
