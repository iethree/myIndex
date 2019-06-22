//Inputs
import React from 'react';

export function TextInput(props){
  return(
    <div className="field">
      <div className="control">
        <input
          type={props.type || "text"} 
          value={props.value}
          className="input" 
          placeholder={props.placeholder|| props.name} 
          name={props.name}
          onChange={(e)=>props.onChange(e.target.value)}
          required={true}
        />
      </div>
    </div>
  );
}

export function RadioInput(props){
  return(
    <div className="control">
      <div className="label">Read?</div>
      {props.options.map(option=>
        <label className="radio" key={option}>
          <input type="radio" 
            name={props.name} 
            value={option} 
            onChange={(e)=>props.onChange(e.target.value)} 
            required={true} 
          />
          &nbsp;{option}
        </label>
      )}
    </div>
  );  
}
